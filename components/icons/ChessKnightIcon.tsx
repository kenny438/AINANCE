
import React from 'react';

const MonopolyDeathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        {...props}
    >
        {/* Top Hat */}
        <path d="M6 10 V 5 C 6 4, 7 4, 8 4 L 16 4 C 17 4, 18 4, 18 5 V 10" />
        <path d="M4 10 L 20 10" />
        
        {/* Skull */}
        <path d="M7 12 C 3 12, 3 20, 7 20 L 17 20 C 21 20, 21 12, 17 12 Z" />
        
        {/* Eyes */}
        <circle cx="10.5" cy="15" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="15" r="1.5" fill="currentColor" />
        
        {/* Teeth */}
        <line x1="9" y1="19" x2="9" y2="20" />
        <line x1="11" y1="19" x2="11" y2="20" />
        <line x1="13" y1="19" x2="13" y2="20" />
        <line x1="15" y1="19" x2="15" y2="20" />
    </svg>
);

export default MonopolyDeathIcon;
