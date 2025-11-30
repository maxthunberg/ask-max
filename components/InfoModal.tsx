"use client";

import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-gray-900">How This AI Works</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <h4 className="text-sm text-gray-900 mb-2">What is Ask Max?</h4>
            <p className="text-sm text-gray-600">
              Ask Max is a lightweight AI chatbot that represents Max Thunberg, a UX Design Lead.
              It's designed to answer questions about Max's work, approach, and case studies based on
              curated portfolio material.
            </p>
          </div>

          <div>
            <h4 className="text-sm text-gray-900 mb-2">What does it know?</h4>
            <p className="text-sm text-gray-600">
              The AI only knows what's in Max's selected public material, including:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Max's professional background and expertise</li>
              <li>His UX leadership principles and work style</li>
              <li>Case studies from his portfolio</li>
              <li>His approach to design and collaboration</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm text-gray-900 mb-2">Limitations</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>
                <strong>Can be wrong:</strong> Like all AI, it sometimes makes mistakes or
                misinterprets information
              </li>
              <li>
                <strong>Limited knowledge:</strong> It can't answer questions outside of the
                provided material
              </li>
              <li>
                <strong>Not the real Max:</strong> This is a tool to learn about Max's work,
                not a replacement for talking to him
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm text-gray-900 mb-2">Privacy</h4>
            <p className="text-sm text-gray-600">
              Your conversations are not stored long-term. Only minimal technical logs are kept
              for debugging purposes. Please don't share sensitive or confidential information
              in this chat.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <p className="text-sm text-blue-900">
              <strong>Want to connect with the real Max?</strong> This chatbot is just a starting
              point. For serious inquiries, please reach out directly through Max's portfolio.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}