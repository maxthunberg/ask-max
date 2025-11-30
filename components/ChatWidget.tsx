"use client";

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { InfoModal } from './InfoModal';

interface ChatWidgetProps {
  theme?: 'light' | 'dark';
}

/**
 * Embeddable chat widget that floats in the bottom-right corner
 */
export function ChatWidget({ theme = 'light' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      {/* Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 flex items-center gap-2"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm pr-2">Ask Max</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-[400px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>

          <ChatInterface onInfoClick={() => setIsInfoOpen(true)} className="h-full" />
        </div>
      )}

      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
}