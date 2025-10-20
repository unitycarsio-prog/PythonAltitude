import React from 'react';

interface ViewTabsProps {
    activeView: 'code' | 'output';
    setActiveView: (view: 'code' | 'output') => void;
}

export const ViewTabs: React.FC<ViewTabsProps> = ({ activeView, setActiveView }) => {
    const getTabClass = (view: 'code' | 'output') => {
        return `w-full py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeView === view
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`;
    };

    return (
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button onClick={() => setActiveView('code')} className={getTabClass('code')}>
                Code
            </button>
            <button onClick={() => setActiveView('output')} className={getTabClass('output')}>
                Output
            </button>
        </div>
    );
};