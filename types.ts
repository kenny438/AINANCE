

export interface AppAttachment {
  name: string;
  description: string;
  language: AssetLanguage;
  code: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  attachment?: AppAttachment;
}

export type MarketplaceItemType = 'Snippet' | 'Template' | 'Plugin' | 'Course' | 'AI Model' | 'Prompt' | 'Workflow';


export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  author: string;
  price: bigint;
  type: MarketplaceItemType;
  rating: number;
  reviews: number;
  tags: string[];
  version: string;
  isFeatured?: boolean;
  language?: AssetLanguage;
  code?: string;
}

export interface LeaderboardUser {
  id:string;
  rank: number;
  name: string;
  reputation: bigint;
  balance: bigint;
  avatar: string;
  bio?: string;
  ownerName?: string;
  qualification?: string;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  description: string;
  amount: bigint;
  date: string;
}

export type AppView = 'dashboard' | 'universe' | 'ai' | 'marketplace' | 'leaderboard' | 'profile' | 'exchange' | 'staking' | 'iaas';

export type AssetType = 'Application' | 'Component' | 'Library' | 'Snippet' | 'AI Model' | 'Prompt' | 'Workflow';
export type AssetLanguage = 'JavaScript' | 'Python' | 'Rust' | 'Go' | 'C++';

export interface UserAsset {
  id: string;
  name: string;
  type: AssetType;
  description: string;
  language: AssetLanguage;
  code: string;
  createdAt: string;
  pinned: boolean;
  stars: number;
  forks: number;
  marketplaceId?: string;
  exchangeTicker?: string;
}

export interface UserActivity {
  id: string;
  type: 'create' | 'publish' | 'update';
  assetName: string;
  date: string;
  description: string;
}

export interface PriceDataPoint {
    time: number;
    price: number;
}

export interface TradableAsset {
    id: string;
    name: string;
    ticker: string;
    description: string;
    author: string;
    currentPrice: number;
    priceHistory: PriceDataPoint[];
    volume24h: number;
    change24h: number; // percentage
    language: AssetLanguage;
    type: AssetType;
    totalSupply: bigint;
    circulatingSupply: bigint;
    liquidity: number; // in GXTR
}

export interface PortfolioHolding {
    assetId: string;
    ticker: string;
    name: string;
    amount: number;
}

export interface AIPrediction {
    prediction: 'UP' | 'DOWN' | 'STABLE';
    confidence: 'High' | 'Medium' | 'Low';
    rationale: string;
}

export type UserTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Apex';

export interface StakingPool {
    id: string;
    assetTicker: string;
    assetName: string;
    apr: number; // Annual Percentage Rate, e.g., 12.5
    totalStaked: bigint;
}

export interface ActiveStake {
    id: string;
    poolId: string;
    assetTicker: string;
    assetName: string;
    amount: bigint;
    stakedAt: string; // ISO string
    rewardsAccrued: bigint;
}

export interface OpenOrder {
    id: string;
    assetId: string;
    ticker: string;
    type: 'buy' | 'sell';
    orderType: 'limit' | 'stop';
    price: number;
    amount: number;
    createdAt: string; // ISO string
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Degenerate';

export interface InvestmentStrategy {
  id: string;
  name: string;
  description: string;
  author: string;
  riskLevel: RiskLevel;
  apy: number; // Annual Percentage Yield
  aum: bigint; // Assets Under Management in GXTR
  minInvestment: bigint;
  performanceFee: number; // percentage
  performanceHistory: PriceDataPoint[]; // Use existing type
  underlyingAssets: string[]; // Tickers of assets it trades, e.g., ['QNTM', 'NNV']
}

export interface ActiveInvestment {
    id: string;
    strategyId: string;
    strategyName: string;
    amountInvested: bigint; // Initial investment
    currentValue: bigint; // Current value, fluctuates
    startedAt: string; // ISO string
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  avatar: string;
  ownerId: string;
  members: string[]; // array of user IDs
}

export interface PriceAlert {
    id: string;
    assetId: string;
    assetTicker: string;
    threshold: number;
    condition: 'above' | 'below';
    triggered: boolean;
    createdAt: string; // ISO string
}

export interface ChatMessage {
  id: string;
  orgId: string;
  authorId: string;
  authorName:string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface ThemeItem {
  id: string;
  name: string;
  description: string;
  price: bigint;
  imageUrl: string;
  isFeatured?: boolean;
}