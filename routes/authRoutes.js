const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || 'STAFF' }
    });
    res.status(201).json({
      id: user.id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user.id, user.role)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (For Admin Dashboard)
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true } // Don't send passwords!
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;