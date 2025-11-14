import type { User, Campaign, Booking } from '../types';

export const mockUsers: User[] = [
    // FIX: Removed 'password' property from user objects as it does not exist in the User type.
    { id: '1', name: 'Admin User', email: 'admin@safewater.in', role: 'admin', village: 'Uppalapadu', phone: '1234567890' },
    { id: '2', name: 'Ravi Kumar', email: 'ravi@example.com', role: 'user', village: 'Uppalapadu Center', phone: '0987654321' },
    { id: '3', name: 'Priya Sharma', email: 'priya@example.com', role: 'user', village: 'Lake View Colony', phone: '1122334455' },
    { id: '4', name: 'Anil Reddy', email: 'anil@example.com', role: 'user', village: 'Green Valley', phone: '2233445566' },
    { id: '5', name: 'Akhil Varma', email: 'akhil@example.com', role: 'user', village: 'New Colony', phone: '3344556677' },
];

export const mockCampaigns: Campaign[] = [
    {
        id: 'c1',
        title: 'Lakefront Water Quality Check',
        description: 'Join us for a comprehensive water quality test near the main lake. We will be using E. coli testing kits to ensure the safety of our primary water source.',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        time: '09:00 AM',
        location: 'Uppalapadu Lake Entrance',
        capacity: 20,
        bookedSlots: 15,
        status: 'Upcoming',
        createdBy: '1'
    },
    {
        id: 'c2',
        title: 'Community Well Sanitation Drive',
        description: 'A campaign focused on testing the community well water. We will also demonstrate proper well maintenance techniques.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:30 AM',
        location: 'Village Community Well',
        capacity: 15,
        bookedSlots: 5,
        status: 'Upcoming',
        createdBy: '1'
    },
    {
        id: 'c3',
        title: 'River Bend Contaminant Check',
        description: 'Testing the water at the river bend, a popular spot for locals. Your participation is crucial.',
        date: new Date().toISOString(),
        time: '02:00 PM',
        location: 'River Bend Point',
        capacity: 25,
        bookedSlots: 25,
        status: 'Ongoing',
        createdBy: '1'
    },
    {
        id: 'c4',
        title: 'Post-Rainfall Water Assessment',
        description: 'Assessing water quality after the recent heavy rainfall to check for runoff contamination.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        time: '08:00 AM',
        location: 'Various points across Uppalapadu',
        capacity: 30,
        bookedSlots: 28,
        status: 'Completed',
        createdBy: '1'
    }
];

export const mockBookings: Booking[] = [
    { id: 'b1', userId: '2', campaignId: 'c1', bookingDate: new Date().toISOString(), status: 'Confirmed', confirmationCode: 'UWSI-RAVI-C1' },
    { id: 'b2', userId: '3', campaignId: 'c1', bookingDate: new Date().toISOString(), status: 'Confirmed', confirmationCode: 'UWSI-PRIYA-C1' },
    { id: 'b3', userId: '4', campaignId: 'c2', bookingDate: new Date().toISOString(), status: 'Confirmed', confirmationCode: 'UWSI-ANIL-C2' },
    { id: 'b4', userId: '2', campaignId: 'c4', bookingDate: new Date().toISOString(), status: 'Confirmed', confirmationCode: 'UWSI-RAVI-C4' },
];