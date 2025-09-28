import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Supabase Session type is not exported in v2 in the same way, using `any` for simplicity as per existing code.
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import { AppView, MarketplaceItem, Transaction, UserAsset, UserActivity, AppAttachment, AssetType, MarketplaceItemType, TradableAsset, PortfolioHolding, LeaderboardUser, AssetLanguage, PriceDataPoint, ActiveStake, StakingPool, OpenOrder, InvestmentStrategy, ActiveInvestment, Organization, PriceAlert, ChatMessage, ThemeItem, Post } from './types';
import { MOCK_MARKETPLACE_ITEMS, MOCK_LEADERBOARD, MOCK_TRANSACTIONS, MOCK_USER_ASSETS, MOCK_USER_ACTIVITY, MOCK_TRADABLE_ASSETS, LANGUAGES, ASSET_TYPES, MOCK_STAKING_POOLS, MOCK_INVESTMENT_STRATEGIES, MOCK_ORGANIZATIONS, MOCK_CHAT_MESSAGES, MOCK_THEMES, MOCK_POSTS } from './constants';
import { THEME_DEFINITIONS } from './themes';
import Header from './components/Header';
import CodeUniverse from './components/CodeUniverse';
import Marketplace from './components/Marketplace';
import Leaderboard from './components/Leaderboard';
import Wallet from './components/Wallet';
import CompanyModal from './components/CompanyModal';
import Profile from './components/Profile';
import AssetEditorModal from './components/CreateAssetModal';
import TerminalModal from './components/TerminalModal';
import AppViewerModal from './components/AppViewerModal';
import BussinSymbolIcon from './components/icons/BussinSymbolIcon';
import AIChat from './components/AIChat';
import TradingView from './components/TradingView';
import MonopolyGambitModal from './components/ChessGambitModal';
import StakingView from './components/StakingView';
import StakingModal from './components/StakingModal';
import { GoogleGenAI, Type } from "@google/genai";
import Dashboard from './components/Dashboard';
import ProfileEditorModal from './components/ProfileEditorModal';
import IaasView from './components/IaasView';
import InvestmentModal from './components/InvestmentModal';
import CreateOrganizationModal from './components/CreateOrganizationModal';
import InviteModal from './components/InviteModal';
import PriceAlertModal from './components/PriceAlertModal';
import AlertBanners from './components/AlertBanners';
import BottomNavBar from './components/BottomNavBar';

interface AccountData {
  name?: string;
  bio?: string;
  balance: bigint;
  portfolio: PortfolioHolding[];
  transactions: Transaction[];
  userAssets: UserAsset[];
  userActivity: UserActivity[];
  assetOwnership: Record<string, number>;
  purchasedCourses: string[];
  purchasedThemes: string[];
  activeThemeId: string | null;
  watchlist: string[];
  staking: ActiveStake[];
  openOrders: OpenOrder[];
  activeInvestments: ActiveInvestment[];
  organizations: string[];
  alerts: PriceAlert[];
  lastGxtrPurchaseDate?: string;
  gxtrPurchasedToday: number;
}

type Theme = 'light' | 'dark';

const GLITCH_USER_EMAIL = 'mgethmikadinujakumarathunga@gmail.com';

// Helper functions to handle BigInt serialization for localStorage
const bigIntReplacer = (key: string, value: any) => {
    if (typeof value === 'bigint') {
        return value.toString() + 'n';
    }
    return value;
};

const bigIntReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
    }
    return value;
};


const App: React.FC = () => {
  const [session, setSession] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [theme, setTheme] = useState<Theme>('light');

  const defaultAccounts: Record<string, AccountData> = {
    'user-1': { // Template for the glitch user
        name: MOCK_LEADERBOARD.find(u => u.id === 'user-1')!.name,
        bio: MOCK_LEADERBOARD.find(u => u.id === 'user-1')!.bio,
        balance: MOCK_LEADERBOARD.find(u => u.id === 'user-1')!.balance,
        portfolio: [],
        transactions: MOCK_TRANSACTIONS,
        userAssets: MOCK_USER_ASSETS,
        userActivity: MOCK_USER_ACTIVITY,
        assetOwnership: {},
        purchasedCourses: [],
        purchasedThemes: [],
        activeThemeId: null,
        watchlist: ['trade-1', 'trade-5'],
        staking: [],
        openOrders: [],
        activeInvestments: [],
        organizations: ['org-1', 'org-2'],
        alerts: [],
        gxtrPurchasedToday: 0,
    },
    'user-2': { // Other mock user, can be kept for leaderboard display
        name: MOCK_LEADERBOARD.find(u => u.id === 'user-2')!.name,
        bio: MOCK_LEADERBOARD.find(u => u.id === 'user-2')!.bio,
        balance: MOCK_LEADERBOARD.find(u => u.id === 'user-2')!.balance,
        portfolio: [],
        transactions: [],
        userAssets: [],
        userActivity: [],
        assetOwnership: {},
        purchasedCourses: [],
        purchasedThemes: [],
        activeThemeId: null,
        watchlist: [],
        staking: [],
        openOrders: [],
        activeInvestments: [],
        organizations: [],
        alerts: [],
        gxtrPurchasedToday: 0,
    }
  };

  const [accounts, setAccounts] = useState<Record<string, AccountData>>(() => {
    try {
        const savedAccounts = localStorage.getItem('aiFinanceAccounts');
        if (savedAccounts) {
            return JSON.parse(savedAccounts, bigIntReviver);
        }
    } catch (error) {
        console.error("Could not load accounts from localStorage", error);
    }
    return defaultAccounts;
  });
  
  useEffect(() => {
    try {
        const serializedAccounts = JSON.stringify(accounts, bigIntReplacer);
        localStorage.setItem('aiFinanceAccounts', serializedAccounts);
    } catch (error) {
        console.error("Could not save accounts to localStorage", error);
    }
  }, [accounts]);


  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState<boolean>(false);
  const [isGambitOpen, setIsGambitOpen] = useState<boolean>(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState<boolean>(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [inviteModalState, setInviteModalState] = useState<{ isOpen: boolean; organization: Organization } | null>(null);


  const [assetInEditor, setAssetInEditor] = useState<UserAsset | Omit<UserAsset, 'id' | 'createdAt'> | null>(null);
  const [assetToRun, setAssetToRun] = useState<UserAsset | Omit<UserAsset, 'id' | 'createdAt'> | AppAttachment | null>(null);
  const [assetToPreview, setAssetToPreview] = useState<UserAsset | Omit<UserAsset, 'id' | 'createdAt'> | AppAttachment | null>(null);
  
  const [initialAIPrompt, setInitialAIPrompt] = useState<string>('');
  
  // Trading State
  const [tradableAssets, setTradableAssets] = useState<TradableAsset[]>(() => {
    try {
        const savedAssets = localStorage.getItem('aiFinanceTradableAssets');
        if (savedAssets) {
            return JSON.parse(savedAssets, bigIntReviver);
        }
    } catch (error) {
        console.error("Could not load tradable assets from localStorage", error);
    }
    return MOCK_TRADABLE_ASSETS;
  });

  useEffect(() => {
      try {
          localStorage.setItem('aiFinanceTradableAssets', JSON.stringify(tradableAssets, bigIntReplacer));
      } catch (error) {
          console.error("Could not save tradable assets to localStorage", error);
      }
  }, [tradableAssets]);


  const [stakingModalState, setStakingModalState] = useState<{ isOpen: boolean; pool: StakingPool; stake?: ActiveStake; action: 'stake' | 'unstake' } | null>(null);
  const [investmentModalState, setInvestmentModalState] = useState<{ isOpen: boolean; strategy: InvestmentStrategy } | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
        const savedOrgs = localStorage.getItem('aiFinanceOrganizations');
        if (savedOrgs) {
            return JSON.parse(savedOrgs);
        }
    } catch (error) {
        console.error("Could not load organizations from localStorage", error);
    }
    return MOCK_ORGANIZATIONS;
  });

  useEffect(() => {
    try {
        localStorage.setItem('aiFinanceOrganizations', JSON.stringify(organizations));
    } catch (error) {
        console.error("Could not save organizations to localStorage", error);
    }
  }, [organizations]);


  const [priceAlertModalState, setPriceAlertModalState] = useState<{ isOpen: boolean; asset: TradableAsset } | null>(null);
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
        const savedMessages = localStorage.getItem('aiFinanceChatMessages');
        if (savedMessages) {
            return JSON.parse(savedMessages);
        }
    } catch (error) {
        console.error("Could not load chat messages from localStorage", error);
    }
    return MOCK_CHAT_MESSAGES;
  });

  useEffect(() => {
    try {
        localStorage.setItem('aiFinanceChatMessages', JSON.stringify(chatMessages));
    } catch (error) {
        console.error("Could not save chat messages to localStorage", error);
    }
  }, [chatMessages]);
  
  // AI Finance State
  const [gxtrPrice, setGxtrPrice] = useState(0.000125);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const isGlitchUser = session?.user?.email === GLITCH_USER_EMAIL;

  useEffect(() => {
    // Function to handle session changes
    const handleSessionChange = (session: any | null) => {
        setSession(session);
        if (session) {
            const userId = session.user.id;
            const userEmail = session.user.email || '';

            setAccounts(prevAccounts => {
                if (prevAccounts[userId]) {
                    return prevAccounts; // Account already exists, do nothing
                }

                const newAccounts = { ...prevAccounts };
                if (userEmail === GLITCH_USER_EMAIL) {
                    // Glitch user: copy data from user-1 template
                    newAccounts[userId] = { ...prevAccounts['user-1'] };
                } else {
                    // New normal user: create default account
                    newAccounts[userId] = {
                        balance: 100n,
                        portfolio: [],
                        transactions: [],
                        userAssets: [],
                        userActivity: [],
                        assetOwnership: {},
                        purchasedCourses: [],
                        purchasedThemes: [],
                        activeThemeId: null,
                        watchlist: [],
                        staking: [],
                        openOrders: [],
                        activeInvestments: [],
                        organizations: [],
                        alerts: [],
                        gxtrPurchasedToday: 0,
                    };
                }
                return newAccounts;
            });
        }
    };
    
    // Set up a listener for auth state changes using Supabase v2 API.
    // This is called once with the initial session state, and then for any auth changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // DERIVED STATE from session and accounts
  const activeUserId = session?.user?.id;
  const activeAccountData = activeUserId ? accounts[activeUserId] : null;

  const activeUser: LeaderboardUser | null = useMemo(() => {
    if (session && activeAccountData) {
        const userEmail = session.user.email || '';
        if (userEmail === GLITCH_USER_EMAIL) {
            // Find the glitch user's mock data and override the balance to reflect the live state
            const glitchUserMock = MOCK_LEADERBOARD.find(u => u.id === 'user-1')!;
            return { 
                ...glitchUserMock, 
                id: activeUserId,
                name: activeAccountData.name || glitchUserMock.name,
                bio: activeAccountData.bio || glitchUserMock.bio,
                balance: activeAccountData.balance 
            };
        } else {
            // Create a temporary LeaderboardUser object for the logged-in user
            return {
                id: session.user.id,
                rank: 999,
                name: activeAccountData.name || userEmail.split('@')[0],
                reputation: 0n,
                balance: activeAccountData.balance,
                avatar: `https://api.dicebear.com/8.x/adventurer/svg?seed=${userEmail.replace(/\s/g, '')}`,
                bio: activeAccountData.bio || 'A new pioneer in the AI Finance ecosystem.'
            };
        }
    }
    return null;
  }, [session, activeAccountData, activeUserId]);


  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = localStorage.getItem('theme') as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    if (initialTheme) {
      setTheme(initialTheme);
      root.classList.toggle('dark', initialTheme === 'dark');
    } else {
      setTheme(systemTheme);
      root.classList.toggle('dark', systemTheme === 'dark');
    }
  }, []);

  // Effect to apply custom theme styles
  useEffect(() => {
    const activeThemeId = activeAccountData?.activeThemeId;
    const themeStyleId = 'custom-theme-styles';
    let styleElement = document.getElementById(themeStyleId) as HTMLStyleElement;

    // Always remove existing styles to handle theme changes and reverts
    if (styleElement) {
      styleElement.remove();
    }
    
    if (activeThemeId) {
      const themeDefinition = THEME_DEFINITIONS.find(t => t.id === activeThemeId);
      if (themeDefinition) {
        styleElement = document.createElement('style');
        styleElement.id = themeStyleId;

        const lightProps = Object.entries(themeDefinition.properties.light)
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n');
        
        const darkProps = Object.entries(themeDefinition.properties.dark)
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n');

        styleElement.innerHTML = `
          :root {
            ${lightProps}
          }
          html.dark {
            ${darkProps}
          }
        `;
        document.head.appendChild(styleElement);
      }
    }
  }, [activeAccountData?.activeThemeId]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Staking reward and Investment value accrual simulation
  useEffect(() => {
    if (!activeUserId) return;
    const rewardInterval = setInterval(() => {
        setAccounts(prevAccounts => {
            const currentAccount = prevAccounts[activeUserId];
            if (!currentAccount) return prevAccounts;
            
            const newStaking = currentAccount.staking.map(stake => {
                const pool = MOCK_STAKING_POOLS.find(p => p.id === stake.poolId);
                if (!pool) return stake;
                
                let rewardToAdd = stake.amount / 100000000n;
                if (rewardToAdd < 1n) rewardToAdd = 1n; 

                return {
                    ...stake,
                    rewardsAccrued: stake.rewardsAccrued + rewardToAdd
                };
            });

            const newActiveInvestments = currentAccount.activeInvestments.map(inv => {
                const strategy = MOCK_INVESTMENT_STRATEGIES.find(s => s.id === inv.strategyId);
                if (!strategy) return inv;

                const secondsInYear = 365 * 24 * 60 * 60;
                const growthPerTick = (strategy.apy / 100) / (secondsInYear / 2); // APY per 2-second tick
                const randomFactor = 1 + (Math.random() - 0.5) * (growthPerTick * 10); // Volatility related to growth
                
                // Using floats for calculation then converting back to BigInt
                const currentValFloat = Number(inv.currentValue);
                const newFloatVal = currentValFloat * (1 + growthPerTick) * randomFactor;
                const newValue = BigInt(Math.floor(newFloatVal));

                return { ...inv, currentValue: newValue };
            });
            
            return {
                ...prevAccounts,
                [activeUserId]: {
                    ...currentAccount,
                    staking: newStaking,
                    activeInvestments: newActiveInvestments,
                }
            };
        });
    }, 2000); // Accrue rewards every 2 seconds
    return () => clearInterval(rewardInterval);
  }, [activeUserId]);


  // Price fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
        setGxtrPrice(prev => prev * (1 + (Math.random() - 0.5) * 0.005));

        setTradableAssets(prevAssets => {
            const newAssets = prevAssets.map(asset => {
                const change = (Math.random() - 0.5) * (0.01); // Max 0.5% change
                const newPrice = asset.currentPrice * (1 + change);
                const newHistory = [...asset.priceHistory, { time: Date.now(), price: newPrice }];
                if (newHistory.length > 100) newHistory.shift();
                
                const startingPrice = asset.priceHistory.find(p => p.time >= Date.now() - 24 * 60 * 60 * 1000)?.price ?? asset.priceHistory[0].price;

                return {
                    ...asset,
                    currentPrice: newPrice,
                    priceHistory: newHistory,
                    change24h: (newPrice / startingPrice - 1) * 100,
                    volume24h: asset.volume24h * (1 + (Math.random() - 0.49) * 0.05)
                };
            });
             // --- NEW ALERT CHECKING LOGIC ---
            if (activeUserId && accounts[activeUserId]) {
                const userAlerts = accounts[activeUserId].alerts;
                const newlyTriggered: PriceAlert[] = [];

                const updatedAlerts = userAlerts.map(alert => {
                    if (alert.triggered) return alert;

                    const asset = newAssets.find(a => a.id === alert.assetId);
                    if (!asset) return alert;

                    const price = asset.currentPrice;
                    const threshold = alert.threshold;
                    let hasTriggered = false;

                    if (alert.condition === 'above' && price > threshold) {
                        hasTriggered = true;
                    } else if (alert.condition === 'below' && price < threshold) {
                        hasTriggered = true;
                    }

                    if (hasTriggered) {
                        const triggeredAlert = { ...alert, triggered: true };
                        newlyTriggered.push(triggeredAlert);
                        return triggeredAlert;
                    }
                    return alert;
                });
                
                if (newlyTriggered.length > 0) {
                    setTriggeredAlerts(prev => [...prev, ...newlyTriggered]);
                    updateActiveAccount(prev => ({...prev, alerts: updatedAlerts}));
                }
            }
            // --- END OF NEW LOGIC ---
            return newAssets;
        });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [activeUserId, accounts]);

  const updateActiveAccount = useCallback((updater: (prev: AccountData) => AccountData) => {
    if (!activeUserId) return;
    setAccounts(prev => ({
        ...prev,
        [activeUserId]: updater(prev[activeUserId])
    }));
  }, [activeUserId]);

  const addActivity = (activity: Omit<UserActivity, 'id' | 'date'>) => {
    const newActivity: UserActivity = {
        ...activity,
        id: `act-${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
    };
    updateActiveAccount(prev => ({ ...prev, userActivity: [newActivity, ...prev.userActivity]}));
  };

  const handlePurchase = (item: MarketplaceItem) => {
    if (!activeAccountData) return;
    if (item.type === 'Course') {
        if (activeAccountData.purchasedCourses.includes(item.id)) {
            alert(`You are already enrolled in "${item.name}".`);
            return;
        }
        if (activeAccountData.balance >= item.price) {
            const newTransaction: Transaction = {
                id: `t${activeAccountData.transactions.length + 1}`,
                type: 'spend',
                description: `Enrolled in course: "${item.name}"`,
                amount: item.price,
                date: new Date().toISOString().split('T')[0],
            };
            updateActiveAccount(prev => ({
                ...prev,
                balance: prev.balance - item.price,
                purchasedCourses: [...prev.purchasedCourses, item.id],
                transactions: [newTransaction, ...prev.transactions]
            }));
            alert(`Successfully enrolled in "${item.name}"!`);
        } else {
            alert("Insufficient GXTR!");
        }
        return;
    }

    const currentOwnership = activeAccountData.assetOwnership[item.id] || 0;
    if (currentOwnership >= 100) {
        alert("You already fully own this asset.");
        return;
    }

    if (activeAccountData.balance >= item.price) {
        const newOwnership = currentOwnership + 1;
        const newTransaction: Transaction = {
            id: `t${activeAccountData.transactions.length + 1}`,
            type: 'spend',
            description: `Purchased 1% of "${item.name}"`,
            amount: item.price,
            date: new Date().toISOString().split('T')[0],
        };

        if (currentOwnership === 0 && item.code && item.language) {
            const typeMap: { [key in MarketplaceItemType]?: AssetType } = {
                'Snippet': 'Snippet', 'Template': 'Application', 'Plugin': 'Library', 'AI Model': 'AI Model', 'Prompt': 'Prompt', 'Workflow': 'Workflow'
            };
            const assetType = typeMap[item.type];
            if (assetType) {
                const newAsset: UserAsset = {
                    id: `asset-${Date.now()}`, name: item.name, type: assetType, description: item.description, language: item.language, code: item.code, createdAt: new Date().toISOString().split('T')[0], pinned: false, stars: 0, forks: 0, marketplaceId: item.id,
                };
                updateActiveAccount(prev => ({
                    ...prev,
                    balance: prev.balance - item.price,
                    assetOwnership: { ...prev.assetOwnership, [item.id]: newOwnership },
                    transactions: [newTransaction, ...prev.transactions],
                    userAssets: [newAsset, ...prev.userAssets]
                }));
                addActivity({ type: 'create', assetName: newAsset.name, description: `Acquired "${newAsset.name}" from the Marketplace.` });
                setAssetInEditor(newAsset);
            }
        } else {
            updateActiveAccount(prev => ({
                ...prev,
                balance: prev.balance - item.price,
                assetOwnership: { ...prev.assetOwnership, [item.id]: newOwnership },
                transactions: [newTransaction, ...prev.transactions]
            }));
            alert(`Successfully purchased another 1% of ${item.name}! You now own ${newOwnership}%.`);
        }
    } else {
        alert("Insufficient GXTR!");
    }
  };

  const handlePurchaseTheme = (theme: ThemeItem) => {
    if (!activeAccountData) return;
    if (activeAccountData.purchasedThemes.includes(theme.id)) {
        alert(`You already own the "${theme.name}" theme.`);
        return;
    }
    if (activeAccountData.balance >= theme.price) {
        const newTransaction: Transaction = {
            id: `t-theme-${Date.now()}`,
            type: 'spend',
            description: `Purchased theme: "${theme.name}"`,
            amount: theme.price,
            date: new Date().toISOString().split('T')[0],
        };
        updateActiveAccount(prev => ({
            ...prev,
            balance: prev.balance - theme.price,
            purchasedThemes: [...prev.purchasedThemes, theme.id],
            transactions: [newTransaction, ...prev.transactions]
        }));
        alert(`Successfully purchased the "${theme.name}" theme!`);
    } else {
        alert("Insufficient GXTR!");
    }
  };

  const handleApplyTheme = (themeId: string | null) => {
    updateActiveAccount(prev => ({
        ...prev,
        activeThemeId: themeId,
    }));
  };

  const addFunds = (amount: number) => {
    if (!activeAccountData) return;
    
    const today = new Date().toISOString().split('T')[0];
    const purchasedToday = activeAccountData.lastGxtrPurchaseDate === today ? activeAccountData.gxtrPurchasedToday : 0;
    const dailyLimit = 200;

    if (amount > dailyLimit - purchasedToday) {
        alert(`You can only purchase ${dailyLimit - purchasedToday} more GXTR today. Daily limit is ${dailyLimit} GXTR.`);
        return;
    }

    const amountBigInt = BigInt(amount);
    const newTransaction: Transaction = {
        id: `t${activeAccountData.transactions.length + 1}`, type: 'earn', description: `Purchased ${amount.toLocaleString()} GXTR`, amount: amountBigInt, date: new Date().toISOString().split('T')[0],
    };
    updateActiveAccount(prev => ({
        ...prev,
        balance: prev.balance + amountBigInt,
        transactions: [newTransaction, ...prev.transactions],
        lastGxtrPurchaseDate: today,
        gxtrPurchasedToday: purchasedToday + amount,
    }));
    setIsCompanyModalOpen(false);
  };

  const handleSaveAsset = (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>, closeModal: boolean = true): UserAsset => {
    let savedAsset: UserAsset;
    if ('id' in asset) {
      updateActiveAccount(prev => ({ ...prev, userAssets: prev.userAssets.map(a => a.id === asset.id ? asset as UserAsset : a)}));
      addActivity({ type: 'update', assetName: asset.name, description: 'Updated asset details.' });
      savedAsset = asset;
    } else {
      const newAsset: UserAsset = { ...asset, id: `asset-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], pinned: false, stars: 0, forks: 0, };
      updateActiveAccount(prev => ({ ...prev, userAssets: [newAsset, ...prev.userAssets] }));
      addActivity({ type: 'create', assetName: newAsset.name, description: 'Created a new asset.' });
      savedAsset = newAsset;
    }
    if (closeModal) {
        setAssetInEditor(null);
    }
    return savedAsset;
  };
  
  const handlePublishAsset = (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>) => {
    alert(`Asset "${asset.name}" has been published to the marketplace!`);
    handleSaveAsset(asset); // Save it locally first
    addActivity({ type: 'publish', assetName: asset.name, description: `Published ${asset.name} to the marketplace.` });
  };

  const handleListOnExchange = (assetData: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>) => {
    if (!activeUser) return;
    const savedAsset = handleSaveAsset(assetData, false); // Save but don't close modal yet

    if (savedAsset.exchangeTicker) {
        alert("This asset is already listed on the exchange.");
        setAssetInEditor(null);
        return;
    }

    if (savedAsset.type !== 'AI Model') {
        alert("Only 'AI Model' assets can be listed on the exchange.");
        setAssetInEditor(null);
        return;
    }
    
    // Generate Ticker
    const ticker = (savedAsset.name
        .match(/\b(\w)/g)?.join('') || 'ASSET')
        .toUpperCase()
        .slice(0, 5);

    // Create Tradable Asset
    const newTradableAsset: TradableAsset = {
        id: `trade-${savedAsset.id}`,
        name: savedAsset.name,
        ticker,
        description: savedAsset.description,
        author: activeUser.name,
        currentPrice: 100.00,
        priceHistory: [{ time: Date.now(), price: 100.00 }],
        volume24h: 0,
        change24h: 0,
        language: savedAsset.language,
        type: savedAsset.type,
        totalSupply: 1_000_000_000n,
        circulatingSupply: 500_000_000n,
        liquidity: 10_000_000,
    };

    // Update states
    setTradableAssets(prev => [...prev, newTradableAsset]);

    // Mark UserAsset as listed
    updateActiveAccount(prev => ({
        ...prev,
        userAssets: prev.userAssets.map(a => a.id === savedAsset.id ? { ...a, exchangeTicker: ticker } : a)
    }));
    
    // Add activity
    addActivity({ type: 'publish', assetName: savedAsset.name, description: `Listed on the Exchange as $${ticker}.` });
    
    // Close modal and notify
    setAssetInEditor(null);
    alert(`Successfully listed ${savedAsset.name} on the exchange as $${ticker}!`);
};

  const handleRunAsset = (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'> | AppAttachment) => {
    if ('language' in asset && asset.language === 'JavaScript' && 'type' in asset && asset.type === 'Application') {
      setAssetToPreview(asset);
    } else {
      setAssetToRun(asset);
    }
  };

  const handleTogglePin = (assetId: string) => {
    updateActiveAccount(prev => {
        const asset = prev.userAssets.find(a => a.id === assetId);
        if (!asset) return prev;
        const pinnedCount = prev.userAssets.filter(a => a.pinned).length;
        if (!asset.pinned && pinnedCount >= 6) {
            alert("You can only pin up to 6 assets.");
            return prev;
        }
        return { ...prev, userAssets: prev.userAssets.map(a => a.id === assetId ? { ...a, pinned: !a.pinned } : a) };
    });
  };

  const handleSaveProfile = (name: string, bio: string) => {
    updateActiveAccount(prev => ({
        ...prev,
        name,
        bio,
    }));
    setIsProfileEditorOpen(false);
  };

  const handleGambitEnd = useCallback(async (didWin: boolean): Promise<UserAsset | null> => {
    let prizeAsset: UserAsset | null = null;
    if (didWin) {
        // Generate prize asset with AI
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `Generate a unique, powerful, and rare code asset as a prize for winning "The Architect's Gambit". It should feel special. It must be an 'AI Model' type, written in Python. The name and description should be epic and related to winning a high-stakes game against a god-like AI. Respond ONLY with the raw JSON object.`;
            const schema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    language: { type: Type.STRING, enum: ['Python'] },
                    type: { type: Type.STRING, enum: ['AI Model'] },
                    code: { type: Type.STRING },
                },
                required: ['name', 'description', 'language', 'type', 'code'],
            };
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            const generatedAsset = JSON.parse(response.text.trim());
            
            prizeAsset = {
                ...generatedAsset,
                id: `asset-prize-${Date.now()}`,
                createdAt: new Date().toISOString().split('T')[0],
                pinned: true,
                stars: 1337,
                forks: 777,
            };
        } catch (error) {
            console.error("Failed to generate prize asset:", error);
            // Fallback prize
            prizeAsset = {
                id: `asset-prize-${Date.now()}`,
                name: "The Architect's Favor",
                type: 'AI Model',
                description: 'A fallback prize due to a cosmic interference. Still, a token of victory.',
                language: 'Python',
                code: 'print("You have won The Architect\'s respect.")',
                createdAt: new Date().toISOString().split('T')[0],
                pinned: true,
                stars: 1337,
                forks: 777,
            };
        }
        updateActiveAccount(prev => ({
            ...prev,
            balance: prev.balance + 10000000n, // Add 10M prize
            userAssets: [prizeAsset!, ...prev.userAssets],
        }));
    } else {
        updateActiveAccount(prev => ({
            ...prev,
            balance: prev.balance - 1000000n, // Subtract 1M cost
        }));
    }
    return prizeAsset;
  }, [updateActiveAccount]);

  const handleTip = (authorName: string, amount: number) => {
    if (!activeAccountData) return;
    const amountBigInt = BigInt(amount);

    if (activeAccountData.balance < amountBigInt) {
        alert("Insufficient GXTR to send tip.");
        return;
    }

    const tipTransaction: Transaction = {
        id: `t${Date.now()}`,
        type: 'spend',
        description: `Tipped ${authorName}`,
        amount: amountBigInt,
        date: new Date().toISOString().split('T')[0],
    };
    updateActiveAccount(prev => ({
        ...prev,
        balance: prev.balance - amountBigInt,
        transactions: [tipTransaction, ...prev.transactions],
    }));
    alert(`Successfully tipped ${authorName} ${amount.toLocaleString()} GXTR!`);
  };

  const handleTrade = (asset: TradableAsset, amount: number, type: 'buy' | 'sell', orderType: 'market' | 'limit' | 'stop', price?: number) => {
    if (!activeAccountData) return;
    
    const cost = BigInt(Math.floor(amount * (price || asset.currentPrice)));
    const currentHolding = activeAccountData.portfolio.find(h => h.assetId === asset.id);

    if (type === 'buy') {
        if (activeAccountData.balance < cost) {
            alert("Insufficient GXTR to complete this purchase.");
            return;
        }
        updateActiveAccount(prev => {
            const newPortfolio = [...prev.portfolio];
            const existingHolding = newPortfolio.find(h => h.assetId === asset.id);
            if (existingHolding) {
                existingHolding.amount += amount;
            } else {
                newPortfolio.push({ assetId: asset.id, ticker: asset.ticker, name: asset.name, amount: amount });
            }
            return {
                ...prev,
                balance: prev.balance - cost,
                portfolio: newPortfolio,
                transactions: [{ id: `t-buy-${Date.now()}`, type: 'spend', description: `Bought ${amount.toFixed(4)} ${asset.ticker}`, amount: cost, date: new Date().toISOString().split('T')[0] }, ...prev.transactions]
            };
        });
        alert(`Successfully bought ${amount.toFixed(4)} ${asset.ticker}!`);
    } else { // sell
        if (!currentHolding || currentHolding.amount < amount) {
            alert("You don't have enough shares to sell.");
            return;
        }
         updateActiveAccount(prev => {
            const newPortfolio = prev.portfolio.map(h => 
                h.assetId === asset.id ? { ...h, amount: h.amount - amount } : h
            ).filter(h => h.amount > 0.000001); // Remove if amount is negligible
            return {
                ...prev,
                balance: prev.balance + cost,
                portfolio: newPortfolio,
                transactions: [{ id: `t-sell-${Date.now()}`, type: 'earn', description: `Sold ${amount.toFixed(4)} ${asset.ticker}`, amount: cost, date: new Date().toISOString().split('T')[0] }, ...prev.transactions]
            };
        });
         alert(`Successfully sold ${amount.toFixed(4)} ${asset.ticker}!`);
    }
  };
  
  const handleToggleWatchlist = (assetId: string) => {
    updateActiveAccount(prev => {
        const isWatched = prev.watchlist.includes(assetId);
        return {
            ...prev,
            watchlist: isWatched 
                ? prev.watchlist.filter(id => id !== assetId) 
                : [...prev.watchlist, assetId]
        };
    });
  };

  const handleStake = (poolId: string, amount: bigint) => {
      if (!activeAccountData) return;
      
      const pool = MOCK_STAKING_POOLS.find(p => p.id === poolId);
      if (!pool) return;
      
      let costFromBalance = 0n;
      let costFromPortfolio = 0;
      
      if (pool.assetTicker === 'GXTR') {
          costFromBalance = amount;
      } else {
          const scalingFactor = 1_000_000;
          costFromPortfolio = Number(amount) / scalingFactor;
      }
      
      updateActiveAccount(prev => {
          const existingStake = prev.staking.find(s => s.poolId === poolId);
          let newStakes;
          if (existingStake) {
              newStakes = prev.staking.map(s => s.id === existingStake.id ? { ...s, amount: s.amount + amount } : s);
          } else {
              newStakes = [...prev.staking, { id: `stake-${Date.now()}`, poolId, assetTicker: pool.assetTicker, assetName: pool.assetName, amount, stakedAt: new Date().toISOString(), rewardsAccrued: 0n }];
          }
          
          let newPortfolio = prev.portfolio;
          if (costFromPortfolio > 0) {
              newPortfolio = prev.portfolio.map(h => h.ticker === pool.assetTicker ? { ...h, amount: h.amount - costFromPortfolio } : h).filter(h => h.amount > 0.000001);
          }
          
          return {
              ...prev,
              balance: prev.balance - costFromBalance,
              portfolio: newPortfolio,
              staking: newStakes
          };
      });
      setStakingModalState(null);
  };
  
  const handleUnstake = (stakeId: string, amount: bigint) => {
        if (!activeAccountData) return;
        const stake = activeAccountData.staking.find(s => s.id === stakeId);
        if (!stake) return;

        updateActiveAccount(prev => {
            const stake = prev.staking.find(s => s.id === stakeId)!;
            const remainingAmount = stake.amount - amount;

            let newStakes = prev.staking;
            if (remainingAmount <= 0n) {
                newStakes = prev.staking.filter(s => s.id !== stakeId);
            } else {
                newStakes = prev.staking.map(s => s.id === stakeId ? { ...s, amount: remainingAmount } : s);
            }

            let newBalance = prev.balance;
            let newPortfolio = prev.portfolio;
            const scalingFactor = 1_000_000;

            if (stake.assetTicker === 'GXTR') {
                newBalance += amount;
            } else {
                const amountToAdd = Number(amount) / scalingFactor;
                const holding = newPortfolio.find(h => h.ticker === stake.assetTicker);
                if (holding) {
                    newPortfolio = newPortfolio.map(h => h.ticker === stake.assetTicker ? { ...h, amount: h.amount + amountToAdd } : h);
                } else {
                    newPortfolio = [...newPortfolio, { assetId: stake.poolId, name: stake.assetName, ticker: stake.assetTicker, amount: amountToAdd }];
                }
            }

            return { ...prev, balance: newBalance, portfolio: newPortfolio, staking: newStakes };
        });
        setStakingModalState(null);
  };

  const handleInvest = (strategy: InvestmentStrategy, amount: bigint) => {
    if (!activeAccountData) return;

    if (activeAccountData.balance < amount) {
        alert("Insufficient GXTR balance.");
        return;
    }
    if (amount < strategy.minInvestment) {
        alert(`Minimum investment is ${strategy.minInvestment.toLocaleString()} GXTR.`);
        return;
    }

    const newInvestment: ActiveInvestment = {
        id: `invest-${Date.now()}`,
        strategyId: strategy.id,
        strategyName: strategy.name,
        amountInvested: amount,
        currentValue: amount,
        startedAt: new Date().toISOString(),
    };
    
    updateActiveAccount(prev => ({
        ...prev,
        balance: prev.balance - amount,
        activeInvestments: [...prev.activeInvestments, newInvestment],
    }));
    setInvestmentModalState(null);
};

const handleWithdraw = (investmentId: string) => {
    if (!activeAccountData) return;
    const investment = activeAccountData.activeInvestments.find(i => i.id === investmentId);
    if (!investment) return;

    const strategy = MOCK_INVESTMENT_STRATEGIES.find(s => s.id === investment.strategyId);
    const feePercentage = strategy ? strategy.performanceFee / 100 : 0.15; // default 15% fee if strategy not found
    
    const profit = investment.currentValue - investment.amountInvested;
    const fee = profit > 0n ? BigInt(Math.floor(Number(profit) * feePercentage)) : 0n;
    const amountToReturn = investment.currentValue - fee;

    updateActiveAccount(prev => ({
        ...prev,
        balance: prev.balance + amountToReturn,
        activeInvestments: prev.activeInvestments.filter(i => i.id !== investmentId),
    }));
};

  const handleInviteToOrganization = (organization: Organization) => {
    setInviteModalState({ isOpen: true, organization });
  };

  const handleCreateOrganization = (name: string, description: string) => {
    if (!activeUserId) return;
    const newOrg: Organization = {
        id: `org-${Date.now()}`,
        name,
        description,
        avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=${name.replace(/\s/g, '')}`,
        ownerId: activeUserId,
        members: [activeUserId],
    };

    setOrganizations(prev => [...prev, newOrg]);
    updateActiveAccount(prev => ({
        ...prev,
        organizations: [...prev.organizations, newOrg.id],
    }));
    setIsCreateOrgModalOpen(false);
  };

  const handleAddAlert = (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
        ...alert,
        id: `alert-${Date.now()}`,
        triggered: false,
        createdAt: new Date().toISOString()
    };
    updateActiveAccount(prev => ({
        ...prev,
        alerts: [...prev.alerts, newAlert]
    }));
  };

  const handleRemoveAlert = (alertId: string) => {
      updateActiveAccount(prev => ({
          ...prev,
          alerts: prev.alerts.filter(a => a.id !== alertId)
      }));
  };

  const handleDismissAlert = (alertId: string) => {
      setTriggeredAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleSendMessage = (orgId: string, content: string) => {
    if (!activeUser) return;

    const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        orgId,
        authorId: activeUser.id,
        authorName: activeUser.name,
        authorAvatar: activeUser.avatar,
        content,
        timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleCreatePost = (content: string) => {
    if (!activeUser) return;

    const newPost: Post = {
        id: `post-${Date.now()}`,
        authorName: activeUser.name,
        authorAvatar: activeUser.avatar,
        content: content,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  };


  if (!session) {
    return <Auth />;
  }

  if (!activeAccountData || !activeUser) {
    return (
        <div className="flex items-center justify-center h-screen bg-background dark:bg-dark-background">
            <BussinSymbolIcon className="w-24 h-24 text-primary animate-pulse-slow" />
        </div>
    );
  }

  return (
    <div className="bg-background dark:bg-dark-background min-h-screen relative">
      <AlertBanners alerts={triggeredAlerts} onDismiss={handleDismissAlert} />
      <Header 
        activeView={activeView}
        setActiveView={setActiveView}
        balance={activeAccountData.balance}
        onWalletClick={() => setIsWalletOpen(true)}
        onGambitClick={() => setIsGambitOpen(true)}
        session={session}
        onSignOut={() => supabase.auth.signOut()}
        activeUser={activeUser}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="p-4 md:p-8 pb-20 md:pb-8">
        {activeView === 'dashboard' && <Dashboard user={activeUser} balance={activeAccountData.balance} gxtrPrice={gxtrPrice} portfolio={activeAccountData.portfolio} tradableAssets={tradableAssets} transactions={activeAccountData.transactions} />}
        {activeView === 'universe' && <CodeUniverse posts={posts} activeUser={activeUser} onCreatePost={handleCreatePost} onStartDiscussion={(prompt) => { setInitialAIPrompt(prompt); setActiveView('ai'); }} onPreviewAttachment={setAssetToPreview} onTip={handleTip} />}
        {activeView === 'ai' && <AIChat isGlitchUser={isGlitchUser} initialPrompt={initialAIPrompt} onClearInitialPrompt={() => setInitialAIPrompt('')} onSaveAsset={setAssetInEditor} onRunAsset={setAssetToPreview}/>}
        {activeView === 'marketplace' && <Marketplace 
            items={MOCK_MARKETPLACE_ITEMS} 
            themes={MOCK_THEMES}
            onPurchase={handlePurchase} 
            onPurchaseTheme={handlePurchaseTheme}
            assetOwnership={activeAccountData.assetOwnership} 
            purchasedCourseIds={activeAccountData.purchasedCourses} 
            purchasedThemeIds={activeAccountData.purchasedThemes}
        />}
        {activeView === 'leaderboard' && <Leaderboard users={MOCK_LEADERBOARD.map(u => u.id === activeUser.id ? activeUser : u)} />}
        {activeView === 'profile' && (
            <Profile
                user={activeUser}
                balance={activeAccountData.balance}
                assets={activeAccountData.userAssets}
                activity={activeAccountData.userActivity}
                onEditAsset={setAssetInEditor}
                onRunAsset={handleRunAsset}
                onTogglePin={handleTogglePin}
                onWalletClick={() => setIsWalletOpen(true)}
                assetOwnership={activeAccountData.assetOwnership}
                portfolio={activeAccountData.portfolio}
                tradableAssets={tradableAssets}
                onEditProfile={() => setIsProfileEditorOpen(true)}
                organizations={organizations.filter(org => activeAccountData.organizations.includes(org.id))}
                onNewOrganization={() => setIsCreateOrgModalOpen(true)}
                onInviteToOrganization={handleInviteToOrganization}
                chatMessages={chatMessages}
                onSendMessage={handleSendMessage}
                purchasedThemes={MOCK_THEMES.filter(t => activeAccountData.purchasedThemes.includes(t.id))}
                activeThemeId={activeAccountData.activeThemeId}
                onApplyTheme={handleApplyTheme}
                leaderboard={MOCK_LEADERBOARD}
            />
        )}
        {activeView === 'exchange' && <TradingView assets={tradableAssets} onTrade={handleTrade} portfolio={activeAccountData.portfolio} balance={activeAccountData.balance} watchlist={activeAccountData.watchlist} onToggleWatchlist={handleToggleWatchlist} onSetAlert={(asset) => setPriceAlertModalState({ isOpen: true, asset })} alerts={activeAccountData.alerts} setActiveView={setActiveView} />}
        {activeView === 'staking' && <StakingView pools={MOCK_STAKING_POOLS} stakes={activeAccountData.staking} balance={activeAccountData.balance} portfolio={activeAccountData.portfolio} onStakeClick={(pool) => setStakingModalState({isOpen: true, pool, action: 'stake'})} onUnstakeClick={(stake) => { const pool = MOCK_STAKING_POOLS.find(p => p.id === stake.poolId)!; setStakingModalState({isOpen: true, pool, stake, action: 'unstake'})}} />}
        {activeView === 'iaas' && <IaasView 
            strategies={MOCK_INVESTMENT_STRATEGIES} 
            activeInvestments={activeAccountData.activeInvestments}
            onInvestClick={(strategy) => setInvestmentModalState({isOpen: true, strategy})}
            onWithdraw={handleWithdraw}
        />}
      </main>
      <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
      <Wallet isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} balance={activeAccountData.balance} transactions={activeAccountData.transactions} onCompanyClick={() => setIsCompanyModalOpen(true)} />
      <CompanyModal 
        isOpen={isCompanyModalOpen} 
        onClose={() => setIsCompanyModalOpen(false)} 
        onPurchase={addFunds} 
        gxtrPurchasedToday={activeAccountData.gxtrPurchasedToday}
        lastGxtrPurchaseDate={activeAccountData.lastGxtrPurchaseDate}
      />
       <MonopolyGambitModal isOpen={isGambitOpen} onClose={() => setIsGambitOpen(false)} onGameEnd={handleGambitEnd} userBalance={activeAccountData.balance} />
      
      {assetInEditor && <AssetEditorModal asset={assetInEditor} onClose={() => setAssetInEditor(null)} onSave={handleSaveAsset} onRun={handleRunAsset} onPublish={handlePublishAsset} onListOnExchange={handleListOnExchange} />}
      {assetToRun && <TerminalModal asset={assetToRun} onClose={() => setAssetToRun(null)} />}
      {assetToPreview && <AppViewerModal asset={assetToPreview} onClose={() => setAssetToPreview(null)} />}
       {stakingModalState && <StakingModal state={stakingModalState} onClose={() => setStakingModalState(null)} onStake={handleStake} onUnstake={handleUnstake} gxtrBalance={activeAccountData.balance} portfolio={activeAccountData.portfolio} />}
      {investmentModalState && <InvestmentModal 
          state={investmentModalState} 
          onClose={() => setInvestmentModalState(null)}
          onInvest={handleInvest}
          gxtrBalance={activeAccountData.balance}
      />}
       {priceAlertModalState?.isOpen && (
            <PriceAlertModal
                asset={priceAlertModalState.asset}
                onClose={() => setPriceAlertModalState(null)}
                onAddAlert={handleAddAlert}
                onRemoveAlert={handleRemoveAlert}
                existingAlerts={activeAccountData.alerts.filter(a => a.assetId === priceAlertModalState.asset.id)}
            />
        )}
      {activeUser && (
        <ProfileEditorModal
            isOpen={isProfileEditorOpen}
            onClose={() => setIsProfileEditorOpen(false)}
            user={activeUser}
            onSave={handleSaveProfile}
        />
       )}
        <CreateOrganizationModal 
            isOpen={isCreateOrgModalOpen} 
            onClose={() => setIsCreateOrgModalOpen(false)} 
            onCreate={handleCreateOrganization} 
        />
        <InviteModal 
            state={inviteModalState}
            onClose={() => setInviteModalState(null)}
        />
    </div>
  );
};

export default App;