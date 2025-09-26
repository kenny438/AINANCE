import { UserTier } from './types';

export const getUserTier = (balance: bigint): { tier: UserTier; className: string } => {
    if (balance >= 10000000000000n) return { tier: 'Apex', className: 'text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-400' };
    if (balance >= 10000000000n) return { tier: 'Diamond', className: 'text-cyan-300' };
    if (balance >= 100000000n) return { tier: 'Gold', className: 'text-yellow-300' };
    if (balance >= 1000000n) return { tier: 'Silver', className: 'text-gray-300' };
    return { tier: 'Bronze', className: 'text-orange-400' };
};
