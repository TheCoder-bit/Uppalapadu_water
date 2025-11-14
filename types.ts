
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  village: string;
  phone: string;
}

export type CampaignStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  time: string;
  location: string;
  capacity: number;
  bookedSlots: number;
  status: CampaignStatus;
  createdBy: string;
}

export interface Booking {
  id: string;
  userId: string;
  campaignId: string;
  bookingDate: string; // ISO 8601 format
  status: 'Confirmed' | 'Cancelled';
  confirmationCode: string;
}

export interface CampaignWithBookings extends Campaign {
    participants: User[];
}
