import React, { useState } from 'react';
import { TradableAsset, PriceAlert } from '../types';
import BellIcon from './icons/BellIcon';
import TrashIcon from './icons/TrashIcon';

interface PriceAlertModalProps {
    asset: TradableAsset;
    onClose: () => void;
    onAddAlert: (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => void;
    onRemoveAlert: (alertId: string) => void;
    existingAlerts: PriceAlert[];
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ asset, onClose, onAddAlert, onRemoveAlert, existingAlerts }) => {
    const [condition, setCondition] = useState<'above' | 'below'>('above');
    const [threshold, setThreshold] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const thresholdNum = parseFloat(threshold);
        if (isNaN(thresholdNum) || thresholdNum <= 0) {
            alert('Please enter a valid price threshold.');
            return;
        }
        onAddAlert({
            assetId: asset.id,
            assetTicker: asset.ticker,
            threshold: thresholdNum,
            condition,
        });
        setThreshold('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-surface w-full max-w-md rounded-xl border border-brand-border shadow-2xl m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-brand-border">
                    <h2 className="text-2xl font-bold text-brand-light flex items-center"><BellIcon className="w-6 h-6 mr-3" /> Price Alerts for {asset.ticker}</h2>
                    <p className="text-brand-muted mt-1">Get notified when {asset.name} hits your target price.</p>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-muted mb-2">Notify me when price is:</label>
                            <div className="flex space-x-2">
                                <button type="button" onClick={() => setCondition('above')} className={`flex-1 p-2 rounded-lg text-sm font-semibold border ${condition === 'above' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-brand-bg border-brand-border text-brand-muted hover:border-brand-muted'}`}>Above</button>
                                <button type="button" onClick={() => setCondition('below')} className={`flex-1 p-2 rounded-lg text-sm font-semibold border ${condition === 'below' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-brand-bg border-brand-border text-brand-muted hover:border-brand-muted'}`}>Below</button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="threshold" className="block text-sm font-medium text-brand-muted mb-1">Target Price (in GXTR)</label>
                            <input
                                id="threshold"
                                type="number"
                                step="0.01"
                                value={threshold}
                                onChange={e => setThreshold(e.target.value)}
                                placeholder={asset.currentPrice.toFixed(2)}
                                className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-light focus:ring-brand-light focus:border-brand-light"
                            />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-lg font-semibold bg-brand-primary hover:bg-brand-accent text-brand-text-on-primary transition-colors">Create Alert</button>
                    </form>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-brand-light border-t border-brand-border pt-4">Active Alerts</h3>
                        {existingAlerts.length > 0 ? (
                            <ul className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                                {existingAlerts.map(alert => (
                                    <li key={alert.id} className={`flex justify-between items-center p-2 rounded-md ${alert.triggered ? 'bg-brand-bg/50 text-brand-muted' : 'bg-brand-bg'}`}>
                                        <div className="text-sm">
                                            <span className="font-semibold">{alert.condition === 'above' ? 'Above' : 'Below'}</span>
                                            <span className="font-mono ml-2">{alert.threshold.toFixed(2)}</span>
                                            {alert.triggered && <span className="ml-2 text-xs italic">(Triggered)</span>}
                                        </div>
                                        <button onClick={() => onRemoveAlert(alert.id)} className="text-brand-muted hover:text-red-400 p-1"><TrashIcon className="w-4 h-4" /></button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-brand-muted mt-3">No active alerts for this asset.</p>
                        )}
                    </div>
                </div>
                 <div className="p-4 bg-brand-bg/50 border-t border-brand-border flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-md font-semibold bg-brand-surface hover:bg-brand-border transition-colors">Done</button>
                </div>
            </div>
        </div>
    );
};

export default PriceAlertModal;
