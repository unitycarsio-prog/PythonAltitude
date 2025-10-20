import React from 'react';

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => {
    return (
        <div className="flex-grow flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
            <label htmlFor="code-editor" className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                EDITOR
            </label>
            <textarea
                id="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-grow bg-transparent text-gray-800 dark:text-gray-200 p-4 font-mono text-sm rounded-b-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 w-full resize-none"
                spellCheck="false"
                aria-label="Python Code Editor"
            />
        </div>
    );
};