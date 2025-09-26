
import React from 'react';

const ChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="64" height="48" rx="4" fill="url(#chip-gradient)"/>
        <path d="M20 0V48" stroke="#E5E7EB" strokeOpacity="0.2" strokeWidth="2"/>
        <path d="M44 0V48" stroke="#E5E7EB" strokeOpacity="0.2" strokeWidth="2"/>
        <path d="M0 24H64" stroke="#E5E7EB" strokeOpacity="0.2" strokeWidth="2"/>
        <rect x="4" y="4" width="56" height="40" rx="2" stroke="#E5E7EB" strokeOpacity="0.4"/>
        <defs>
            <linearGradient id="chip-gradient" x1="0" y1="0" x2="64" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4B5563"/>
                <stop offset="1" stopColor="#9CA3AF"/>
            </linearGradient>
        </defs>
    </svg>
);

export default ChipIcon;
