import mongoose from 'mongoose';

const ticketTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  sold: { type: Number, default: 0 }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
  },
  gallery: [{ type: String }],
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Technology', 'Music', 'Business', 'Arts', 'Sports', 'Other'],
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming',
  },
  ticketTiers: [ticketTierSchema],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Event', eventSchema);
