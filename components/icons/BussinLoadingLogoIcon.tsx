import React from 'react';

const BussinLoadingLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(25, 5) scale(0.9)">
        <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M30 10 V 50" />
            <path d="M30 10 Q 10 20 30 30 Q 10 40 30 50" />
            <path d="M30 10 Q 50 20 30 30 Q 50 40 30 50" />
        </g>
    </g>
    <text
      x="50"
      y="85"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="18"
      fontWeight="bold"
      fill="currentColor"
      textAnchor="middle"
      letterSpacing="0.1em"
    >
      BUSSIN
    </text>
  </svg>
);

export default BussinLoadingLogoIcon;
