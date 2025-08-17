import React, { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    Send,
    Paperclip,
    Smile,
    Minimize2,
    X,
    Bot,
    User,
    Sparkles
} from 'lucide-react';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hi there! I'm your AI assistant. I'm here to help you with project management, task organization, and answer any questions you might have. How can I assist you today?",
            timestamp: new Date(Date.now() - 60000)
        }
    ]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            type: 'user',
            content: message,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "I understand you're looking for help with that. Let me break this down for you and provide some actionable insights.",
                "That's a great question! Based on best practices in project management, here are some recommendations I can offer.",
                "I can definitely help you with that. Let me analyze your request and provide you with a comprehensive solution.",
                "Thanks for reaching out! I've processed your query and here's what I recommend based on current industry standards.",
                "Excellent point! Let me walk you through a step-by-step approach that should address your needs effectively."
            ];

            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[600px] z-50">
            <div className="h-full flex flex-col rounded-none md:rounded-xl shadow-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-all duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-none md:rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-600">
                            <Sparkles className="w-5 h-5 text-blue-600 dark:text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                AI Assistant
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Always here to help
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg transition-colors md:hidden hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg transition-colors hidden md:block hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.type === 'bot' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-600">
                                    <Bot className="w-4 h-4 text-blue-600 dark:text-white" />
                                </div>
                            )}

                            <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-last' : ''}`}>
                                <div className={`p-3 rounded-2xl ${
                                    msg.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-md'
                                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700 shadow-sm'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                                <p className={`text-xs mt-1 px-3 text-gray-400 dark:text-gray-500 ${
                                    msg.type === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {formatTime(msg.timestamp)}
                                </p>
                            </div>

                            {msg.type === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-600">
                                <Bot className="w-4 h-4 text-blue-600 dark:text-white" />
                            </div>
                            <div className="p-3 rounded-2xl rounded-bl-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-none md:rounded-b-xl">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 transition-all duration-200 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-800">
                        <button className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Paperclip className="w-4 h-4" />
                        </button>

                        <textarea
                            ref={inputRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 resize-none bg-transparent border-none outline-none text-sm placeholder-gray-400 max-h-24 text-gray-900 dark:text-white"
                            rows="1"
                            style={{
                                minHeight: '20px',
                                height: 'auto'
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                            }}
                        />

                        <button className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Smile className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                message.trim()
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;