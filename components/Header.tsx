import React from 'react';
import type { Theme } from '../App';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
    theme: Theme;
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <svg
                        className="w-8 h-8 mr-3 text-green-500 dark:text-green-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 20L12 4l9 16H3z" />
                        <path d="M8 14l4-4 4 4" />
                    </svg>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-wider">
                        PythonAltitude
                    </h1>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <SunIcon className="w-6 h-6 text-yellow-400" />
                    ) : (
                        <MoonIcon className="w-6 h-6 text-gray-700" />
                    )}
                </button>
            </div>
        </header>
    );
};