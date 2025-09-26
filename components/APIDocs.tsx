import React, { useState, useRef, useEffect } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import KeyIcon from './icons/KeyIcon';

declare global {
    interface Window {
        hljs: any;
    }
}

const CodeBlock: React.FC<{ language: string; code: string; title: string }> = ({ language, code, title }) => {
    const codeRef = useRef<HTMLElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (codeRef.current && window.hljs) {
            codeRef.current.innerHTML = window.hljs.highlight(code, { language: language || 'plaintext', ignoreIllegals: true }).value;
        }
    }, [code, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-brand-bg rounded-lg border border-brand-border overflow-hidden my-4">
            <div className="flex justify-between items-center px-4 py-2 bg-brand-surface border-b border-brand-border">
                <p className="text-xs text-brand-muted font-mono">{title}</p>
                <button onClick={handleCopy} className="flex items-center space-x-1 text-xs text-brand-muted hover:text-brand-light">
                    <ClipboardIcon className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm"><code ref={codeRef} className={`language-${language}`}>{code}</code></pre>
        </div>
    );
};


const APIDocs: React.FC = () => {
    const [apiKey, setApiKey] = useState('');

    const generateApiKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = 'gxtr_live_';
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setApiKey(key);
    };

    return (
        <div className="max-w-7xl w-full mx-auto animate-fade-in p-4">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-brand-light">GXTR-as-a-Service</h1>
                <p className="text-xl text-brand-muted mt-2">The Supabase for Investment.</p>
            </header>
            
            <div className="bg-brand-surface border border-brand-border rounded-lg p-6 mb-12">
                <h2 className="text-2xl font-bold text-brand-light mb-3 flex items-center"><KeyIcon className="w-6 h-6 mr-3"/>Your API Keys</h2>
                <p className="text-brand-muted mb-4">Use your secret API key to authenticate requests on your server. Keep this key confidential.</p>
                <div className="flex items-center space-x-3 bg-brand-bg p-3 rounded-lg border border-brand-border">
                    <input 
                        type="text" 
                        readOnly 
                        value={apiKey || '************************************'} 
                        className="flex-grow bg-transparent font-mono text-brand-light focus:outline-none"
                    />
                    <button onClick={generateApiKey} className="px-4 py-1.5 text-sm font-semibold bg-brand-primary hover:bg-brand-accent text-brand-text-on-primary rounded-md transition-colors">
                        Generate Key
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-3xl font-bold text-brand-light mb-4 border-b border-brand-border pb-2">Core Concept</h2>
                    <p className="text-brand-muted leading-relaxed mb-4">Instead of apps building their own investment engines, AI Finance provides them with a complete suite of tools to integrate decentralized finance primitives instantly.</p>
                    <ul className="list-disc list-inside space-y-2 text-brand-muted">
                        <li>APIs (REST/GraphQL)</li>
                        <li>SDKs (JavaScript, Python, Swift)</li>
                        <li>Webhooks (for live updates)</li>
                    </ul>
                </div>
                <div>{/* Placeholder for visual */}</div>
            </div>
            
            <h2 className="text-4xl font-bold text-brand-light mt-16 mb-8 text-center">How It Works</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                <section>
                    <h3 className="text-2xl font-bold text-brand-light mb-2">1. Wallet as Auth</h3>
                    <p className="text-brand-muted leading-relaxed">No passwords, no centralized accounts. Users connect their wallets, and the wallet address becomes their unique account ID. Simple, secure, and decentralized.</p>
                </section>
                <CodeBlock 
                    title="JavaScript: WalletAuth"
                    language="javascript"
                    code={`import { GxtrClient } from '@gxtr/sdk';\n\nconst gxtr = new GxtrClient(process.env.GXTR_API_KEY);\n\n// This will prompt the user to connect their wallet.\nconst { user, error } = await gxtr.auth.signInWithWallet();\n\nif (user) {\n  console.log('Authenticated user:', user.walletAddress);\n}`}
                />

                <section>
                    <h3 className="text-2xl font-bold text-brand-light mb-2">2. The Investment Layer</h3>
                    <p className="text-brand-muted leading-relaxed">Supabase stores data; GXTR stores investment positions. Every wallet has an on-chain record of their strategies, stakes, and yield history, all accessible via a simple API call.</p>
                </section>
                <CodeBlock 
                    title="API: GET /investment/:wallet"
                    language="json"
                    code={JSON.stringify({
                        "wallet": "0x123...",
                        "strategies": [
                          {"id": "ma-01", "status": "running", "yield": "5.4%"},
                          {"id": "heist-07", "status": "paused"}
                        ],
                        "balance": "523.42 GXTR"
                      }, null, 2)}
                />

                <section>
                    <h3 className="text-2xl font-bold text-brand-light mb-2">3. Realtime Streaming</h3>
                    <p className="text-brand-muted leading-relaxed">Stream live investment updates directly to your application. Per-second yield calculations and balance changes are pushed via WebSockets for a truly dynamic user experience.</p>
                </section>
                 <CodeBlock 
                    title="WebSocket: Live Balance Update"
                    language="json"
                    code={JSON.stringify({
                      "wallet": "0x123...",
                      "balance_update": "+0.0021 GXTR/sec"
                    }, null, 2)}
                />

                <section>
                    <h3 className="text-2xl font-bold text-brand-light mb-2">4. Programmable Functions</h3>
                    <p className="text-brand-muted leading-relaxed">Run serverless GXTR investment scripts. This allows developers to build complex, programmable strategies that execute automatically based on market conditions, right within our infrastructure.</p>
                </section>
                <CodeBlock 
                    title="GXTR Function: auto-buy-on-dip.js"
                    language="javascript"
                    code={`// Deploys as a serverless function\nexport default async (event) => {\n  // event contains live market data\n  if (event.price < 2) {\n    await gxtr.buy("0x123...", 10);\n    console.log('Executed auto-buy order.');\n  }\n};`}
                />

                 <section>
                    <h3 className="text-2xl font-bold text-brand-light mb-2">5. Strategy Storage</h3>
                    <p className="text-brand-muted leading-relaxed">Think of it as GitHub for investment logic. Users and developers can publish, share, and fork trading strategies. New investors can subscribe to top performers' code.</p>
                </section>
                 <div>{/* Placeholder */}</div>
            </div>
        </div>
    );
};

export default React.memo(APIDocs);