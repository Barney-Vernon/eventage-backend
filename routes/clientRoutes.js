const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all clients
router.get('/', async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    next(error);
  }
});

module.exports = router;