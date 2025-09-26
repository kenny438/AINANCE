import React, { useState } from 'react';
import { UserAsset, LeaderboardUser, UserActivity, PortfolioHolding, TradableAsset, AssetLanguage, AssetType, Organization, ChatMessage, ThemeItem } from '../types';
import PlusIcon from './icons/PlusIcon';
import CodeIcon from './icons/CodeIcon';
import SparkleIcon from './icons/SparkleIcon';
import BookIcon from './icons/BookIcon';
import RepoIcon from './icons/RepoIcon';
import PulseIcon from './icons/PulseIcon';
import AssetCard from './AssetCard';
import ContributionGraph from './ContributionGraph';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import { ASSET_TYPES, LANGUAGES } from '../constants';
import AwardIcon from './icons/AwardIcon';
import ZapIcon from './icons/ZapIcon';
import UsersIcon from './icons/UsersIcon';
import PieChartIcon from './icons/PieChartIcon';
import { getUserTier } from '../utils';
import PlayIcon from './icons/PlayIcon';
import StarIcon from './icons/StarIcon';
import ForkIcon from './icons/ForkIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import OrganizationsView from './OrganizationsView';
import OrganizationChatView from './OrganizationChatView';
import WandIcon from './icons/WandIcon';
import PixelatedGunIcon from './icons/PixelatedGunIcon';

type ProfileTab = 'overview' | 'assets' | 'organizations' | 'portfolio' | 'achievements' | 'rankings' | 'personalization';

interface ProfileProps {
  user: LeaderboardUser;
  balance: bigint;
  assets: UserAsset[];
  activity: UserActivity[];
  onEditAsset: (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>) => void;
  onRunAsset: (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>) => void;
  onTogglePin: (assetId: string) => void;
  onWalletClick: () => void;
  assetOwnership: Record<string, number>;
  portfolio: PortfolioHolding[];
  tradableAssets: TradableAsset[];
  onEditProfile: () => void;
  organizations: Organization[];
  onNewOrganization: () => void;
  onInviteToOrganization: (organization: Organization) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (orgId: string, content: string) => void;
  leaderboard: LeaderboardUser[];
  purchasedThemes: ThemeItem[];
  activeThemeId: string | null;
  onApplyTheme: (themeId: string | null) => void;
}

const StatWidget: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4 flex items-center space-x-4">
        <div className="p-2 bg-secondary dark:bg-dark-secondary rounded-md">{icon}</div>
        <div>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{title}</p>
            <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
        </div>
    </div>
);


const AIPrompt: React.FC<{ onGenerate: (prompt: string) => Promise<void>, isGenerating: boolean }> = ({ onGenerate, isGenerating }) => {
    return (
        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-6 mb-8 shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <SparkleIcon className="w-8 h-8 text-primary mb-2" />
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Feature Coming Soon</h3>
                <p className="text-text-secondary dark:text-dark-text-secondary">AI-powered asset generation is on its way.</p>
            </div>
            <div className="flex items-center space-x-3 mb-3">
                <SparkleIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
                <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Generate with AI</h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-4 text-sm">Describe the code asset you want to create. It can be a full application, a component, a function, or just a snippet.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-stretch gap-3">
                <input
                    type="text"
                    placeholder="e.g., a React hook for fetching data, a Python sorting algorithm"
                    className="flex-grow bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                    disabled={true}
                />
                <button
                    type="submit"
                    disabled={true}
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors disabled:bg-surface disabled:text-text-secondary disabled:cursor-not-allowed"
                >
                    <SparkleIcon className="w-5 h-5" />
                    <span>Generate</span>
                </button>
            </form>
        </div>
    );
};

const TabButton: React.FC<{label: string, icon: React.ReactNode, active: boolean, onClick: () => void}> = ({ label, icon, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active ? 'text-text-primary dark:text-dark-text-primary bg-secondary dark:bg-dark-secondary' : 'text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
    }`}>
        {icon}
        <span>{label}</span>
    </button>
);

const ActivityItem: React.FC<{ item: UserActivity }> = ({ item }) => {
    const icon = {
        create: <PlusIcon className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary"/>,
        publish: <SparkleIcon className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary"/>,
        update: <CodeIcon className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary"/>
    }[item.type];
    
    return (
        <div className="flex space-x-3 py-3 border-b border-border dark:border-dark-border last:border-b-0">
             <div className="w-6 h-6 rounded-full bg-background dark:bg-dark-background flex items-center justify-center mt-1">{icon}</div>
             <div>
                <p className="text-text-primary dark:text-dark-text-primary text-sm">
                    <span className="font-semibold">{item.assetName}</span> - {item.description}
                </p>
                <p className="text-text-secondary dark:text-dark-text-secondary text-xs mt-0.5">{new Date(item.date).toDateString()}</p>
             </div>
        </div>
    );
};

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

const Stat: React.FC<{icon: React.ReactNode, value: number | string, label: string}> = ({ icon, value, label }) => (
    <div className="flex items-center space-x-1 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary">
        {icon}
        <span className="text-sm font-semibold">{value}</span>
        <span className="text-sm">{label}</span>
    </div>
);


const Badge: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4 flex items-center space-x-4">
        <div className="p-3 bg-background dark:bg-dark-background rounded-lg">{icon}</div>
        <div>
            <h3 className="font-bold text-text-primary dark:text-dark-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{description}</p>
        </div>
    </div>
);

const RankingTable: React.FC<{ users: LeaderboardUser[] }> = ({ users }) => {
    return (
        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-secondary/50 dark:bg-dark-secondary/50">
                    <tr>
                        <th className="p-3 font-semibold text-text-secondary dark:text-dark-text-secondary text-xs uppercase tracking-wider w-12 text-center">#</th>
                        <th className="p-3 font-semibold text-text-secondary dark:text-dark-text-secondary text-xs uppercase tracking-wider">Entity</th>
                        <th className="p-3 font-semibold text-text-secondary dark:text-dark-text-secondary text-xs uppercase tracking-wider text-right">Net Worth</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className="border-t border-border dark:border-dark-border">
                            <td className="p-3 font-bold text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                                {index + 1}
                            </td>
                            <td className="p-3">
                                <div className="flex items-center space-x-3">
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full"/>
                                    <span className="font-semibold text-text-primary dark:text-dark-text-primary text-sm">{user.name}</span>
                                </div>
                            </td>
                            <td className="p-3 font-mono text-right">
                                <div className="flex items-center justify-end space-x-1 text-text-primary dark:text-dark-text-primary text-sm">
                                    <AtlasCoinIcon className="w-3.5 h-3.5"/>
                                    <span>{user.balance.toLocaleString()}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PersonalizationView: React.FC<{
    themes: ThemeItem[];
    activeThemeId: string | null;
    onApplyTheme: (themeId: string | null) => void;
}> = ({ themes, activeThemeId, onApplyTheme }) => (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Personalization</h2>
                <p className="text-text-secondary dark:text-dark-text-secondary">Apply a purchased theme to change the application's look and feel.</p>
            </div>
            <button
                onClick={() => onApplyTheme(null)}
                className="px-4 py-2 rounded-md font-semibold bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border transition-colors"
            >
                Revert to Default
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map(theme => (
                <div key={theme.id} className={`bg-surface dark:bg-dark-surface border rounded-lg overflow-hidden flex flex-col transition-all duration-200 ${activeThemeId === theme.id ? 'border-primary ring-2 ring-primary' : 'border-border dark:border-dark-border'}`}>
                    <img src={theme.imageUrl} alt={theme.name} className="w-full h-40 object-cover" />
                    <div className="p-4 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">{theme.name}</h3>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1 flex-grow">{theme.description}</p>
                        <button
                            onClick={() => onApplyTheme(theme.id)}
                            disabled={activeThemeId === theme.id}
                            className="mt-4 w-full py-2 rounded-md text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-secondary dark:disabled:bg-dark-secondary disabled:text-text-secondary dark:disabled:text-dark-text-secondary bg-primary hover:bg-accent text-text-on-primary"
                        >
                            {activeThemeId === theme.id ? 'Applied' : 'Apply Theme'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const Profile: React.FC<ProfileProps> = ({ user, balance, assets, activity, onEditAsset, onRunAsset, onTogglePin, onWalletClick, assetOwnership, portfolio, tradableAssets, onEditProfile, organizations, onNewOrganization, onInviteToOrganization, chatMessages, onSendMessage, leaderboard, purchasedThemes, activeThemeId, onApplyTheme }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const { tier, className: tierClassName } = getUserTier(balance);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const loserboard = [...leaderboard].sort((a, b) => Number(a.balance - b.balance));

  const handleNewAsset = () => {
      onEditAsset({
          name: '',
          type: 'Component',
          description: '',
          language: 'JavaScript',
          code: '',
          pinned: false,
          stars: 0,
          forks: 0
      });
  };
  
    return (
        <div className="max-w-7xl w-full mx-auto animate-fade-in">
            {/* Profile Header */}
            <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-background dark:border-dark-background shadow-lg"/>
                <div className="text-center sm:text-left flex-grow">
                <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{user.name}</h1>
                {user.ownerName && <p className="text-lg text-text-secondary dark:text-dark-text-secondary">{user.ownerName}</p>}
                {user.qualification && <p className="mt-2 text-md font-semibold italic text-primary dark:text-primary">{user.qualification}</p>}
                {user.bio && <p className="text-text-secondary dark:text-dark-text-secondary mt-2">{user.bio}</p>}
                <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${tierClassName}`}>{tier}</span>
                    <span className="text-text-secondary dark:text-dark-text-secondary text-sm">Reputation: {user.reputation.toLocaleString()}</span>
                </div>
                </div>
                <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <button onClick={onEditProfile} className="w-full px-4 py-2 rounded-md font-semibold bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border transition-colors">
                        Edit Profile
                    </button>
                    <button onClick={onWalletClick} className="w-full justify-center px-4 py-2 rounded-md font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors flex items-center space-x-2">
                        <AtlasCoinIcon className="w-5 h-5"/>
                        <span>{balance.toLocaleString()} GXTR</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex items-center space-x-2 border-b border-border dark:border-dark-border overflow-x-auto">
                <TabButton label="Overview" icon={<BookIcon className="w-4 h-4" />} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <TabButton label="Assets" icon={<RepoIcon className="w-4 h-4" />} active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
                <TabButton label="Organizations" icon={<BriefcaseIcon className="w-4 h-4" />} active={activeTab === 'organizations'} onClick={() => setActiveTab('organizations')} />
                <TabButton label="Portfolio" icon={<PieChartIcon className="w-4 h-4" />} active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
                {purchasedThemes.length > 0 && (
                    <TabButton label="Personalization" icon={<WandIcon className="w-4 h-4" />} active={activeTab === 'personalization'} onClick={() => setActiveTab('personalization')} />
                )}
                <TabButton label="Achievements" icon={<AwardIcon className="w-4 h-4" />} active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
                <TabButton label="Rankings" icon={<UsersIcon className="w-4 h-4" />} active={activeTab === 'rankings'} onClick={() => setActiveTab('rankings')} />
            </div>

            {/* Tab Content */}
            <div>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <ContributionGraph />
                        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-2">Recent Activity</h3>
                        {activity.length > 0 ? activity.slice(0, 5).map(item => <ActivityItem key={item.id} item={item}/>) : <p className="text-sm text-text-secondary dark:text-dark-text-secondary">No recent activity.</p>}
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-2">Pinned Assets</h3>
                            <div className="space-y-3">
                            {assets.filter(a => a.pinned).map(asset => (
                                <div key={asset.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-secondary dark:hover:bg-dark-secondary">
                                <span className="font-semibold">{asset.name}</span>
                                <LanguageBadge language={asset.language} />
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
                )}
                
                {/* Assets Tab */}
                {activeTab === 'assets' && (
                <div>
                    <AIPrompt onGenerate={async () => {}} isGenerating={isGenerating} />
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <input type="text" placeholder="Filter assets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md p-2 text-sm"/>
                            <select value={filterLang} onChange={e => setFilterLang(e.target.value)} className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md p-2 text-sm">
                                <option value="All">All Languages</option>
                                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>
                        </div>
                        <button onClick={handleNewAsset} className="flex items-center space-x-2 px-4 py-2 rounded-md font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors">
                            <PlusIcon className="w-5 h-5"/>
                            <span>New Asset</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assets
                            .filter(asset => filterLang === 'All' || asset.language === filterLang)
                            .filter(asset => asset.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(asset => (
                            <AssetCard key={asset.id} asset={asset} onEdit={onEditAsset} onRun={onRunAsset} onTogglePin={onTogglePin} />
                        ))}
                    </div>
                </div>
                )}

                {/* Organizations Tab */}
                {activeTab === 'organizations' && (
                     <>
                        {!selectedOrgId ? (
                            <OrganizationsView
                                organizations={organizations}
                                onNewOrganization={onNewOrganization}
                                onInvite={onInviteToOrganization}
                                onSelectOrganization={setSelectedOrgId}
                            />
                        ) : (
                            <OrganizationChatView
                                organization={organizations.find(o => o.id === selectedOrgId)!}
                                messages={chatMessages.filter(m => m.orgId === selectedOrgId)}
                                currentUser={user}
                                onSendMessage={onSendMessage}
                                onBack={() => setSelectedOrgId(null)}
                            />
                        )}
                    </>
                )}

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                    <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-2">Holdings</h3>
                        <div className="space-y-3">
                            {portfolio.map(holding => {
                                const asset = tradableAssets.find(a => a.id === holding.assetId);
                                const value = asset ? holding.amount * asset.currentPrice : 0;
                                return (
                                    <div key={holding.assetId} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary dark:hover:bg-dark-secondary">
                                        <div>
                                            <p className="font-bold">{holding.name} ({holding.ticker})</p>
                                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{holding.amount.toFixed(4)} shares</p>
                                        </div>
                                        <p className="font-mono text-right font-semibold">{value.toFixed(2)} GXTR</p>
                                    </div>
                                )
                            })}
                            {portfolio.length === 0 && <p className="text-sm text-text-secondary dark:text-dark-text-secondary">You don't hold any tradable assets.</p>}
                        </div>
                    </div>
                )}

                 {/* Personalization Tab */}
                {activeTab === 'personalization' && (
                    <PersonalizationView themes={purchasedThemes} activeThemeId={activeThemeId} onApplyTheme={onApplyTheme} />
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Badge icon={<AwardIcon className="w-8 h-8 text-yellow-400" />} title="Pioneer" description="Joined during the first week of AI Finance." />
                        <Badge icon={<ZapIcon className="w-8 h-8 text-blue-400" />} title="Power Staker" description="Staked over 1,000,000,000 GXTR." />
                        <Badge icon={<UsersIcon className="w-8 h-8 text-green-400" />} title="Community Pillar" description="Received 100 tips from other users." />
                        <Badge icon={<PixelatedGunIcon className="w-8 h-8 text-red-400" />} title="Top G" description="Made a degen-level investment and survived." />
                    </div>
                )}

                {/* Rankings Tab */}
                {activeTab === 'rankings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Leaderboard</h3>
                            <RankingTable users={leaderboard} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Loserboard</h3>
                            <RankingTable users={loserboard} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(Profile);