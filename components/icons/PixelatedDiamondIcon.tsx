import React from 'react';

const PixelatedDiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    {...props}
  >
    <path d="M12 3 L6 9 H18 Z M6 9 L12 21 L18 9 Z"/>
  </svg>
);

export default PixelatedDiamondIcon;
