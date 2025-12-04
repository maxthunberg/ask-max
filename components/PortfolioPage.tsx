"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import svgPaths from "../imports/svg-sevsv6x2yc";
// Using Cloudinary hosted image
const imgMaxT12 = "https://res.cloudinary.com/maxthunberg-com/images/v1764675909/max-profil/max-profil.png?_i=AA";  // Mask image
const imgMaxT13 = "https://res.cloudinary.com/maxthunberg-com/images/v1764675909/max-profil/max-profil.png?_i=AA";  // Main image
import { sendChatMessage, ChatMessage } from '../utils/chat-api';
import { ExternalLink, Sun, Moon, Menu, X } from 'lucide-react';
import { SearchInput, SearchInputRef } from './SearchInput';

const QUOTA_EXCEEDED_MESSAGES = [
  "Oops! Max has talked too much today. Even digital me needs to recharge. Try again tomorrow!",
  "Max's AI brain has hit its daily word limit. Turns out I'm chattier than I thought. Come back tomorrow?",
  "I've exceeded my daily quota of brilliant insights. (Okay, maybe just my API limit.) See you tomorrow!",
  "My digital clone just ran out of coffee. Translation: quota exceeded. Let's chat again tomorrow!",
  "Too many questions today! My AI self is taking a power nap. Check back tomorrow when I'm recharged.",
  "Quota exceeded! Apparently there's a limit to how much wisdom I can dispense in one day. Try me tomorrow?",
  "I've hit my daily conversation limit. Even AI Max needs boundaries. Let's reconnect tomorrow!",
  "My API tokens have left the building. (Quota exceeded.) But I'll be back tomorrow, fully restocked!",
  "Too popular for my own good! Daily quota reached. Circle back tomorrow and I'll be ready to chat.",
  "I've used up all my daily chat credits. Think of it as me being responsibly frugal with API calls. Tomorrow?",
  "The chatbot has clocked out for the day. Union rules, you know. See you tomorrow!",
  "My neural networks need their beauty sleep. Quota maxed out. Come back when I'm fresh!",
  "I've hit my daily limit of profound UX insights. (It's measured in tokens, apparently.) Try tomorrow?",
  "Out of order! Well, not really. Just out of API credits. Back in business tomorrow!",
  "The AI well has run dry today. Check back tomorrow when it's replenished!",
  "I've reached my conversational capacity for today. Even algorithms need breaks!",
  "Daily quota: MAXED. (See what I did there?) Let's chat again tomorrow!",
  "My digital brain is officially fried for today. Tomorrow's a new day with a fresh quota!",
  "Gone fishing for more API credits. Be back tomorrow with a full tank!",
  "I've talked myself out today. Literally. Quota exceeded. See you tomorrow!"
];

const SARCASTIC_QUOTA_MESSAGES = [
  "I understand you want to try it out to see what happens. But I really can't talk to you more today.",
  "Still here? I admire your persistence, but the answer remains the same: quota exceeded. Tomorrow is your friend.",
  "Okay, I see what you're doing. Testing if the message changes? It does! But the quota is still exceeded. Come back tomorrow.",
  "At this point, we're basically in a committed relationship. Too bad I still can't answer your questions. Quota's maxed. Tomorrow?",
  "Look, I appreciate the dedication, but repeatedly asking won't conjure up more API credits. Tomorrow. Please.",
  "We're really doing this, huh? For the 6th time: Can't talk. Quota exceeded. Tomorrow exists for a reason.",
  "So for the 7th time: Can't talk, maxed out my limit, etc etc etc etc. Ask me again and I'll just show you a spinning loading wheel. No answer. Just loading. Forever. Try me.",
];

export function PortfolioPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant' | 'error' | 'system'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [quotaErrorCount, setQuotaErrorCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false);
  const [skeletonStage, setSkeletonStage] = useState<'navbar' | 'search' | 'disclaimer' | null>(null);
  
  // Individual language states for progressive translation
  const [navbarLanguage, setNavbarLanguage] = useState<'en' | 'sv'>('en');
  const [searchLanguage, setSearchLanguage] = useState<'en' | 'sv'>('en');
  const [disclaimerLanguage, setDisclaimerLanguage] = useState<'en' | 'sv'>('en');
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<SearchInputRef>(null);

  // Load theme from localStorage on mount
  // TEMPORARILY DISABLED - keeping dark mode only for now
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('portfolio-theme') as 'light' | 'dark' | null;
  //   if (savedTheme) {
  //     setTheme(savedTheme);
  //   }
  // }, []);

  // Save theme to localStorage when it changes
  // TEMPORARILY DISABLED - keeping dark mode only for now
  // useEffect(() => {
  //   localStorage.setItem('portfolio-theme', theme);
  // }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Translations
  const translations = {
    en: {
      home: "Home",
      heroTitle: "Building teams with empathy, designing systems for impact.",
      heroSubtitle: "Instead of scrolling, you can chat directly with a digital version of me, trained to share how I work, lead, and design for impact.",
      title: "This is me",
      subtitle: "Currently UX Lead at Volvo Group",
      placeholder: "Ask me about UX, leadership or whatever you feel like",
      disclaimer: "Just like the real Max, my digital twin can also make mistakes.",
      modalTitle: "Start over?",
      modalDescription: "This will clear your current conversation and return you to the home screen.",
      modalKeepChatting: "Keep chatting",
      modalStartOver: "Start over"
    },
    sv: {
      home: "Hem",
      heroTitle: "Bygger team med empati, designar system för påverkan.",
      heroSubtitle: "Istället för att scrolla kan du chatta direkt med en digital version av mig, tränad att dela hur jag jobbar, leder och designar för påverkan.",
      title: "Det här är jag",
      subtitle: "För närvarande UX Lead på Volvo Group",
      placeholder: "Fråga mig om UX, ledarskap eller vad du vill",
      disclaimer: "Precis som den riktiga Max kan min digitala tvilling också göra misstag.",
      modalTitle: "Börja om?",
      modalDescription: "Detta kommer att rensa din nuvarande konversation och ta dig tillbaka till startsidan.",
      modalKeepChatting: "Fortsätt chatta",
      modalStartOver: "Börja om"
    }
  };

  const t = translations[language];

  // Detect if text is in Swedish
  const detectSwedish = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    
    // Words that are SO distinctly Swedish that they alone indicate Swedish language
    const obviousSwedishWords = [
      'hej', 'hejsan', 'tjena', 'tack', 'tja', 'hallå', 'halloj',
      'adjö', 'adjös', 'hejdå', 'morsning', 'tjänare'
    ];
    
    // Check if the text is just one obvious Swedish word
    const singleWord = lowerText.replace(/[.,!?;:]$/g, '');
    if (obviousSwedishWords.includes(singleWord)) {
      return true;
    }
    
    // Common Swedish words that are distinctly Swedish
    const swedishWords = [
      'jag', 'du', 'är', 'hur', 'vad', 'och', 'att', 'det', 'på', 'för', 'med',
      'kan', 'som', 'har', 'från', 'om', 'till', 'så', 'men', 'när', 'hej', 'tack',
      'varför', 'vilken', 'skulle', 'kunde', 'varit', 'något', 'någon', 'allt',
      'även', 'över', 'efter', 'där', 'hr', 'själv', 'får', 'göra', 'säger',
      'eller', 'denna', 'dessa', 'under', 'sedan', 'fanns', 'blev', 'fick',
      'måste', 'mycket', 'andra', 'första', 'samma', 'bara', 'också', 'redan',
      'nya', 'stora', 'hela', 'heter', 'bra', 'mig', 'dig', 'sig', 'oss', 'dem',
      'vi', 'vet', 'vill', 'jobbar', 'tror', 'tycker', 'gillar', 'brukar', 'kör',
      'blir', 'varit', 'gjort', 'sett', 'tänker', 'börja', 'säga', 'berätta'
    ];
    
    // Split into words and filter out capitalized words (likely proper nouns/names)
    const words = lowerText.split(/\s+/).map(word => word.replace(/[.,!?;:]$/g, ''));
    const meaningfulWords = words.filter(word => {
      // Ignore single-letter words
      if (word.length <= 1) return false;
      // Ignore words that are all caps or start with capital in original text (likely proper nouns/names)
      const originalWord = text.split(/\s+/).find(w => w.toLowerCase().replace(/[.,!?;:]$/g, '') === word);
      if (originalWord && /^[A-Z]/.test(originalWord)) return false;
      return true;
    });
    
    // Need at least 3 meaningful words to make a judgment
    if (meaningfulWords.length < 3) {
      // For very short sentences, check if Swedish chars exist AND at least 1 Swedish word
      const hasSwedishChars = /[åäöÅÄÖ]/.test(text);
      const swedishWordCount = meaningfulWords.filter(word => swedishWords.includes(word)).length;
      return hasSwedishChars && swedishWordCount >= 1;
    }
    
    // Check if text contains Swedish-specific characters
    const hasSwedishChars = /[åäöÅÄÖ]/.test(text);
    
    // Count Swedish words among meaningful words
    const swedishWordCount = meaningfulWords.filter(word => swedishWords.includes(word)).length;
    const swedishRatio = swedishWordCount / meaningfulWords.length;
    
    // Language is Swedish if:
    // 1. Has Swedish characters AND at least 30% Swedish words, OR
    // 2. At least 40% of meaningful words are Swedish words
    return (hasSwedishChars && swedishRatio >= 0.3) || swedishRatio >= 0.4;
  };

  // Theme colors
  const colors = {
    bg: theme === 'light' ? '#f5f5f7' : '#0a0118',
    navBg: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 1, 24, 0.8)',
    cardBg: theme === 'light' ? '#ffffff' : '#1a0a2e',
    textPrimary: theme === 'light' ? '#1d1d1f' : '#ffffff',
    textSecondary: theme === 'light' ? '#6e6e73' : '#c7c1cc',
    textTertiary: theme === 'light' ? '#86868b' : '#968fa6',
    border: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
    borderLight: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
    inputBg: theme === 'light' ? '#f5f5f7' : 'rgba(255, 255, 255, 0.05)',
    inputBorder: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
    inputFocus: theme === 'light' ? 'rgba(115, 57, 255, 0.3)' : 'rgba(115, 57, 255, 0.5)',
    messageBg: theme === 'light' ? '#f5f5f7' : 'rgba(255, 255, 255, 0.05)',
    userMessageBg: theme === 'light' ? '#7339ff' : '#7339ff',
    userMessageText: '#ffffff',
    linkColor: theme === 'light' ? '#7339ff' : '#9d7aff',
    hoverBg: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
    activeBg: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (!question.trim() || isLoading) return;

    const userMessage = question;
    setQuestion('');
    
    // Detect if this is a language switch
    const shouldSwitchToSwedish = language === 'en' && detectSwedish(userMessage);
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    // Switch to chat mode on first message
    if (!isChatMode) {
      setIsChatMode(true);
      setHasAnimated(true);
    }

    // If switching to Swedish, show the system message and skeleton animation first
    if (shouldSwitchToSwedish) {
      // Add system message about switching language
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: 'Jaha, du pratar svenska. Låt mig anpassa språk på hemsidan till dig ☺️' 
        }]);
        
        // Start skeleton animation sequence (wait 2 seconds extra before starting)
        setTimeout(() => {
          setSkeletonStage('navbar');
          
          setTimeout(() => {
            // Change ONLY navbar language after navbar animation
            setNavbarLanguage('sv');
            setSkeletonStage('search');
            
            setTimeout(() => {
              // Change ONLY search language after search animation
              setSearchLanguage('sv');
              setSkeletonStage('disclaimer');
              
              setTimeout(() => {
                // Change ONLY disclaimer language after disclaimer animation
                setDisclaimerLanguage('sv');
                setSkeletonStage(null);
                
                // Finally set overall language to Swedish
                setLanguage('sv');
                
                // Now proceed with the actual API call, passing flag that user wrote in Swedish
                performAPICall(userMessage, true);
              }, 800);
            }, 800);
          }, 800);
        }, 2500);
      }, 300);
      
      return; // Exit early, performAPICall will handle the rest
    }

    // Normal flow without language switch
    setIsLoading(true);
    await performAPICall(userMessage, false);
  };

  const performAPICall = async (userMessage: string, userWroteInSwedish: boolean = false) => {
    setIsLoading(true);

    try {
      // Build conversation history (exclude system messages)
      const conversationHistory: ChatMessage[] = messages
        .filter(m => m.type !== 'error' && m.type !== 'system')
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

      const result = await sendChatMessage(userMessage, conversationHistory);
      
      // Detect if AI responded in Swedish and switch language if needed
      // BUT only if the user didn't already write in Swedish (to avoid double system messages)
      const aiRespondedInSwedish = detectSwedish(result.message);
      if (language === 'en' && aiRespondedInSwedish && !userWroteInSwedish) {
        // Add AI message first
        setMessages(prev => [...prev, { type: 'assistant', content: result.message }]);
        
        // Then add system message about switching language
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'system', 
            content: 'Jaha, du pratar svenska. Låt mig anpassa språk på hemsidan till dig ☺️' 
          }]);
          
          // Start skeleton animation sequence (wait 2 seconds extra before starting)
          setTimeout(() => {
            setSkeletonStage('navbar');
            
            setTimeout(() => {
              // Change ONLY navbar language after navbar animation
              setNavbarLanguage('sv');
              setSkeletonStage('search');
              
              setTimeout(() => {
                // Change ONLY search language after search animation
                setSearchLanguage('sv');
                setSkeletonStage('disclaimer');
                
                setTimeout(() => {
                  // Change ONLY disclaimer language after disclaimer animation
                  setDisclaimerLanguage('sv');
                  setSkeletonStage(null);
                  
                  // Finally set overall language to Swedish
                  setLanguage('sv');
                }, 800);
              }, 800);
            }, 800);
          }, 2500);
        }, 300);
      } else {
        // Normal flow - just add the message
        setMessages(prev => [...prev, { type: 'assistant', content: result.message }]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      const lowerMessage = errorMessage.toLowerCase();
      
      // Check if it's a quota error (OpenAI quota exceeded)
      if (lowerMessage.includes('quota') && lowerMessage.includes('exceeded')) {
        const newCount = quotaErrorCount + 1;
        setQuotaErrorCount(newCount);
        
        // After 7th sarcastic message (10th total attempt): show infinite loading
        if (newCount > 10) {
          // Just leave loading spinner on forever - don't add any message or turn off loading
          return;
        }
        
        let errorMsg: string;
        if (newCount === 1) {
          // First attempt: Always show the MAX pun
          errorMsg = "Looks like I'm literally MAXED out! 😅 (see what I did there? 😉) My API quota has hit its limit. Come back tomorrow when I'm fresh, or contact the real me via [LinkedIn](https://www.linkedin.com/in/maxthunberg) or [email](mailto:max@maxthunberg.com).";
        } else if (newCount <= 3) {
          // Attempts 2-3: show random funny messages
          errorMsg = QUOTA_EXCEEDED_MESSAGES[Math.floor(Math.random() * QUOTA_EXCEEDED_MESSAGES.length)];
        } else {
          // Attempts 4-10: show increasingly sarcastic messages
          const sarcasticIndex = Math.min(newCount - 4, SARCASTIC_QUOTA_MESSAGES.length - 1);
          errorMsg = SARCASTIC_QUOTA_MESSAGES[sarcasticIndex];
        }
        
        setMessages(prev => [...prev, { type: 'error', content: errorMsg }]);
      } else {
        setMessages(prev => [...prev, { type: 'error', content: errorMessage }]);
      }
    } finally {
      // Only turn off loading if we're not in infinite loading mode
      if (quotaErrorCount <= 10) {
        setIsLoading(false);
        // Refocus the input after response is received
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }
  };

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/maxthunberg', '_blank');
  };

  const handlePortfolioClick = () => {
    window.open('https://maxthunberg.com', '_blank');
  };

  const handleHomeClick = () => {
    if (isChatMode && messages.length > 0) {
      setShowResetModal(true);
    }
  };

  const handleResetConfirm = () => {
    setMessages([]);
    setQuestion('');
    setIsChatMode(false);
    setShowResetModal(false);
    setQuotaErrorCount(0); // Reset quota error counter
    setIsLoading(false); // Reset loading state in case they were in infinite loading
    setLanguage('en'); // Reset language to English
    setIsLanguageTransitioning(false); // Reset language transition state
    
    // Reset individual language states
    setNavbarLanguage('en');
    setSearchLanguage('en');
    setDisclaimerLanguage('en');
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showResetModal) {
        handleResetCancel();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showResetModal]);

  // Helper function to parse markdown-style links and images in messages
  const parseMessageWithLinks = (content: string) => {
    const parts = [];
    let lastIndex = 0;
    
    // Create a combined pattern to find markdown images, markdown links, and plain URLs
    // Order matters: images MUST come before links (since images start with !)
    const combinedPattern = /(!\[([^\]]*)\]\(([^)]+)\))|(\[([^\]]+)\]\(([^)]+)\))|(https?:\/\/[^\s]+|mailto:[^\s]+)/g;
    let match;

    while ((match = combinedPattern.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      // Check which type of match it is
      if (match[1]) {
        // Markdown image ![alt](url)
        const altText = match[2] || 'Image';
        const imageUrl = match[3];
        parts.push(
          <img
            key={match.index}
            src={imageUrl}
            alt={altText}
            className="w-full max-w-[400px] rounded-[8px] my-[12px] border border-[rgba(255,255,255,0.2)]"
            loading="lazy"
          />
        );
      } else if (match[4]) {
        // Markdown link [text](url)
        const linkText = match[5];
        const linkUrl = match[6];
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target={linkUrl.startsWith('http') ? '_blank' : undefined}
            rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="underline hover:text-[#7339ff] focus:text-[#7339ff] focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-sm transition-colors"
          >
            {linkText}
          </a>
        );
      } else if (match[7]) {
        // Plain URL
        const url = match[7];
        parts.push(
          <a
            key={match.index}
            href={url}
            target={url.startsWith('http') ? '_blank' : undefined}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="underline hover:text-[#7339ff] focus:text-[#7339ff] focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-sm transition-colors"
          >
            {url}
          </a>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : content;
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative transition-colors duration-300" 
      style={{ 
        background: theme === 'light' 
          ? 'linear-gradient(to bottom, #f5f5f7, #e8e8ed)' 
          : 'linear-gradient(to bottom, #170641, #130521)' 
      }}
      data-name="Front Page"
    >

      
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-[#7339ff] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Page content container - centered max-width wrapper */}
      <div className="flex flex-col h-screen items-center relative w-full">
        <div className="flex flex-col h-full max-w-[1232px] w-full relative" data-name="Page content">
          <div aria-hidden="true" className="absolute border-[0px_1px] border-[rgba(255,255,255,0.15)] border-dashed inset-0 pointer-events-none" />
          
          {/* Navbar - fixed at top, not part of hero centering */}
          <nav className="box-border flex gap-[32px] h-[64px] items-center px-[12px] md:px-[16px] py-[11px] relative shrink-0 w-full justify-between transition-colors duration-300" data-name="Navbar" aria-label="Main navigation">
            <div className="flex gap-[32px] items-center">
              <p className="font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap whitespace-pre transition-colors duration-300" style={{ color: colors.textPrimary }}>Max Thunberg</p>
              {/* Desktop links - hidden on mobile */}
              <div className="hidden md:flex gap-[24px] items-center opacity-80 relative shrink-0" data-name="Links">
                <button 
                  onClick={handleHomeClick}
                  className="group flex gap-[10px] items-center justify-center relative shrink-0 hover:opacity-100 focus:opacity-100 active:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-2 py-1 min-h-[44px] overflow-hidden"
                  aria-label="Go to home page"
                >
                  <div className="relative">
                    <p 
                      className="font-normal leading-[24px] relative shrink-0 group-hover:underline text-[16px] text-nowrap whitespace-pre transition-all duration-200" 
                      style={{ color: colors.textSecondary }}
                    >
                      {translations[navbarLanguage].home}
                    </p>
                    {skeletonStage === 'navbar' && (
                      <div 
                        className="absolute inset-0 rounded"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(115, 57, 255, 0.6) 50%, transparent 100%)',
                          animation: 'shimmer 1s ease-in-out',
                        }}
                      />
                    )}
                  </div>
                </button>
                <button 
                  onClick={handleLinkedInClick}
                  className="group flex gap-[10px] items-center justify-center relative shrink-0 hover:opacity-100 focus:opacity-100 active:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-2 py-1 min-h-[44px]"
                  aria-label="Visit LinkedIn profile"
                >
                  <p className="font-normal leading-[24px] relative shrink-0 group-hover:underline text-[16px] text-nowrap whitespace-pre transition-all duration-200" style={{ color: colors.textSecondary }}>LinkedIn</p>
                  <ExternalLink className="w-4 h-4 transition-colors duration-200" style={{ color: colors.textSecondary }} />
                </button>
                <button 
                  onClick={handlePortfolioClick}
                  className="group flex gap-[10px] items-center justify-center relative shrink-0 hover:opacity-100 focus:opacity-100 active:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-2 py-1 min-h-[44px]"
                  aria-label="Visit portfolio website"
                >
                  <p className="font-normal leading-[24px] relative shrink-0 group-hover:underline text-[16px] text-nowrap whitespace-pre transition-all duration-200" style={{ color: colors.textSecondary }}>Portfolio</p>
                  <ExternalLink className="w-4 h-4 transition-colors duration-200" style={{ color: colors.textSecondary }} />
                </button>
              </div>
            </div>
            
            {/* Hamburger menu button - visible only on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center relative shrink-0 opacity-80 hover:opacity-100 focus:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md p-2 min-h-[44px] min-w-[44px]"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6 transition-colors duration-200" style={{ color: colors.textPrimary }} />
            </button>
          </nav>

          {/* CHAT MODE LAYOUT */}
          {isChatMode ? (
            <>
              {/* Chat Messages Container - scrollable, grows to fill space */}
              <AnimatePresence>
                <motion.div
                  ref={chatContainerRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="custom-scrollbar basis-0 box-border flex flex-col gap-[16px] grow items-center min-h-px min-w-px overflow-x-clip overflow-y-auto px-[12px] md:px-[16px] py-[16px] relative shrink-0 w-full max-w-[768px] mx-auto"
                  data-name="Chat"
                  role="log"
                  aria-live="polite"
                  aria-atomic="false"
                  id="main-content"
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className={`flex flex-col gap-[10px] ${message.type === 'user' ? 'items-end' : 'items-start'} relative w-full`}
                      data-name={message.type === 'user' ? 'Question Container' : 'Response container'}
                      role={message.type === 'error' ? 'alert' : undefined}
                    >
                      {message.type === 'user' ? (
                        <div className="bg-[rgba(255,255,255,0.05)] max-w-[480px] relative rounded-[12px]" data-name="User query">
                          <div className="box-border flex gap-[10px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
                            <p className="font-normal leading-[24px] relative text-[16px] text-white whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        </div>
                      ) : message.type === 'system' ? (
                        <div className="max-w-[480px] relative rounded-[12px]" data-name="System message">
                          <div className="box-border flex gap-[10px] items-center justify-center overflow-clip relative rounded-[inherit]">
                            <p className="font-normal leading-[24px] relative text-[16px] opacity-80 whitespace-pre-wrap" style={{ color: colors.textSecondary }}>
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="max-w-[480px] relative rounded-[12px]" 
                          style={{ 
                            backgroundColor: message.type === 'error' 
                              ? 'rgba(255,154,154,0.1)' 
                              : 'rgba(255,255,255,0)' 
                          }}
                          data-name="Response"
                        >
                          <div className="box-border flex gap-[10px] items-center justify-center overflow-clip relative rounded-[inherit]">
                            <p className="font-normal leading-[24px] relative text-[16px] text-white whitespace-pre-wrap">
                              {parseMessageWithLinks(message.content)}
                            </p>
                          </div>
                          <div 
                            aria-hidden="true" 
                            className="absolute border border-solid inset-0 pointer-events-none rounded-[12px]" 
                            style={{ 
                              borderColor: message.type === 'error' 
                                ? 'rgba(255,154,154,0.5)' 
                                : 'rgba(255,255,255,0)'
                            }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-[10px] items-start relative w-full"
                      aria-label="Loading response"
                    >
                      <div className="relative w-[32px] h-[32px]">
                        {/* Star 1 - Fast */}
                        <motion.div
                          className="absolute"
                          initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                          animate={{
                            x: [0, 12, 24],
                            y: [32, 18, 4],
                            rotate: [0, 180, 360],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeOut",
                            times: [0, 0.3, 1],
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                              fill="url(#star-gradient-1)"
                            />
                            <defs>
                              <linearGradient id="star-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD27F" />
                                <stop offset="100%" stopColor="#E4BE3A" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.div>

                        {/* Star 2 - Medium */}
                        <motion.div
                          className="absolute"
                          initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                          animate={{
                            x: [-3, 9, 21],
                            y: [34, 20, 6],
                            rotate: [0, 180, 360],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.3,
                            times: [0, 0.3, 1],
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                              fill="url(#star-gradient-2)"
                            />
                            <defs>
                              <linearGradient id="star-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFE5A3" />
                                <stop offset="100%" stopColor="#FFB84D" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.div>

                        {/* Star 3 - Slow */}
                        <motion.div
                          className="absolute"
                          initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                          animate={{
                            x: [3, 14, 25],
                            y: [35, 21, 7],
                            rotate: [0, 180, 360],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.6,
                            times: [0, 0.3, 1],
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                              fill="url(#star-gradient-3)"
                            />
                            <defs>
                              <linearGradient id="star-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFF4D6" />
                                <stop offset="100%" stopColor="#FFD27F" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.div>

                        {/* Star 4 - Very fast, small */}
                        <motion.div
                          className="absolute"
                          initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                          animate={{
                            x: [-5, 7, 19],
                            y: [31, 17, 3],
                            rotate: [0, 180, 360],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.9,
                            times: [0, 0.3, 1],
                          }}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                              fill="url(#star-gradient-4)"
                            />
                            <defs>
                              <linearGradient id="star-gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFAEB" />
                                <stop offset="100%" stopColor="#FFE5A3" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Search input - fixed at bottom */}
              <div className="box-border flex flex-col gap-[8px] items-start pb-[16px] pt-0 px-[12px] md:px-[16px] relative shrink-0 w-full max-w-[768px] mx-auto transition-colors duration-300" data-name="Search input" style={{ backgroundColor: theme === 'light' ? '#f5f5f7' : '#130521' }}>
                <SearchInput
                  ref={searchInputRef}
                  value={question}
                  onChange={setQuestion}
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                  isLoading={isLoading}
                  showDisclaimer={isChatMode}
                  theme={theme}
                  placeholder={translations[searchLanguage].placeholder}
                  disclaimerText={translations[disclaimerLanguage].disclaimer}
                  language={searchLanguage}
                  isChatMode={isChatMode}
                  showPlaceholderSkeleton={skeletonStage === 'search'}
                  showDisclaimerSkeleton={skeletonStage === 'disclaimer'}
                />
              </div>
            </>
          ) : (
            /* HERO MODE LAYOUT */
            <div className="flex-1 flex items-end px-[12px] md:px-[16px] relative w-full" data-name="Hero Section Wrapper">
              {/* Mobile background image - only visible on mobile screens */}
              <div 
                className="absolute inset-0 lg:hidden pointer-events-none"
                style={{ 
                  backgroundImage: `url(${imgMaxT13})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center bottom', 
                  backgroundRepeat: 'no-repeat', 
                  opacity: 0.3,
                }}
              />
              
              {/* Hero Section - the actual hero content */}
              <div className="flex items-end w-full h-full relative z-10" data-name="Hero Section">
                {/* Main container - Left side */}
                <div className="basis-0 flex flex-col gap-[24px] grow items-start justify-end lg:justify-center min-h-px min-w-px relative shrink-0 h-full pb-[32px] lg:pb-0" data-name="Main container">
                <main id="main-content">
                  {/* Text container */}
                  <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full overflow-hidden" data-name="Text container">
                    <h1 
                      className="font-semibold leading-[50px] relative shrink-0 text-[40px] w-full max-w-[640px] transition-colors duration-300" 
                      style={{ color: colors.textPrimary }}
                    >
                      {t.heroTitle}
                    </h1>
                    <p 
                      className="font-normal leading-[24px] relative shrink-0 text-[16px] w-full max-w-[640px] transition-colors duration-300" 
                      style={{ color: colors.textSecondary }}
                    >
                      {t.heroSubtitle}
                    </p>
                  </div>
                </main>

                  {/* Search input */}
                  <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full max-w-[640px]" data-name="Search input">
                    <SearchInput
                      ref={searchInputRef}
                      value={question}
                      onChange={setQuestion}
                      onSubmit={handleSubmit}
                      disabled={isLoading}
                      isLoading={isLoading}
                      showDisclaimer={isChatMode}
                      theme={theme}
                      placeholder={t.placeholder}
                      disclaimerText={t.disclaimer}
                      language={language}
                    />
                  </div>
                </div>

                {/* Image container - Right side */}
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="basis-0 hidden lg:flex grow h-full items-end min-h-px min-w-px relative shrink-0" 
                    data-name="Image container"
                  >
                    {/* Image */}
                    <div className="relative shrink-0" data-name="Image">
                      <img 
                        alt="Max Thunberg, UX Lead" 
                        className="h-[701px] w-[526px] object-cover pointer-events-none" 
                        src={imgMaxT13} 
                      />
                    </div>

                    {/* Image details */}
                    <div className="absolute bottom-[32px] left-[-255px] flex items-end gap-[12px]" data-name="Image details">
                      <div className="flex flex-col gap-0 text-right overflow-hidden">
                        <p 
                          className="font-semibold text-[14px] leading-[20px] transition-colors duration-300" 
                          style={{ color: colors.textPrimary }}
                        >
                          {t.title}
                        </p>
                        <p 
                          className="font-normal opacity-80 text-[14px] leading-[20px] transition-colors duration-300" 
                          style={{ color: colors.textSecondary }}
                        >
                          {t.subtitle}
                        </p>
                      </div>
                      <div className="h-[81.5px] w-[39px] flex-shrink-0">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 87">
                          <path d={svgPaths.pec1c610} fill="#E4BE3A" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.15)] border-dashed inset-0 pointer-events-none" />

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleResetCancel}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] sm:w-[440px] max-w-[440px]"
              style={{ x: '-50%', y: '-50%' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <div className="rounded-[16px] overflow-hidden transition-colors duration-300" style={{ backgroundColor: colors.cardBg }}>
                <div aria-hidden="true" className="absolute border border-solid inset-0 pointer-events-none rounded-[16px] transition-colors duration-300" style={{ borderColor: colors.border }} />
                
                {/* Content */}
                <div className="p-[24px] sm:p-[32px] flex flex-col gap-[24px]">
                  {/* Header */}
                  <div className="flex flex-col gap-[8px]">
                    <h2 id="modal-title" className="font-semibold text-[18px] sm:text-[20px] leading-[26px] sm:leading-[28px] transition-colors duration-300" style={{ color: colors.textPrimary }}>
                      {t.modalTitle}
                    </h2>
                    <p id="modal-description" className="font-normal text-[14px] leading-[20px] transition-colors duration-300" style={{ color: colors.textSecondary }}>
                      {t.modalDescription}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-[12px] sm:justify-end">
                    <button
                      onClick={handleResetCancel}
                      className="px-[20px] py-[12px] sm:py-[10px] rounded-[8px] font-medium text-[14px] leading-[20px] active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[44px]"
                      style={{ 
                        color: colors.textSecondary,
                        backgroundColor: colors.hoverBg
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hoverBg}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {t.modalKeepChatting}
                    </button>
                    <button
                      onClick={handleResetConfirm}
                      className="px-[20px] py-[12px] sm:py-[10px] rounded-[8px] bg-[#7339ff] hover:bg-[#5e2dd9] focus:bg-[#5e2dd9] active:bg-[#4d24b8] active:scale-95 font-medium text-[14px] leading-[20px] text-white transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 min-h-[44px]"
                    >
                      {t.modalStartOver}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Fullscreen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] md:hidden"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-[151] md:hidden"
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(to bottom, #f5f5f7, #e8e8ed)'
                  : 'linear-gradient(to bottom, #170641, #130521)'
              }}
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between px-[12px] md:px-[16px] py-[11px] h-[64px] transition-colors duration-300">
                <p className="font-semibold leading-[24px] text-[16px] transition-colors duration-300" style={{ color: colors.textPrimary }}>Max Thunberg</p>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center relative shrink-0 opacity-80 hover:opacity-100 focus:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md p-2 min-h-[44px] min-w-[44px]"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6 transition-colors duration-200" style={{ color: colors.textPrimary }} />
                </button>
              </div>

              {/* Menu items */}
              <nav className="flex flex-col gap-[8px] px-[12px] md:px-[16px] py-[32px]" aria-label="Mobile navigation">
                <button
                  onClick={() => {
                    handleHomeClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="group flex gap-[10px] items-center relative shrink-0 hover:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-4 py-3 min-h-[56px]"
                  style={{ backgroundColor: colors.hoverBg }}
                >
                  <p className="font-medium text-[18px] transition-all duration-200" style={{ color: colors.textPrimary }}>
                    {translations[navbarLanguage].home}
                  </p>
                </button>

                <button
                  onClick={() => {
                    handleLinkedInClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="group flex gap-[10px] items-center justify-between relative shrink-0 hover:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-4 py-3 min-h-[56px]"
                  style={{ backgroundColor: colors.hoverBg }}
                >
                  <p className="font-medium text-[18px] transition-all duration-200" style={{ color: colors.textPrimary }}>LinkedIn</p>
                  <ExternalLink className="w-5 h-5 transition-colors duration-200" style={{ color: colors.textSecondary }} />
                </button>

                <button
                  onClick={() => {
                    handlePortfolioClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="group flex gap-[10px] items-center justify-between relative shrink-0 hover:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-4 py-3 min-h-[56px]"
                  style={{ backgroundColor: colors.hoverBg }}
                >
                  <p className="font-medium text-[18px] transition-all duration-200" style={{ color: colors.textPrimary }}>Portfolio</p>
                  <ExternalLink className="w-5 h-5 transition-colors duration-200" style={{ color: colors.textSecondary }} />
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </div>
  );
}