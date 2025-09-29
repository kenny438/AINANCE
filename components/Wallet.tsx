import React from 'react';
import { Transaction } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import BussinSymbolIcon from './icons/BussinSymbolIcon';

interface WalletProps {
    isOpen: boolean;
    onClose: () => void;
    balance: bigint;
    transactions: Transaction[];
    onCompanyClick: () => void;
}

const Wallet: React.FC<WalletProps> = ({ isOpen, onClose, balance, transactions, onCompanyClick }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-surface dark:bg-dark-surface w-full max-w-lg rounded-xl border border-border dark:border-dark-border shadow-2xl m-4 animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border dark:border-dark-border">
                    <div className="flex items-center space-x-3">
                        <BussinSymbolIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
                        <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">My Wallet</h2>
                    </div>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Your Grand X factor Trader (GXTR) balance and activity.</p>
                </div>

                <div className="p-6 text-center bg-secondary/30 dark:bg-dark-secondary/30">
                    <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-1">Current Balance</p>
                    <div className="flex items-center justify-center space-x-2 text-text-primary dark:text-dark-text-primary">
                        <AtlasCoinIcon className="w-8 h-8"/>
                        <span className="text-4xl font-bold tracking-tighter">{balance.toLocaleString('en-US')}</span>
                    </div>
                    <p className="text-text-secondary dark:text-dark-text-secondary font-light mt-1">Googolplex GXTR</p>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-3">Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         <button 
                            onClick={onCompanyClick}
                            className="w-full text-center p-3 rounded-lg bg-text-primary/10 dark:bg-dark-text-primary/10 text-text-primary dark:text-dark-text-primary hover:bg-text-primary/20 dark:hover:bg-dark-text-primary/20 border border-text-primary/20 dark:border-dark-text-primary/20 transition-colors"
                         >
                            Buy GXTR
                         </button>
                         <button 
                            disabled 
                            className="w-full text-center p-3 rounded-lg bg-text-secondary/10 dark:bg-dark-text-secondary/10 text-text-secondary dark:text-dark-text-secondary border border-text-secondary/20 dark:border-dark-text-secondary/20 cursor-not-allowed"
                         >
                            Cash Out
                         </button>
                    </div>
                </div>
                
                <div className="p-6 border-t border-border dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-3">Recent Transactions</h3>
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                        {transactions.map(tx => (
                            <li key={tx.id} className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-text-primary dark:text-dark-text-primary font-medium">{tx.description}</p>
                                    <p className="text-text-secondary dark:text-dark-text-secondary text-xs">{tx.date}</p>
                                </div>
                                <span className={`font-semibold font-mono ${tx.type === 'earn' ? 'text-text-primary dark:text-dark-text-primary' : 'text-text-secondary dark:text-dark-text-secondary'}`}>
                                    {tx.type === 'earn' ? '+' : '-'}{tx.amount.toLocaleString('en-US')}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 bg-secondary/30 dark:bg-dark-secondary/30 text-right border-t border-border dark:border-dark-border">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-semibold bg-surface dark:bg-dark-surface hover:bg-border dark:hover:bg-dark-border transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Wallet);