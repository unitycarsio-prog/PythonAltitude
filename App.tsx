import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { PlayIcon } from './components/icons/PlayIcon';
import { initializePyodide, runPythonCode } from './services/pyodideService';
import type { PyodideInterface } from 'pyodide';
import { AdBanner } from './components/AdBanner';
import { ViewTabs } from './components/ViewTabs';


const initialCode = `# Welcome to PythonAltitude!
# Click the "Run Code" button below to execute this script.

print("Hi, welcome to PythonAltitude")

# Try writing your own Python code here.
# For example, you can do math:
# print(5 + 5)
`;

export type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [code, setCode] = useState<string>(initialCode);
    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPyodideLoading, setIsPyodideLoading] = useState<boolean>(true);
    const [activeView, setActiveView] = useState<'code' | 'output'>('code');
    const [theme, setTheme] = useState<Theme>('dark');
    const pyodide = useRef<PyodideInterface | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const initialTheme = savedTheme || 'dark';
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    useEffect(() => {
        const loadPyodide = async () => {
            try {
                pyodide.current = await initializePyodide();
                setIsPyodideLoading(false);
            } catch (e) {
                console.error("Failed to load Pyodide", e);
                setError("Failed to initialize the Python environment. Please refresh the page.");
                setIsPyodideLoading(false);
            }
        };
        loadPyodide();
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            return newTheme;
        });
    };

    const handleRunCode = useCallback(async () => {
        if (!pyodide.current) return;

        setIsLoading(true);
        setOutput('');
        setError('');
        setActiveView('output'); // Switch to output view on run
        try {
            const result = await runPythonCode(pyodide.current, code);
            setOutput(result.output);
            setError(result.error);
        } catch (e) {
            const err = e as Error;
            setError(err.message || 'An unknown error occurred during execution.');
        } finally {
            setIsLoading(false);
        }
    }, [code]);

    const isButtonDisabled = isLoading || isPyodideLoading;

    return (
        <div className="min-h-screen flex flex-col">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <AdBanner />
            <main className="flex-grow flex flex-col p-2 sm:p-4 gap-4">
                <div className="md:hidden">
                    <ViewTabs activeView={activeView} setActiveView={setActiveView} />
                </div>
                <div className="flex-grow flex flex-col md:flex-row gap-4 min-h-0">
                    <div className={`flex-1 flex-col relative ${activeView === 'code' ? 'flex' : 'hidden'} md:flex`}>
                         <CodeEditor code={code} setCode={setCode} />
                    </div>
                    <div className={`flex-1 flex-col ${activeView === 'output' ? 'flex' : 'hidden'} md:flex`}>
                        <PreviewPanel output={output} error={error} isLoading={isLoading} isPyodideLoading={isPyodideLoading} />
                    </div>
                </div>
                <div className="my-2">
                    <AdBanner />
                </div>
                 <div className="flex justify-end">
                    <button
                        onClick={handleRunCode}
                        disabled={isButtonDisabled}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-auto"
                        aria-label="Run Python Code"
                    >
                        {isLoading || isPyodideLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm font-medium">{isPyodideLoading ? 'Initializing Environment...' : 'Executing...'}</span>
                            </>
                        ) : (
                           <>
                             <PlayIcon className="h-5 w-5 mr-2" />
                             <span className="text-sm font-medium">Run Code</span>
                           </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default App;