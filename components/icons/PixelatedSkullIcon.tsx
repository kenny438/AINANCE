import React from 'react';

const PixelatedSkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    {...props}
  >
    <path d="M8 4h8v2h2v2h2v6h-2v2h-2v2H8v-2H6v-2H4V8h2V6h2V4z M10 8h-2v4h2V8z m4 0h2v4h-2V8z m-2 6h2v2h-2v-2z"/>
  </svg>
);

export default PixelatedSkullIcon;
