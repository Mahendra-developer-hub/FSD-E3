// In-memory data store for the server

export const users = [
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@univ.edu',
    password: 'password123',
    role: 'ADMIN',
  },
  {
    id: 'user-student',
    name: 'Test Student',
    email: 'student@univ.edu',
    password: 'password123',
    role: 'USER',
  }
];

export const events = [
  {
    id: 'event-1',
    name: "Annual Technical Symposium 2026",
    department: "CSE Department",
    date: "October 24, 2026",
    time: "09:00 AM - 05:00 PM",
    venue: "Main Auditorium, Block C",
    tiers: [
      { id: 'tier-student', name: 'Student Pass', price: 150, description: 'Requires valid Student ID' },
      { id: 'tier-general', name: 'General Admission', price: 250, description: 'Standard access to all events' },
      { id: 'tier-vip', name: 'VIP Access', price: 1000, description: 'Priority seating & Backstage access' }
    ],
    totalTickets: 100,
  },
  {
    id: 'event-2',
    name: "AI & Machine Learning Workshop",
    department: "AI & Data Science",
    date: "November 15, 2026",
    time: "10:00 AM - 04:00 PM",
    venue: "Lab 4, Block B",
    tiers: [
      { id: 'tier-student', name: 'Student Pass', price: 200, description: 'Requires valid Student ID' },
      { id: 'tier-general', name: 'General Admission', price: 400, description: 'Includes lunch & materials' },
    ],
    totalTickets: 50,
  },
  {
    id: 'event-3',
    name: "Cultural Fest 2026",
    department: "Student Council",
    date: "December 05, 2026",
    time: "05:00 PM - 11:00 PM",
    venue: "Open Grounds",
    tiers: [
      { id: 'tier-earlybird', name: 'Early Bird', price: 300, description: 'Limited time offer' },
      { id: 'tier-general', name: 'General Admission', price: 500, description: 'Standard access' },
      { id: 'tier-vip', name: 'VIP Lounge', price: 1500, description: 'Lounge access & Free drinks' }
    ],
    totalTickets: 500,
  }
];

export const bookings = [];
