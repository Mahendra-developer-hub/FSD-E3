import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import { sendEmail, getTicketTemplate } from '../services/emailService.js';
import QRCode from 'qrcode';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { eventId, ticketTierName, quantity } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const tier = event.ticketTiers.find((t) => t.name === ticketTierName);
    if (!tier) return res.status(404).json({ message: 'Ticket tier not found' });

    if (tier.capacity - tier.sold < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalAmount = tier.price * quantity;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects amounts in cents/paise
      currency: 'inr',
      metadata: {
        eventId: event._id.toString(),
        userId: req.user._id.toString(),
        ticketTierName,
        quantity: quantity.toString(),
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    const { eventId, userId, ticketTierName, quantity } = paymentIntent.metadata;

    // Check if booking already exists for this payment intent
    const existingBooking = await Booking.findOne({ paymentIntentId });
    if (existingBooking) {
      return res.status(400).json({ message: 'Booking already confirmed' });
    }

    const event = await Event.findById(eventId);
    const tier = event.ticketTiers.find((t) => t.name === ticketTierName);
    
    // Update ticket sold count
    tier.sold += Number(quantity);
    await event.save();

    // Create Booking
    const booking = new Booking({
      user: userId,
      event: eventId,
      ticketTierName,
      quantity: Number(quantity),
      totalAmount: paymentIntent.amount / 100,
      paymentStatus: 'Completed',
      paymentIntentId,
    });

    // Generate QR Code base64
    const qrData = JSON.stringify({ bookingId: booking._id, eventId });
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    booking.qrCodeUrl = qrCodeDataUrl; // Store if needed, or just generate on fly

    await booking.save();

    // Send Ticket Email
    await sendEmail({
      email: req.user.email,
      subject: `Your tickets for ${event.title}`,
      html: getTicketTemplate(
        req.user.name,
        event.title,
        ticketTierName,
        quantity,
        booking.totalAmount,
        qrCodeDataUrl
      ),
      attachments: [{
        filename: 'qrcode.png',
        content: qrCodeDataUrl.split("base64,")[1],
        encoding: 'base64',
        cid: 'qrcode'
      }]
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('event', 'title date image location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
