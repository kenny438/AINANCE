import React from 'react';
import { UserAsset } from '../types';
import PlayIcon from './icons/PlayIcon';
import StarIcon from './icons/StarIcon';
import ForkIcon from './icons/ForkIcon';
import PinIcon from './icons/PinIcon';
import PieChartIcon from './icons/PieChartIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';

interface AssetCardProps {
    asset: UserAsset;
    onRun: (asset: UserAsset) => void;
    onEdit: (asset: UserAsset) => void;
    onTogglePin: (assetId: string) => void;
    isCompact?: boolean;
    ownership?: number;
}

const LanguageBadge: React.FC<{ language: string }> = ({ language }) => {
    const colors: { [key: string]: string } = {
        JavaScript: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
        Python: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
        Rust: 'bg-orange-400/20 text-orange-300 border-orange-400/30',
        Go: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
        'C++': 'bg-pink-400/20 text-pink-300 border-pink-400/30',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[language] || 'bg-gray-500/20 text-gray-400'}`}>{language}</span>
}

const Stat: React.FC<{icon: React.ReactNode, value: number | string}> = ({ icon, value }) => (
    <div className="flex items-center space-x-1 text-text-secondary dark:text-dark-text-secondary">
        {icon}
        <span className="text-xs">{value}</span>
    </div>
);


const AssetCard: React.FC<AssetCardProps> = ({ asset, onRun, onEdit, onTogglePin, isCompact = false, ownership }) => (
    <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4 flex flex-col justify-between animate-fade-in transition-all duration-200 hover:border-text-secondary dark:hover:border-dark-text-secondary hover:shadow-lg">
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary flex-grow mr-2">{asset.name}</h3>
                <button 
                  onClick={() => onTogglePin(asset.id)} 
                  title={asset.pinned ? 'Unpin asset' : 'Pin asset'}
                  className={`p-1 rounded-md transition-colors ${asset.pinned ? 'text-primary bg-primary/10' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-secondary dark:hover:bg-dark-secondary'}`}
                >
                    <PinIcon className="w-4 h-4"/>
                </button>
            </div>
            {!isCompact && <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4 h-10 overflow-hidden">{asset.description}</p>}
        </div>
        <div>
            <div className="flex justify-between items-center text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                   <LanguageBadge language={asset.language} />
                   <Stat icon={<StarIcon className="w-3.5 h-3.5"/>} value={asset.stars.toLocaleString('en-US')} />
                   <Stat icon={<ForkIcon className="w-3.5 h-3.5"/>} value={asset.forks.toLocaleString('en-US')} />
                   {ownership !== undefined && <Stat icon={<PieChartIcon className="w-3.5 h-3.5"/>} value={`${ownership}%`} />}
                   {asset.exchangeTicker && <Stat icon={<TrendingUpIcon className="w-3.5 h-3.5 text-green-400"/>} value={`$${asset.exchangeTicker}`} />}
                </div>
                 <span className="text-xs">{asset.type}</span>
            </div>
            <div className="flex items-center space-x-2">
                 <button onClick={() => onEdit(asset)} className="flex-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors">Edit</button>
                 <button onClick={() => onRun(asset)} className="flex items-center justify-center space-x-1.5 flex-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors">
                    <PlayIcon className="w-3.5 h-3.5" />
                    <span>Run</span>
                </button>
            </div>
        </div>
    </div>
);

export default React.memo(AssetCard);