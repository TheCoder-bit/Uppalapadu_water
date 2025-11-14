
import React from 'react';
import type { Page } from '../../App';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    setPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ setPage }) => {
    const { user, logout } = useAuth();
    
    const WaterDropIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 8.5A1.5 1.5 0 017 7h6a1.5 1.5 0 011.5 1.5v3.25a.75.75 0 01-1.5 0V9a.5.5 0 00-.5-.5H7a.5.5 0 00-.5.5v2.75a.75.75 0 01-1.5 0V8.5z" clipRule="evenodd" />
            <path d="M10 18c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7zm0-12a5 5 0 100 10 5 5 0 000-10z" />
             <path d="M10 3.25A6.75 6.75 0 003.25 10c0 2.44 1.3 4.6 3.25 5.85.2.13.44.13.64 0A6.72 6.72 0 0010 17.5a6.72 6.72 0 002.86-1.65c.2-.13.44-.13.64 0A6.72 6.72 0 0016.75 10 6.75 6.75 0 0010 3.25zM10 12a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
    );

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setPage(user ? (user.role === 'admin' ? 'adminDashboard' : 'userDashboard') : 'landing')}>
                    <WaterDropIcon />
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">UWSI</h1>
                </div>
                <nav className="flex items-center space-x-4">
                    {user && (
                        <a href="#" onClick={(e) => { e.preventDefault(); setPage(user.role === 'admin' ? 'adminDashboard' : 'userDashboard'); }} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">Dashboard</a>
                    )}
                    <a href="#" onClick={(e) => { e.preventDefault(); setPage('kitGuide'); }} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">E. coli Kit Guide</a>
                    
                    {user ? (
                        <>
                           <span className="text-gray-700 dark:text-gray-300">Welcome, {user.name.split(' ')[0]}</span>
                           <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">Logout</button>
                        </>
                    ) : (
                        <button onClick={() => setPage('auth')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">Login / Register</button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
