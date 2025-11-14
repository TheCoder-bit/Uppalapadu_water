
import React, { useState, useMemo } from 'react';
import { AuthContext } from './context/AuthContext';
import type { User } from './types';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import KitUsageGuide from './pages/KitUsageGuide';

export type Page = 'landing' | 'auth' | 'adminDashboard' | 'userDashboard' | 'kitGuide' | 'about';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [page, setPage] = useState<Page>('landing');

    const authContextValue = useMemo(() => ({
        user,
        login: (userData: User) => {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            if (userData.role === 'admin') {
                setPage('adminDashboard');
            } else {
                setPage('userDashboard');
            }
        },
        logout: () => {
            setUser(null);
            localStorage.removeItem('user');
            setPage('landing');
        },
    }), [user]);

    const renderPage = () => {
        if (!user) {
            switch (page) {
                case 'auth':
                    return <AuthPage setPage={setPage} />;
                case 'kitGuide':
                    return <KitUsageGuide />;
                case 'landing':
                default:
                    return <LandingPage setPage={setPage} />;
            }
        }

        switch (page) {
            case 'adminDashboard':
                return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
            case 'userDashboard':
                return <UserDashboard />;
            case 'kitGuide':
                return <KitUsageGuide />;
            default:
                return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
        }
    };
    
    return (
        <AuthContext.Provider value={authContextValue}>
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Header setPage={setPage} />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {renderPage()}
                </main>
                <Footer />
            </div>
        </AuthContext.Provider>
    );
};

export default App;
