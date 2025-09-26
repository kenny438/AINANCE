import React from 'react';

const ContributionGraph: React.FC = () => {
    const today = new Date();
    const squares = [];
    
    // Create data for the last 365 days
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Mock contribution count
        const contributions = Math.random() > 0.3 ? Math.floor(Math.random() * 20) : 0;
        
        squares.push({ date, contributions });
    }
    squares.reverse(); // order from oldest to newest

    const getBGColor = (count: number) => {
        if (count === 0) return 'bg-secondary dark:bg-dark-secondary';
        if (count < 5) return 'bg-primary/20';
        if (count < 10) return 'bg-primary/50';
        if (count < 15) return 'bg-primary/80';
        return 'bg-primary';
    };

    return (
        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
            <div className="grid grid-cols-53 grid-rows-7 gap-1" style={{gridAutoFlow: 'column'}}>
                {squares.map(({ date, contributions }, index) => (
                    <div 
                        key={index}
                        className={`w-3 h-3 rounded-sm ${getBGColor(contributions)}`}
                        title={`${contributions} contributions on ${date.toDateString()}`}
                    >
                    </div>
                ))}
            </div>
            <div className="flex justify-end items-center space-x-2 mt-2 text-xs text-text-secondary dark:text-dark-text-secondary">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-secondary dark:bg-dark-secondary"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/50"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/80"></div>
                <div className="w-3 h-3 rounded-sm bg-primary"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ContributionGraph;