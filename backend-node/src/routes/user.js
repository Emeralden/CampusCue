const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const SECRET_KEY = process.env.SECRET_KEY;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createAccessToken(email) {
  return jwt.sign({ sub: email }, SECRET_KEY, { algorithm: 'HS256', expiresIn: '60m' });
}

function createRefreshToken(email) {
  return jwt.sign({ sub: email }, SECRET_KEY, { algorithm: 'HS256', expiresIn: '31d' });
}

function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function safeUserResponse(user) {
  return {
    id: user._id,
    email: user.email,
    full_name: user.full_name,
    mess_cycle: user.mess_cycle,
    diet_type: user.diet_type,
    enable_satisfaction_prompt: user.enable_satisfaction_prompt,
  };
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  password: z.string().min(6),
  mess_cycle: z.string(),
});

const ProfileUpdateSchema = z.object({
  full_name: z.string().min(1).optional(),
  diet_type: z.enum(['veg', 'non_veg', 'egg']).optional(),
  enable_satisfaction_prompt: z.boolean().optional(),
});

// ─── POST /users/register ─────────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  const result = RegisterSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ detail: result.error.errors });
  }

  const { email, full_name, password, mess_cycle } = result.data;

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(400).json({ detail: 'A user with this email already exists.' });
  }

  const hashed_password = await argon2.hash(password);

  await User.create({
    email: email.toLowerCase().trim(),
    full_name,
    hashed_password,
    mess_cycle,
  });

  return res.status(201).json({ detail: 'User created successfully!' });
});

// ─── POST /users/token ────────────────────────────────────────────────────────

router.post('/token', async (req, res) => {
  const email = req.body.username || req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }

  const valid = await argon2.verify(user.hashed_password, password);
  if (!valid) {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }

  const access_token = createAccessToken(user.email);
  const refresh_token = createRefreshToken(user.email);

  user.hashed_refresh_token = hashRefreshToken(refresh_token);
  await user.save();

  return res.json({ access_token, refresh_token, token_type: 'bearer' });
});

// ─── POST /users/token/refresh ────────────────────────────────────────────────

router.post('/token/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(401).json({ detail: 'Refresh token required.' });
  }

  let payload;
  try {
    payload = jwt.verify(refresh_token, SECRET_KEY, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }

  const user = await User.findOne({ email: payload.sub?.toLowerCase().trim() });
  if (!user || !user.hashed_refresh_token) {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }

  const expectedHash = hashRefreshToken(refresh_token);
  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedHash),
    Buffer.from(user.hashed_refresh_token)
  );

  if (!isValid) {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }

  const access_token = createAccessToken(user.email);
  return res.json({ access_token, token_type: 'bearer' });
});

// ─── GET /users/me ────────────────────────────────────────────────────────────

router.get('/me', authenticate, (req, res) => {
  return res.json(safeUserResponse(req.user));
});

// ─── POST /users/me/toggle-mess-cycle ─────────────────────────────────────────

router.post('/me/toggle-mess-cycle', authenticate, async (req, res) => {
  req.user.mess_cycle = req.user.mess_cycle === 'weeks_1_3' ? 'weeks_2_4' : 'weeks_1_3';
  await req.user.save();
  return res.json(safeUserResponse(req.user));
});

// ─── POST /users/me/toggle-diet ───────────────────────────────────────────────

router.post('/me/toggle-diet', authenticate, async (req, res) => {
  req.user.diet_type = req.user.diet_type === 'veg' ? 'non_veg' : 'veg';
  await req.user.save();
  return res.json(safeUserResponse(req.user));
});

// ─── PATCH /users/me/profile ──────────────────────────────────────────────────

router.patch('/me/profile', authenticate, async (req, res) => {
  const result = ProfileUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ detail: result.error.errors });
  }

  const updates = result.data;
  if (Object.keys(updates).length === 0) {
    return res.json(safeUserResponse(req.user));
  }

  Object.assign(req.user, updates);
  await req.user.save();

  return res.json(safeUserResponse(req.user));
});

module.exports = router;
