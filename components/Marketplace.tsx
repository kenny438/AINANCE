import React, { useState, useEffect } from 'react';
import { MarketplaceItem, MarketplaceItemType, ThemeItem } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import BussinLogoIcon from './icons/BussinLogoIcon';
import StarIcon from './icons/StarIcon';
import { MARKETPLACE_ITEM_TYPES } from '../constants';
import WandIcon from './icons/WandIcon';
import RepoIcon from './icons/RepoIcon';
import TrollEasterEggModal from './TrollEasterEggModal';

interface MarketplaceProps {
  items: MarketplaceItem[];
  themes: ThemeItem[];
  onPurchase: (item: MarketplaceItem) => void;
  onPurchaseTheme: (theme: ThemeItem) => void;
  assetOwnership: Record<string, number>;
  purchasedCourseIds: string[];
  purchasedThemeIds: string[];
}

const StarRating: React.FC<{ rating: number, className?: string }> = ({ rating, className = '' }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className={`flex items-center ${className}`}>
            {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-500 fill-current" />)}
            {halfStar && <StarIcon key="half" className="w-4 h-4 text-yellow-500" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)', fill: 'currentColor' }} />}
            {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600" />)}
        </div>
    );
};

interface ItemCardProps {
    item: MarketplaceItem;
    onPurchase: (item: MarketplaceItem) => void;
    ownership: number;
    isCourseOwned: boolean;
}

const ItemCard: React.FC<ItemCardProps> = React.memo(({ item, onPurchase, ownership, isCourseOwned }) => {
  const typeColors = {
    Snippet: 'text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300',
    Template: 'text-green-700 bg-green-100 dark:bg-green-900/50 dark:text-green-300',
    Plugin: 'text-purple-700 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300',
    Course: 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300',
    'AI Model': 'text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300',
    Prompt: 'text-indigo-700 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300',
    Workflow: 'text-pink-700 bg-pink-100 dark:bg-pink-900/50 dark:text-pink-300',
  };
  
  const isAsset = item.type !== 'Course';
  const isFullyOwned = (isAsset && ownership >= 100) || (!isAsset && isCourseOwned);

  const getButtonText = () => {
    if (isAsset) {
      if (ownership >= 100) return 'Fully Owned';
      if (ownership > 0) return 'Buy 1% More';
      return 'Buy 1%';
    }
    return isCourseOwned ? 'Enrolled' : 'Enroll';
  };

  return (
    <div className="bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:border-text-secondary dark:hover:border-dark-text-secondary shadow-lg animate-fade-in h-full">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">{item.name}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeColors[item.type]}`}>{item.type}</span>
        </div>
        <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4 h-10 overflow-hidden">{item.description}</p>
        
        {isAsset && ownership > 0 && (
          <div className="mb-4 p-2 text-center bg-surface dark:bg-dark-surface rounded-md border border-border dark:border-dark-border">
            <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">You own {ownership}%</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
                <StarRating rating={item.rating} />
                <span className="text-xs text-text-secondary dark:text-dark-text-secondary">({item.reviews.toLocaleString()})</span>
            </div>
            <span className="text-xs font-mono text-text-secondary dark:text-dark-text-secondary">v{item.version}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-full text-text-secondary dark:text-dark-text-secondary capitalize">{tag}</span>
            ))}
        </div>
        <p className="text-xs text-text-secondary dark:text-dark-text-secondary">by <span className="font-semibold text-text-primary dark:text-dark-text-primary">{item.author}</span></p>
      </div>
      <div className="px-5 py-4 bg-surface/50 dark:bg-dark-surface/50 border-t border-border dark:border-dark-border flex flex-col items-stretch mt-auto">
        {isAsset && <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center mb-2">Price for 1% Ownership</p>}
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1 text-text-primary dark:text-dark-text-primary">
              <AtlasCoinIcon className="w-5 h-5"/>
              <span className="text-lg font-bold">{item.price.toLocaleString()}</span>
            </div>
            <button
              onClick={() => onPurchase(item)}
              disabled={isFullyOwned}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                isFullyOwned 
                  ? 'bg-secondary dark:bg-dark-secondary text-text-secondary dark:text-dark-text-secondary cursor-not-allowed' 
                  : 'bg-primary hover:bg-accent text-text-on-primary'
              }`}
            >
              {getButtonText()}
            </button>
        </div>
      </div>
    </div>
  );
});

const EmptyMarketplace: React.FC = () => (
    <div className="text-center py-20 px-6 bg-secondary dark:bg-dark-secondary border-2 border-dashed border-border dark:border-dark-border rounded-lg animate-fade-in">
        <BussinLogoIcon className="w-24 h-24 text-text-secondary dark:text-dark-text-secondary mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">The Marketplace is Open!</h2>
        <p className="text-text-secondary dark:text-dark-text-secondary max-w-md mx-auto mb-6">
            An empty canvas awaits. Be the first to list a cognitive model, prompt, or workflow and help build the AI Finance economy from the ground up.
        </p>
        <button 
            disabled
            className="px-6 py-3 rounded-lg font-semibold bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary cursor-not-allowed"
        >
            List Your First Asset
        </button>
    </div>
);

interface ThemeCardProps {
    theme: ThemeItem;
    onPurchase: (theme: ThemeItem) => void;
    isOwned: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = React.memo(({ theme, onPurchase, isOwned }) => {
    return (
        <div className={`bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:border-text-secondary dark:hover:border-dark-text-secondary shadow-lg animate-fade-in h-full relative ${theme.isFeatured ? 'ring-2 ring-primary' : ''}`}>
            {theme.isFeatured && (
                <div className="absolute top-2 -right-10 bg-primary text-text-on-primary text-xs font-bold px-12 py-1 transform rotate-45">
                    PREMIUM
                </div>
            )}
            <img src={theme.imageUrl} alt={theme.name} className="w-full h-48 object-cover"/>
            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">{theme.name}</h3>
                <p className="text-text-secondary dark:text-dark-text-secondary text-sm mt-1 mb-4 flex-grow">{theme.description}</p>
                 <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center space-x-1 text-text-primary dark:text-dark-text-primary">
                        <AtlasCoinIcon className="w-5 h-5"/>
                        <span className="text-lg font-bold">{theme.price.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={() => onPurchase(theme)}
                        disabled={isOwned}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                            isOwned
                                ? 'bg-secondary dark:bg-dark-secondary text-text-secondary dark:text-dark-text-secondary cursor-not-allowed'
                                : 'bg-primary hover:bg-accent text-text-on-primary'
                        }`}
                    >
                        {isOwned ? 'Owned' : 'Purchase'}
                    </button>
                </div>
            </div>
        </div>
    );
});

const Marketplace: React.FC<MarketplaceProps> = ({ items, themes, onPurchase, onPurchaseTheme, assetOwnership, purchasedCourseIds, purchasedThemeIds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState<'assets' | 'themes'>('assets');
  const [titleClicks, setTitleClicks] = useState(0);
  const [showTrollModal, setShowTrollModal] = useState(false);

  useEffect(() => {
    if (titleClicks >= 10) {
        setShowTrollModal(true);
        setTitleClicks(0);
    }
  }, [titleClicks]);
  
  const filteredItems = items.filter(item =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === 'All' || item.type === filterType)
  );

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase()) || theme.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredItems = items.filter(item => item.isFeatured);
  const trendingItems = [...items].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  
  const TabButton: React.FC<{label: string, icon: React.ReactNode, active: boolean, onClick: () => void}> = ({ label, icon, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
        active ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
    }`}>
        {icon}
        <span>{label}</span>
    </button>
);

  return (
    <div className="max-w-7xl mx-auto w-full bg-surface dark:bg-dark-surface rounded-2xl shadow-lg border border-border dark:border-dark-border p-6 md:p-8">
      <h1 onClick={() => setTitleClicks(c => c + 1)} className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2 cursor-pointer select-none">The AI Marketplace</h1>
      <p className="text-text-secondary dark:text-dark-text-secondary mb-6">Discover, purchase, and deploy models, prompts, workflows, and themes.</p>
      
      <div className="border-b border-border dark:border-dark-border mb-8">
          <div className="flex items-center space-x-2">
              <TabButton label="Assets" icon={<RepoIcon className="w-5 h-5" />} active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
              <TabButton label="Themes" icon={<WandIcon className="w-5 h-5" />} active={activeTab === 'themes'} onClick={() => setActiveTab('themes')} />
          </div>
      </div>
      
      {activeTab === 'assets' && (
        <>
          {/* Featured Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Featured Assets</h2>
            <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-border dark:scrollbar-thumb-dark-border scrollbar-track-transparent">
                {featuredItems.map(item => (
                    <div key={item.id} className="w-80 flex-shrink-0">
                        <ItemCard 
                            item={item} 
                            onPurchase={onPurchase} 
                            ownership={assetOwnership[item.id] || 0} 
                            isCourseOwned={item.type === 'Course' && purchasedCourseIds.includes(item.id)}
                        />
                    </div>
                ))}
            </div>
          </div>

          {/* Trending Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Trending This Week</h2>
            <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-border dark:scrollbar-thumb-dark-border scrollbar-track-transparent">
                {trendingItems.map(item => (
                    <div key={item.id} className="w-80 flex-shrink-0">
                        <ItemCard 
                            item={item} 
                            onPurchase={onPurchase} 
                            ownership={assetOwnership[item.id] || 0}
                            isCourseOwned={item.type === 'Course' && purchasedCourseIds.includes(item.id)}
                        />
                    </div>
                ))}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 border-t border-border dark:border-dark-border pt-8">All Assets</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
                type="text"
                placeholder="Search for assets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-grow bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:ring-primary focus:border-primary"
            />
            <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:ring-primary focus:border-primary"
            >
                <option value="All">All Types</option>
                {MARKETPLACE_ITEM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
            </select>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                 <ItemCard 
                    key={item.id} 
                    item={item} 
                    onPurchase={onPurchase} 
                    ownership={assetOwnership[item.id] || 0}
                    isCourseOwned={item.type === 'Course' && purchasedCourseIds.includes(item.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyMarketplace />
          )}
        </>
      )}

      {activeTab === 'themes' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search for themes..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-grow bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:ring-primary focus:border-primary"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThemes.map(theme => (
                    <ThemeCard
                        key={theme.id}
                        theme={theme}
                        onPurchase={onPurchaseTheme}
                        isOwned={purchasedThemeIds.includes(theme.id)}
                    />
                ))}
            </div>
        </div>
      )}
      {showTrollModal && <TrollEasterEggModal onClose={() => setShowTrollModal(false)} />}
    </div>
  );
};

export default React.memo(Marketplace);