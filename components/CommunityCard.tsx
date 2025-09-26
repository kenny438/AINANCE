import React from 'react';
import DiscordIcon from './icons/DiscordIcon';
import TelegramIcon from './icons/TelegramIcon';

const CommunityCard: React.FC = () => (
    <div className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border mb-2 p-4 animate-fade-in">
        <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">Join the Community</h3>
        <div className="flex space-x-3 mb-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center space-x-2 py-2 bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border rounded-md transition-colors text-text-primary dark:text-dark-text-primary">
                <DiscordIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Discord</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center space-x-2 py-2 bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border rounded-md transition-colors text-text-primary dark:text-dark-text-primary">
                <TelegramIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Telegram</span>
            </a>
        </div>
        <div className="flex justify-around text-center text-sm pt-2 border-t border-border dark:border-dark-border">
            <div>
                <p className="font-bold text-lg text-text-primary dark:text-dark-text-primary">125,432</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Users</p>
            </div>
            <div>
                <p className="font-bold text-lg text-text-primary dark:text-dark-text-primary">12,876</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Active Traders</p>
            </div>
             <div>
                <p className="font-bold text-lg text-text-primary dark:text-dark-text-primary">1,203</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Proposals</p>
            </div>
        </div>
    </div>
);

export default CommunityCard;
