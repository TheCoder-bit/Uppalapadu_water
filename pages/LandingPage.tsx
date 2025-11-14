
import React from 'react';
import type { Page } from '../App';

interface LandingPageProps {
  setPage: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
    return (
        <div className="text-center">
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl py-20 px-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
                    Clean Water, Healthy Community
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                    Join the Student-Led Initiative in Uppalapadu to ensure safe and clean water for everyone. Participate in our free water testing campaigns and make a difference.
                </p>
                <div className="space-x-4">
                    <button onClick={() => setPage('auth')} className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300">
                        Get Started
                    </button>
                    <button onClick={() => setPage('kitGuide')} className="bg-transparent border-2 border-blue-500 text-blue-500 font-semibold px-8 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300">
                        Learn About Testing
                    </button>
                </div>
            </section>

            <section className="py-16">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">Our Mission</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-500 mb-2">Empower</h3>
                        <p className="text-gray-600 dark:text-gray-400">Equip residents with the knowledge and tools to test their own water sources.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-500 mb-2">Educate</h3>
                        <p className="text-gray-600 dark:text-gray-400">Raise awareness about water safety, sanitation, and hygiene best practices.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-500 mb-2">Ensure</h3>
                        <p className="text-gray-600 dark:text-gray-400">Conduct regular testing campaigns to monitor water quality and ensure community health.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
