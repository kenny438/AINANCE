import React, { useState } from 'react';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import BussinSymbolIcon from './icons/BussinSymbolIcon';

interface CompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchase: (amount: number) => void;
    gxtrPurchasedToday: number;
    lastGxtrPurchaseDate?: string;
}

const PurchaseOption: React.FC<{amount: number, price: number, onSelect: (amount: number) => void, selected: boolean, disabled: boolean}> = ({amount, price, onSelect, selected, disabled}) => (
    <button 
        onClick={() => onSelect(amount)}
        disabled={disabled}
        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left w-full
        ${selected ? 'border-accent bg-accent/5' : 'border-border dark:border-dark-border bg-surface dark:bg-dark-surface hover:border-text-secondary dark:hover:border-dark-text-secondary'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <div className="flex items-center space-x-2">
            <AtlasCoinIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
            <span className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{amount.toLocaleString('en-US')}</span>
        </div>
        <p className="text-text-secondary dark:text-dark-text-secondary">${price.toLocaleString('en-US')} USD</p>
    </button>
);


const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onPurchase, gxtrPurchasedToday, lastGxtrPurchaseDate }) => {
    const [selectedAmount, setSelectedAmount] = useState<number>(50);

    if (!isOpen) return null;

    const dailyLimit = 200;
    const today = new Date().toISOString().split('T')[0];
    const purchasedToday = lastGxtrPurchaseDate === today ? gxtrPurchasedToday : 0;
    const remainingLimit = dailyLimit - purchasedToday;

    const handlePurchase = () => {
        if (selectedAmount > remainingLimit) {
            alert(`Purchase exceeds daily limit. You can only buy ${remainingLimit} more GXTR today.`);
            return;
        }
        if (selectedAmount <= 0) {
            alert('Please select a valid amount.');
            return;
        }
        onPurchase(selectedAmount);
    }
    
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Number(e.target.value);
        if (value > remainingLimit) {
            value = remainingLimit;
        }
        if (value < 0) {
            value = 0;
        }
        setSelectedAmount(value);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-background dark:bg-dark-background w-full max-w-2xl rounded-xl border border-border dark:border-dark-border shadow-2xl m-4 animate-fade-in flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border dark:border-dark-border">
                    <div className="flex items-center space-x-3">
                        <BussinSymbolIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
                        <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Power Your Operations</h2>
                    </div>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Purchase Grand X factor Trader (GXTR) to reward contributors, sponsor bounties, and access enterprise features.</p>
                </div>
                
                <div className="p-6 flex-grow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Choose a Package</h3>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                            Daily limit remaining: <span className="font-bold text-text-primary dark:text-dark-text-primary">{remainingLimit} GXTR</span>
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <PurchaseOption amount={50} price={5} onSelect={setSelectedAmount} selected={selectedAmount === 50} disabled={remainingLimit < 50} />
                        <PurchaseOption amount={100} price={9} onSelect={setSelectedAmount} selected={selectedAmount === 100} disabled={remainingLimit < 100} />
                        <PurchaseOption amount={200} price={18} onSelect={setSelectedAmount} selected={selectedAmount === 200} disabled={remainingLimit < 200} />
                    </div>
                    
                    <div>
                        <label htmlFor="custom-amount" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Or enter a custom amount (max {remainingLimit})</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtlasCoinIcon className="w-5 h-5 text-text-primary dark:text-dark-text-primary" />
                            </div>
                            <input 
                                type="number" 
                                id="custom-amount"
                                value={selectedAmount}
                                onChange={handleCustomAmountChange}
                                max={remainingLimit}
                                className="w-full bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg pl-10 p-2 text-text-primary dark:text-dark-text-primary focus:ring-primary focus:border-primary"
                                placeholder="e.g. 75"
                                disabled={remainingLimit === 0}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-surface/50 dark:bg-dark-surface/50 border-t border-border dark:border-dark-border flex justify-end items-center space-x-4">
                     <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-semibold bg-surface dark:bg-dark-surface hover:bg-border dark:hover:bg-dark-border transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handlePurchase}
                        disabled={selectedAmount <= 0 || selectedAmount > remainingLimit}
                        className="px-6 py-2 rounded-md text-sm font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Purchase {selectedAmount.toLocaleString('en-US')} GXTR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyModal;