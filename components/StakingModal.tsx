import React, { useState, useEffect } from 'react';
import { StakingPool, ActiveStake, PortfolioHolding } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import BussinSymbolIcon from './icons/BussinSymbolIcon';

interface StakingModalProps {
    state: {
        isOpen: boolean;
        pool: StakingPool;
        stake?: ActiveStake;
        action: 'stake' | 'unstake';
    } | null;
    onClose: () => void;
    onStake: (poolId: string, amount: bigint) => void;
    onUnstake: (stakeId: string, amount: bigint) => void;
    gxtrBalance: bigint;
    portfolio: PortfolioHolding[];
}

const StakingModal: React.FC<StakingModalProps> = ({ state, onClose, onStake, onUnstake, gxtrBalance, portfolio }) => {
    const [amountStr, setAmountStr] = useState('');
    const { isOpen, pool, stake, action } = state || {};

    const isGxtr = pool?.assetTicker === 'GXTR';
    const scalingFactor = 1_000_000;

    let availableBalance: number | bigint = 0n;
    if (isGxtr) {
        availableBalance = action === 'stake' ? gxtrBalance : stake?.amount || 0n;
    } else {
        const holding = portfolio.find(h => h.ticker === pool?.assetTicker);
        availableBalance = action === 'stake' ? (holding?.amount || 0) : Number(stake?.amount || 0n) / scalingFactor;
    }

    useEffect(() => {
        if (isOpen) {
            setAmountStr('');
        }
    }, [isOpen]);

    if (!isOpen || !pool) return null;

    const handleAmountChange = (value: string) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setAmountStr(value);
        }
    };
    
    const handleSetMax = () => {
        setAmountStr(isGxtr ? availableBalance.toString() : availableBalance.toString());
    };

    const handleSubmit = () => {
        const amountNum = parseFloat(amountStr);
        if (isNaN(amountNum) || amountNum <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        let amountBigInt: bigint;
        if (isGxtr) {
            if (BigInt(amountStr) > (availableBalance as bigint)) {
                alert("Amount exceeds available balance.");
                return;
            }
            amountBigInt = BigInt(amountStr);
        } else {
             if (amountNum > (availableBalance as number)) {
                alert("Amount exceeds available balance.");
                return;
            }
            amountBigInt = BigInt(Math.floor(amountNum * scalingFactor));
        }

        if (action === 'stake') {
            onStake(pool.id, amountBigInt);
        } else if (stake) {
            onUnstake(stake.id, amountBigInt);
        }
    };

    const title = action === 'stake' ? `Stake ${pool.assetTicker}` : `Unstake ${pool.assetTicker}`;
    const availableBalanceFormatted = isGxtr ? (availableBalance as bigint).toLocaleString() : (availableBalance as number).toFixed(6);
    
    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-surface w-full max-w-md rounded-xl border border-brand-border shadow-2xl m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-brand-border">
                    <h2 className="text-2xl font-bold text-brand-light">{title}</h2>
                    <p className="text-brand-muted mt-1">Available: {availableBalanceFormatted} {pool.assetTicker}</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="stake-amount" className="block text-sm font-medium text-brand-muted mb-1">Amount</label>
                        <div className="relative">
                            <input
                                id="stake-amount"
                                type="text"
                                value={amountStr}
                                onChange={e => handleAmountChange(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-light text-lg font-mono focus:ring-brand-light focus:border-brand-light"
                            />
                            <button onClick={handleSetMax} className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-brand-accent hover:text-brand-light">MAX</button>
                        </div>
                    </div>
                     <div className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border text-sm">
                        <div className="flex justify-between">
                            <span className="text-brand-muted">Pool APR</span>
                            <span className="font-semibold text-brand-light">{pool.apr.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-brand-muted">Action</span>
                            <span className="font-semibold text-brand-light capitalize">{action}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-brand-bg/30 border-t border-brand-border flex items-center space-x-3">
                    <button onClick={onClose} className="w-full px-4 py-3 rounded-md font-semibold bg-brand-surface hover:bg-brand-border transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="w-full px-4 py-3 rounded-md font-semibold bg-brand-primary hover:bg-brand-accent text-brand-text-on-primary transition-colors capitalize">{action}</button>
                </div>
            </div>
        </div>
    );
};

export default StakingModal;