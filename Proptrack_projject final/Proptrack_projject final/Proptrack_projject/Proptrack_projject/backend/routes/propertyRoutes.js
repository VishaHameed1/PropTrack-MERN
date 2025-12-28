const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. GET all properties (Jo deleted nahi hain aur booked nahi hain)
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ 
      status: { $ne: 'booked' },
      isDeleted: false // Sirf wahi dikhao jo delete nahi hui
    }).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. GET available properties (Similar to above, but specific for 'vacant')
router.get('/available', async (req, res) => {
  try {
    const properties = await Property.find({ 
      status: 'vacant', 
      isDeleted: false 
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available properties' });
  }
});

// 3. GET properties by Seller Email
router.get('/seller/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const properties = await Property.find({ 
      ownerEmail: email,
      isDeleted: false 
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seller properties' });
  }
});

// 4. GET a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property || property.isDeleted) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. POST a new property (Updated with Payment Method & Rent Duration)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      title, price, location, ownerEmail, area,
      sellingType, description, city, bedrooms, bathrooms,
      paymentMethod, rentDuration 
    } = req.body;

    const newProperty = new Property({
      title,
      price,
      location,
      ownerEmail,
      area,
      sellingType,
      description,
      city,
      bedrooms,
      bathrooms,
      paymentMethod, // Naya field
      rentDuration: sellingType === 'Rent' ? rentDuration : undefined, // Sirf Rent ke liye
      image: req.file ? req.file.filename : null
    });

    await newProperty.save();
    res.status(201).json({ message: 'Property added successfully', property: newProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add property' });
  }
});

// 6. PUT update property (Updated with new fields)
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      price: req.body.price,
      location: req.body.location,
      area: req.body.area,
      city: req.body.city,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      description: req.body.description,
      sellingType: req.body.sellingType,
      paymentMethod: req.body.paymentMethod, // Update payment method
      rentDuration: req.body.sellingType === 'Rent' ? req.body.rentDuration : null
    };

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProperty) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// 7. DELETE a property (Soft delete logic)
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.isDeleted = true;
    property.deletedBy = req.body.role || 'seller'; // frontend se role bhej sakte hain
    property.deletedAt = new Date();

    await property.save();
    res.status(200).json({ message: 'Property soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;