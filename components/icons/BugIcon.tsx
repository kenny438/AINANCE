import React from 'react';

const BugIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        {...props}
    >
        <path d="m8 2 1.88 1.88" />
        <path d="M14.12 3.88 16 2" />
        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
        <path d="M12 20v-9" />
        <path d="M6.53 9C4.6 9.6 3 11.2 3 13" />
        <path d="M21 13c0-1.8-1.6-3.4-3.53-4" />
        <path d="M3 16h18" />
        <path d="M3 13h18" />
        <path d="m4 10 1.5 1" />
        <path d="m20 10-1.5 1" />
    </svg>
);

export default BugIcon;
