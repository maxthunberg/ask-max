"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Info } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '../utils/chat-api';

interface ChatInterfaceProps {
  onInfoClick?: () => void;
  className?: string;
}

export function ChatInterface({ onInfoClick, className = '' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<ChatMessage & { id: string }>>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm a lightweight AI version of Max Thunberg. Ask me about Max's UX design work, leadership approach, or case studies. What would you like to know?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage & { id: string } = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Send to API with conversation history (excluding the greeting)
      const conversationHistory = messages
        .slice(1) // Skip initial greeting
        .map(({ role, content }) => ({ role, content }));

      const response = await sendChatMessage(userMessage.content, conversationHistory);

      const assistantMessage: ChatMessage & { id: string } = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      
      // Don't add prefix if it's the friendly quota message
      if (errorMessage.includes('💸') || errorMessage.toLowerCase().includes('quota')) {
        setError(errorMessage);
      } else {
        setError(`Error sending message: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Ask Max</h2>
            <p className="text-sm text-gray-500">Light beta</p>
          </div>
          {onInfoClick && (
            <button
              onClick={onInfoClick}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Information"
            >
              <Info className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className={`border rounded-lg px-4 py-3 ${
            error.includes('💸') || error.toLowerCase().includes('quota') 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-sm whitespace-pre-wrap ${
              error.includes('💸') || error.toLowerCase().includes('quota')
                ? 'text-yellow-900'
                : 'text-red-800'
            }`}>
              {error}
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Privacy Notice */}
      <div className="border-t border-gray-200 px-6 py-2 bg-gray-50">
        <p className="text-xs text-gray-500">
          This is a light AI version of Max based only on selected public material.{' '}
          <button
            onClick={onInfoClick}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Learn more
          </button>
        </p>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about Max's work..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}