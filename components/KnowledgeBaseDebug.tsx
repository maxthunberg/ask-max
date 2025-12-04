import React, { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface KBFileInfo {
  filename: string;
  contentLength: number;
  firstLines: string;
  containsAgrowth: boolean;
  containsEHVS: boolean;
  containsLinneaus: boolean;
}

interface KBInfo {
  files: KBFileInfo[];
  totalFiles: number;
  kbInitialized: boolean;
  kbChunkCount: number;
}

export function KnowledgeBaseDebug() {
  const [kbInfo, setKbInfo] = useState<KBInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkKnowledgeBase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b0a7158/admin/kb-info`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setKbInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-8">Knowledge Base Debug Info</h1>
        
        <button
          onClick={checkKnowledgeBase}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg mb-6 transition-colors"
        >
          {loading ? 'Loading...' : 'Check Knowledge Base'}
        </button>

        {error && (
          <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-6">
            <p className="text-red-200">Error: {error}</p>
          </div>
        )}

        {kbInfo && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl mb-4">Summary</h2>
              <div className="space-y-2">
                <p><strong>Total Files:</strong> {kbInfo.totalFiles}</p>
                <p><strong>KB Initialized:</strong> {kbInfo.kbInitialized ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Chunk Count:</strong> {kbInfo.kbChunkCount || 0}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl">Files in Knowledge Base</h2>
              {kbInfo.files.map((file, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg mb-3 text-blue-400">{file.filename}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <p><strong>Content Length:</strong> {file.contentLength.toLocaleString()} characters</p>
                    <p>
                      <strong>Contains Agrowth:</strong> {file.containsAgrowth ? '✅ Yes' : '❌ No'}
                    </p>
                    <p>
                      <strong>Contains EHVS:</strong> {file.containsEHVS ? '✅ Yes' : '❌ No'}
                    </p>
                    <p>
                      <strong>Contains Linneaus:</strong> {file.containsLinneaus ? '✅ Yes' : '❌ No'}
                    </p>
                  </div>

                  <div className="bg-gray-900 rounded p-4">
                    <p className="text-sm text-gray-400 mb-2">First 5 lines:</p>
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                      {file.firstLines}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
