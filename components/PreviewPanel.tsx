import React from 'react';

interface PreviewPanelProps {
    output: string;
    error: string;
    isLoading: boolean;
    isPyodideLoading: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ output, error, isLoading, isPyodideLoading }) => {
    const isSvg = output.trim().startsWith('<svg') && output.trim().endsWith('</svg>');

    const renderContent = () => {
        if (isPyodideLoading) {
            return <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Initializing Python Environment...</p>;
        }
        if (isLoading) {
             return <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Executing code...</p>;
        }
        if (error) {
            return <pre className="text-red-500 dark:text-red-400 text-sm whitespace-pre-wrap w-full">{error}</pre>;
        }
        if (output) {
            return isSvg ? (
                <div
                    className="bg-white rounded-md p-2 max-w-full max-h-full"
                    dangerouslySetInnerHTML={{ __html: output }}
                />
            ) : (
                <pre className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap w-full">{output}</pre>
            );
        }
        return <p className="text-gray-400 dark:text-gray-500 text-sm">Click "Run Code" to see the output here.</p>;
    }

    const alignmentClass = isSvg ? 'items-center justify-center' : 'items-start justify-start';

    return (
        <div className="flex-grow flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                OUTPUT
            </h2>
            <div className={`flex-grow p-4 font-mono text-base overflow-auto flex ${alignmentClass}`}>
                {renderContent()}
            </div>
        </div>
    );
};