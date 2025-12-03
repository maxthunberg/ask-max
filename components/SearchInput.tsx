"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../imports/svg-sevsv6x2yc";
import { Loader2 } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  showDisclaimer?: boolean;
  theme?: 'light' | 'dark';
  disclaimerText?: string;
  language?: string;
  showPlaceholderSkeleton?: boolean;
  showDisclaimerSkeleton?: boolean;
  isChatMode?: boolean;
}

export interface SearchInputRef {
  focus: () => void;
}

const BASE_TEXT_EN = "Ask me about ";
const ROTATING_WORDS_EN = [
  "UX",
  "leadership",
  "designing systems",
  "golf",
  "whatever you feel like"
];

const BASE_TEXT_SV = "Fråga mig om ";
const ROTATING_WORDS_SV = [
  "UX",
  "ledarskap",
  "att designa system",
  "golf",
  "vad du vill"
];

export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>((props, ref) => {
  const {
    value,
    onChange,
    onSubmit,
    placeholder = "Ask me about UX, leadership or whatever you feel like",
    disabled = false,
    isLoading = false,
    showDisclaimer = false,
    theme = 'dark',
    disclaimerText = "Just like the real Max, my digital twin can also make mistakes.",
    language = 'en',
    showPlaceholderSkeleton = false,
    showDisclaimerSkeleton = false,
    isChatMode = false,
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const uniqueId = useRef(`search-input-${Math.random().toString(36).substr(2, 9)}`);
  
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Theme colors
  const colors = {
    inputBg: theme === 'light' ? '#e8e8ed' : '#21123c',
    inputBgHover: theme === 'light' ? '#dcdce0' : '#271641',
    inputBgFocus: theme === 'light' ? '#d1d1d6' : '#2d1f4d',
    border: theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : '#4d4164',
    borderHover: theme === 'light' ? 'rgba(0, 0, 0, 0.3)' : '#968fa6',
    borderFocus: theme === 'light' ? 'rgba(115, 57, 255, 0.8)' : '#ffffff',
    textPrimary: theme === 'light' ? '#1d1d1f' : '#ffffff',
    textSecondary: theme === 'light' ? '#6e6e73' : '#c7c1cc',
  };

  // Expose focus method to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    }
  }));

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Typing and deleting animation effect
  useEffect(() => {
    // If in chat mode, show static text instead of animating
    if (isChatMode) {
      const staticText = language === 'sv' 
        ? 'Fråga mig om vad du vill' 
        : 'Ask me about whatever you feel like';
      setDisplayedPlaceholder(staticText);
      return;
    }

    // Select the correct base text and rotating words based on language
    const BASE_TEXT = language === 'sv' ? BASE_TEXT_SV : BASE_TEXT_EN;
    const ROTATING_WORDS = language === 'sv' ? ROTATING_WORDS_SV : ROTATING_WORDS_EN;
    
    const targetWord = ROTATING_WORDS[currentPlaceholderIndex];
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const animate = () => {
      if (!isDeleting) {
        // Typing phase
        if (charIndex <= targetWord.length) {
          setDisplayedPlaceholder(BASE_TEXT + targetWord.slice(0, charIndex));
          charIndex++;
          timeoutId = setTimeout(animate, 80); // Type speed
        } else {
          // Finished typing, wait before deleting
          timeoutId = setTimeout(() => {
            isDeleting = true;
            charIndex = targetWord.length;
            animate();
          }, 2000); // Pause at the end
        }
      } else {
        // Deleting phase
        if (charIndex > 0) {
          setDisplayedPlaceholder(BASE_TEXT + targetWord.slice(0, charIndex));
          charIndex--;
          timeoutId = setTimeout(animate, 50); // Delete speed (faster)
        } else {
          // Finished deleting, move to next word
          setCurrentPlaceholderIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        }
      }
    };

    animate();

    return () => clearTimeout(timeoutId);
  }, [currentPlaceholderIndex, language, isChatMode]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Ctrl+A / Cmd+A to select all text
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      // Let the default behavior happen (select all)
      // This is the standard behavior, but we ensure nothing else interferes
      return;
    }
    
    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleFieldClick = (e: React.MouseEvent) => {
    // Only focus if clicking on the container itself, not the textarea
    // and if there's no text selection happening
    if (e.target === e.currentTarget && !window.getSelection()?.toString()) {
      textareaRef.current?.focus();
    }
  };

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start w-full">
      <style dangerouslySetInnerHTML={{__html: `
        #${uniqueId.current}::placeholder {
          color: ${colors.textSecondary};
          opacity: 0.7;
        }
      `}} />
      <div 
        onClick={handleFieldClick}
        className="transition-colors duration-200 box-border content-stretch flex gap-[12px] items-start pl-[12px] pr-[56px] py-[16px] relative rounded-[12px] w-full cursor-text group" 
        style={{
          backgroundColor: colors.inputBg,
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.querySelector('textarea:focus')) {
            e.currentTarget.style.backgroundColor = colors.inputBgHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.querySelector('textarea:focus')) {
            e.currentTarget.style.backgroundColor = colors.inputBg;
          }
        }}
        data-name="Search input"
        role="search"
      >
        <div 
          aria-hidden="true" 
          className="absolute border border-solid inset-0 pointer-events-none rounded-[12px] transition-colors duration-200" 
          style={{
            borderColor: colors.border,
          }}
        />
        
        {/* Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSubmit();
          }}
          disabled={isLoading || !value.trim() || disabled}
          className="absolute bg-[#7339ff] hover:bg-[#5e2dd9] active:bg-[#4d24b8] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bottom-[8px] box-border flex items-center justify-center p-[8px] right-[8px] rounded-[8px] transition-all duration-200 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 w-[40px] h-[40px]"
          data-name="Button Primary"
          aria-label={isLoading ? "Sending message..." : "Send message"}
        >
          <div className="relative shrink-0 size-[24px]" data-name="Frame" aria-hidden="true">
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-[#F6F7FC] animate-spin" />
            ) : (
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d={svgPaths.p35129400} stroke="var(--stroke-0, #F6F7FC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            )}
          </div>
        </button>

        {/* Textarea */}
        <div className="basis-0 grow min-w-px relative flex items-center">
          <textarea
            id={uniqueId.current}
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              const parent = e.currentTarget.parentElement?.parentElement;
              if (parent) {
                parent.style.backgroundColor = colors.inputBgFocus;
                const border = parent.querySelector('[aria-hidden="true"]') as HTMLElement;
                if (border) {
                  border.style.borderColor = colors.borderFocus;
                }
              }
            }}
            onBlur={(e) => {
              const parent = e.currentTarget.parentElement?.parentElement;
              if (parent) {
                parent.style.backgroundColor = colors.inputBg;
                const border = parent.querySelector('[aria-hidden="true"]') as HTMLElement;
                if (border) {
                  border.style.borderColor = colors.border;
                }
              }
            }}
            placeholder={displayedPlaceholder}
            disabled={disabled}
            rows={1}
            className="basis-0 font-normal grow leading-[24px] min-h-[24px] min-w-px relative shrink-0 text-[16px] bg-transparent border-none outline-none resize-none overflow-hidden max-h-[200px] transition-colors duration-200"
            style={{
              color: colors.textPrimary,
            }}
            aria-label="Ask Max a question"
            aria-describedby="disclaimer-text"
          />
          {showPlaceholderSkeleton && (
            <div 
              className="absolute inset-0 rounded pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(115, 57, 255, 0.6) 50%, transparent 100%)',
                animation: 'shimmer 1s ease-in-out',
              }}
            />
          )}
        </div>
      </div>

      {/* Disclaimer text */}
      {showDisclaimer && (
        <div className="relative w-full flex justify-center">
          <p 
            id="disclaimer-text" 
            className="font-normal leading-[18px] opacity-70 relative shrink-0 text-[12px] transition-colors duration-200 text-center"
            style={{ color: colors.textSecondary }}
          >
            {disclaimerText}
          </p>
          {showDisclaimerSkeleton && (
            <div 
              className="absolute inset-0 rounded pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(115, 57, 255, 0.6) 50%, transparent 100%)',
                animation: 'shimmer 1s ease-in-out',
              }}
            />
          )}
        </div>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
