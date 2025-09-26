import React from 'react';

const RepoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M4 22h16a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v18"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <path d="M3 15h6"></path>
        <path d="M5 12h2"></path>
        <path d="M4 18h3"></path>
    </svg>
);

export default RepoIcon;
