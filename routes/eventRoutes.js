const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      include: { client: true, resources: { include: { resource: true } }, invoices: true },
      orderBy: { eventDate: 'asc' }
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, eventDate, venue, clientId, resources } = req.body;
    if (!resources || resources.length === 0) {
      res.status(400);
      throw new Error('At least one resource must be assigned');
    }
    for (const item of resources) {
      const resource = await prisma.resource.findUnique({ where: { id: item.resourceId } });
      if (!resource) {
        res.status(404);
        throw new Error(`Resource with ID ${item.resourceId} not found`);
      }
      if (resource.availableQty < item.quantity) {
        res.status(400);
        throw new Error(`Conflict: Only ${resource.availableQty} units of ${resource.name} available.`);
      }
    }
    const newEvent = await prisma.$transaction(async (prisma) => {
      const event = await prisma.event.create({
        data: {
          title, description, eventDate: new Date(eventDate), venue, clientId, status: 'CONFIRMED',
          resources: { create: resources.map(item => ({ resourceId: item.resourceId, quantity: item.quantity })) }
        }
      });
      for (const item of resources) {
        await prisma.resource.update({
          where: { id: item.resourceId },
          data: { availableQty: { decrement: item.quantity } }
        });
      }
      return event;
    });
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    next(error);
  }
});

module.exports = router;