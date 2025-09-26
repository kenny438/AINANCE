import React, { useState, useEffect } from 'react';
import { InvestmentStrategy, PriceDataPoint, RiskLevel } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';

const riskStyles: { [key in RiskLevel]: string } = {
    Low: 'bg-green-500/20 text-green-300 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    High: 'bg-red-500/20 text-red-300 border-red-500/30',
    Degenerate: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const PerformanceChart: React.FC<{ data: PriceDataPoint[], color: string }> = ({ data, color }) => {
    // This is a simplified version, as a full SVG chart is complex.
    // We can show a simple representation or use a library in a real app.
    // For now, let's just show a placeholder.
    if (!data || data.length < 2) return <div className="h-40 flex items-center justify-center bg-brand-bg rounded-md text-brand-muted">No performance data.</div>;
    
    // Create a simple SVG sparkline
    const width = 300;
    const height = 80;
    const values = data.map(p => p.price);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    const points = data.map((point, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((point.price - min) / (max - min)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        </svg>
    );
};


interface InvestmentModalProps {
    state: { isOpen: boolean; strategy: InvestmentStrategy } | null;
    onClose: () => void;
    onInvest: (strategy: InvestmentStrategy, amount: bigint) => void;
    gxtrBalance: bigint;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ state, onClose, onInvest, gxtrBalance }) => {
    const [amountStr, setAmountStr] = useState('');
    const { isOpen, strategy } = state || {};

    useEffect(() => {
        if (isOpen) setAmountStr('');
    }, [isOpen]);

    if (!isOpen || !strategy) return null;

    const handleAmountChange = (value: string) => {
        if (/^\d*$/.test(value)) setAmountStr(value);
    };

    const handleSetMax = () => setAmountStr(gxtrBalance.toString());

    const handleSubmit = () => {
        if (!amountStr) return alert("Please enter an amount.");
        const amount = BigInt(amountStr);
        onInvest(strategy, amount);
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-surface w-full max-w-lg rounded-xl border border-brand-border shadow-2xl m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-brand-border">
                    <h2 className="text-2xl font-bold text-brand-light">Invest in: {strategy.name}</h2>
                    <p className="text-brand-muted mt-1">{strategy.description}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-brand-bg p-3 rounded-lg border border-brand-border">
                            <p className="text-xs text-brand-muted">Projected APY</p>
                            <p className="text-xl font-bold text-green-400">{strategy.apy.toFixed(1)}%</p>
                        </div>
                        <div className="bg-brand-bg p-3 rounded-lg border border-brand-border">
                            <p className="text-xs text-brand-muted">Risk Level</p>
                            <p className={`text-xl font-bold ${riskStyles[strategy.riskLevel]}`}>{strategy.riskLevel}</p>
                        </div>
                    </div>

                    <div className="bg-brand-bg p-3 rounded-lg border border-brand-border text-sm">
                        <div className="flex justify-between"><span className="text-brand-muted">Performance Fee</span><span className="font-semibold">{strategy.performanceFee}%</span></div>
                        <div className="flex justify-between mt-1"><span className="text-brand-muted">Min. Investment</span><span className="font-mono">{strategy.minInvestment.toLocaleString()} GXTR</span></div>
                    </div>
                    
                    <div className="h-24">
                        <PerformanceChart data={strategy.performanceHistory} color="#4ade80" />
                    </div>

                    <div>
                        <label htmlFor="invest-amount" className="block text-sm font-medium text-brand-muted mb-1">Amount to Invest</label>
                        <div className="relative">
                             <input id="invest-amount" type="text" value={amountStr} onChange={e => handleAmountChange(e.target.value)} placeholder="0" className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-light text-lg font-mono focus:ring-brand-light focus:border-brand-light" />
                             <button onClick={handleSetMax} className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-brand-accent hover:text-brand-light">MAX</button>
                        </div>
                        <p className="text-xs text-brand-muted mt-1 text-right">Available: {gxtrBalance.toLocaleString()} GXTR</p>
                    </div>
                </div>
                <div className="p-6 bg-brand-bg/30 border-t border-brand-border flex items-center space-x-3">
                    <button onClick={onClose} className="w-full px-4 py-3 rounded-md font-semibold bg-brand-surface hover:bg-brand-border transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="w-full px-4 py-3 rounded-md font-semibold bg-brand-primary hover:bg-brand-accent text-brand-text-on-primary transition-colors">Confirm Investment</button>
                </div>
            </div>
        </div>
    );
};

export default InvestmentModal;
