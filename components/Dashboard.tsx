import React from 'react';
import { LeaderboardUser, PortfolioHolding, TradableAsset, Transaction } from '../types';
import DollarSignIcon from './icons/DollarSignIcon';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import CpuIcon from './icons/CpuIcon';
import FileTextIcon from './icons/FileTextIcon';
import PieChartIcon from './icons/PieChartIcon';
import WalletCard from './WalletCard';

interface DashboardProps {
    user: LeaderboardUser;
    balance: bigint;
    gxtrPrice: number;
    portfolio: PortfolioHolding[];
    tradableAssets: TradableAsset[];
    transactions: Transaction[];
}

const StatWidget: React.FC<{ title: string; value: string; subValue?: string; icon: React.ReactNode }> = ({ title, value, subValue, icon }) => (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-5 flex items-center space-x-4">
        <div className="p-3 bg-brand-bg rounded-lg">{icon}</div>
        <div>
            <p className="text-brand-muted text-sm">{title}</p>
            <p className="text-2xl font-bold text-brand-light">{value}</p>
            {subValue && <p className="text-sm text-brand-muted">{subValue}</p>}
        </div>
    </div>
);

const AITreasuryWidget: React.FC = () => {
    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-5 h-full flex flex-col items-center justify-center text-center">
            <CpuIcon className="w-10 h-10 text-brand-muted mb-3"/>
            <h3 className="text-xl font-bold text-brand-light">AI Treasury Manager</h3>
            <p className="text-brand-muted text-sm mt-1">Automated protocol management is coming soon.</p>
        </div>
    );
}

const RecentActivityWidget: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-5">
        <div className="flex items-center space-x-3 mb-4">
            <FileTextIcon className="w-6 h-6 text-brand-muted" />
            <h3 className="text-xl font-bold text-brand-light">Recent Activity</h3>
        </div>
        <ul className="space-y-3">
            {transactions.slice(0, 4).map(tx => (
                <li key={tx.id} className="flex justify-between items-center text-sm">
                    <div>
                        <p className="text-brand-light">{tx.description}</p>
                        <p className="text-xs text-brand-muted">{tx.date}</p>
                    </div>
                    <span className={`font-mono font-semibold ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.type === 'earn' ? '+' : '-'}{tx.amount.toLocaleString()} GXTR
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, balance, gxtrPrice, portfolio, tradableAssets, transactions }) => {
    
    const netWorth = Number(balance) * gxtrPrice;
    const portfolioValue = portfolio.reduce((acc, holding) => {
        const asset = tradableAssets.find(a => a.id === holding.assetId);
        return acc + (asset ? holding.amount * asset.currentPrice : 0);
    }, 0);

    return (
        <div className="max-w-7xl w-full mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-brand-light mb-2">Welcome back, {user.name}</h1>
            <p className="text-brand-muted mb-8">This is your real-time AI Finance command center.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatWidget 
                    title="Total Net Worth" 
                    value={`$${(netWorth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                    subValue={`${balance.toLocaleString()} GXTR`}
                    icon={<DollarSignIcon className="w-7 h-7 text-brand-light"/>}
                />
                 <StatWidget 
                    title="GXTR Price" 
                    value={`$${gxtrPrice.toPrecision(4)}`} 
                    icon={<AtlasCoinIcon className="w-7 h-7 text-brand-light"/>}
                />
                 <StatWidget 
                    title="Portfolio Value" 
                    value={`$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subValue={`${portfolio.length} Assets`}
                    icon={<PieChartIcon className="w-7 h-7 text-brand-light"/>}
                />
                <AITreasuryWidget />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecentActivityWidget transactions={transactions} />
                <div className="flex items-center justify-center">
                    <WalletCard user={user} balance={balance} />
                </div>
            </div>

        </div>
    );
};

export default React.memo(Dashboard);