import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { initializeKnowledgeBase } from '../utils/chat-api';

/**
 * Setup instructions component that helps users get started
 */
export function SetupInstructions() {
  const [kbStatus, setKbStatus] = useState<'checking' | 'ready' | 'initializing' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkKnowledgeBase();
  }, []);

  const checkKnowledgeBase = async () => {
    setKbStatus('checking');
    setError(null);

    try {
      // Try to check if KB is initialized by making a health check
      const response = await fetch(
        `https://${window.location.hostname.includes('localhost') ? 'your-project' : window.location.hostname.split('.')[0]}.supabase.co/functions/v1/make-server-2b0a7158/health`
      ).catch(() => null);

      if (response && response.ok) {
        setKbStatus('ready');
      } else {
        setKbStatus('error');
        setError('Server not responding. Please check your Supabase configuration.');
      }
    } catch (err) {
      setKbStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleInitialize = async () => {
    setKbStatus('initializing');
    setError(null);

    try {
      await initializeKnowledgeBase();
      setKbStatus('ready');
    } catch (err) {
      setKbStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to initialize');
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        {kbStatus === 'checking' && <Loader2 className="w-5 h-5 text-blue-600 mt-0.5 animate-spin" />}
        {kbStatus === 'ready' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
        {kbStatus === 'initializing' && <Loader2 className="w-5 h-5 text-blue-600 mt-0.5 animate-spin" />}
        {kbStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}

        <div className="flex-1">
          <h3 className="text-sm text-gray-900 mb-2">
            {kbStatus === 'checking' && 'Checking system status...'}
            {kbStatus === 'ready' && 'System Ready'}
            {kbStatus === 'initializing' && 'Initializing knowledge base...'}
            {kbStatus === 'error' && 'Setup Required'}
          </h3>

          {kbStatus === 'ready' && (
            <p className="text-sm text-gray-600">
              The knowledge base is initialized and ready. You can start chatting!
            </p>
          )}

          {kbStatus === 'error' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {error || 'The knowledge base needs to be initialized before you can chat.'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInitialize}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Initialize Knowledge Base
                </button>
                <button
                  onClick={checkKnowledgeBase}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          )}

          {kbStatus === 'initializing' && (
            <p className="text-sm text-gray-600">
              This may take 30-60 seconds while we process the knowledge files and create embeddings...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
