const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Create Event with Resource Conflict Detection
router.post('/', auth, async (req, res) => {
  const { title, eventDate, venue, clientId, resources } = req.body;

  try {
    // 1. Check availability
    for (let item of resources) {
      const resource = await prisma.resource.findUnique({ where: { id: item.resourceId } });
      if (resource.availableQty < item.quantity) {
        return res.status(400).json({ error: `Conflict: Only ${resource.availableQty} of ${resource.name} available.` });
      }
    }

    // 2. Create Event
    const newEvent = await prisma.event.create({
      data: {
        title,
        eventDate: new Date(eventDate),
        venue,
        clientId,
        resources: {
          create: resources.map(item => ({
            resourceId: item.resourceId,
            quantity: item.quantity
          }))
        }
      }
    });

    // 3. Deduct inventory
    for (let item of resources) {
      await prisma.resource.update({
        where: { id: item.resourceId },
        data: { availableQty: { decrement: item.quantity } }
      });
    }

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get All Events
router.get('/', auth, async (req, res) => {
  const events = await prisma.event.findMany({ include: { client: true } });
  res.json(events);
});

module.exports = router;