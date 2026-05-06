import express from 'express';
import { createPaymentIntent, confirmBooking, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/create-payment-intent').post(protect, createPaymentIntent);
router.route('/confirm').post(protect, confirmBooking);
router.route('/mybookings').get(protect, getMyBookings);

export default router;
