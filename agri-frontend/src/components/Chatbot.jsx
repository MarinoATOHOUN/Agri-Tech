// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
import React, { useState, useEffect, useRef } from 'react';
import { chatbotService } from '../services/api';
import { Send, MessageSquare, X, User, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            role: 'assistant',
            content: 'Bonjour ! Je suis Agri-Conseiller, votre assistant personnel. Comment puis-je vous aider avec votre exploitation aujourd\'hui ?'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = message.trim();
        setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await chatbotService.sendMessage(userMessage);
            setChatHistory(prev => [...prev, { role: 'assistant', content: response.response }]);
        } catch (error) {
            console.error('Erreur Chatbot:', error);
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: "Désolé, je rencontre des difficultés techniques. Vérifiez que votre clé API est bien configurée."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Bouton flottant */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-agri-green text-white p-4 rounded-full shadow-lg hover:bg-agri-dark-green transition-all duration-300 flex items-center justify-center group"
                >
                    <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        1
                    </span>
                </button>
            )}

            {/* Fenêtre de chat */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className="bg-agri-green p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Cpu size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Agri-Conseiller</h3>
                                <p className="text-[10px] text-white/80">IA experte en agriculture</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-agri-green text-white' : 'bg-white border border-gray-200 text-agri-green'
                                        }`}>
                                        {msg.role === 'user' ? <User size={14} /> : <Cpu size={14} />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-agri-green text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                                        }`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                strong: ({ node, ...props }) => (
                                                    <strong
                                                        className={`font-bold ${msg.role === 'user' ? 'text-white underline' : 'text-agri-dark-green'}`}
                                                        {...props}
                                                    />
                                                ),
                                                code: ({ node, ...props }) => (
                                                    <code
                                                        className={`${msg.role === 'user' ? 'bg-white/20' : 'bg-gray-100'} px-1 rounded text-xs`}
                                                        {...props}
                                                    />
                                                ),
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-agri-green flex items-center justify-center">
                                        <Cpu size={14} />
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Posez votre question..."
                            className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-agri-green transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || isLoading}
                            className="bg-agri-green text-white p-2 rounded-xl hover:bg-agri-dark-green disabled:opacity-50 disabled:hover:bg-agri-green transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
