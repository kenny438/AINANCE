import React, { useState, useEffect } from 'react';
import { LeaderboardUser } from '../types';

interface ProfileEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, bio: string) => void;
    user: LeaderboardUser;
}

const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        if (user) {
            // Use the custom name/bio if available
            setName(user.name);
            setBio(user.bio || '');
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(name, bio);
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
                    <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Edit Your Profile</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Customize your public presence.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="display-name" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Display Name</label>
                        <input
                            id="display-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:ring-primary focus:border-primary"
                            placeholder="Your display name"
                        />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Bio</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:ring-primary focus:border-primary"
                            placeholder="Tell everyone a little about yourself"
                            maxLength={150}
                        />
                         <p className="text-xs text-right text-text-secondary dark:text-dark-text-secondary mt-1">{bio.length}/150</p>
                    </div>
                </div>

                <div className="p-4 bg-secondary/30 dark:bg-dark-secondary/30 text-right border-t border-border dark:border-dark-border flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-semibold bg-surface dark:bg-dark-surface hover:bg-border dark:hover:bg-dark-border transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-md text-sm font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditorModal;
