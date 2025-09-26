import React from 'react';
import { LeaderboardUser } from '../types';
import AtlasCoinIcon from './icons/AtlasCoinIcon';
import { getUserTier } from '../utils';
import PixelatedCrownIcon from './icons/PixelatedCrownIcon';
import PixelatedDiamondIcon from './icons/PixelatedDiamondIcon';
import PixelatedSkullIcon from './icons/PixelatedSkullIcon';

interface LeaderboardProps {
  users: LeaderboardUser[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">AI Finance Leaderboard</h1>
      <p className="text-text-secondary dark:text-dark-text-secondary mb-8">Top entities in the AI Finance ecosystem.</p>
      
      <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/50 dark:bg-dark-secondary/50">
            <tr>
              <th className="p-4 font-semibold text-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider w-16">Rank</th>
              <th className="p-4 font-semibold text-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider">Entity</th>
              <th className="p-4 font-semibold text-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider hidden sm:table-cell">Tier</th>
              <th className="p-4 font-semibold text-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider text-right hidden sm:table-cell">Reputation</th>
              <th className="p-4 font-semibold text-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider text-right">Net Worth (GXTR)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const { tier, className } = getUserTier(user.balance);
              const rankContent = () => {
                if (user.rank === 1) return <PixelatedCrownIcon className="w-6 h-6 text-yellow-400 mx-auto" />;
                if (user.rank === 2) return <PixelatedDiamondIcon className="w-5 h-5 text-cyan-400 mx-auto" />;
                if (user.rank === 3) return <PixelatedSkullIcon className="w-5 h-5 text-gray-400 mx-auto" />;
                return <span className="text-text-primary dark:text-dark-text-primary">{user.rank}</span>;
              };
              return (
                <tr key={user.rank} className={`border-t border-border dark:border-dark-border transition-colors duration-200 hover:bg-secondary/30 dark:hover:bg-dark-secondary/30 ${index === 0 ? 'bg-primary/5' : ''}`}>
                  <td className="p-4 font-bold text-lg text-center">
                      {rankContent()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-border dark:border-dark-border"/>
                      <span className="font-semibold text-text-primary dark:text-dark-text-primary">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full bg-secondary dark:bg-dark-secondary font-bold ${className}`}>
                      {tier}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-right text-text-primary dark:text-dark-text-primary hidden sm:table-cell">{user.reputation.toLocaleString()}</td>
                  <td className="p-4 font-mono text-right">
                      <div className="flex items-center justify-end space-x-1 text-text-primary dark:text-dark-text-primary">
                          <AtlasCoinIcon className="w-4 h-4"/>
                          <span>{user.balance.toLocaleString()}</span>
                      </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(Leaderboard);