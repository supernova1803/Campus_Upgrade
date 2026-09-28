const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;
const usersFile = path.join(__dirname, 'data', 'users.json');
const scrypt = promisify(crypto.scrypt);
const captchaAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const sessionsSecret = process.env.SESSION_SECRET || crypto.randomBytes(48).toString('hex');

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(session({
  name: 'campusconnect.sid',
  secret: sessionsSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

async function readUsers() {
  try { return JSON.parse(await fs.promises.readFile(usersFile, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}

async function writeUsers(users) {
  await fs.promises.mkdir(path.dirname(usersFile), { recursive: true });
  const temporaryFile = `${usersFile}.tmp`;
  await fs.promises.writeFile(temporaryFile, JSON.stringify(users, null, 2), { mode: 0o600 });
  await fs.promises.rename(temporaryFile, usersFile);
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, interests: user.interests || [] };
}

function setSessionUser(req, user) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);
      req.session.user = publicUser(user);
      req.session.save((saveError) => saveError ? reject(saveError) : resolve(req.session.user));
    });
  });
}

function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Please log in first.' });
  next();
}

app.get('/api/status', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.get('/api/auth/captcha', (req, res) => {
  res.set('Cache-Control', 'no-store');
  req.session.signupCaptcha = Array.from({ length: 6 }, () => captchaAlphabet[crypto.randomInt(captchaAlphabet.length)]).join('');
  req.session.save((error) => {
    if (error) return res.status(500).json({ error: 'Could not create a CAPTCHA.' });
    res.json({ captcha: req.session.signupCaptcha });
  });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, captcha } = req.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const fullName = typeof name === 'string' ? name.trim() : '';
  const expectedCaptcha = req.session.signupCaptcha;
  delete req.session.signupCaptcha;
  if (!expectedCaptcha || typeof captcha !== 'string' || captcha.trim().toUpperCase() !== expectedCaptcha) {
    return res.status(400).json({ error: 'The CAPTCHA expired or did not match. Please try a new code.' });
  }
  if (fullName.length < 2 || fullName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Enter a name, valid email, and password of at least 8 characters.' });
  }
  try {
    const users = await readUsers();
    if (users.some((user) => user.email === normalizedEmail)) return res.status(409).json({ error: 'An account already exists for this email. Please log in.' });
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = (await scrypt(password, salt, 64)).toString('hex');
    const user = { id: crypto.randomUUID(), name: fullName, email: normalizedEmail, salt, passwordHash, interests: [] };
    users.push(user);
    await writeUsers(users);
    res.status(201).json({ message: 'Account created. Please log in.' });
  } catch (error) {
    console.error('Signup failed:', error.message);
    res.status(500).json({ error: 'Could not create your account right now.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body?.password;
  if (typeof password !== 'string') return res.status(400).json({ error: 'Enter your email and password.' });
  try {
    const user = (await readUsers()).find((account) => account.email === email);
    if (!user) return res.status(401).json({ error: 'No account exists for this email. Please sign up first.' });
    const candidate = await scrypt(password, user.salt, 64);
    const stored = Buffer.from(user.passwordHash, 'hex');
    if (stored.length !== candidate.length || !crypto.timingSafeEqual(stored, candidate)) return res.status(401).json({ error: 'Email or password is incorrect.' });
    res.json({ user: await setSessionUser(req, user) });
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ error: 'Could not log in right now.' });
  }
});

app.get('/api/auth/me', (req, res) => req.session.user ? res.json({ user: req.session.user }) : res.status(401).json({ user: null }));

app.get('/api/registrations', requireLogin, async (req, res) => {
  try {
    const user = (await readUsers()).find((account) => account.id === req.session.user.id);
    res.json({ registrations: user?.registrations || [] });
  } catch (error) {
    console.error('Could not load registrations:', error.message);
    res.status(500).json({ error: 'Could not load registered events.' });
  }
});

app.post('/api/registrations', requireLogin, async (req, res) => {
  const { eventId, name, department, semester, usn } = req.body || {};
  if (![eventId, name, department, semester, usn].every((value) => typeof value === 'string' && value.trim())) return res.status(400).json({ error: 'Complete all registration fields.' });
  try {
    const users = await readUsers();
    const user = users.find((account) => account.id === req.session.user.id);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    const registration = { eventId, name: name.trim(), department: department.trim(), semester: semester.trim(), usn: usn.trim().toUpperCase(), createdAt: new Date().toISOString() };
    user.registrations = [...(user.registrations || []).filter((entry) => entry.eventId !== eventId), registration];
    await writeUsers(users);
    res.status(201).json({ registrations: user.registrations });
  } catch (error) {
    console.error('Registration save failed:', error.message);
    res.status(500).json({ error: 'Could not save your registration.' });
  }
});

app.patch('/api/auth/profile', requireLogin, async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const interests = Array.isArray(req.body?.interests) ? [...new Set(req.body.interests.filter((item) => typeof item === 'string').map((item) => item.trim().toLowerCase()).filter(Boolean))].slice(0, 20) : [];
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid name and email.' });
  try {
    const users = await readUsers();
    if (users.some((user) => user.email === email && user.id !== req.session.user.id)) return res.status(409).json({ error: 'That email is already in use.' });
    const user = users.find((account) => account.id === req.session.user.id);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    user.name = name; user.email = email; user.interests = interests;
    await writeUsers(users);
    req.session.user = publicUser(user);
    res.json({ user: req.session.user });
  } catch (error) {
    console.error('Profile update failed:', error.message);
    res.status(500).json({ error: 'Could not update your profile right now.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ error: 'Could not sign out.' });
    res.clearCookie('campusconnect.sid', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.status(204).end();
  });
});

app.get('/api/items', (req, res) => res.json([{ id: 1, name: 'Alpha' }, { id: 2, name: 'Beta' }]));
app.post('/api/items', (req, res) => res.status(201).json({ id: Date.now(), name: req.body?.name || 'New item' }));

app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
