import React from 'react';

type Piece = `${'w' | 'b'}${'P' | 'N' | 'B' | 'R' | 'Q' | 'K'}`;

interface ChessPieceIconProps extends React.SVGProps<SVGSVGElement> {
    piece: Piece;
}

const pieces: { [key in Piece]: React.ReactNode } = {
    wP: <path d="M22 9.5c0-1.1-.9-2-2-2h-1c-1.1 0-2 .9-2 2v1h6v-1zM20 12H4v2h16v-2zm-12 3v2h8v-2h-8zM6 18v-1h12v1H6z" fill="#E8E8E8" />,
    wR: <path d="M9 36V10H7v26h2zm18 0V10h-2v26h2zM7 10V4h2v6H7zm18 0V4h2v6h-2zM32 4H4v6h28V4z" fill="#E8E8E8" />,
    wN: <path d="M22 10c1.2 0 2.2-1.7 2.2-3.8 0-1.8-1.5-3.2-3.2-3.2-1.4 0-2.7.8-3.2 2-.5-1.2-1.8-2-3.2-2-1.8 0-3.2 1.4-3.2 3.2C11.8 8.3 12.8 10 14 10c-1.9 1.4-3 3.8-3 6.4V20h12v-3.6c0-2.6-1.1-5-3-6.4zM24 22H10v2h14v-2zm-2 2H12v2h10v-2zm-1 2H13v2h9v-2z" fill="#E8E8E8" />,
    wB: <path d="M13 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1l-2 2 2 2v1h-4l-2 2-2-2H8v-1l2-2-2-2V4a1 1 0 0 1 1-1zM15 11l-2 2h6l-2-2h-2zM12 14h10v2H12v-2zm-1 3h12v2H11v-2zm-1 3h14v2H10v-2z" fill="#E8E8E8" />,
    wQ: <path d="M8 12a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8zm15 0a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1zM16.5 13a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1zM4 14h24v2H4v-2zm-1 3h26v2H3v-2zm-1 3h28v2H2v-2z" fill="#E8E8E8" />,
    wK: <path d="M16 4h-2V2h2v2zm-2 4V4h2v4h-2zm-2-2V2h2v2h-2zm-2 2V2h2v2h-2zm-2-2V2h2v2H8zM24 10h-2V6h2v4zm-4 0h-2V6h2v4zm-4 0h-2V6h2v4zm-4 0H8V6h2v4zm-4 0H4V6h2v4zM2 12h28v2H2v-2zm-1 3h30v2H1v-2zm-1 3h32v2H0v-2z" fill="#E8E8E8" />,
    bP: <path d="M22 9.5c0-1.1-.9-2-2-2h-1c-1.1 0-2 .9-2 2v1h6v-1zM20 12H4v2h16v-2zm-12 3v2h8v-2h-8zM6 18v-1h12v1H6z" fill="#151515" />,
    bR: <path d="M9 36V10H7v26h2zm18 0V10h-2v26h2zM7 10V4h2v6H7zm18 0V4h2v6h-2zM32 4H4v6h28V4z" fill="#151515" />,
    bN: <path d="M22 10c1.2 0 2.2-1.7 2.2-3.8 0-1.8-1.5-3.2-3.2-3.2-1.4 0-2.7.8-3.2 2-.5-1.2-1.8-2-3.2-2-1.8 0-3.2 1.4-3.2 3.2C11.8 8.3 12.8 10 14 10c-1.9 1.4-3 3.8-3 6.4V20h12v-3.6c0-2.6-1.1-5-3-6.4zM24 22H10v2h14v-2zm-2 2H12v2h10v-2zm-1 2H13v2h9v-2z" fill="#151515" />,
    bB: <path d="M13 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1l-2 2 2 2v1h-4l-2 2-2-2H8v-1l2-2-2-2V4a1 1 0 0 1 1-1zM15 11l-2 2h6l-2-2h-2zM12 14h10v2H12v-2zm-1 3h12v2H11v-2zm-1 3h14v2H10v-2z" fill="#151515" />,
    bQ: <path d="M8 12a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8zm15 0a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1zM16.5 13a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1zM4 14h24v2H4v-2zm-1 3h26v2H3v-2zm-1 3h28v2H2v-2z" fill="#151515" />,
    bK: <path d="M16 4h-2V2h2v2zm-2 4V4h2v4h-2zm-2-2V2h2v2h-2zm-2 2V2h2v2h-2zm-2-2V2h2v2H8zM24 10h-2V6h2v4zm-4 0h-2V6h2v4zm-4 0h-2V6h2v4zm-4 0H8V6h2v4zm-4 0H4V6h2v4zM2 12h28v2H2v-2zm-1 3h30v2H1v-2zm-1 3h32v2H0v-2z" fill="#151515" />,
};

const ChessPieceIcon: React.FC<ChessPieceIconProps> = ({ piece, className, ...props }) => (
    <svg 
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full p-1 drop-shadow-md ${className}`}
        {...props}
    >
        {pieces[piece]}
    </svg>
);

export default ChessPieceIcon;
