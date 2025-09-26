import React, { useState } from 'react';
import BussinSymbolIcon from './icons/BussinSymbolIcon';

interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
}

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) {
            alert("Please provide a name and description.");
            return;
        }
        onCreate(name, description);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <form
                onSubmit={handleSubmit}
                className="bg-surface dark:bg-dark-surface w-full max-w-lg rounded-xl border border-border dark:border-dark-border shadow-2xl m-4 animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border dark:border-dark-border">
                    <div className="flex items-center space-x-3">
                         <BussinSymbolIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
                         <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Create New Organization</h2>
                    </div>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Organizations are shared spaces where you can collaborate on projects.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="org-name" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Organization Name</label>
                        <input
                            id="org-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:ring-primary focus:border-primary"
                            placeholder="e.g., Quantum Leap Inc."
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="org-description" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Description</label>
                        <textarea
                            id="org-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:ring-primary focus:border-primary"
                            placeholder="What is the purpose of this organization?"
                            required
                        />
                    </div>
                </div>

                <div className="p-4 bg-secondary/30 dark:bg-dark-secondary/30 text-right border-t border-border dark:border-dark-border flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-semibold bg-surface dark:bg-dark-surface hover:bg-border dark:hover:bg-dark-border transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-md text-sm font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors"
                    >
                        Create Organization
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrganizationModal;
