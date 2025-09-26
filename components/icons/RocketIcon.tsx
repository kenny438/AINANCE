import React from 'react';

const RocketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.12-.67-1.04-1.8-1.6-3.05-1.88Z" />
        <path d="m12 15-3-3a9 9 0 0 1 3-12 9 9 0 0 1 12 3l-3 3" />
        <path d="m7 14 5-5" />
        <path d="m9 11 4 4" />
        <path d="m21.5 21.5-3.3-3.3" />
    </svg>
);

export default RocketIcon;
