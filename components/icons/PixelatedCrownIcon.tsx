import React from 'react';

const PixelatedCrownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    {...props}
  >
    {/* Base */}
    <path d="M5 20H27V22H5V20Z" />
    <path d="M7 22H25V24H7V22Z" />
    <path d="M9 24H23V26H9V24Z" />
    
    {/* Middle Part */}
    <path d="M5 18H27V20H5V18Z" />
    <path d="M5 16H9V18H5V16Z" />
    <path d="M23 16H27V18H23V16Z" />
    <path d="M13 16H19V18H13V16Z" />

    {/* Points */}
    <path d="M5 10H9V16H5V10Z" />
    <path d="M23 10H27V16H23V10Z" />
    <path d="M13 8H19V16H13V8Z" />

    {/* Jewels */}
    <path d="M7 10H5V8H7V10Z" />
    <path d="M27 10H25V8H27V10Z" />
    <path d="M17 8H15V6H17V8Z" />

    {/* S-like shape on top */}
    <path d="M15 6H13V4H17V6H15Z" />
    <path d="M13 4H11V2H13V4Z" />
    <path d="M17 4H19V0H17V4Z" />
  </svg>
);

export default PixelatedCrownIcon;