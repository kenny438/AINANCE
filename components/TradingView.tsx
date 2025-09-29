import React, { useState, useMemo, useEffect } from 'react';
import { AppView, TradableAsset, PriceDataPoint, PortfolioHolding, AIPrediction, PriceAlert } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrendingDownIcon from './icons/TrendingDownIcon';
import BrainIcon from './icons/BrainIcon';
import MinusIcon from './icons/MinusIcon';
import StarIcon from './icons/StarIcon';
import InfoIcon from './icons/InfoIcon';
import BellIcon from './icons/BellIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import LockIcon from './icons/LockIcon';
import BarChartIcon from './icons/BarChartIcon';


// --- SUB-COMPONENTS ---

const PriceChart: React.FC<{ data: PriceDataPoint[], color: string }> = ({ data, color }) => {
    if (!data || data.length < 2) {
        return <div className="flex items-center justify-center h-full text-brand-muted">Not enough data for chart.</div>;
    }

    const width = 500;
    const height = 250;
    const padding = 20;

    const prices = data.map(p => p.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    const getX = (index: number) => (index / (data.length - 1)) * (width - padding * 2) + padding;
    const getY = (price: number) => height - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2) - padding;

    const path = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point.price)}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="75%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
            </defs>
            <path d={path} fill="none" stroke={color} strokeWidth="2" />
            <path d={`${path} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`} fill="url(#chartGradient)" />
        </svg>
    );
};

const TradePanel: React.FC<{ 
    asset: TradableAsset, 
    onTrade: (asset: TradableAsset, amount: number, type: 'buy' | 'sell', orderType: 'market' | 'limit' | 'stop', price?: number) => void,
    holding: number,
    balance: bigint
}> = ({ asset, onTrade, holding, balance }) => {
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
    
    const [amount, setAmount] = useState(''); // Amount of asset (e.g., QNTM)
    const [total, setTotal] = useState(''); // Amount of GXTR
    
    const [limitPrice, setLimitPrice] = useState('');
    const [stopPrice, setStopPrice] = useState('');

    useEffect(() => {
        setAmount('');
        setTotal('');
        setLimitPrice('');
        setStopPrice('');
    }, [tradeType, orderType, asset]);

    const handleAmountChange = (value: string) => {
        setAmount(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            setTotal((numValue * asset.currentPrice).toFixed(2));
        } else {
            setTotal('');
        }
    };
    
    const handleTotalChange = (value: string) => {
        setTotal(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            setAmount((numValue / asset.currentPrice).toFixed(6));
        } else {
            setAmount('');
        }
    };

    const handleTrade = () => {
        const numAmount = parseFloat(amount);
        if (numAmount > 0) {
            let price: number | undefined;
            if (orderType === 'limit') price = parseFloat(limitPrice);
            if (orderType === 'stop') price = parseFloat(stopPrice);
            onTrade(asset, numAmount, tradeType, orderType, price);
            setAmount('');
            setTotal('');
        }
    };
    
    const maxAmount = tradeType === 'buy' ? parseFloat((Number(balance) / asset.currentPrice).toFixed(6)) : holding;

    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg h-full flex flex-col">
            <div className="flex border-b border-brand-border">
                <button onClick={() => setTradeType('buy')} className={`flex-1 p-3 text-sm font-semibold transition-colors ${tradeType === 'buy' ? 'bg-green-500/20 text-green-300 border-b-2 border-green-300' : 'text-brand-muted hover:bg-brand-bg/50'}`}>Buy</button>
                <button onClick={() => setTradeType('sell')} className={`flex-1 p-3 text-sm font-semibold transition-colors ${tradeType === 'sell' ? 'bg-red-500/20 text-red-300 border-b-2 border-red-300' : 'text-brand-muted hover:bg-brand-bg/50'}`}>Sell</button>
            </div>
             <div className="flex border-b border-brand-border text-xs">
                <button onClick={() => setOrderType('market')} className={`flex-1 p-2 font-semibold transition-colors ${orderType === 'market' ? 'text-brand-light' : 'text-brand-muted hover:text-brand-light'}`}>Market</button>
                <button onClick={() => setOrderType('limit')} className={`flex-1 p-2 font-semibold transition-colors ${orderType === 'limit' ? 'text-brand-light' : 'text-brand-muted hover:text-brand-light'}`}>Limit</button>
                <button onClick={() => setOrderType('stop')} className={`flex-1 p-2 font-semibold transition-colors ${orderType === 'stop' ? 'text-brand-light' : 'text-brand-muted hover:text-brand-light'}`}>Stop</button>
            </div>
            <div className="p-4 space-y-3 flex-grow flex flex-col">
                {orderType === 'limit' && (
                     <div className="space-y-1">
                        <label className="text-xs text-brand-muted">Limit Price</label>
                        <input type="number" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} placeholder="0.00" className="w-full bg-brand-bg p-2 rounded-lg border border-brand-border text-brand-light" />
                    </div>
                )}
                 {orderType === 'stop' && (
                     <div className="space-y-1">
                        <label className="text-xs text-brand-muted">Stop Price</label>
                        <input type="number" value={stopPrice} onChange={e => setStopPrice(e.target.value)} placeholder="0.00" className="w-full bg-brand-bg p-2 rounded-lg border border-brand-border text-brand-light" />
                    </div>
                )}
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-brand-muted">
                        <label>Amount</label>
                        <span>Balance: {holding.toFixed(6)} {asset.ticker}</span>
                    </div>
                    <div className="flex items-center bg-brand-bg p-2 rounded-lg border border-brand-border">
                        <input type="number" value={amount} onChange={e => handleAmountChange(e.target.value)} placeholder="0.00" className="w-full bg-transparent text-brand-light focus:outline-none" />
                        <span className="font-semibold text-brand-muted">{asset.ticker}</span>
                    </div>
                </div>
                 <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-brand-muted">
                        <label>Total</label>
                         <span>Balance: {balance.toLocaleString('en-US')} GXTR</span>
                    </div>
                    <div className="flex items-center bg-brand-bg p-2 rounded-lg border border-brand-border">
                        <input type="number" value={total} onChange={e => handleTotalChange(e.target.value)} placeholder="0.00" className="w-full bg-transparent text-brand-light focus:outline-none" />
                        <span className="font-semibold text-brand-muted">GXTR</span>
                    </div>
                </div>
            </div>
            <div className="p-4 mt-auto">
                 <button onClick={handleTrade} className={`w-full p-3 rounded-lg font-semibold text-brand-text-on-primary transition-opacity ${tradeType === 'buy' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} disabled:opacity-50`} disabled={!amount || parseFloat(amount) <= 0}>
                    {tradeType === 'buy' ? `Buy ${asset.ticker}` : `Sell ${asset.ticker}`}
                </button>
            </div>
        </div>
    );
}

const OrderBook: React.FC<{ asset: TradableAsset }> = ({ asset }) => {
    const generateOrders = (count: number, isBuy: boolean) => {
        return Array.from({ length: count }, (_, i) => {
            const price = asset.currentPrice * (1 + (isBuy ? -1 : 1) * (i + 1) * 0.001 * (Math.random() + 0.5));
            const amount = Math.random() * 10;
            const total = price * amount;
            return { price, amount, total };
        });
    };
    const buyOrders = useMemo(() => generateOrders(10, true), [asset.currentPrice]);
    const sellOrders = useMemo(() => generateOrders(10, false).reverse(), [asset.currentPrice]);

    return (
        <div className="text-xs font-mono">
            <div className="grid grid-cols-3 text-brand-muted p-2">
                <span>Price (GXTR)</span>
                <span className="text-right">Amount ({asset.ticker})</span>
                <span className="text-right">Total (GXTR)</span>
            </div>
            <div>
                {sellOrders.map((order, i) => (
                    <div key={i} className="grid grid-cols-3 p-1 relative hover:bg-brand-surface">
                        <span className="text-red-400">{order.price.toFixed(2)}</span>
                        <span className="text-right">{order.amount.toFixed(4)}</span>
                        <span className="text-right">{order.total.toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="p-2 border-y border-brand-border my-1 text-lg font-sans font-bold flex items-center gap-2">
                <span className={asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>{asset.currentPrice.toFixed(2)}</span>
                {asset.change24h >=0 ? <TrendingUpIcon className="w-4 h-4 text-green-400"/> : <TrendingDownIcon className="w-4 h-4 text-red-400"/>}
            </div>
            <div>
                {buyOrders.map((order, i) => (
                    <div key={i} className="grid grid-cols-3 p-1 relative hover:bg-brand-surface">
                        <span className="text-green-400">{order.price.toFixed(2)}</span>
                        <span className="text-right">{order.amount.toFixed(4)}</span>
                        <span className="text-right">{order.total.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AIAnalysisPanel: React.FC = () => {
    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col h-full min-h-[200px] items-center justify-center text-center">
            <h3 className="font-semibold text-brand-light mb-2 flex items-center"><BrainIcon className="w-5 h-5 mr-2 text-brand-muted"/>AI Analysis</h3>
            <div className="flex-grow flex flex-col items-center justify-center text-brand-muted">
                <BrainIcon className="w-10 h-10 mb-2" />
                <h4 className="font-bold text-brand-light">Coming Soon</h4>
                <p className="text-sm">Get AI-powered market predictions and analysis.</p>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

interface TradingViewProps {
    assets: TradableAsset[];
    onTrade: (asset: TradableAsset, amount: number, type: 'buy' | 'sell', orderType: 'market' | 'limit' | 'stop', price?: number) => void;
    portfolio: PortfolioHolding[];
    balance: bigint;
    watchlist: string[];
    onToggleWatchlist: (assetId: string) => void;
    alerts: PriceAlert[];
    onSetAlert: (asset: TradableAsset) => void;
    setActiveView: (view: AppView) => void;
}

const TradingView: React.FC<TradingViewProps> = ({ assets, onTrade, portfolio, balance, watchlist, onToggleWatchlist, alerts, onSetAlert, setActiveView }) => {
    const [selectedAsset, setSelectedAsset] = useState<TradableAsset | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'watchlist'>('all');
    
    const holding = portfolio.find(h => h.assetId === selectedAsset?.id)?.amount || 0;

    const handleSelectAsset = (asset: TradableAsset) => {
        setSelectedAsset(asset);
    }

    const displayedAssets = activeTab === 'all' ? assets : assets.filter(a => watchlist.includes(a.id));

    if (selectedAsset) {
        return (
            <div className="flex flex-col gap-4 animate-fade-in">
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                        <button onClick={() => setSelectedAsset(null)} className="p-2 rounded-full text-brand-muted hover:text-brand-light hover:bg-brand-bg"><ArrowLeftIcon className="w-5 h-5"/></button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-brand-light">{selectedAsset.name} ({selectedAsset.ticker})</h2>
                            <p className="text-brand-muted text-sm">{selectedAsset.type} / {selectedAsset.language}</p>
                        </div>
                   </div>
                   <div className="text-right">
                       <p className={`text-xl md:text-2xl font-mono ${selectedAsset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {selectedAsset.currentPrice.toFixed(2)}
                       </p>
                       <p className={`text-sm font-semibold ${selectedAsset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {selectedAsset.change24h.toFixed(2)}% (24h)
                       </p>
                   </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-4 flex flex-col gap-4">
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        <div className="bg-brand-surface border border-brand-border rounded-lg p-2 h-64 lg:h-[400px]">
                             <PriceChart data={selectedAsset.priceHistory} color={selectedAsset.change24h >= 0 ? '#4ade80' : '#f87171'} />
                        </div>
                        <AIAnalysisPanel />
                        <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
                             <h3 className="font-semibold text-brand-light mb-2">Asset Information</h3>
                            <p className="text-sm text-brand-muted mb-4">{selectedAsset.description}</p>
                            <div className="space-y-3 text-sm">
                               <div className="flex justify-between"><span className="text-brand-muted">Author</span><span className="font-semibold text-brand-light">{selectedAsset.author}</span></div>
                               <div className="flex justify-between"><span className="text-brand-muted">24h Volume</span><span className="font-mono text-brand-light">{selectedAsset.volume24h.toLocaleString('en-US', {maximumFractionDigits: 0})} GXTR</span></div>
                               <div className="flex justify-between"><span className="text-brand-muted">Liquidity</span><span className="font-mono text-brand-light">{selectedAsset.liquidity.toLocaleString('en-US')} GXTR</span></div>
                               <div className="flex justify-between"><span className="text-brand-muted">Circulating Supply</span><span className="font-mono text-brand-light">{selectedAsset.circulatingSupply.toLocaleString('en-US')}</span></div>
                               <div className="flex justify-between"><span className="text-brand-muted">Total Supply</span><span className="font-mono text-brand-light">{selectedAsset.totalSupply.toLocaleString('en-US')}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <TradePanel asset={selectedAsset} onTrade={onTrade} holding={holding} balance={balance} />
                        <div className="bg-brand-surface border border-brand-border rounded-lg overflow-y-auto max-h-96">
                            <h3 className="p-3 font-semibold text-brand-light border-b border-brand-border sticky top-0 bg-brand-surface/80 backdrop-blur-sm">Order Book</h3>
                            <OrderBook asset={selectedAsset} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-brand-light mb-2">Exchange</h1>
            <p className="text-brand-muted mb-8">Trade ownership of AI assets.</p>
            
            <div className="flex justify-between items-center border-b border-brand-border mb-4">
                {/* Left side: local tabs */}
                <div className="flex space-x-1">
                    <button onClick={() => setActiveTab('all')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'all' ? 'border-b-2 border-brand-light text-brand-light' : 'text-brand-muted hover:text-brand-light'}`}>All Assets</button>
                    <button onClick={() => setActiveTab('watchlist')} className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 ${activeTab === 'watchlist' ? 'border-b-2 border-brand-light text-brand-light' : 'text-brand-muted hover:text-brand-light'}`}>
                        <StarIcon className="w-4 h-4" /> Watchlist
                    </button>
                </div>

                {/* Right side: navigation buttons */}
                <div className="flex items-center space-x-2">
                    <button onClick={() => setActiveView('staking')} className="px-3 py-1.5 text-sm font-semibold flex items-center gap-2 text-brand-muted hover:text-brand-light bg-brand-surface hover:bg-brand-bg rounded-md transition-colors">
                        <LockIcon className="w-4 h-4" /> 
                        <span className="hidden sm:inline">Staking</span>
                    </button>
                    <button onClick={() => setActiveView('iaas')} className="px-3 py-1.5 text-sm font-semibold flex items-center gap-2 text-brand-muted hover:text-brand-light bg-brand-surface hover:bg-brand-bg rounded-md transition-colors">
                        <BarChartIcon className="w-4 h-4" /> 
                        <span className="hidden sm:inline">Investing</span>
                    </button>
                </div>
            </div>

            <div className="bg-brand-surface border border-brand-border rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-brand-bg/50">
                            <tr>
                                <th className="p-4 w-10"></th>
                                <th className="p-4 font-semibold text-brand-muted text-sm uppercase tracking-wider">Asset</th>
                                <th className="p-4 font-semibold text-brand-muted text-sm uppercase tracking-wider text-right">Price</th>
                                <th className="p-4 font-semibold text-brand-muted text-sm uppercase tracking-wider text-right">24h Change</th>
                                <th className="p-4 font-semibold text-brand-muted text-sm uppercase tracking-wider text-right hidden sm:table-cell">24h Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedAssets.map((asset) => {
                                const hasActiveAlert = alerts.some(a => a.assetId === asset.id && !a.triggered);
                                return (
                                    <tr key={asset.id} className="border-t border-brand-border transition-colors duration-200 hover:bg-brand-bg/30 group">
                                        <td className="p-4">
                                            <button onClick={(e) => { e.stopPropagation(); onToggleWatchlist(asset.id); }} className="text-brand-muted hover:text-brand-accent">
                                                <StarIcon filled={watchlist.includes(asset.id)} className={watchlist.includes(asset.id) ? 'text-brand-accent' : ''} />
                                            </button>
                                        </td>
                                        <td className="p-4 cursor-pointer" onClick={() => handleSelectAsset(asset)}>
                                            <div className="flex items-center space-x-2">
                                                <div className="font-bold text-brand-light group-hover:text-brand-accent">{asset.name}</div>
                                                <button onClick={(e) => { e.stopPropagation(); onSetAlert(asset); }} title="Set Price Alert" className={`transition-colors ${hasActiveAlert ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-light'}`}>
                                                    <BellIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-sm text-brand-muted">{asset.ticker}</div>
                                        </td>
                                        <td className="p-4 font-mono text-right text-brand-light cursor-pointer" onClick={() => handleSelectAsset(asset)}>{asset.currentPrice.toFixed(2)}</td>
                                        <td className={`p-4 font-mono text-right font-semibold cursor-pointer ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`} onClick={() => handleSelectAsset(asset)}>
                                            <div className="flex items-center justify-end space-x-1">
                                                {asset.change24h >= 0 ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
                                                <span>{asset.change24h.toFixed(2)}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-right text-brand-light cursor-pointer hidden sm:table-cell" onClick={() => handleSelectAsset(asset)}>{asset.volume24h.toLocaleString('en-US', {notation: 'compact'})}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                 {activeTab === 'watchlist' && displayedAssets.length === 0 && (
                    <div className="p-8 text-center text-brand-muted">
                        <StarIcon className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold text-brand-light">Your Watchlist is Empty</h3>
                        <p>Click the star icon on any asset to add it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(TradingView);