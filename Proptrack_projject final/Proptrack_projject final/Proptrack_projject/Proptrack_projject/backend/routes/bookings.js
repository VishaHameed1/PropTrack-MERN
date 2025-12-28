const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel'); // Model name check karlein
const Property = require('../models/Property');

// 1. Add new booking (Buyer side)
router.post('/', async (req, res) => {
  try {
    const { propertyId, buyerEmail, sellerEmail } = req.body;

    // Validation
    if (!propertyId || !buyerEmail || !sellerEmail) {
      return res.status(400).json({ message: 'Missing required fields (Property ID, Buyer or Seller Email)' });
    }

    // Check agar property available hai ya nahi
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (property.status === 'booked' || property.isDeleted) {
      return res.status(400).json({ message: 'Property is no longer available' });
    }

    const newBooking = new Booking({
      propertyId,
      buyerEmail,
      sellerEmail,
      status: 'pending' // Humare enum mein lowercase 'pending' hai
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking request sent successfully", booking: newBooking });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error during booking" });
  }
});

// 2. Confirm Booking (Seller side)
// Yeh wahi route hai jo booking ko confirm karega aur property status 'booked' kar dega
router.put('/confirm/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Booking status update karein
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'booked' },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking request not found' });

    // 🟢 Sync with Property: Property ko 'booked' mark karein
    await Property.findByIdAndUpdate(booking.propertyId, { status: 'booked' });

    res.status(200).json({ message: 'Booking confirmed and property status updated', booking });
  } catch (error) {
    console.error("Confirm error:", error);
    res.status(500).json({ message: "Failed to confirm booking" });
  }
});

// 3. Deny Booking (Seller side)
router.put('/deny/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: 'rejected' },
      { new: true }
    );
    res.status(200).json({ message: 'Booking request denied', booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to deny booking" });
  }
});

module.exports = router;