
import React, { useState, useRef, useEffect } from 'react';
import { Organization, ChatMessage, LeaderboardUser } from '../types';
import SendIcon from './icons/SendIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface OrganizationChatViewProps {
    organization: Organization;
    messages: ChatMessage[];
    currentUser: LeaderboardUser;
    onSendMessage: (orgId: string, content: string) => void;
    onBack: () => void;
}

const MessageBubble: React.FC<{ message: ChatMessage; isCurrentUser: boolean }> = ({ message, isCurrentUser }) => {
    const alignment = isCurrentUser ? 'justify-end' : 'justify-start';
    const bubbleColor = isCurrentUser ? 'bg-primary text-text-on-primary' : 'bg-secondary dark:bg-dark-secondary';

    return (
        <div className={`flex items-end gap-2 ${alignment}`}>
            {!isCurrentUser && (
                <img src={message.authorAvatar} alt={message.authorName} className="w-8 h-8 rounded-full flex-shrink-0" />
            )}
            <div className={`max-w-md p-3 rounded-2xl ${bubbleColor}`}>
                {!isCurrentUser && <p className="text-xs font-bold mb-1 text-text-secondary dark:text-dark-text-secondary">{message.authorName}</p>}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${isCurrentUser ? 'text-right' : 'text-left'}`}>{message.timestamp}</p>
            </div>
        </div>
    );
};

const OrganizationChatView: React.FC<OrganizationChatViewProps> = ({ organization, messages, currentUser, onSendMessage, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(organization.id, newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-320px)] bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg animate-fade-in">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center p-4 border-b border-border dark:border-dark-border">
                <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-secondary dark:hover:bg-dark-secondary">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <img src={organization.avatar} alt={organization.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <h2 className="text-lg font-bold">{organization.name}</h2>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{organization.members.length} members</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isCurrentUser={msg.authorId === currentUser.id} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="flex-shrink-0 p-4 border-t border-border dark:border-dark-border">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" className="p-3 bg-primary hover:bg-accent text-text-on-primary rounded-full transition-colors disabled:opacity-50" disabled={!newMessage.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrganizationChatView;
