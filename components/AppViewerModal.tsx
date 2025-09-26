

import React from 'react';
import BussinSymbolIcon from './icons/BussinSymbolIcon';

interface AppViewerModalProps {
    asset: { name: string; code: string; } | null;
    onClose: () => void;
}

const tailwindConfig = `
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'brand-bg': '#000000',
          'brand-surface': '#151515',
          'brand-border': '#2A2A2A',
          'brand-primary': '#FBBF24',
          'brand-secondary': '#151515',
          'brand-accent': '#FFFFFF',
          'brand-light': '#e8e8e8',
          'brand-muted': '#6e6e73',
          'brand-text-on-primary': '#000000',
        },
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fade-in': 'fadeIn 0.5s ease-out forwards',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }
      }
    }
  }
`;

const AppViewerModal: React.FC<AppViewerModalProps> = ({ asset, onClose }) => {
    if (!asset) return null;

    const srcDoc = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdn.tailwindcss.com"></script>
            <script>${tailwindConfig}</script>
            <style>
              /* Simple scrollbar styling for webkit browsers */
              ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              ::-webkit-scrollbar-track {
                background: #151515;
              }
              ::-webkit-scrollbar-thumb {
                background-color: #2A2A2A;
                border-radius: 4px;
              }
              ::-webkit-scrollbar-thumb:hover {
                background-color: #6e6e73;
              }
            </style>
        </head>
        <body class="bg-brand-bg text-brand-light">
            ${asset.code}
        </body>
        </html>
    `;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-brand-surface w-full max-w-5xl rounded-xl border border-brand-border shadow-2xl m-4 animate-fade-in flex flex-col"
                onClick={e => e.stopPropagation()}
                style={{ height: '85vh' }}
            >
                <div className="p-3 bg-brand-bg border-b border-brand-border flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 bg-brand-muted/50 rounded-full"></span>
                        <span className="w-3 h-3 bg-brand-muted/50 rounded-full"></span>
                        <span className="w-3 h-3 bg-brand-muted/50 rounded-full"></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-brand-light font-semibold">
                        <BussinSymbolIcon className="w-4 h-4" />
                        <span>Preview: {asset.name}</span>
                    </div>
                    <div className="w-16 flex justify-end">
                         <button onClick={onClose} className="px-3 py-1 rounded-md text-xs font-semibold bg-brand-surface hover:bg-brand-border transition-colors">Close</button>
                    </div>
                </div>
                
                <div className="flex-grow bg-brand-bg">
                    <iframe
                        srcDoc={srcDoc}
                        title={asset.name}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-modals"
                    />
                </div>
            </div>
        </div>
    );
};

export default AppViewerModal;