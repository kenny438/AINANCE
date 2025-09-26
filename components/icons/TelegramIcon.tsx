import React from 'react';

const TelegramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
       <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-1.37.2-1.64l16.12-5.66c.74-.26 1.45.53 1.16 1.54l-2.89 12.56c-.32 1.33-1.47 1.22-2.05.28l-4.12-7.55-4.07 3.86c-.4.38-1.03.39-1.44.03z"></path>
    </svg>
);

export default TelegramIcon;
