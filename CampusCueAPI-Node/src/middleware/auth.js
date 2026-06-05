const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY;

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];

  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }

  const email = payload.sub;
  if (!email) {
    return res.status(401).json({ detail: 'Invalid token subject' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ detail: 'User not found' });
  }

  req.user = user;
  next();
}

module.exports = { authenticate };
