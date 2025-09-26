import React from 'react';
import { MOCK_POSTS } from '../constants';
import { Post, AppAttachment } from '../types';
import HeartIcon from './icons/HeartIcon';
import MessageCircleIcon from './icons/MessageCircleIcon';
import SendIcon from './icons/SendIcon';
import MoreHorizontalIcon from './icons/MoreHorizontalIcon';
import CodeIcon from './icons/CodeIcon';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import GiftIcon from './icons/GiftIcon';
import ZapIcon from './icons/ZapIcon';
import CommunityCard from './CommunityCard';

const AppAttachmentCard: React.FC<{ attachment: AppAttachment, onPreview: (attachment: AppAttachment) => void }> = ({ attachment, onPreview }) => (
    <div className="mt-4 bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-4 transition-colors hover:border-text-secondary dark:hover:border-dark-text-secondary">
        <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-surface dark:bg-dark-surface rounded-md">
                <CodeIcon className="w-5 h-5 text-text-primary dark:text-dark-text-primary" />
            </div>
            <div>
                <p className="font-bold text-text-primary dark:text-dark-text-primary">{attachment.name}</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{attachment.language}</p>
            </div>
        </div>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">{attachment.description}</p>
        <button 
            onClick={() => onPreview(attachment)}
            className="w-full py-2 text-sm font-semibold bg-surface dark:bg-dark-surface hover:bg-border dark:hover:bg-dark-border rounded-md transition-colors">
            View App
        </button>
    </div>
);

const PostCard: React.FC<{ post: Post, onDiscuss: (content: string) => void, onPreviewAttachment: (attachment: AppAttachment) => void, onTip: (authorName: string, amount: number) => void }> = React.memo(({ post, onDiscuss, onPreviewAttachment, onTip }) => {
    
    const handleTipClick = () => {
        const amountStr = prompt(`How many GXTR would you like to tip ${post.authorName}?`);
        if (amountStr) {
            const amount = parseInt(amountStr, 10);
            if (!isNaN(amount) && amount > 0) {
                onTip(post.authorName, amount);
            } else {
                alert("Please enter a valid positive number.");
            }
        }
    };

    return (
        <div className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border last:border-b-0 py-2 animate-fade-in">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                    <img src={post.authorAvatar} alt={post.authorName} className="w-9 h-9 rounded-full border-2 border-border dark:border-dark-border" />
                    <span className="font-semibold text-sm text-text-primary dark:text-dark-text-primary">{post.authorName}</span>
                </div>
                <button aria-label="More options" className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary">
                    <MoreHorizontalIcon className="w-5 h-5" />
                </button>
            </div>

            {post.image && (
                <div className="bg-background dark:bg-dark-background border-y border-border dark:border-dark-border">
                    <img src={post.image} alt="Post content" className="w-full h-auto object-contain max-h-[60vh]" />
                </div>
            )}

            <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-4">
                    <button aria-label="Like post" className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-transform active:scale-90 duration-150"><HeartIcon className="w-6 h-6" /></button>
                    <button aria-label="Comment on post" className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-transform active:scale-90 duration-150"><MessageCircleIcon className="w-6 h-6" /></button>
                    <button aria-label="Share post" className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-transform active:scale-90 duration-150"><SendIcon className="w-6 h-6" /></button>
                </div>
                 <div className="flex items-center space-x-4">
                    <button onClick={handleTipClick} aria-label="Tip author" className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-transform active:scale-90 duration-150">
                        <GiftIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => onDiscuss(`Tell me more about this post: "${post.authorName}: ${post.content}"`)} aria-label="Discuss post with AI" className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-transform active:scale-90 duration-150">
                        <ChatBubbleIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="px-4 pb-4">
                <p className="text-sm text-text-primary dark:text-dark-text-primary font-semibold mb-1">{post.likes.toLocaleString()} likes</p>
                <p className="text-sm text-text-primary dark:text-dark-text-primary">
                    <span className="font-semibold mr-2 cursor-pointer hover:underline">{post.authorName}</span>
                    {post.content}
                </p>
                
                {post.attachment && <AppAttachmentCard attachment={post.attachment} onPreview={onPreviewAttachment} />}

                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-3 cursor-pointer hover:underline">
                    View all {post.comments.toLocaleString()} comments
                </p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-2 uppercase">{post.timestamp}</p>
            </div>
        </div>
    );
});

interface CodeUniverseProps {
    onStartDiscussion: (prompt: string) => void;
    onPreviewAttachment: (attachment: AppAttachment) => void;
    onTip: (authorName: string, amount: number) => void;
}

const EventsCard: React.FC = () => (
    <div className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border mb-2 p-4 animate-fade-in">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary dark:bg-dark-secondary rounded-md">
                <ZapIcon className="w-5 h-5 text-text-primary dark:text-dark-text-primary" />
            </div>
            <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">Community AI Challenge</h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Build a micro-model and win 100,000 GXTR!</p>
            </div>
        </div>
        <button className="mt-3 w-full py-2 text-sm font-semibold bg-secondary dark:bg-dark-secondary hover:bg-border dark:hover:bg-dark-border rounded-md transition-colors">
            Learn More
        </button>
    </div>
);

const CodeUniverse: React.FC<CodeUniverseProps> = ({ onStartDiscussion, onPreviewAttachment, onTip }) => {
    return (
        <div className="max-w-xl mx-auto w-full flex flex-col h-full">
            <div className="overflow-y-auto h-full">
                 <EventsCard />
                 <CommunityCard />
                 {MOCK_POSTS.slice(0, 20).map(post => (
                    <PostCard key={post.id} post={post} onDiscuss={onStartDiscussion} onPreviewAttachment={onPreviewAttachment} onTip={onTip} />
                ))}
            </div>
        </div>
    );
};

export default React.memo(CodeUniverse);
