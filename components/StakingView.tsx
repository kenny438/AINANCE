import React from 'react';
import { StakingPool, ActiveStake, PortfolioHolding } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import LockIcon from './icons/LockIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';

interface StakingViewProps {
    pools: StakingPool[];
    stakes: ActiveStake[];
    balance: bigint;
    portfolio: PortfolioHolding[];
    onStakeClick: (pool: StakingPool) => void;
    onUnstakeClick: (stake: ActiveStake) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-bg rounded-md">{icon}</div>
            <div>
                <p className="text-sm text-brand-muted">{title}</p>
                <p className="text-xl font-bold font-mono text-brand-light">{value}</p>
            </div>
        </div>
    </div>
);

const PoolCard: React.FC<{ pool: StakingPool; userStake: bigint; onStakeClick: (pool: StakingPool) => void }> = ({ pool, userStake, onStakeClick }) => {
    const isGxtr = pool.assetTicker === 'GXTR';
    const scalingFactor = 1_000_000;
    
    const formatBigInt = (val: bigint) => {
        if (isGxtr) return val.toLocaleString('en-US');
        return (Number(val) / scalingFactor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
    };
    
    return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-5 transition-all hover:border-brand-muted hover:shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-brand-light">{pool.assetName}</h3>
                <p className="text-sm text-brand-muted">{pool.assetTicker}</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-green-400">{pool.apr.toFixed(2)}%</p>
                <p className="text-xs text-brand-muted">APR</p>
            </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-brand-muted">Total Staked</span>
                <span className="font-mono text-brand-light">{formatBigInt(pool.totalStaked)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-brand-muted">My Stake</span>
                <span className="font-mono text-brand-light">{formatBigInt(userStake)}</span>
            </div>
        </div>
        <button onClick={() => onStakeClick(pool)} className="mt-6 w-full py-2.5 rounded-lg font-semibold bg-brand-primary hover:bg-brand-accent text-brand-text-on-primary transition-colors">
            Stake {pool.assetTicker}
        </button>
    </div>
)};


const StakingView: React.FC<StakingViewProps> = ({ pools, stakes, balance, portfolio, onStakeClick, onUnstakeClick }) => {
    
    const totalStakedValue = stakes.reduce((acc, stake) => acc + stake.amount, 0n);
    const totalRewards = stakes.reduce((acc, stake) => acc + stake.rewardsAccrued, 0n);

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-brand-light mb-2">Staking</h1>
            <p className="text-brand-muted mb-8">Stake your assets to earn rewards and participate in the ecosystem.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard title="Total Staked Value (GXTR)" value={totalStakedValue.toLocaleString('en-US')} icon={<LockIcon className="w-6 h-6 text-brand-light" />} />
                <StatCard title="Total Rewards Earned (GXTR)" value={totalRewards.toLocaleString('en-US')} icon={<TrendingUpIcon className="w-6 h-6 text-brand-light" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-brand-light mb-4">My Active Stakes</h2>
                    <div className="bg-brand-surface border border-brand-border rounded-lg">
                        {stakes.length > 0 ? (
                             <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-brand-bg/50">
                                        <tr>
                                            <th className="p-4 font-semibold text-brand-muted text-sm uppercase">Asset</th>
                                            <th className="p-4 font-semibold text-brand-muted text-sm uppercase text-right">Amount Staked</th>
                                            <th className="p-4 font-semibold text-brand-muted text-sm uppercase text-right">Rewards Accrued</th>
                                            <th className="p-4 font-semibold text-brand-muted text-sm uppercase text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stakes.map(stake => {
                                            const isGxtr = stake.assetTicker === 'GXTR';
                                            const scalingFactor = 1_000_000;
                                            const formatBigInt = (val: bigint) => {
                                                if (isGxtr) return val.toLocaleString('en-US');
                                                return (Number(val) / scalingFactor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
                                            };

                                            return (
                                                <tr key={stake.id} className="border-t border-brand-border">
                                                    <td className="p-4 font-semibold text-brand-light">{stake.assetName}</td>
                                                    <td className="p-4 font-mono text-right text-brand-light">{formatBigInt(stake.amount)}</td>
                                                    <td className="p-4 font-mono text-right text-green-400">{formatBigInt(stake.rewardsAccrued)}</td>
                                                    <td className="p-4 text-center">
                                                        <button onClick={() => onUnstakeClick(stake)} className="px-4 py-1.5 text-xs font-semibold bg-brand-secondary hover:bg-brand-border rounded-md">Unstake</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 px-6">
                                <LockIcon className="w-12 h-12 text-brand-muted mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-brand-light">No Active Stakes</h3>
                                <p className="text-brand-muted mt-2">Stake assets from the available pools to start earning rewards.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                     <h2 className="text-2xl font-bold text-brand-light mb-4">Available Pools</h2>
                     <div className="space-y-6">
                        {pools.map(pool => {
                            const userStakeInPool = stakes
                                .filter(s => s.poolId === pool.id)
                                .reduce((acc, s) => acc + s.amount, 0n);
                            return (
                                <PoolCard key={pool.id} pool={pool} userStake={userStakeInPool} onStakeClick={onStakeClick} />
                            );
                        })}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(StakingView);