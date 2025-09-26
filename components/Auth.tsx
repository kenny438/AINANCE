import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import PixelatedCrownIcon from './icons/PixelatedCrownIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import WalletCard from './WalletCard';
import { LeaderboardUser } from '../types';

const Auth: React.FC = () => {
    const [view, setView] = useState<'intro' | 'login' | 'signup'>('intro');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isLogin = view === 'login';

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else { // signup
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            }
        } catch (error: any) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const mockUserForCard: LeaderboardUser = {
        id: 'preview-user',
        rank: 1,
        name: 'Satoshi Nakamoto',
        ownerName: 'Satoshi Nakamoto',
        reputation: 999999n,
        balance: 1234567890123456n,
        avatar: `https://api.dicebear.com/8.x/adventurer/svg?seed=Satoshi`,
        bio: 'Building the future of finance.'
    };

    const renderIntro = () => (
        <div className="space-y-4 animate-fade-in">
            <button
                onClick={() => setView('signup')}
                className="w-full text-center py-4 rounded-full bg-primary text-text-on-primary font-bold text-lg transition-transform hover:scale-105"
            >
                Create wallet
            </button>
            <button
                onClick={() => setView('login')}
                className="w-full text-center py-4 font-semibold text-text-secondary dark:text-dark-text-secondary text-lg"
            >
                I already have a wallet
            </button>
        </div>
    );

    const renderForm = () => {
        const isLogin = view === 'login';
        return (
            <form onSubmit={handleAuthAction} className="space-y-6 animate-fade-in">
                 {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}
                <div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary placeholder-text-secondary dark:placeholder-dark-text-secondary focus:ring-primary focus:border-primary"
                        placeholder="Email address"
                    />
                </div>
                <div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary placeholder-text-secondary dark:placeholder-dark-text-secondary focus:ring-primary focus:border-primary"
                        placeholder="Password"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-text-on-primary bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-dark-background disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </div>
                <div className="text-center">
                    <button type="button" onClick={() => setView(isLogin ? 'signup' : 'login')} className="text-sm text-text-secondary dark:text-dark-text-secondary hover:underline">
                        {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="min-h-screen bg-background dark:bg-dark-background md:grid md:grid-cols-2 lg:grid-cols-5">
            {/* Visual Column (Desktop) */}
            <div className="hidden md:flex lg:col-span-3 bg-surface dark:bg-dark-surface flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                <div className="max-w-md w-full z-10">
                    <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-4">A Gateway to the New Economy</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary mb-8">
                        Your wallet is more than just a balance. It's your identity, your portfolio, and your key to decentralized AI finance.
                    </p>
                    <WalletCard user={mockUserForCard} balance={mockUserForCard.balance} />
                </div>
                <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
            
            {/* Auth Column (Mobile & Desktop) */}
            <div className="flex flex-col justify-center h-screen md:h-auto p-8 lg:col-span-2 relative">
                {view !== 'intro' && (
                    <button 
                        onClick={() => setView('intro')} 
                        className="absolute top-6 left-6 text-text-primary dark:text-dark-text-primary p-2 rounded-full hover:bg-secondary dark:hover:bg-dark-secondary z-10"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                )}

                {/* Mobile only header */}
                <div className="md:hidden text-center mb-8 mt-8">
                     <PixelatedCrownIcon className="w-24 h-24 text-primary mx-auto animate-fade-in" />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">YOUR WALLET.</h1>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">YOUR KINGDOM.</h1>
                </div>

                <div className="max-w-sm mx-auto w-full">
                    {view === 'intro' ? renderIntro() : renderForm()}
                </div>
            </div>
        </div>
    );
};

export default Auth;
