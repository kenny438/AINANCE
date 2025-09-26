
import React, { useState, useEffect } from 'react';
import { Organization } from '../types';
import BussinSymbolIcon from './icons/BussinSymbolIcon';
import LinkIcon from './icons/LinkIcon';
import ClipboardIcon from './icons/ClipboardIcon';

interface InviteModalProps {
    state: { isOpen: boolean; organization: Organization } | null;
    onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ state, onClose }) => {
    const [copied, setCopied] = useState(false);
    const { isOpen, organization } = state || {};

    const inviteLink = `https://aifinance.dev/join?org=${organization?.id}&token=${btoa(organization?.name || '').slice(0, 16)}`;

    useEffect(() => {
        if (isOpen) {
            setCopied(false);
        }
    }, [isOpen]);

    if (!isOpen || !organization) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-surface dark:bg-dark-surface w-full max-w-lg rounded-xl border border-border dark:border-dark-border shadow-2xl m-4 animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border dark:border-dark-border">
                    <div className="flex items-center space-x-3">
                        <BussinSymbolIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
                        <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Invite Members to {organization.name}</h2>
                    </div>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Share this link with anyone you want to invite to your organization.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="invite-link" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2 flex items-center space-x-2">
                            <LinkIcon className="w-4 h-4" />
                            <span>Shareable Invite Link</span>
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                id="invite-link"
                                type="text"
                                readOnly
                                value={inviteLink}
                                className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-secondary dark:text-dark-text-secondary font-mono text-sm"
                            />
                            <button
                                onClick={handleCopy}
                                className="px-4 py-3 rounded-lg bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border transition-colors flex items-center space-x-2"
                            >
                                <ClipboardIcon className="w-4 h-4"/>
                                <span className="text-sm font-semibold">{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Current Members ({organization.members.length})</h3>
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                            {/* In a real app, you would resolve user IDs to names/avatars */}
                            {organization.members.map(memberId => (
                                <div key={memberId} className="flex items-center space-x-3 p-2 bg-secondary dark:bg-dark-secondary rounded-md">
                                    <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${memberId}`} alt="member" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm font-medium">{memberId}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-secondary/30 dark:bg-dark-secondary/30 text-right border-t border-border dark:border-dark-border">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-md text-sm font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteModal;
