const express = require('express');
const router = express.Router();
const Service = require('../models/service');

// ✅ Add new service manually
router.post('/add', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ View all services
router.get('/view', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Seed services in bulk (default)
router.get('/seed', async (req, res) => {
  const services = [
    {
      name: 'Home Service',
      description: 'Pandit visits your home for pooja',
      price: 'starting from 5000',
      image: '/images/kalash.jpeg'
    },
    {
      name: 'Temple Service',
      description: 'Pooja performed at temple with pandit',
      price: 'starting from 3000',
      image: '/images/temple.jpeg'
    },
    {
      name: 'Astrological Service',
      description: 'Get horoscope and astrology consultation',
      price: 'starting from 1000',
      image: '/images/astro.jpeg'
    },
  ];

  try {
    await Service.insertMany(services);
    res.send('✅ Services seeded');
  } catch (err) {
    console.error('Seeding error:', err.message);
    res.status(500).send('Error seeding');
  }
});

// DANGEROUS: Use only for cleanup




module.exports = router;
