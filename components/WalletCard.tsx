import React from 'react';
import { LeaderboardUser } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import ChipIcon from './icons/ChipIcon';
import BussinLogoIcon from './icons/BussinLogoIcon';
import { getUserTier } from '../utils';

interface WalletCardProps {
    user: LeaderboardUser;
    balance: bigint;
}

const WalletCard: React.FC<WalletCardProps> = ({ user, balance }) => {
    const { tier } = getUserTier(balance);
    const isApex = tier === 'Apex';

    const formatBalanceAsCardNumber = (b: bigint) => {
        return String(b)
            .slice(0, 16)
            .padEnd(16, '0')
            .replace(/(.{4})/g, '$1 ')
            .trim();
    };

    const carbonFiberPattern = "bg-[url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='12'%20viewBox='0%200%2012%2012'%3E%3Cpath%20fill='%23fff'%20fill-opacity='0.04'%20d='M6%200h6v6H6V0zm6%206h6v6h-6V6zM0%206h6v6H0V6zM0%200h6v6H0V0z'/%3E%3C/svg%3E\")]";
    const apexCardStyles = `bg-black bg-gradient-to-br from-gray-900 to-black shadow-2xl shadow-black/50 ${carbonFiberPattern}`;
    const apexText = "text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-400";

    return (
        <div className="group w-full max-w-sm h-56 [perspective:1000px]">
            <div className="relative h-full w-full rounded-2xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Card Front */}
                <div className={`absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden border ${isApex ? 'text-white border-white/10 ' + apexCardStyles : 'bg-gradient-to-br from-surface to-border dark:from-dark-surface dark:to-dark-border text-text-primary dark:text-dark-text-primary border-transparent'} [backface-visibility:hidden]`}>
                    {isApex && <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60"></div>}
                    <div className="relative z-10 flex justify-between items-start">
                        <span className={`text-xl font-bold tracking-wider ${isApex ? apexText : 'text-text-secondary dark:text-dark-text-secondary'}`}>{isApex ? "APEX TIER" : "AI FINANCE"}</span>
                        <AtlasCoinIcon className={`w-8 h-8 ${isApex ? 'text-white/80' : 'text-text-secondary dark:text-dark-text-secondary'}`}/>
                    </div>

                    <div className="relative z-10">
                        <ChipIcon className="w-12 h-9 mb-2" />
                        <p className={`font-mono tracking-widest text-2xl ${isApex ? 'text-gray-300' : 'text-text-secondary dark:text-dark-text-secondary'}`}>{formatBalanceAsCardNumber(balance)}</p>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                        <p className="font-semibold uppercase tracking-wider">{user.ownerName || user.name}</p>
                        <BussinLogoIcon className={`w-16 h-16 ${isApex ? 'text-white' : 'text-current'}`} />
                    </div>
                </div>

                {/* Card Back */}
                <div className={`absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden border ${isApex ? 'text-white border-white/10 ' + apexCardStyles : 'bg-gradient-to-br from-surface to-border dark:from-dark-surface dark:to-dark-border text-text-primary dark:text-dark-text-primary border-transparent'} [transform:rotateY(180deg)] [backface-visibility:hidden]`}>
                    <div className="text-right">
                        <p className="font-mono text-xs uppercase text-gray-400">Identity Protocol v2.1</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <img src={user.avatar} alt="User Avatar" className="w-20 h-20 rounded-lg border-2 border-white/20 p-1 bg-yellow-500/20"/>
                        <div>
                            <p className="text-xs uppercase text-gray-400">Name</p>
                            <p className="text-lg font-bold">{user.name}</p>
                            <p className="text-xs uppercase text-gray-400 mt-2">Status</p>
                            <p className="font-semibold text-primary">{tier} Tier User</p>
                        </div>
                    </div>
                     <div>
                        <p className="text-xs uppercase text-gray-400">Bio</p>
                        <p className="text-sm italic">"{user.bio}"</p>
                     </div>
                     <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                        <p className="text-xs uppercase text-gray-400">Reputation: <span className="font-mono text-base text-white">{user.reputation.toLocaleString('en-US')}</span></p>
                        <BussinLogoIcon className={`w-12 h-12 ${isApex ? 'text-white' : 'text-current'}`} />
                     </div>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;