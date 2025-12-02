"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import svgPaths from "../imports/svg-sevsv6x2yc";
// Using local image for production build compatibility
const imgMaxT12 = "/images/max-thunberg.jpg";  // Mask image
const imgMaxT13 = "/images/max-thunberg.jpg";  // Main image
import { sendChatMessage, ChatMessage } from '../utils/chat-api';
import { Loader2 } from 'lucide-react';
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
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant' | 'error'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [quotaErrorCount, setQuotaErrorCount] = useState(0);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<SearchInputRef>(null);

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
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    // Switch to chat mode on first message
    if (!isChatMode) {
      setIsChatMode(true);
      setHasAnimated(true);
    }

    setIsLoading(true);

    try {
      // Build conversation history
      const conversationHistory: ChatMessage[] = messages
        .filter(m => m.type !== 'error')
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

      const result = await sendChatMessage(userMessage, conversationHistory);
      setMessages(prev => [...prev, { type: 'assistant', content: result.message }]);
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

  // Helper function to parse markdown-style links in error messages
  const parseMessageWithLinks = (content: string) => {
    // First handle markdown-style links [text](url)
    const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    // Then handle plain URLs (http, https, mailto)
    const plainUrlPattern = /(https?:\/\/[^\s]+|mailto:[^\s]+)/g;
    
    const parts = [];
    let lastIndex = 0;
    
    // Create a combined pattern to find both markdown and plain URLs
    const combinedPattern = /(\[([^\]]+)\]\(([^)]+)\))|(https?:\/\/[^\s]+|mailto:[^\s]+)/g;
    let match;

    while ((match = combinedPattern.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      // Check if it's a markdown link or plain URL
      if (match[1]) {
        // Markdown link [text](url)
        const linkText = match[2];
        const linkUrl = match[3];
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
      } else if (match[4]) {
        // Plain URL
        const url = match[4];
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
    <div className="bg-gradient-to-b from-[#170641] relative size-full to-[#130521] min-h-screen" data-name="Front Page">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-[#7339ff] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <div className="content-stretch flex flex-col items-center relative size-full">
        {/* Page content container */}
        <div className="basis-0 content-stretch flex flex-col grow items-center max-w-[1232px] min-h-px min-w-px relative shrink-0 w-full" data-name="Page content">
          <div aria-hidden="true" className="absolute border-[0px_1px] border-[rgba(255,255,255,0.15)] border-dashed inset-0 pointer-events-none" />
          
          {/* Navbar */}
          <nav className="box-border content-stretch flex gap-[32px] h-[64px] items-center px-[16px] py-[11px] relative shrink-0 w-full" data-name="Navbar" aria-label="Main navigation">
            <p className="font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Max Thunberg</p>
            <div className="content-stretch flex gap-[24px] items-center opacity-80 relative shrink-0" data-name="Links">
              <button 
                onClick={handleHomeClick}
                className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 hover:opacity-100 focus:opacity-100 active:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-2 py-1 min-h-[44px]"
                aria-label="Go to home page"
              >
                <p className="font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">Home</p>
              </button>
              <button 
                onClick={handleLinkedInClick}
                className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 hover:opacity-100 focus:opacity-100 active:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-2 py-1 min-h-[44px]"
                aria-label="Visit LinkedIn profile"
              >
                <p className="font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">LinkedIn</p>
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="basis-0 box-border content-stretch flex grow items-center min-h-px min-w-px px-[16px] py-0 relative shrink-0 w-full" data-name="Hero Section">
            {/* Main container - Left side */}
            <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Main container">
              <main id="main-content">
                {/* Text container */}
                <AnimatePresence>
                  {!isChatMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full mb-[24px]" 
                      data-name="Text container"
                    >
                      <h1 className="font-semibold leading-[50px] relative shrink-0 text-[40px] text-white w-full max-w-[640px]">Building teams with empathy, designing systems for impact.</h1>
                      <p className="font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] w-full max-w-[640px]">Instead of scrolling, you can chat directly with a digital version of me, trained to share how I work, lead, and design for impact.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chat Messages */}
                <AnimatePresence>
                  {isChatMode && (
                    <motion.div
                      ref={chatContainerRef}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="w-full max-w-[640px] overflow-y-auto flex flex-col gap-[16px] mb-[24px]"
                      style={{ maxHeight: 'calc(100vh - 200px)' }}
                      data-name="Content"
                      role="log"
                      aria-live="polite"
                      aria-atomic="false"
                    >
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className={`flex flex-col gap-[10px] ${message.type === 'user' ? 'items-end self-end' : 'items-start self-start'} relative w-full`}
                          data-name={message.type === 'user' ? 'Query container' : 'Response container'}
                          role={message.type === 'error' ? 'alert' : undefined}
                        >
                          {message.type === 'user' ? (
                            <div className="bg-[rgba(255,255,255,0.05)] max-w-[90%] sm:max-w-[480px] relative rounded-[12px]" data-name="Query">
                              <div className="box-border flex gap-[10px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
                                <p className="font-normal leading-[24px] relative text-[16px] text-white whitespace-pre-wrap">{message.content}</p>
                              </div>
                              <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                            </div>
                          ) : (
                            <div 
                              className={`${
                                message.type === 'error' 
                                  ? 'bg-[rgba(255,154,154,0.1)]' 
                                  : 'bg-[rgba(255,255,255,0)]'
                              } max-w-[90%] sm:max-w-[480px] relative rounded-[12px]`} 
                              data-name="Response"
                            >
                              <div className="box-border flex gap-[10px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
                                <p className="font-normal leading-[24px] relative text-[16px] text-white whitespace-pre-wrap">
                                  {parseMessageWithLinks(message.content)}
                                </p>
                              </div>
                              <div 
                                aria-hidden="true" 
                                className={`absolute border ${
                                  message.type === 'error' 
                                    ? 'border-[rgba(255,154,154,0.5)]' 
                                    : 'border-[rgba(255,255,255,0)]'
                                } border-solid inset-0 pointer-events-none rounded-[12px]`} 
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                      
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col gap-[10px] items-start self-start relative w-full"
                          aria-label="Loading response"
                        >
                          <div className="bg-[rgba(255,255,255,0)] relative rounded-[12px] px-[16px] py-[12px]">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              {/* Search input */}
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full max-w-[640px]" data-name="Search input">
                <SearchInput
                  ref={searchInputRef}
                  value={question}
                  onChange={setQuestion}
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                  isLoading={isLoading}
                  showDisclaimer={isChatMode}
                />
              </div>
            </div>

            {/* Image container - Right side */}
            <AnimatePresence>
              {!isChatMode && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="basis-0 content-stretch hidden lg:flex grow h-full items-end min-h-px min-w-px relative shrink-0" 
                  data-name="Image container"
                >
                  {/* Image */}
                  <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Image">
                    <div className="[grid-area:1_/_1] h-[701px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[526px_701px] ml-0 mt-0 relative w-[526px]" data-name="Max_T (1) 2" style={{ maskImage: `url('${imgMaxT12}')` }}>
                      <img alt="Max Thunberg, UX Lead" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMaxT13} />
                    </div>
                    <div className="[grid-area:1_/_1] bg-[#7339ff] h-[701px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.5px_0px] mask-size-[526px_701px] mix-blend-color ml-[0.5px] mt-0 opacity-20 w-[526px]" data-name="Overlay" style={{ maskImage: `url('${imgMaxT12}')` }} />
                  </div>

                  {/* Image details */}
                  <div className="absolute bottom-[32px] left-[-255px] flex items-end gap-[12px]" data-name="Image details">
                    <div className="flex flex-col gap-[4px] text-right">
                      <p className="font-semibold text-white text-[14px] leading-[20px]">This is me</p>
                      <p className="font-normal opacity-80 text-[#c7c1cc] text-[14px] leading-[20px]">Currently UX Lead at Volvo Group</p>
                    </div>
                    <div className="h-[81.5px] w-[39px] flex-shrink-0">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 87">
                        <path d={svgPaths.pec1c610} fill="#E4BE3A" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[calc(100%-2rem)] sm:w-[440px] max-w-[440px]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <div className="bg-[#1a0a2e] rounded-[16px] overflow-hidden">
                <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                
                {/* Content */}
                <div className="p-[24px] sm:p-[32px] flex flex-col gap-[24px]">
                  {/* Header */}
                  <div className="flex flex-col gap-[8px]">
                    <h2 id="modal-title" className="font-semibold text-[18px] sm:text-[20px] leading-[26px] sm:leading-[28px] text-white">
                      Start over?
                    </h2>
                    <p id="modal-description" className="font-normal text-[14px] leading-[20px] text-[#c7c1cc]">
                      This will clear your current conversation and return you to the home screen.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-[12px] sm:justify-end">
                    <button
                      onClick={handleResetCancel}
                      className="px-[20px] py-[12px] sm:py-[10px] rounded-[8px] font-medium text-[14px] leading-[20px] text-[#c7c1cc] hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.1)] active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgba(255,255,255,0.2)] focus:ring-opacity-50 min-h-[44px]"
                    >
                      Keep chatting
                    </button>
                    <button
                      onClick={handleResetConfirm}
                      className="px-[20px] py-[12px] sm:py-[10px] rounded-[8px] bg-[#7339ff] hover:bg-[#5e2dd9] focus:bg-[#5e2dd9] active:bg-[#4d24b8] active:scale-95 font-medium text-[14px] leading-[20px] text-white transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 min-h-[44px]"
                    >
                      Start over
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
