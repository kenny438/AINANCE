import React, { useState, useEffect, useRef } from 'react';
import { UserAsset, AssetType, AssetLanguage } from '../types';
import PlayIcon from './icons/PlayIcon';
import SparkleIcon from './icons/SparkleIcon';
import { ASSET_TYPES, LANGUAGES } from '../constants';
import BussinSymbolIcon from './icons/BussinSymbolIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';

declare global {
    interface Window {
        hljs: any;
    }
}

interface AssetEditorModalProps {
    asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'> | null;
    onClose: () => void;
    onSave: (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>) => void;
    onRun: (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>) => void;
    onPublish: (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>) => void;
    onListOnExchange: (asset: UserAsset | Omit<UserAsset, 'id' | 'createdAt'>) => void;
}

const AssetEditorModal: React.FC<AssetEditorModalProps> = ({ asset, onClose, onSave, onRun, onPublish, onListOnExchange }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<AssetType>('Component');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState<AssetLanguage>('JavaScript');
    const [code, setCode] = useState('');
    
    const codeRef = useRef<HTMLElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const mapLanguageToHljs = (lang: AssetLanguage): string => {
        const langMap: { [key in AssetLanguage]: string } = {
            'JavaScript': 'javascript',
            'Python': 'python',
            'Rust': 'rust',
            'Go': 'go',
            'C++': 'cpp',
        };
        return langMap[lang] || 'plaintext';
    };

    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.textContent = code;
            if (window.hljs) {
                window.hljs.highlightElement(codeRef.current);
            }
        }
    }, [code, language]);

    const handleScroll = () => {
        if (preRef.current && textareaRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };


    useEffect(() => {
        if (asset) {
            setName(asset.name || '');
            setType(asset.type || 'Component');
            setDescription(asset.description || '');
            setLanguage(asset.language || 'JavaScript');
            setCode(asset.code || '');
        }
    }, [asset]);

    const getPayload = () => ({
        ...asset!,
        name, 
        type, 
        description, 
        language, 
        code 
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim() || !description.trim() || !code.trim()) {
            alert("Please fill out all fields.");
            return;
        }
        onSave(getPayload());
    };

    const handleRun = () => {
        onRun(getPayload());
    }
    
    const handlePublish = () => {
        if(!name.trim() || !description.trim() || !code.trim()) {
            alert("Please fill out all fields before publishing.");
            return;
        }
        onPublish(getPayload());
    }

    if (!asset) return null;

    const isPurchasedAsset = 'marketplaceId' in asset && !!asset.marketplaceId;
    const isEditing = 'id' in asset;
    const modalTitle = isEditing 
        ? (isPurchasedAsset ? 'Asset Playground' : 'Edit Asset') 
        : 'Create New Asset';

    const isListed = 'exchangeTicker' in asset && !!asset.exchangeTicker;
    const canList = type === 'AI Model' && !isListed;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-brand-bg w-full max-w-7xl rounded-xl border border-brand-border shadow-2xl m-4 animate-fade-in flex flex-col"
                onClick={e => e.stopPropagation()}
                style={{ height: '90vh' }}
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b border-brand-border flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <BussinSymbolIcon className="w-6 h-6 text-brand-muted" />
                            <h2 className="text-2xl font-bold text-brand-light">{modalTitle}</h2>
                        </div>
                        <p className="text-brand-muted mt-1">Utilize the Atlas AI Co-pilot to accelerate your development.</p>
                    </div>
                    
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-hidden">
                        {/* Left Panel: Editor */}
                        <div className="flex flex-col space-y-4 overflow-y-auto pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="asset-name" className="block text-sm font-medium text-brand-muted mb-1">Asset Name</label>
                                    <input id="asset-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-brand-surface border border-brand-border rounded-lg p-2 text-brand-light focus:ring-brand-light focus:border-brand-light" placeholder="e.g., Auth Component"/>
                                </div>
                                <div>
                                    <label htmlFor="asset-type" className="block text-sm font-medium text-brand-muted mb-1">Asset Type</label>
                                    <select id="asset-type" value={type} onChange={e => setType(e.target.value as AssetType)} className="w-full bg-brand-surface border border-brand-border rounded-lg p-2 text-brand-light focus:ring-brand-light focus:border-brand-light">
                                        {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="asset-language" className="block text-sm font-medium text-brand-muted mb-1">Language</label>
                                <select id="asset-language" value={language} onChange={e => setLanguage(e.target.value as AssetLanguage)} className="w-full bg-brand-surface border border-brand-border rounded-lg p-2 text-brand-light focus:ring-brand-light focus:border-brand-light">
                                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="asset-desc" className="block text-sm font-medium text-brand-muted mb-1">Description</label>
                                <textarea id="asset-desc" value={description} onChange={e => setDescription(e.target.value)} required rows={2} className="w-full bg-brand-surface border border-brand-border rounded-lg p-2 text-brand-light focus:ring-brand-light focus:border-brand-light" placeholder="A short description of what this asset does."></textarea>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <label htmlFor="asset-code" className="block text-sm font-medium text-brand-muted mb-1">Code</label>
                                <div className="relative w-full flex-grow border border-brand-border rounded-lg overflow-hidden">
                                     <textarea
                                        ref={textareaRef}
                                        id="asset-code"
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        onScroll={handleScroll}
                                        required
                                        className="absolute inset-0 w-full h-full bg-transparent border-0 p-[1em] font-mono text-sm text-transparent caret-brand-light resize-none focus:outline-none z-10 leading-relaxed"
                                        placeholder={`// Start coding in ${language}...`}
                                        spellCheck="false"
                                    />
                                    <pre
                                        ref={preRef}
                                        className="absolute inset-0 w-full h-full m-0 overflow-auto pointer-events-none"
                                        aria-hidden="true"
                                    >
                                        <code ref={codeRef} className={`hljs language-${mapLanguageToHljs(language)} font-mono text-sm leading-relaxed`}>
                                            {/* Content is managed by useEffect and highlight.js */}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: AI Co-pilot */}
                        <div className="flex flex-col bg-brand-surface/50 rounded-lg border border-brand-border overflow-hidden">
                            <div className="p-4 border-b border-brand-border">
                                <h3 className="text-lg font-bold text-brand-light flex items-center"><SparkleIcon className="w-5 h-5 mr-2 text-brand-muted"/>Atlas AI Co-pilot</h3>
                            </div>
                            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                                <SparkleIcon className="w-12 h-12 text-brand-muted mb-3"/>
                                <h4 className="text-xl font-bold text-brand-light">Co-pilot Coming Soon</h4>
                                <p className="text-brand-muted mt-1 text-sm">AI-powered code explanation, refactoring, debugging, and more are on the horizon.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-brand-surface/50 border-t border-brand-border flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center space-x-2">
                             {!isPurchasedAsset && (
                                <button type="button" onClick={handlePublish} className="px-4 py-2 rounded-md text-sm font-semibold bg-brand-surface hover:bg-brand-border text-brand-light transition-colors">
                                    Publish to Marketplace
                                </button>
                             )}
                            <button 
                                type="button" 
                                onClick={() => onListOnExchange(getPayload())}
                                disabled={!canList}
                                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold bg-green-500/10 hover:bg-green-500/20 text-green-300 border border-green-500/30 transition-colors disabled:bg-brand-surface disabled:border-brand-border disabled:text-brand-muted disabled:cursor-not-allowed"
                                title={type !== 'AI Model' ? "Only AI Models can be listed on the exchange" : isListed ? "Asset is already listed" : "List on Exchange"}
                            >
                                <TrendingUpIcon className="w-4 h-4" />
                                <span>{isListed ? `Listed: $${(asset as UserAsset).exchangeTicker}` : 'List on Exchange'}</span>
                            </button>
                             <button type="button" onClick={handleRun} className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold bg-brand-surface hover:bg-brand-border text-brand-light transition-colors">
                                 <PlayIcon className="w-4 h-4" />
                                 <span>Run</span>
                             </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-semibold bg-brand-surface hover:bg-brand-border transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 rounded-md text-sm font-semibold bg-brand-primary hover:bg-brand-accent text-brand-text-on-primary transition-colors">
                               {isEditing ? 'Save Changes' : 'Create Asset'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssetEditorModal;