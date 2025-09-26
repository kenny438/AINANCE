import React from 'react';
import { PriceAlert } from '../types';
import BellIcon from './icons/BellIcon';

interface AlertBannersProps {
    alerts: PriceAlert[];
    onDismiss: (alertId: string) => void;
}

const AlertBanners: React.FC<AlertBannersProps> = ({ alerts, onDismiss }) => {
    if (alerts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 w-full max-w-sm z-[80] space-y-3">
            {alerts.map(alert => (
                <div key={alert.id} className="bg-brand-surface border border-brand-border rounded-lg shadow-2xl p-4 flex items-start space-x-3 animate-fade-in">
                    <div className="p-2 bg-brand-primary/10 rounded-full mt-1">
                        <BellIcon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-bold text-brand-light">Price Alert Triggered!</h3>
                        <p className="text-sm text-brand-muted">
                            {alert.assetTicker} is now {alert.condition} {alert.threshold.toFixed(2)} GXTR.
                        </p>
                    </div>
                    <button onClick={() => onDismiss(alert.id)} className="text-brand-muted hover:text-brand-light">&times;</button>
                </div>
            ))}
        </div>
    );
};

export default AlertBanners;
