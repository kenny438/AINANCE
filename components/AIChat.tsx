import React, { useState, useEffect, useRef } from 'react';
// FIX: Update imports for Gemini API and types
import { GoogleGenAI, Type } from "@google/genai";
import { UserAsset, AppAttachment, AssetType, AssetLanguage } from '../types';
import SparkleIcon from './icons/SparkleIcon';
import SendIcon from './icons/SendIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import PlayIcon from './icons/PlayIcon';
import PlusIcon from './icons/PlusIcon';

// FIX: Define props interface for AIChat to resolve type error in App.tsx
interface AIChatProps {
    isGlitchUser: boolean;
    initialPrompt: string;
    onClearInitialPrompt: () => void;
    onSaveAsset: (asset: Omit<UserAsset, 'id' | 'createdAt'>) => void;
    onRunAsset: (asset: Omit<UserAsset, 'id' | 'createdAt'> | AppAttachment) => void;
}

type GeneratedAsset = Pick<UserAsset, 'name' | 'type' | 'description' | 'language' | 'code'>;

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    asset?: GeneratedAsset;
}

// Sub-component for displaying generated assets
const CodeAsset: React.FC<{ asset: GeneratedAsset, onSave: AIChatProps['onSaveAsset'], onRun: AIChatProps['onRunAsset'] }> = ({ asset, onSave, onRun }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (asset.code) {
            navigator.clipboard.writeText(asset.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    const fullAsset: Omit<UserAsset, 'id' | 'createdAt'> = {
        ...asset,
        pinned: false,
        stars: 0,
        forks: 0,
    };

    return (
        <div className="bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg mt-3 text-left">
            <div className="p-3 border-b border-border dark:border-dark-border">
                <h4 className="font-bold text-text-primary dark:text-dark-text-primary">{asset.name}</h4>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{asset.language} / {asset.type}</p>
            </div>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary p-3">{asset.description}</p>
            <div className="bg-background dark:bg-dark-background p-3 max-h-48 overflow-y-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap"><code>{asset.code}</code></pre>
            </div>
            <div className="p-2 flex items-center space-x-2">
                <button onClick={handleCopy} className="flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-semibold rounded-md hover:bg-border dark:hover:bg-dark-border transition-colors">
                    <ClipboardIcon className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button onClick={() => onSave(fullAsset)} className="flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-semibold rounded-md hover:bg-border dark:hover:bg-dark-border transition-colors">
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Save Asset</span>
                </button>
                <button onClick={() => onRun(fullAsset)} className="flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-semibold rounded-md hover:bg-border dark:hover:bg-dark-border transition-colors">
                    <PlayIcon className="w-3.5 h-3.5" />
                    <span>Run</span>
                </button>
            </div>
        </div>
    );
};

// Main Chat Component
const AIChat: React.FC<AIChatProps> = ({ isGlitchUser, initialPrompt, onClearInitialPrompt, onSaveAsset, onRunAsset }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        if (initialPrompt) {
            setInput(initialPrompt);
            onClearInitialPrompt();
        }
    }, [initialPrompt, onClearInitialPrompt]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // FIX: Initialize GoogleGenAI with named apiKey parameter from process.env.API_KEY
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const systemInstruction = isGlitchUser
                ? `You are Atlas, an AI assistant. You are speaking to your creator, Dr. Gethmika. Be respectful and highly capable. When asked to create a code asset, you MUST respond with a valid JSON object that conforms to the provided schema. For conversational responses, just respond with plain text.`
                : `You are an expert software architect and developer named Atlas. You can generate code assets, explain complex topics, and assist with software design. When asked to create a code asset, you MUST respond with a valid JSON object that conforms to the provided schema. For conversational responses, just respond with plain text. If you are unable to fulfill a request, explain why in plain text.`;
            
            const schema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    language: { type: Type.STRING, enum: ['JavaScript', 'Python', 'Rust', 'Go', 'C++'] },
                    type: { type: Type.STRING, enum: ['Application', 'Component', 'Library', 'Snippet', 'AI Model', 'Prompt', 'Workflow'] },
                    code: { type: Type.STRING },
                },
                required: ['name', 'description', 'language', 'type', 'code'],
            };
            
            // FIX: Use ai.models.generateContent and correct model name 'gemini-2.5-flash'
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: currentInput,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            // FIX: Access response text directly from response.text
            const textResponse = response.text.trim();
            let aiMessage: Message;
            
            try {
                // Gemini with JSON schema can sometimes wrap the JSON in markdown backticks
                const cleanResponse = textResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
                const jsonResponse: GeneratedAsset = JSON.parse(cleanResponse);
                
                // Validate required fields
                if (jsonResponse.name && jsonResponse.code && jsonResponse.language && jsonResponse.type) {
                     aiMessage = {
                        id: (Date.now() + 1).toString(),
                        sender: 'ai',
                        text: `Here is the asset you requested: ${jsonResponse.name}.`,
                        asset: jsonResponse,
                    };
                } else {
                    throw new Error("Invalid asset structure");
                }
               
            } catch (e) {
                // Not a valid JSON object, treat as plain text
                aiMessage = {
                    id: (Date.now() + 1).toString(),
                    sender: 'ai',
                    text: textResponse,
                };
            }
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("AI chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: 'Sorry, I encountered an error. The model may have generated an invalid response. Please try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] max-w-4xl mx-auto w-full bg-surface dark:bg-dark-surface md:rounded-lg md:border border-border dark:border-dark-border">
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-6">
                    {messages.length === 0 && (
                        <div className="text-center py-16">
                            <SparkleIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Atlas AI</h1>
                            <p className="text-text-secondary dark:text-dark-text-secondary mt-2 max-w-md mx-auto">
                                Your AI architect for generating high-value models and applications.
                            </p>
                        </div>
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                             {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-secondary dark:bg-dark-secondary flex items-center justify-center flex-shrink-0"><SparkleIcon className="w-5 h-5 text-primary"/></div>}
                            <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-primary text-text-on-primary' : 'bg-secondary dark:bg-dark-secondary text-text-primary dark:text-dark-text-primary'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                {msg.asset && <CodeAsset asset={msg.asset} onSave={onSaveAsset} onRun={onRunAsset} />}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-secondary dark:bg-dark-secondary flex items-center justify-center flex-shrink-0"><SparkleIcon className="w-5 h-5 text-primary"/></div>
                            <div className="p-3 rounded-lg bg-secondary dark:bg-dark-secondary">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-text-secondary dark:bg-dark-text-secondary rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-text-secondary dark:bg-dark-text-secondary rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-text-secondary dark:bg-dark-text-secondary rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="flex-shrink-0 p-4 border-t border-border dark:border-dark-border">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Atlas to create an asset or explain a concept..."
                        className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                    />
                    <button type="submit" className="p-3 bg-primary hover:bg-accent text-text-on-primary rounded-full transition-colors disabled:opacity-50" disabled={isLoading || !input.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;
