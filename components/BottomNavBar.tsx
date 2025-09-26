import React from 'react';
import { AppView } from '../types';
import HomeIcon from './icons/HomeIcon';
import GlobeIcon from './icons/GlobeIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import UserIcon from './icons/UserIcon';
import BarChartIcon from './icons/BarChartIcon';

interface BottomNavBarProps {
    activeView: AppView;
    setActiveView: (view: AppView) => void;
}

const NavItem: React.FC<{
    label: string;
    view: AppView;
    activeView: AppView;
    onClick: (view: AppView) => void;
    icon: React.ReactNode;
}> = ({ label, view, activeView, onClick, icon }) => (
    <button
        onClick={() => onClick(view)}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
            activeView === view
                ? 'text-primary'
                : 'text-text-secondary dark:text-dark-text-secondary'
        }`}
    >
        {icon}
        <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface dark:bg-dark-surface border-t border-border dark:border-dark-border flex items-center justify-around md:hidden z-50">
            <NavItem
                label="Exchange"
                view="exchange"
                activeView={activeView}
                onClick={setActiveView}
                icon={<TrendingUpIcon className="w-6 h-6" />}
            />
            <NavItem
                label="Universe"
                view="universe"
                activeView={activeView}
                onClick={setActiveView}
                icon={<GlobeIcon className="w-6 h-6" />}
            />
            <button 
                onClick={() => setActiveView('dashboard')}
                className="flex items-center justify-center w-16 h-16 -mt-8 rounded-full bg-primary shadow-lg ring-4 ring-background dark:ring-dark-background"
                aria-label="Dashboard"
            >
                <HomeIcon className="w-8 h-8 text-text-on-primary"/>
            </button>
            <NavItem
                label="Investing"
                view="iaas"
                activeView={activeView}
                onClick={setActiveView}
                icon={<BarChartIcon className="w-6 h-6" />}
            />
            <NavItem
                label="Profile"
                view="profile"
                activeView={activeView}
                onClick={setActiveView}
                icon={<UserIcon className="w-6 h-6" />}
            />
        </nav>
    );
};

export default BottomNavBar;
