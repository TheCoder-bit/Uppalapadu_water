import { mockUsers, mockCampaigns, mockBookings } from './mockData';
import type { User, Campaign, Booking, CampaignWithBookings } from '../types';

const SIMULATED_DELAY = 500;

// A simple in-memory store to hold the state
let users = [...mockUsers];
let campaigns = [...mockCampaigns];
let bookings = [...mockBookings];

const api = {
  // Auth
  login: (email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          resolve(user);
        } else {
          reject(new Error('User not found. Please check your email or register.'));
        }
      }, SIMULATED_DELAY);
    });
  },

  register: (data: Omit<User, 'id' | 'role'>): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          return reject(new Error('An account with this email already exists.'));
        }
        const newUser: User = {
          ...data,
          id: `u${Date.now()}`,
          role: 'user',
        };
        users.push(newUser);
        resolve(newUser);
      }, SIMULATED_DELAY);
    });
  },

  // Campaigns
  getCampaigns: (): Promise<Campaign[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(campaigns.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime() )), SIMULATED_DELAY);
    });
  },
  
  getCampaignById: (id: string): Promise<CampaignWithBookings> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            const campaign = campaigns.find(c => c.id === id);
            if (!campaign) {
                return reject(new Error('Campaign not found'));
            }
            const campaignBookings = bookings.filter(b => b.campaignId === id && b.status === 'Confirmed');
            const participants = users.filter(u => campaignBookings.some(b => b.userId === u.id));
            resolve({ ...campaign, participants });
        }, SIMULATED_DELAY);
      });
  },

  createCampaign: (data: Omit<Campaign, 'id' | 'bookedSlots' | 'status'>): Promise<Campaign> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newCampaign: Campaign = {
          ...data,
          id: `c${Date.now()}`,
          bookedSlots: 0,
          status: 'Upcoming',
        };
        campaigns.push(newCampaign);
        resolve(newCampaign);
      }, SIMULATED_DELAY);
    });
  },

  updateCampaign: (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = campaigns.findIndex(c => c.id === id);
        if (index !== -1) {
          campaigns[index] = { ...campaigns[index], ...data };
          resolve(campaigns[index]);
        } else {
          reject(new Error('Campaign not found.'));
        }
      }, SIMULATED_DELAY);
    });
  },

  deleteCampaign: (id: string): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        campaigns = campaigns.filter(c => c.id !== id);
        bookings = bookings.filter(b => b.campaignId !== id);
        resolve();
      }, SIMULATED_DELAY);
    });
  },

  // Bookings
  getUserBookings: (userId: string): Promise<{ booking: Booking, campaign: Campaign }[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const userBookings = bookings.filter(b => b.userId === userId);
        const detailedBookings = userBookings.map(booking => {
          const campaign = campaigns.find(c => c.id === booking.campaignId);
          return { booking, campaign: campaign! };
        }).filter(item => item.campaign);
        resolve(detailedBookings);
      }, SIMULATED_DELAY);
    });
  },

  createBooking: (userId: string, campaignId: string): Promise<Booking> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return reject(new Error('Campaign not found.'));
        if (campaign.bookedSlots >= campaign.capacity) return reject(new Error('Campaign is full.'));

        const existingBooking = bookings.find(b => b.userId === userId && b.campaignId === campaignId && b.status === 'Confirmed');
        if (existingBooking) return reject(new Error('Already booked for this campaign.'));
        
        const newBooking: Booking = {
          id: `b${Date.now()}`,
          userId,
          campaignId,
          bookingDate: new Date().toISOString(),
          status: 'Confirmed',
          confirmationCode: `UWSI-${userId}-${campaignId}`
        };
        bookings.push(newBooking);
        campaign.bookedSlots++;
        resolve(newBooking);
      }, SIMULATED_DELAY);
    });
  },

  cancelBooking: (bookingId: string): Promise<Booking> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex === -1) return reject(new Error('Booking not found.'));
        
        const booking = bookings[bookingIndex];
        const campaign = campaigns.find(c => c.id === booking.campaignId);
        if (campaign && booking.status === 'Confirmed') {
          campaign.bookedSlots--;
        }

        bookings[bookingIndex].status = 'Cancelled';
        resolve(bookings[bookingIndex]);
      }, SIMULATED_DELAY);
    });
  }
};

export default api;