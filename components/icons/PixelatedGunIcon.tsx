import React from 'react';

const PixelatedGunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    {...props}
  >
    <path d="M5 8H18V10H5V8Z" />
    <path d="M5 10H7V12H5V10Z" />
    <path d="M7 12H9V14H7V12Z" />
    <path d="M9 14H11V16H9V14Z" />
    <path d="M11 12H14V14H11V12Z" />
    <path d="M7 14H8V18H7V14Z" />
  </svg>
);

export default PixelatedGunIcon;
