import type { PyodideInterface } from 'pyodide';

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;

export async function initializePyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  console.log("Initializing Pyodide...");
  const pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
  });
  
  console.log("Loading micropip...");
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  
  console.log("Installing numpy and matplotlib...");
  await micropip.install(['numpy', 'matplotlib']);
  
  console.log("Pyodide is ready.");
  pyodideInstance = pyodide;
  return pyodide;
}

export interface PythonExecutionResult {
    output: string;
    error: string;
}

export async function runPythonCode(pyodide: PyodideInterface, code: string): Promise<PythonExecutionResult> {
    const setupCode = `
import sys
import io
import warnings
import matplotlib
matplotlib.use('svg')
import matplotlib.pyplot as plt

# Suppress the specific UserWarning from Matplotlib
warnings.filterwarnings(
    "ignore",
    category=UserWarning,
    message="Matplotlib is currently using a non-GUI backend, so cannot show the figure."
)

# Redirect stdout and stderr to capture output
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`;
    
    // Reset streams and setup matplotlib for each run
    await pyodide.runPythonAsync(setupCode);

    try {
        // Execute the user's code
        await pyodide.runPythonAsync(code);

        // After execution, run a final script to gather all results in one go.
        // This is more robust than making multiple calls from JS to Python.
        const getResultsScript = `
import sys
import io
import json
import matplotlib.pyplot as plt

# Capture standard output and error
stdout = sys.stdout.getvalue()
stderr = sys.stderr.getvalue()
svg_data = ""

# Check if any plots were created
if plt.get_fignums():
    # Save the current figure to a string buffer
    fig = plt.gcf()
    buf = io.StringIO()
    fig.savefig(buf, format='svg')
    buf.seek(0)
    svg_data = buf.read()
    plt.close(fig) # Close the figure to free up memory

# Return all results as a JSON string
json.dumps({
    "stdout": stdout,
    "stderr": stderr,
    "svg": svg_data
})
`;
        const resultJson = await pyodide.runPythonAsync(getResultsScript) as string;
        const results = JSON.parse(resultJson);

        if (results.stderr) {
            return { output: '', error: results.stderr };
        }
        
        // Prioritize SVG output, but fall back to standard text output if no plot was generated.
        const output = results.svg || results.stdout;
        return { output: output, error: '' };

    } catch (e: any) {
        // This will catch syntax errors in the user's code or other JS-level exceptions.
        // We can also try to get stderr from python, as it might contain the traceback.
        const stderr = await pyodide.runPythonAsync("sys.stderr.getvalue()") as string;
        return { output: '', error: stderr || e.message };
    }
}