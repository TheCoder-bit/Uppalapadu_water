
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} Uppalapadu Water Safety Initiative. All Rights Reserved.</p>
                <p className="text-sm mt-1">A Student-Led Community Project.</p>
            </div>
        </footer>
    );
};

export default Footer;
