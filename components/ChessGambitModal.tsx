import React, { useState, useEffect, useCallback } from 'react';
import { UserAsset } from '../types';
import AssetCard from './AssetCard';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import ChessPieceIcon from './icons/ChessPieceIcon';

// --- ICONS ---
const UserToken: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" fill="currentColor" stroke="#FFF" strokeWidth="1" /></svg> );
const ArchitectToken: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg> );

type Piece = 'bK' | 'wN' | 'wP' | null;
type Board = Piece[][];

interface MonopolyGambitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGameEnd: (didWin: boolean) => Promise<UserAsset | null>;
    userBalance: bigint;
}

const initialBoard: Board = [
    [null, null, null, null, null],
    [null, null, null, 'bK', null],
    [null, 'wP', null, null, null],
    [null, null, 'wN', null, null],
    [null, null, null, null, null],
];

const winningMove = { from: { r: 3, c: 2 }, to: { r: 1, c: 3 } }; // Knight to checkmate

const MonopolyGambitModal: React.FC<MonopolyGambitModalProps> = ({ isOpen, onClose, onGameEnd, userBalance }) => {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState<{ r: number, c: number } | null>(null);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'processing'>('playing');
    const [prizeAsset, setPrizeAsset] = useState<UserAsset | null>(null);
    const cost = 1000000n;
    const canPlay = userBalance >= cost;

    useEffect(() => {
        if (isOpen) {
            setBoard(initialBoard);
            setSelectedPiece(null);
            setGameState('playing');
            setPrizeAsset(null);
        }
    }, [isOpen]);

    const handleSquareClick = (r: number, c: number) => {
        if (gameState !== 'playing' || !canPlay) return;

        if (selectedPiece) {
            // Attempting to move
            if (selectedPiece.r === winningMove.from.r && selectedPiece.c === winningMove.from.c &&
                r === winningMove.to.r && c === winningMove.to.c) {
                // Winning move
                setGameState('processing');
                onGameEnd(true).then(asset => {
                    setGameState('won');
                    setPrizeAsset(asset);
                });
            } else {
                // Losing move
                setGameState('processing');
                onGameEnd(false).then(() => {
                    setGameState('lost');
                });
            }
            setSelectedPiece(null);
        } else {
            // Selecting a piece
            if (board[r][c] === 'wN') {
                setSelectedPiece({ r, c });
            }
        }
    };
    
    if (!isOpen) return null;

    const renderGameState = () => {
        switch (gameState) {
            case 'won':
                return (
                    <div className="text-center p-4">
                        <h3 className="text-2xl font-bold text-green-400">CHECKMATE</h3>
                        <p className="text-brand-light mt-2">The Architect is impressed. You have won 10,000,000 GXTR and a unique asset.</p>
                        {prizeAsset && (
                            <div className="mt-4 max-w-sm mx-auto">
                                <AssetCard asset={prizeAsset} onRun={() => {}} onEdit={() => {}} onTogglePin={() => {}} isCompact />
                            </div>
                        )}
                        <button onClick={onClose} className="mt-4 px-6 py-2 rounded-lg font-semibold bg-brand-primary hover:bg-brand-accent text-brand-text-on-primary">Claim Winnings</button>
                    </div>
                );
            case 'lost':
                return (
                    <div className="text-center p-4">
                        <h3 className="text-2xl font-bold text-red-400">FAILURE</h3>
                        <p className="text-brand-light mt-2">A predictable, shortsighted move. The Architect is unimpressed. You lose your stake.</p>
                        <button onClick={onClose} className="mt-4 px-6 py-2 rounded-lg font-semibold bg-brand-surface hover:bg-brand-border">Acknowledge Defeat</button>
                    </div>
                );
            case 'processing':
                 return (
                    <div className="text-center p-4">
                        <h3 className="text-xl font-bold text-brand-light animate-pulse">Processing...</h3>
                        <p className="text-brand-muted mt-2">The Architect evaluates your move.</p>
                    </div>
                );
            default: // playing
                return (
                     <div className="flex flex-col items-center">
                        <div className="aspect-square w-full max-w-sm border-4 border-brand-border shadow-2xl">
                            {board.map((row, r) => (
                                <div key={r} className="flex">
                                    {row.map((piece, c) => (
                                        <div
                                            key={c}
                                            onClick={() => handleSquareClick(r, c)}
                                            className={`w-[20%] aspect-square flex items-center justify-center transition-colors
                                                ${(r + c) % 2 === 0 ? 'bg-brand-surface' : 'bg-brand-bg'}
                                                ${selectedPiece && selectedPiece.r === r && selectedPiece.c === c ? 'bg-yellow-500/50' : ''}
                                                ${gameState === 'playing' && canPlay && board[r][c]?.startsWith('w') ? 'cursor-pointer' : ''}
                                            `}
                                        >
                                            {piece && <ChessPieceIcon piece={piece} />}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <p className="text-brand-muted mt-4 text-center text-sm">White to move. Checkmate in one.</p>
                    </div>
                );
        }
    };


    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-brand-surface w-full max-w-xl rounded-2xl border border-brand-border shadow-2xl m-4 animate-fade-in flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b border-brand-border text-center">
                    <h2 className="text-2xl font-bold text-brand-light">The Architect's Gambit</h2>
                    <p className="text-brand-muted text-sm mt-1">A test of foresight. The wager is high, but the prize is invaluable.</p>
                </div>
                
                <div className="p-6 flex-grow">
                    {!canPlay ? (
                        <div className="text-center p-8">
                             <h3 className="text-xl font-bold text-red-400">Insufficient Funds</h3>
                             <p className="text-brand-light mt-2">You do not possess the required 1,000,000 GXTR to challenge The Architect.</p>
                        </div>
                    ) : renderGameState()}
                </div>
                
                <div className="p-4 bg-brand-bg/50 border-t border-brand-border flex justify-between items-center text-sm">
                    <div>
                        <span className="text-brand-muted">Cost to Play: </span>
                        <span className="font-bold text-brand-light flex items-center">
                            <AtlasCoinIcon className="w-4 h-4 mr-1" />
                            {cost.toLocaleString()}
                        </span>
                    </div>
                    <button onClick={onClose} className="px-4 py-2 rounded-md font-semibold bg-brand-surface hover:bg-brand-border transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

export default MonopolyGambitModal;