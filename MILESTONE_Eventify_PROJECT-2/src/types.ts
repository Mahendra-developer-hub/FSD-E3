export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Event {
  id: string;
  name: string;
  department: string;
  date: string;
  time: string;
  venue: string;
  tiers: TicketTier[];
  totalTickets: number;
}

export interface Booking {
  id: string;
  eventName: string;
  userName: string;
  userEmail: string;
  userDepartment: string;
  tierId: string;
  tierName: string;
  ticketsCount: number;
  totalAmount: number;
  timestamp: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  department: string;
  tierId: string;
  ticketsCount: number;
}
