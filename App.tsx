import React, { useState } from 'react';
import { PortfolioPage } from './components/PortfolioPage';
import { KnowledgeBaseDebug } from './components/KnowledgeBaseDebug';

export default function App() {
  // Simple routing based on URL hash
  const [route, setRoute] = React.useState(window.location.hash.slice(1) || 'home');

  React.useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1) || 'home');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === 'debug') {
    return <KnowledgeBaseDebug />;
  }

  return <PortfolioPage />;
}