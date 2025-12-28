const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');
const Property = require('../models/Property');

// 1. POST: Nayi booking request bhejna
router.post('/', async (req, res) => {
  try {
    const { propertyId, buyerEmail, sellerEmail } = req.body;

    // Check karein ke kahin property pehle se booked toh nahi
    const property = await Property.findById(propertyId);
    if (!property || property.status === 'booked') {
      return res.status(400).json({ message: 'Property is not available for booking' });
    }

    const booking = new Booking({
      propertyId,
      buyerEmail,
      sellerEmail,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json({ message: 'Booking request sent to seller.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send booking request', error });
  }
});

// 2. GET: Seller ke liye tamam "Pending" bookings
router.get('/pending/:sellerEmail', async (req, res) => {
  try {
    const { sellerEmail } = req.params;
    const bookings = await Booking.find({ sellerEmail, status: 'pending' })
      .populate('propertyId') // Isse property ki details (price, location, paymentMethod) mil jayengi
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending bookings' });
  }
});

// 3. PUT: Booking Confirm karna aur Property mark karna
router.put('/confirm/:bookingId', async (req, res) => {
  try {
    // Booking ka status 'booked' (ya 'confirmed') karein
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: 'booked' },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // 🟢 Sabse important: Property ka status bhi update karein
    await Property.findByIdAndUpdate(booking.propertyId, { status: 'booked' });

    res.json({ message: 'Booking confirmed and property marked as booked', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to confirm booking' });
  }
});

// 4. GET: Buyer ki apni tamam bookings
router.get('/buyer/:buyerEmail', async (req, res) => {
  try {
    const { buyerEmail } = req.params;
    const bookings = await Booking.find({ buyerEmail })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch buyer bookings' });
  }
});

// 5. GET: Seller ki tamam bookings (History)
router.get('/seller/:sellerEmail', async (req, res) => {
  try {
    const { sellerEmail } = req.params;
    const bookings = await Booking.find({ sellerEmail })
      .populate('propertyId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching seller bookings' });
  }
});

module.exports = router;