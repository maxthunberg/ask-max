// Simple bordered icons for Coming Soon features
import { Brain, Image, BookOpen, Mic } from 'lucide-react';

interface IconWrapperProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

const IconWrapper = ({ children, theme = 'dark' }: IconWrapperProps) => (
  <div className="relative size-[48px]" data-name="Icon">
    <div 
      className="absolute border border-solid left-0 rounded-[12px] size-[48px] top-0" 
      style={{ borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : '#4d4164' }}
    />
    <div className="absolute left-[12px] size-[24px] top-[12px]" data-name="Frame">
      {children}
    </div>
  </div>
);

export const BrainIllustration = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => (
  <IconWrapper theme={theme}>
    <Brain 
      className="w-6 h-6" 
      stroke="white" 
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const ImageIllustration = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => (
  <IconWrapper theme={theme}>
    <Image 
      className="w-6 h-6" 
      stroke="white" 
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const BookIllustration = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => (
  <IconWrapper theme={theme}>
    <BookOpen 
      className="w-6 h-6" 
      stroke="white" 
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const MicIllustration = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => (
  <IconWrapper theme={theme}>
    <Mic 
      className="w-6 h-6" 
      stroke="white" 
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);