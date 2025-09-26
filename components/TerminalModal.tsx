import React, { useState, useEffect } from 'react';
import { AssetLanguage } from '../types';
import BussinSymbolIcon from './icons/BussinSymbolIcon';

interface TerminalModalProps {
    asset: { name: string; language: AssetLanguage; code: string; } | null;
    onClose: () => void;
}

const TerminalModal: React.FC<TerminalModalProps> = ({ asset, onClose }) => {
    const [output, setOutput] = useState<string[]>([]);

    useEffect(() => {
        if (asset) {
            setOutput([]);
            const lines = [
                `> Initializing ${asset.language} runtime...`,
                `> Compiling asset: "${asset.name}"...`,
                `> Compilation successful. No errors found.`,
                `> Starting execution...`,
                `----------------------------------------`,
                ...asset.code.split('\n').map(line => line ? `  ${line}` : ' '),
                `----------------------------------------`,
                `> Execution finished.`,
                `> Process finished with exit code 0.`
            ];
            
            let i = 0;
            const interval = setInterval(() => {
                if (i < lines.length) {
                    setOutput(prev => [...prev, lines[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 300);

            return () => clearInterval(interval);
        }
    }, [asset]);

    if (!asset) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-secondary dark:bg-black w-full max-w-3xl rounded-xl border border-border dark:border-dark-border shadow-2xl m-4 animate-fade-in flex flex-col"
                onClick={e => e.stopPropagation()}
                style={{ height: '60vh' }}
            >
                <div className="p-3 bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 bg-text-secondary/50 rounded-full"></span>
                        <span className="w-3 h-3 bg-text-secondary/50 rounded-full"></span>
                        <span className="w-3 h-3 bg-text-secondary/50 rounded-full"></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                        <BussinSymbolIcon className="w-4 h-4" />
                        <span>Terminal: Running "{asset.name}"</span>
                    </div>
                    <div className="w-16"></div>
                </div>
                
                <div className="p-4 flex-grow overflow-y-auto font-mono text-sm text-text-primary dark:text-dark-text-primary">
                    {output.map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap">{line}</div>
                    ))}
                    <div className="w-2 h-4 bg-text-primary dark:bg-dark-text-primary animate-pulse"></div>
                </div>

                <div className="p-3 bg-surface/50 dark:bg-dark-surface/50 border-t border-border dark:border-dark-border flex justify-end">
                    <button onClick={onClose} className="px-4 py-1 rounded-md text-xs font-semibold bg-surface dark:bg-dark-surface hover:bg-border dark:hover:bg-dark-border transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

export default TerminalModal;