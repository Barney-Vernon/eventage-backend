const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all clients
router.get('/', async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) { next(error); }
});

// Create a new client
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newClient = await prisma.client.create({
      data: { name, email, phone }
    });
    res.status(201).json(newClient);
  } catch (error) { next(error); }
});

module.exports = router;