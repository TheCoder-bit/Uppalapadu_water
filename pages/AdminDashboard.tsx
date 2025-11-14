import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Campaign, CampaignWithBookings, User } from '../types';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';


const AdminDashboard: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignWithBookings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCampaignData, setNewCampaignData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: 20,
    });
    
    const { user } = useAuth();

    const fetchCampaigns = useCallback(async () => {
        setIsLoading(true);
        const data = await api.getCampaigns();
        setCampaigns(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);
    
    const viewParticipants = async (campaignId: string) => {
        const campaignDetails = await api.getCampaignById(campaignId);
        setSelectedCampaign(campaignDetails);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCampaignData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value, 10) : value }));
    };

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            await api.createCampaign({ ...newCampaignData, createdBy: user.id });
            setIsCreateModalOpen(false);
            setNewCampaignData({ title: '', description: '', date: '', time: '', location: '', capacity: 20 });
            fetchCampaigns();
        } catch (error) {
            console.error("Failed to create campaign", error);
            alert("Failed to create campaign.");
        }
    };
    
    const chartData = campaigns.map(c => ({
        name: c.title.substring(0, 15) + '...',
        Booked: c.bookedSlots,
        Capacity: c.capacity
    }));
    
    const stats = {
        totalCampaigns: campaigns.length,
        totalParticipants: campaigns.reduce((acc, c) => acc + c.bookedSlots, 0),
        upcomingEvents: campaigns.filter(c => c.status === 'Upcoming').length,
    }

    if (isLoading) return <div className="text-center">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Campaigns</h3>
                    <p className="text-3xl font-bold text-blue-500">{stats.totalCampaigns}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Participants</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.totalParticipants}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Upcoming Campaigns</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats.upcomingEvents}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold mb-4">Campaign Analytics</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Booked" fill="#3B82F6" />
                        <Bar dataKey="Capacity" fill="#A78BFA" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            {/* Campaign List */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Manage Campaigns</h2>
                    <button onClick={() => setIsCreateModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200">
                        + Create New Campaign
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Slots</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {campaigns.map(campaign => (
                                <tr key={campaign.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{campaign.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(campaign.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{campaign.bookedSlots} / {campaign.capacity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{campaign.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => viewParticipants(campaign.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
             {/* Participant Modal */}
            {selectedCampaign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Participants for {selectedCampaign.title}</h3>
                        <ul className="space-y-2 max-h-64 overflow-y-auto">
                           {selectedCampaign.participants.length > 0 ? selectedCampaign.participants.map(p => (
                               <li key={p.id} className="p-2 border rounded-md dark:border-gray-600">{p.name} - {p.email}</li>
                           )) : <p>No participants have registered for this campaign yet.</p>}
                        </ul>
                        <button onClick={() => setSelectedCampaign(null)} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Create Campaign Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Create New Campaign</h3>
                        <form onSubmit={handleCreateCampaign} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input type="text" name="title" id="title" value={newCampaignData.title} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea name="description" id="description" value={newCampaignData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                                    <input type="date" name="date" id="date" value={newCampaignData.date} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
                                </div>
                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                                    <input type="time" name="time" id="time" value={newCampaignData.time} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                    <input type="text" name="location" id="location" value={newCampaignData.location} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
                                </div>
                                <div>
                                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
                                    <input type="number" name="capacity" id="capacity" value={newCampaignData.capacity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required min="1" />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Create Campaign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;