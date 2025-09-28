import React from 'react';

interface TrollEasterEggModalProps {
    onClose: () => void;
}

const asciiArt = `⠀     ⢀⡴⠋⠉⢉⠍⣉⡉⠉⠉⠉⠓⠲⠶⠤⣄⠀⠀⠀
⠀⠀⢀⠎⠀⠪⠾⢊⣁⣀⡀⠄⠀⠀⡌⠉⠁⠄⠀⢳⠀⠀
⠀⣰⠟⣢⣤⣐⠘⠛⣻⠻⠭⠇⠀⢤⡶⠟⠛⠂⠀⢌⢷⡀
⢸⢈⢸⠠⡶⠬⣉⡉⠁⠀⣠⢄⡀⠀⠳⣄⠑⠚⣏⠁⣪⠇
⠀⢯⡊⠀⠹⡦⣼⣍⠛⢲⠯⢭⣁⣲⣚⣁⣬⢾⢿⠈⡜⠀
⠀⠀⠙⡄⠀⠘⢾⡉⠙⡟⠶⢶⣿⣶⣿⣶⣿⣾⣿⠀⡇⠀
⠀⠀⠀⠙⢦⣤⡠⡙⠲⠧⠀⣠⣇⣨⣏⣽⡹⠽⠏⠀⡇⠀
⠀⠀⠀⠀⠀⠈⠙⠦⢕⡋⠶⠄⣤⠤⠤⠤⠤⠂⡠⠀⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠒⠦⠤⣄⣀⣀⣀⣠⠔⠁`;

const TrollEasterEggModal: React.FC<TrollEasterEggModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/90 z-[999] flex flex-col items-center justify-center font-mono text-white animate-fade-in backdrop-blur-sm">
            <div className="relative bg-white p-6 border border-border rounded-lg shadow-lg">
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600 transition-colors z-10"
                    aria-label="Close"
                >
                    &times;
                </button>
                
                <h2 className="text-2xl text-center text-black mb-4">
                    Gethmika be like :
                </h2>
                <pre className="text-left text-sm leading-tight text-black select-none">
                    {asciiArt}
                </pre>
                
                <p className="text-2xl md:text-3xl mt-4 text-black animate-pulse text-center font-bold">
                    look at little dumbass jr gonna cry
                </p>
            </div>
        </div>
    );
};

export default TrollEasterEggModal;