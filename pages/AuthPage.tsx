import React, { useState } from 'react';
import type { Page } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface AuthPageProps {
  setPage: (page: Page) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setPage }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [village, setVillage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (isLogin) {
            try {
                // Special case for admin login with password check
                if (email.toLowerCase() === 'admin@safewater.in') {
                    if (password === 'admin123') {
                        const user = await api.login(email);
                        login(user);
                        // No need to set isLoading to false, page will change
                    } else {
                        throw new Error('Invalid admin password.');
                    }
                } else {
                    // General user login (mock API doesn't check password, but we check if user exists)
                    const user = await api.login(email);
                    login(user);
                }
            } catch (err) {
                setError((err as Error).message || 'Login failed. Please check your credentials.');
                setIsLoading(false);
            }
        } else {
            // Registration
            if (!name || !phone || !village || !email || !password) {
                setError("Please fill out all registration fields.");
                setIsLoading(false);
                return;
            }
            try {
                await api.register({ name, email, phone, village });
                alert('Registration successful! Please log in now with your credentials.');
                // Reset form and switch to login view
                setIsLogin(true);
                setName('');
                setPhone('');
                setVillage('');
                setPassword('');

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    {isLogin ? 'Welcome Back!' : 'Create an Account'}
                </h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                             <input type="text" placeholder="Village / Area" value={village} onChange={(e) => setVillage(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                        </>
                    )}
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                        {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }} className="ml-1 font-medium text-blue-500 hover:underline">
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;