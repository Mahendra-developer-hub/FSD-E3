import mongoose from 'mongoose';
import User from './models/User.js';
import Event from './models/Event.js';
import Booking from './models/Booking.js';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    await Booking.deleteMany();
    await Event.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const createdUsers = await User.insertMany([
      { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'ADMIN' },
      { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: 'USER' }
    ]);

    const adminUser = createdUsers[0]._id;

    const events = [
      {
        title: 'Tech Conference 2026',
        description: 'Join us for the biggest tech conference of the year.',
        date: new Date('2026-08-15'),
        location: 'Silicon Valley, CA',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
        category: 'Technology',
        createdBy: adminUser,
        ticketTiers: [
          { name: 'General Admission', price: 99, capacity: 500, sold: 0 },
          { name: 'VIP Pass', price: 299, capacity: 100, sold: 0 }
        ]
      },
      {
        title: 'Summer Music Festival',
        description: 'Three days of non-stop music and entertainment.',
        date: new Date('2026-07-20'),
        location: 'Austin, TX',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80',
        category: 'Music',
        createdBy: adminUser,
        ticketTiers: [
          { name: 'Day 1 Pass', price: 75, capacity: 1000, sold: 0 },
          { name: 'Full Weekend', price: 199, capacity: 500, sold: 0 }
        ]
      }
    ];

    await Event.insertMany(events);
    console.log('Data Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
