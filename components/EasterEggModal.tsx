
import React, { useEffect, useState } from 'react';

interface EasterEggModalProps {
    onClose: () => void;
}

const EasterEggModal: React.FC<EasterEggModalProps> = ({ onClose }) => {
    const [line1, setLine1] = useState(false);
    const [line2, setLine2] = useState(false);
    const [finalMessage, setFinalMessage] = useState('');
    const fullMessage = "Fuck u to evryone who didnt beleive in me";

    useEffect(() => {
        const t1 = setTimeout(() => setLine1(true), 500);
        const t2 = setTimeout(() => setLine2(true), 1500);
        const t3 = setTimeout(() => {
            let i = 0;
            const typingInterval = setInterval(() => {
                setFinalMessage(fullMessage.substring(0, i + 1));
                i++;
                if (i >= fullMessage.length) {
                    clearInterval(typingInterval);
                }
            }, 100);
            return () => clearInterval(typingInterval);
        }, 2500);
        
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center font-mono backdrop-blur-sm" onClick={onClose}>
            <div className="text-center text-green-500 animate-fade-in p-4">
                {line1 && <p className="text-xl animate-pulse">[system_override: direct_mem_access]</p>}
                {line2 && <p className="text-md mt-4 opacity-75">> broadcasting priority message...</p>}
                {finalMessage && (
                     <div className="mt-8 text-3xl font-bold p-4 border-2 border-green-500/50 relative">
                        <span>{finalMessage}</span>
                        <span className="animate-pulse">_</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EasterEggModal;