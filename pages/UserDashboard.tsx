
import React, { useState, useEffect, useCallback } from 'react';
import type { Campaign, Booking } from '../types';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const UserDashboard: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [myBookings, setMyBookings] = useState<{ booking: Booking, campaign: Campaign }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'campaigns' | 'bookings'>('campaigns');
    const { user } = useAuth();
    
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        if (user) {
            const [campaignData, bookingData] = await Promise.all([
                api.getCampaigns(),
                api.getUserBookings(user.id)
            ]);
            setCampaigns(campaignData.filter(c => c.status !== 'Completed'));
            setMyBookings(bookingData);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleBooking = async (campaignId: string) => {
        if (!user) return;
        try {
            await api.createBooking(user.id, campaignId);
            alert('Booking successful!');
            fetchAllData();
        } catch (error) {
            alert((error as Error).message);
        }
    };
    
    const handleCancelBooking = async (bookingId: string) => {
        try {
            await api.cancelBooking(bookingId);
            alert('Booking cancelled.');
            fetchAllData();
        } catch (error) {
            alert((error as Error).message);
        }
    }
    
    if (isLoading) return <div className="text-center">Loading dashboard...</div>;

    const StatusBadge: React.FC<{ status: Campaign['status'] | Booking['status'] }> = ({ status }) => {
        const color = {
            Upcoming: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            Ongoing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        }[status];
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>{status}</span>;
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, {user?.name}!</h1>
            
            <div className="flex space-x-4 border-b dark:border-gray-700">
                <button onClick={() => setView('campaigns')} className={`py-2 px-4 font-semibold ${view === 'campaigns' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>Available Campaigns</button>
                <button onClick={() => setView('bookings')} className={`py-2 px-4 font-semibold ${view === 'bookings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>My Bookings ({myBookings.length})</button>
            </div>
            
            {view === 'campaigns' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-bold mb-2">{campaign.title}</h2>
                                    <StatusBadge status={campaign.status} />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">{campaign.description}</p>
                                <p><strong>Date:</strong> {new Date(campaign.date).toLocaleDateString()} at {campaign.time}</p>
                                <p><strong>Location:</strong> {campaign.location}</p>
                                <p><strong>Slots:</strong> {campaign.bookedSlots} / {campaign.capacity}</p>
                            </div>
                            <button 
                                onClick={() => handleBooking(campaign.id)}
                                disabled={campaign.bookedSlots >= campaign.capacity || myBookings.some(b => b.campaign.id === campaign.id && b.booking.status === 'Confirmed')}
                                className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {myBookings.some(b => b.campaign.id === campaign.id && b.booking.status === 'Confirmed') ? 'Booked' : (campaign.bookedSlots >= campaign.capacity ? 'Full' : 'Book Slot')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {view === 'bookings' && (
                 <div className="space-y-4">
                    {myBookings.length > 0 ? myBookings.map(({booking, campaign}) => (
                        <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{campaign.title}</h3>
                                <p className="text-sm text-gray-500">{new Date(campaign.date).toLocaleDateString()} - {campaign.location}</p>
                                <p className="text-sm">Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               <StatusBadge status={booking.status} />
                               {booking.status === 'Confirmed' && new Date(campaign.date) > new Date() && (
                                   <button onClick={() => handleCancelBooking(booking.id)} className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600">Cancel</button>
                               )}
                            </div>
                        </div>
                    )) : <p>You have no bookings.</p>}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
