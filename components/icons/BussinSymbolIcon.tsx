
import React from 'react';

const BussinSymbolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <path d="M30 10 V 50" />
          <path d="M30 10 Q 10 20 30 30 Q 10 40 30 50" />
          <path d="M30 10 Q 50 20 30 30 Q 50 40 30 50" />
      </g>
  </svg>
);

export default BussinSymbolIcon;
