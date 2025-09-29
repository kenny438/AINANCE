import React, { useState, useEffect, useRef } from 'react';
// FIX: The `Session` type is not exported in older versions of `@supabase/supabase-js`.
// import { Session } from '@supabase/supabase-js';
import { AppView, LeaderboardUser } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import UserIcon from './icons/UserIcon';
import BussinLogoIcon from './icons/BussinLogoIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import MonopolyDeathIcon from './icons/ChessKnightIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

type Theme = 'light' | 'dark';

interface HeaderProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  balance: bigint;
  onWalletClick: () => void;
  onGambitClick: () => void;
  // FIX: Use `any` for session type.
  session: any;
  onSignOut: () => void;
  activeUser: LeaderboardUser;
  theme: Theme;
  toggleTheme: () => void;
}

const NavItem: React.FC<{
  label: string;
  view?: AppView;
  activeView?: AppView;
  onClick: (view?: AppView) => void;
}> = ({ label, view, activeView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      activeView === view
        ? 'text-primary font-semibold'
        : 'text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
    }`}
  >
    {label}
  </button>
);

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, balance, onWalletClick, onGambitClick, session, onSignOut, activeUser, theme, toggleTheme }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const viewTitles: { [key in AppView]?: string } = {
      dashboard: 'Dashboard',
      universe: 'Universe',
      ai: 'AI Chat',
      marketplace: 'Marketplace',
      leaderboard: 'Leaderboard',
      profile: 'Profile',
      exchange: 'Exchange',
      staking: 'Staking',
      iaas: 'Investing',
  };

  return (
    <header className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BussinLogoIcon className="h-8 w-auto text-primary" />
            <h1 className="text-xl font-bold text-text-primary dark:text-dark-text-primary md:hidden">
              {viewTitles[activeView]}
            </h1>
          </div>
          
          <nav className="hidden md:flex items-baseline space-x-1">
            <NavItem label="Dashboard" view="dashboard" activeView={activeView} onClick={setActiveView as any} />
            <NavItem label="Universe" view="universe" activeView={activeView} onClick={setActiveView as any} />
            <NavItem label="Exchange" view="exchange" activeView={activeView} onClick={setActiveView as any} />
            <NavItem label="Staking" view="staking" activeView={activeView} onClick={setActiveView as any} />
            <NavItem label="Investing" view="iaas" activeView={activeView} onClick={setActiveView as any} />
            <NavItem label="Marketplace" view="marketplace" activeView={activeView} onClick={setActiveView as any} />
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-text-secondary dark:text-dark-text-secondary hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={onWalletClick}
              className="flex items-center space-x-2 bg-primary hover:bg-accent rounded-full py-1.5 px-3 transition-colors duration-200 text-text-on-primary"
            >
              <AtlasCoinIcon className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wider">
                 {Number(balance) > 9999 ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(balance)) : balance.toLocaleString('en-US')}
              </span>
            </button>
            <div ref={dropdownRef} className="relative hidden md:block">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-1.5 p-2 rounded-md hover:bg-secondary dark:hover:bg-dark-secondary transition-colors">
                <img src={activeUser.avatar} alt="user avatar" className="w-6 h-6 rounded-full" />
                <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">{activeUser.name}</span>
                <ChevronDownIcon className={`w-4 h-4 text-text-secondary dark:text-dark-text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg shadow-lg py-1 animate-fade-in">
                  <div className="px-3 py-2 border-b border-border dark:border-dark-border">
                    <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">Signed in as</p>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate">{session.user.email}</p>
                  </div>
                  <button onClick={() => { setActiveView('profile'); setDropdownOpen(false); }} className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-border dark:hover:bg-dark-border"><span>My Profile</span></button>
                   <button onClick={() => { onGambitClick(); setDropdownOpen(false); }} className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-border dark:hover:bg-dark-border"><span>The Gambit</span></button>
                  <button 
                    onClick={() => { onSignOut(); setDropdownOpen(false); }} 
                    className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-border dark:hover:bg-dark-border"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);