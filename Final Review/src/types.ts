export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum EventCategory {
  TECH = 'Tech',
  CULTURAL = 'Cultural',
  SPORTS = 'Sports',
  MUSIC = 'Music',
  BUSINESS = 'Business',
  ART = 'Art',
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketTiers {
  [key: string]: number;
}

export interface EventDoc {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: any; // Firestore Timestamp
  location: string;
  images: string[];
  ticketTiers: TicketTiers;
  totalCapacity: number;
  availableTickets: number;
  status: EventStatus;
  isFeatured: boolean;
  createdBy?: string;
  createdAt: any;
  updatedAt: any;
}

export interface BookingDoc {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  tickets: {
    tier: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: BookingStatus;
  stripeSessionId?: string;
  qrCodeUrl?: string;
  createdAt: any;
  updatedAt: any;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
