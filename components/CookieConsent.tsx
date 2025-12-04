import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookieConsentProps {
  theme: 'light' | 'dark';
  language: 'en' | 'sv';
}

export function CookieConsent({ theme, language }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    console.log('Cookie consent status:', consent);
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => {
        console.log('Showing cookie banner');
        setShowBanner(true);
      }, 1000);
    } else if (consent === 'accepted') {
      // Initialize Google Analytics if already accepted
      console.log('Cookie consent already accepted, initializing GA');
      initializeGoogleAnalytics();
    }
  }, []);

  const initializeGoogleAnalytics = () => {
    // Add gtag.js script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-XD7R2W1EFV';
    document.head.appendChild(script1);

    // Add gtag configuration
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XD7R2W1EFV');
    `;
    document.head.appendChild(script2);
  };

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    initializeGoogleAnalytics();
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const translations = {
    en: {
      title: 'Cookie preferences',
      description: "I want to learn how you use my website because I'm curious. You decide if you want to accept it or not.",
      accept: 'Accept',
      decline: 'Decline'
    },
    sv: {
      title: 'Cookie-inställningar',
      description: 'Jag vill lära mig hur du använder min webbplats för jag är nyfiken. Du bestämmer om du vill acceptera det eller inte.',
      accept: 'Acceptera',
      decline: 'Neka'
    }
  };

  const t = translations[language];

  // Theme colors
  const colors = {
    bg: theme === 'light' ? '#ffffff' : '#1a0a2e',
    textPrimary: theme === 'light' ? '#1d1d1f' : '#ffffff',
    textSecondary: theme === 'light' ? '#6e6e73' : '#c7c1cc',
    border: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
    hoverBg: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
    buttonBg: theme === 'light' ? '#e8e8ed' : '#21123c',
    buttonBgHover: theme === 'light' ? '#dcdce0' : '#271641',
    buttonBorder: theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : '#4d4164',
    buttonBorderHover: theme === 'light' ? 'rgba(0, 0, 0, 0.3)' : '#968fa6',
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[200] p-4"
          role="dialog"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-description"
        >
          <div className="max-w-[720px] mx-auto">
            <div 
              className="rounded-[12px] overflow-hidden shadow-xl backdrop-blur-xl relative"
              style={{ 
                backgroundColor: theme === 'light' 
                  ? 'rgba(255, 255, 255, 0.95)' 
                  : 'rgba(26, 10, 46, 0.95)' 
              }}
            >
              <div 
                aria-hidden="true" 
                className="absolute border border-solid inset-0 pointer-events-none rounded-[12px]" 
                style={{ borderColor: colors.border }} 
              />
              
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-1">
                    <h2 
                      id="cookie-title"
                      className="font-semibold text-[16px] leading-[22px]"
                      style={{ color: colors.textPrimary }}
                    >
                      {t.title}
                    </h2>
                    <p 
                      id="cookie-description"
                      className="font-normal text-[14px] leading-[20px]"
                      style={{ color: colors.textSecondary }}
                    >
                      {t.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full md:w-auto md:flex-shrink-0">
                    <button
                      onClick={handleDecline}
                      className="relative flex-1 md:flex-initial px-4 py-2.5 rounded-[8px] font-medium text-[14px] leading-[20px] active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[44px] whitespace-nowrap overflow-hidden"
                      style={{ 
                        backgroundColor: colors.buttonBg,
                        color: colors.textPrimary
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.buttonBgHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.buttonBg}
                    >
                      <div 
                        aria-hidden="true" 
                        className="absolute border border-solid inset-0 pointer-events-none rounded-[8px] transition-colors duration-200" 
                        style={{ borderColor: colors.buttonBorder }}
                      />
                      <span className="relative z-10">{t.decline}</span>
                    </button>
                    <button
                      onClick={handleAccept}
                      className="relative flex-1 md:flex-initial px-4 py-2.5 rounded-[8px] font-medium text-[14px] leading-[20px] active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[44px] whitespace-nowrap overflow-hidden"
                      style={{ 
                        backgroundColor: colors.buttonBg,
                        color: colors.textPrimary
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.buttonBgHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.buttonBg}
                    >
                      <div 
                        aria-hidden="true" 
                        className="absolute border border-solid inset-0 pointer-events-none rounded-[8px] transition-colors duration-200" 
                        style={{ borderColor: colors.buttonBorder }}
                      />
                      <span className="relative z-10">{t.accept}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}