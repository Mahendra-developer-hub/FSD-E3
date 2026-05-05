import { Event, TicketTier } from './types';

export const TICKET_TIERS: TicketTier[] = [
  { id: 'tier-student', name: 'Student Pass', price: 150, description: 'Requires valid Student ID' },
  { id: 'tier-general', name: 'General Admission', price: 250, description: 'Standard access to all events' },
  { id: 'tier-vip', name: 'VIP Access', price: 1000, description: 'Priority seating & Backstage access' }
];

export const MOCK_EVENT: Event = {
  id: 'event-1',
  name: "Annual Technical Symposium 2026",
  department: "CSE Department",
  date: "October 24, 2026",
  time: "09:00 AM - 05:00 PM",
  venue: "Main Auditorium, Block C",
  tiers: TICKET_TIERS,
  totalTickets: 100,
};
