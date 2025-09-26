import React from 'react';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
        <path d="M12 13.5V10" />
        <path d="M10 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-4Z" />
        <path d="M4.5 10.5a2.5 2.5 0 0 1 0 5h0a2.5 2.5 0 0 1 0-5Z" />
        <path d="M19.5 10.5a2.5 2.5 0 0 1 0 5h0a2.5 2.5 0 0 1 0-5Z" />
        <path d="M12 22a8 8 0 0 0 8-8v-2a8 8 0 0 0-8-8h0a8 8 0 0 0-8 8v2a8 8 0 0 0 8 8Z" />
    </svg>
);

export default BrainIcon;
