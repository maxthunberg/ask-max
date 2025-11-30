import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import svgPaths from "../imports/svg-da725proeg";
import { Loader2 } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  showDisclaimer?: boolean;
}

export interface SearchInputRef {
  focus: () => void;
}

export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask me about UX, leadership or whatever you feel like",
  disabled = false,
  isLoading = false,
  showDisclaimer = false,
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <div 
        onClick={handleFieldClick}
        className="bg-[#21123c] hover:bg-[#271641] focus-within:bg-[#2d1f4d] transition-colors duration-200 box-border content-stretch flex gap-[12px] items-start pl-[12px] pr-[56px] py-[16px] relative rounded-[12px] w-full cursor-text group" 
        data-name="Search input"
        role="search"
      >
        <div 
          aria-hidden="true" 
          className="absolute border border-[#4d4164] group-hover:border-[#968fa6] group-focus-within:border-white transition-colors duration-200 border-solid inset-0 pointer-events-none rounded-[12px]" 
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
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="basis-0 font-['Figtree:Regular',sans-serif] font-normal grow leading-[24px] min-h-[24px] min-w-px relative shrink-0 text-[16px] bg-transparent border-none outline-none resize-none overflow-hidden text-white placeholder:text-[#c7c1cc] placeholder:opacity-70 max-h-[200px]"
          aria-label="Ask Max a question"
          aria-describedby="disclaimer-text"
        />
      </div>

      {/* Disclaimer text */}
      {showDisclaimer && (
        <p id="disclaimer-text" className="font-['Figtree:Regular',sans-serif] font-normal leading-[18px] opacity-70 relative shrink-0 text-[#c7c1cc] text-[12px] w-full">
          Just like the real Max, my digital twin can also make mistakes.
        </p>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';