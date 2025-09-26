
import React from 'react';
import { Organization } from '../types';
import PlusIcon from './icons/PlusIcon';
import UsersIcon from './icons/UsersIcon';
import UserPlusIcon from './icons/UserPlusIcon';

interface OrganizationsViewProps {
    organizations: Organization[];
    onNewOrganization: () => void;
    onInvite: (organization: Organization) => void;
    onSelectOrganization: (orgId: string) => void;
}

const OrganizationCard: React.FC<{ organization: Organization; onInvite: (organization: Organization) => void; onSelect: (orgId: string) => void; }> = ({ organization, onInvite, onSelect }) => (
    <div
        onClick={() => onSelect(organization.id)}
        className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4 w-full flex flex-col justify-between animate-fade-in transition-all duration-200 hover:border-text-secondary dark:hover:border-dark-text-secondary hover:shadow-lg cursor-pointer"
    >
        <div>
            <div className="flex items-center space-x-4 mb-3">
                <img src={organization.avatar} alt={organization.name} className="w-12 h-12 rounded-lg border-2 border-border dark:border-dark-border" />
                <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">{organization.name}</h3>
                </div>
            </div>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4 h-10 overflow-hidden">{organization.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-xs text-text-secondary dark:text-dark-text-secondary">
                <UsersIcon className="w-4 h-4" />
                <span>{organization.members.length} member{organization.members.length !== 1 ? 's' : ''}</span>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onInvite(organization); }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors"
            >
                <UserPlusIcon className="w-3.5 h-3.5" />
                <span>Invite</span>
            </button>
        </div>
    </div>
);

const OrganizationsView: React.FC<OrganizationsViewProps> = ({ organizations, onNewOrganization, onInvite, onSelectOrganization }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">My Organizations</h2>
                <button
                    onClick={onNewOrganization}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Create Organization</span>
                </button>
            </div>

            {organizations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map(org => (
                        <OrganizationCard key={org.id} organization={org} onInvite={onInvite} onSelect={onSelectOrganization} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-surface dark:bg-dark-surface border-2 border-dashed border-border dark:border-dark-border rounded-lg">
                    <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">No Organizations Yet</h3>
                    <p className="text-text-secondary dark:text-dark-text-secondary max-w-md mx-auto mt-2 mb-6">
                        Create an organization to collaborate with others on projects, or join an existing one.
                    </p>
                    <button
                        onClick={onNewOrganization}
                        className="flex items-center space-x-2 mx-auto px-5 py-2.5 rounded-md font-semibold bg-primary hover:bg-accent text-text-on-primary transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Create Your First Organization</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrganizationsView;