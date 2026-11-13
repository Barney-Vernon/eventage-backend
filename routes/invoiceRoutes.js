const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all invoices (with event details)
router.get('/', async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { event: true }
    });
    res.json(invoices);
  } catch (error) { next(error); }
});

// Create an invoice
router.post('/', async (req, res, next) => {
  try {
    const { eventId, amount } = req.body;
    const invoice = await prisma.invoice.create({
      data: { eventId: parseInt(eventId), amount: parseFloat(amount) }
    });
    res.status(201).json(invoice);
  } catch (error) { next(error); }
});

module.exports = router;