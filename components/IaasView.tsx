import React from 'react';
import { InvestmentStrategy, ActiveInvestment, RiskLevel } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import BarChartIcon from './icons/BarChartIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';

interface IaasViewProps {
    strategies: InvestmentStrategy[];
    activeInvestments: ActiveInvestment[];
    onInvestClick: (strategy: InvestmentStrategy) => void;
    onWithdraw: (investmentId: string) => void;
}

const riskStyles: { [key in RiskLevel]: string } = {
    Low: 'bg-green-500/20 text-green-300 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    High: 'bg-red-500/20 text-red-300 border-red-500/30',
    Degenerate: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const StrategyCard: React.FC<{ strategy: InvestmentStrategy; onInvest: () => void }> = ({ strategy, onInvest }) => (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-5 flex flex-col justify-between transition-all hover:border-brand-muted hover:shadow-lg">
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-brand-light">{strategy.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${riskStyles[strategy.riskLevel]}`}>{strategy.riskLevel}</span>
            </div>
            <p className="text-sm text-brand-muted mb-4 h-14 overflow-hidden">{strategy.description}</p>
        </div>
        <div>
            <div className="flex justify-between items-center text-sm mb-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{strategy.apy.toFixed(1)}%</p>
                    <p className="text-xs text-brand-muted">Projected APY</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-mono text-brand-light">{strategy.aum.toLocaleString('en-US')}</p>
                    <p className="text-xs text-brand-muted">AUM (GXTR)</p>
                </div>
            </div>
            <button onClick={onInvest} className="w-full py-2.5 rounded-lg font-semibold bg-brand-primary hover:bg-brand-accent text-brand-text-on-primary transition-colors">
                View & Invest
            </button>
        </div>
    </div>
);

const IaasView: React.FC<IaasViewProps> = ({ strategies, activeInvestments, onInvestClick, onWithdraw }) => {

    const portfolioValue = activeInvestments.reduce((sum, inv) => sum + inv.currentValue, 0n);
    const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amountInvested, 0n);
    const totalPnl = portfolioValue - totalInvested;
    const pnlPercentage = totalInvested > 0n ? ((Number(totalPnl) / Number(totalInvested)) * 100).toFixed(2) : '0.00';

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-brand-light mb-2">Investment-as-a-Service (IAAS)</h1>
            <p className="text-brand-muted mb-8">Invest in automated, AI-powered trading strategies and earn yield.</p>

            <div className="bg-brand-surface border border-brand-border rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-brand-light mb-4">My Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-brand-bg rounded-lg"><AtlasCoinIcon className="w-7 h-7 text-brand-light" /></div>
                        <div>
                            <p className="text-sm text-brand-muted">Total Value</p>
                            <p className="text-2xl font-bold text-brand-light">{portfolioValue.toLocaleString('en-US')} <span className="text-lg font-normal">GXTR</span></p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-brand-bg rounded-lg"><TrendingUpIcon className={`w-7 h-7 ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`} /></div>
                        <div>
                            <p className="text-sm text-brand-muted">Total P/L</p>
                            <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalPnl.toLocaleString('en-US')} <span className="text-lg font-normal">({pnlPercentage}%)</span></p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-brand-bg rounded-lg"><BarChartIcon className="w-7 h-7 text-brand-light" /></div>
                        <div>
                            <p className="text-sm text-brand-muted">Active Strategies</p>
                            <p className="text-2xl font-bold text-brand-light">{activeInvestments.length}</p>
                        </div>
                    </div>
                </div>
                {activeInvestments.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs text-brand-muted uppercase">
                                <tr>
                                    <th className="p-2">Strategy</th>
                                    <th className="p-2 text-right">Current Value</th>
                                    <th className="p-2 text-right">P/L (%)</th>
                                    <th className="p-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeInvestments.map(inv => {
                                    const pnl = inv.currentValue - inv.amountInvested;
                                    const pnlPercent = inv.amountInvested > 0n ? ((Number(pnl) / Number(inv.amountInvested)) * 100).toFixed(2) : '0.00';
                                    return (
                                        <tr key={inv.id} className="border-t border-brand-border">
                                            <td className="p-2 font-semibold">{inv.strategyName}</td>
                                            <td className="p-2 text-right font-mono">{inv.currentValue.toLocaleString('en-US')} GXTR</td>
                                            <td className={`p-2 text-right font-mono ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnl.toLocaleString('en-US')} ({pnlPercent}%)</td>
                                            <td className="p-2 text-center">
                                                <button onClick={() => onWithdraw(inv.id)} className="px-3 py-1 text-xs font-semibold bg-brand-secondary hover:bg-brand-border rounded-md">Withdraw</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-bold text-brand-light mb-4">Available Strategies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {strategies.map(strat => (
                        <StrategyCard key={strat.id} strategy={strat} onInvest={() => onInvestClick(strat)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(IaasView);