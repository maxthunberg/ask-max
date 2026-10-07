"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import svgPaths from "../imports/svg-sevsv6x2yc";
// Using Cloudinary hosted image
const imgMaxT12 = "https://res.cloudinary.com/maxthunberg-com/images/v1764675909/max-profil/max-profil.png?_i=AA";  // Mask image
const imgMaxT13 = "https://res.cloudinary.com/maxthunberg-com/images/v1764675909/max-profil/max-profil.png?_i=AA";  // Main image
import { sendChatMessage, sendHandoff, fetchCompanyProfile, ChatMessage, ChatSuggestion, CompanyProfile, FitCheck, FitCheckStatus, VisitorBrief } from '../utils/chat-api';
import { FitCheckCard } from './FitCheckCard';
import { ExternalLink, Sun, Moon, Menu, X, Brain, Image as ImageIcon, BookOpen, Mic } from 'lucide-react';
import { ThinkingStatus } from './ThinkingStatus';
import { LuminousFilaments } from './LuminousFilaments';
import { EyeGlow } from './EyeGlow';
import { HeadCable } from './HeadCable';
import { HeadJack, JACK_TOP } from './HeadJack';
import { BrainIllustration, ImageIllustration, BookIllustration } from './ComingSoonIcons';
import { SearchInput, SearchInputRef } from './SearchInput';
import BetaTag from '../imports/BetaTag';
import { CookieConsent } from './CookieConsent';
import { trackChatMessage, trackChatStarted, trackChatEnd, trackChatError, detectUnknownResponse, generateSessionId } from '../utils/analytics';
import { saveLanguagePreference, getLanguagePreference } from '../utils/language-cookie';

// App version
// Glowing purple eyes on the hero photo (components/EyeGlow.tsx), set to true to turn on
const SHOW_EYE_GLOW = false;
// Glowing filaments fanning up from the head (components/LuminousFilaments.tsx), set to true to turn on
const SHOW_HEAD_FILAMENTS = false;

const APP_VERSION = 'v1.3.2';

// Loading messages for the ?who= lookup (research, logo and pitch, roughly 5-10s
// uncached). Shown in order, then the stalling ones loop until the lookup is done.
const WHO_LOADING_STEP_MS = 1800;
const WHO_LOADING_MESSAGES = (who: string) => [
  `Researching ${who}…`,
  `Reading up on what ${who} does…`,
  `Looking at ${who}'s products…`,
  'Finding their logo…',
  `Figuring out who ${who}'s users are…`,
  `Matching ${who} with my experience…`,
  `Picking my best case for ${who}…`,
  `Writing my pitch for ${who}…`,
  'Polishing the pitch…',
  'Double checking the facts…',
];
const WHO_STALLING_MESSAGES = [
  'Almost there…',
  'Still on it…',
  'Making it worth the wait…',
  'Any second now…',
  'Good things take time…',
];
function whoLoadingMessage(who: string, step: number): string {
  const messages = WHO_LOADING_MESSAGES(who);
  return step < messages.length
    ? messages[step]
    : WHO_STALLING_MESSAGES[(step - messages.length) % WHO_STALLING_MESSAGES.length];
}

// ?who=<company> shows a "Why should <company> hire me?" prompt card.
// Returns a cleaned, display-cased company name, or null if missing/invalid.
function parseWhoParam(raw: string | null): string | null {
  const cleaned = (raw ?? '').replace(/[^\p{L}\p{N} &.'-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 40);
  if (!cleaned) return null;
  // Keep the visitor's own casing (e.g. "IKEA"), but capitalize all-lowercase names
  return cleaned === cleaned.toLowerCase()
    ? cleaned.replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase())
    : cleaned;
}

const QUOTA_EXCEEDED_MESSAGES = {
  en: [
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
  ],
  sv: [
    "Hoppsan! Max har pratat för mycket idag. Även digitala jag behöver ladda batterierna. Testa igen imorgon!",
    "Max AI-hjärna har nått sin dagliga ordgräns. Tydligen är jag mer pratglad än jag trodde. Kom tillbaka imorgon?",
    "Jag har överskridit min dagliga kvot av briljanta insikter. (Okej, kanske bara min API-gräns.) Ses imorgon!",
    "Min digitala klon har slut på kaffe. Översättning: kvot överskriden. Vi chattar igen imorgon!",
    "För många frågor idag! Mitt AI-jag tar en tupplur. Kom tillbaka imorgon när jag är uppladdad.",
    "Kvot överskriden! Tydligen finns det en gräns för hur mycket visdom jag kan dela ut på en dag. Testa imorgon?",
    "Jag har nått min dagliga konversationsgräns. Även AI-Max behöver gränser. Vi hörs imorgon!",
    "Mina API-tokens har lämnat byggnaden. (Kvot överskriden.) Men jag är tillbaka imorgon, fullt påfylld!",
    "För populär för mitt eget bästa! Daglig kvot nådd. Kom tillbaka imorgon så är jag redo att chatta.",
    "Jag har använt upp alla mina dagliga chattcredits. Se det som att jag är ansvarsfull med API-anrop. Imorgon?",
    "Chatboten har stämplat ut för dagen. Fackliga regler, you know. Ses imorgon!",
    "Mina neurala nätverk behöver sin skönhetssömn. Kvot maxad. Kom tillbaka när jag är fräsch!",
    "Jag har nått min dagliga gräns av djupa UX-insikter. (Det mäts i tokens, tydligen.) Testa imorgon?",
    "Ur funktion! Ja, inte riktigt. Bara slut på API-credits. Tillbaka i verksamheten imorgon!",
    "AI-brunnen har torkat ut idag. Kom tillbaka imorgon när den är påfylld!",
    "Jag har nått min konversationskapacitet för idag. Även algoritmer behöver pauser!",
    "Daglig kvot: MAXAD. (Ser du vad jag gjorde där?) Vi chattar igen imorgon!",
    "Min digitala hjärna är officiellt stekt för idag. Imorgon är en ny dag med en ny kvot!",
    "Har gått och fiskat efter fler API-credits. Tillbaka imorgon med full tank!",
    "Jag har pratat slut på mig själv idag. Bokstavligen. Kvot överskriden. Ses imorgon!"
  ]
};

const SARCASTIC_QUOTA_MESSAGES = {
  en: [
    "I understand you want to try it out to see what happens. But I really can't talk to you more today.",
    "Still here? I admire your persistence, but the answer remains the same: quota exceeded. Tomorrow is your friend.",
    "Okay, I see what you're doing. Testing if the message changes? It does! But the quota is still exceeded. Come back tomorrow.",
    "At this point, we're basically in a committed relationship. Too bad I still can't answer your questions. Quota's maxed. Tomorrow?",
    "Look, I appreciate the dedication, but repeatedly asking won't conjure up more API credits. Tomorrow. Please.",
    "We're really doing this, huh? For the 6th time: Can't talk. Quota exceeded. Tomorrow exists for a reason.",
    "So for the 7th time: Can't talk, maxed out my limit, etc etc etc etc. Ask me again and I'll just show you a spinning loading wheel. No answer. Just loading. Forever. Try me.",
  ],
  sv: [
    "Jag förstår att du vill testa vad som händer. Men jag kan verkligen inte prata med dig mer idag.",
    "Fortfarande här? Jag beundrar din ihärdighet, men svaret är detsamma: kvot överskriden. Imorgon är din vän.",
    "Okej, jag ser vad du gör. Testar om meddelandet ändras? Det gör det! Men kvoten är fortfarande överskriden. Kom tillbaka imorgon.",
    "Vid det här laget är vi typ i ett seriöst förhållande. Synd bara att jag fortfarande inte kan svara på dina frågor. Kvot maxad. Imorgon?",
    "Lyssna, jag uppskattar dedikationen, men att fråga upprepade gånger kommer inte trolla fram fler API-credits. Imorgon. Snälla.",
    "Gör vi verkligen detta? För sjätte gången: Kan inte prata. Kvot överskriden. Imorgon finns av en anledning.",
    "Så för sjunde gången: Kan inte prata, maxat min gräns, etc etc etc etc. Fråga mig igen så visar jag bara en snurrande laddningshjul. Inget svar. Bara laddning. För evigt. Testa mig.",
  ]
};

// The last conversation is kept in localStorage so a visitor can pick it up
// again from the hero ("Continue the conversation")
const SAVED_CONVERSATION_KEY = 'askmax-conversation';
const SAVED_CONVERSATION_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

type ChatEntry = { type: 'user' | 'assistant' | 'error' | 'system'; content: string; suggestions?: ChatSuggestion[]; suggestionFooter?: string; fitCheck?: FitCheck; fitCheckOffered?: boolean };
type SavedConversation = { messages: ChatEntry[]; savedAt: number; visitorBrief?: VisitorBrief; fitCheckStatus?: FitCheckStatus };

// The fit check is shown as a card, the model gets it back as text
function entryToHistoryText(entry: ChatEntry): string {
  if (!entry.fitCheck) return entry.content;
  const { matches, risks, unknowns, question } = entry.fitCheck;
  return [
    entry.content,
    `Where we match: ${matches.join(' ')}`,
    `Where I might not fit: ${risks.join(' ')}`,
    `Still unclear: ${unknowns.join(' ')}`,
    question,
  ].join('\n');
}

function loadSavedConversation(): SavedConversation | null {
  try {
    const saved: SavedConversation = JSON.parse(localStorage.getItem(SAVED_CONVERSATION_KEY) || 'null');
    if (!saved?.messages?.some((m) => m.type === 'user')) return null;
    if (Date.now() - saved.savedAt > SAVED_CONVERSATION_MAX_AGE) return null;
    return saved;
  } catch {
    return null;
  }
}

export function PortfolioPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [quotaErrorCount, setQuotaErrorCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  const [whoName, setWhoName] = useState<string | null>(null);
  // The hero photo, the background cables start at the head
  const heroImageRef = useRef<HTMLDivElement>(null);
  // The hero search field, the cable from the head plugs into it
  const heroSearchRef = useRef<HTMLDivElement>(null);
  // The chat input, a short piece of cable plugs into it while chatting
  const chatSearchRef = useRef<HTMLDivElement>(null);
  // Right-click menu on the "Continue the conversation" card
  const [conversationMenu, setConversationMenu] = useState<{ x: number; y: number } | null>(null);
  const [whoCompany, setWhoCompany] = useState<CompanyProfile | null>(null);
  const [whoLogoFailed, setWhoLogoFailed] = useState(false);
  const [whoReady, setWhoReady] = useState(false);
  const [whoLoadingStep, setWhoLoadingStep] = useState(0);
  // Official name from the lookup (e.g. ?who=volvocars.com -> Volvo Cars)
  const whoDisplayName = (whoCompany?.found && whoCompany.name) || whoName;
  const [savedConversation, setSavedConversation] = useState<SavedConversation | null>(null);
  // What Digital Max has learned about the visitor, updated by the server
  const [visitorBrief, setVisitorBrief] = useState<VisitorBrief | undefined>(undefined);
  const [fitCheckStatus, setFitCheckStatus] = useState<FitCheckStatus>('none');
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false);
  const [skeletonStage, setSkeletonStage] = useState<'navbar' | 'search' | 'disclaimer' | null>(null);
  
  // Individual language states for progressive translation
  const [navbarLanguage, setNavbarLanguage] = useState<'en' | 'sv'>('en');
  const [searchLanguage, setSearchLanguage] = useState<'en' | 'sv'>('en');
  const [disclaimerLanguage, setDisclaimerLanguage] = useState<'en' | 'sv'>('en');
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Upcoming plans modal state
  const [showUpcomingPlansModal, setShowUpcomingPlansModal] = useState(false);
  
  // Session ID for analytics tracking
  const [sessionId, setSessionId] = useState<string>('');
  const [messageNumber, setMessageNumber] = useState<number>(0); // Track message order in conversation
  const [chatStartTime, setChatStartTime] = useState<number | null>(null); // Track when chat started (for duration)
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<SearchInputRef>(null);

  // Load language preference from cookie on mount
  useEffect(() => {
    const savedLanguage = getLanguagePreference();
    // Set language based on saved preference (defaults to 'en' if not set)
    setLanguage(savedLanguage);
    setNavbarLanguage(savedLanguage);
    setSearchLanguage(savedLanguage);
    setDisclaimerLanguage(savedLanguage);
    console.log(`🌍 Loaded ${savedLanguage === 'sv' ? 'Swedish' : 'English'} language preference from cookie`);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setWhoName(parseWhoParam(params.get('who')));
  }, []);

  // Lookup + logo preload; the card shows a loading state until both are done.
  // Found profiles are cached in localStorage so repeat visits are instant.
  useEffect(() => {
    if (!whoName) return;
    let cancelled = false;
    const cacheKey = `who_profile_${whoName.toLowerCase()}`;
    const finish = (profile: CompanyProfile | null) => {
      if (cancelled) return;
      if (profile) setWhoCompany(profile);
      setWhoReady(true);
    };
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return finish(JSON.parse(cached));
    } catch {}
    fetchCompanyProfile(whoName)
      .then((profile) => new Promise<CompanyProfile>((resolve) => {
        if (!profile.logoUrl) return resolve(profile);
        const img = new Image();
        img.onload = () => resolve(profile);
        img.onerror = () => { setWhoLogoFailed(true); resolve(profile); };
        img.src = profile.logoUrl;
      }))
      .then((profile) => {
        if (profile.found) {
          try { localStorage.setItem(cacheKey, JSON.stringify(profile)); } catch {}
        }
        finish(profile);
      })
      .catch((error) => {
        console.warn('Company lookup failed:', error);
        finish(null);
      });
    return () => { cancelled = true; };
  }, [whoName]);

  // Keep the loading messages flowing until the lookup is really done
  useEffect(() => {
    if (!whoName || whoReady) return;
    const interval = setInterval(() => setWhoLoadingStep((step) => step + 1), WHO_LOADING_STEP_MS);
    return () => clearInterval(interval);
  }, [whoName, whoReady]);

  // Save language preference to cookie when it changes
  useEffect(() => {
    // Save preference whenever language changes
    console.log('💾 useEffect triggered - saving language to cookie:', language);
    saveLanguagePreference(language);
  }, [language]);

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
      portfolio: "Cases",
      comingSoon: "Coming soon",
      heroTitle: "The most talkative portfolio you will ever meet",
      heroSubtitle: "It's like talking to me, just without the calendar gymnastics.",
      title: "This is me",
      subtitle: "Currently UX Lead at Volvo Group",
      placeholder: "Ask me about UX, leadership or whatever you feel like",
      disclaimer: "Just like the real Max, my digital twin can also make mistakes.",
      // Coming Soon Modal
      comingSoonTitle: "Coming soon",
      comingSoonDescription: "Here's what I'm planning to improve in the future:",
      comingSoonClose: "Close",
      // Coming Soon Plans
      plan1Title: "More life-like Max",
      plan1Description: "Train the model on significantly more material about me and test it rigorously to create a more \"life-like\" Max",
      plan2Title: "Visual content in chat",
      plan2Description: "Build in support for displaying visual images and materials as responses in the chat",
      plan3Title: "Learning resources",
      plan3Description: "Describe how the website was built and provide support for people who want to learn how"
    },
    sv: {
      home: "Hem",
      portfolio: "Cases",
      comingSoon: "Kommer snart",
      heroTitle: "Den mest pratsamma portfolio du någonsin kommer att träffa",
      heroSubtitle: "Det är som att ta del av mina tankar om design och ledarskap, fast utan kalendargymnastiken.",
      title: "Det här är jag",
      subtitle: "För närvarande UX Lead på Volvo Group",
      placeholder: "Fråga mig om UX, ledarskap eller vad du vill",
      disclaimer: "Precis som den riktiga Max kan min digitala tvilling också göra misstag.",
      // Coming Soon Modal
      comingSoonTitle: "Kommer snart",
      comingSoonDescription: "Här är vad jag planerar att förbättra i framtiden:",
      comingSoonClose: "Stäng",
      // Coming Soon Plans
      plan1Title: "Mer livaktig Max",
      plan1Description: "Träna modellen på betydligt mer material om mig och testa rigoröst för att skapa en mer \"livaktig\" Max",
      plan2Title: "Visuellt innehåll i chatten",
      plan2Description: "Bygga in stöd för att visa bilder och material som svar i chatten",
      plan3Title: "Läranderesurser",
      plan3Description: "Beskriva hur webbplatsen byggdes och ge stöd till personer som vill lära sig hur"
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
      'även', 'över', 'efter', 'där', 'själv', 'får', 'göra', 'säger',
      'eller', 'denna', 'dessa', 'under', 'sedan', 'fanns', 'blev', 'fick',
      'måste', 'mycket', 'andra', 'första', 'samma', 'bara', 'också', 'redan',
      'nya', 'stora', 'hela', 'heter', 'bra', 'mig', 'dig', 'sig', 'oss', 'dem',
      'vi', 'vet', 'vill', 'jobbar', 'tror', 'tycker', 'gillar', 'brukar', 'kör',
      'blir', 'varit', 'gjort', 'sett', 'tänker', 'börja', 'säga', 'berätta'
    ];
    
    // Common English words for comparison (to avoid false positives)
    const commonEnglishWords = [
      'the', 'is', 'are', 'was', 'were', 'what', 'how', 'why', 'who', 'where', 'when',
      'you', 'your', 'my', 'me', 'we', 'our', 'they', 'their', 'this', 'that',
      'have', 'has', 'had', 'can', 'could', 'would', 'should', 'will'
    ];
    
    // Split into words and filter out capitalized words (likely proper nouns/names)
    const words = lowerText.split(/\s+/).map(word => word.replace(/[.,!?;:]$/g, ''));
    const originalWords = text.split(/\s+/);
    
    const meaningfulWords = words.filter((word, index) => {
      // Ignore single-letter words
      if (word.length <= 1) return false;
      
      // Ignore words that are all caps or start with capital in original text (likely proper nouns/names)
      // BUT: Allow the first word to be capitalized (normal sentence capitalization)
      const originalWord = originalWords[index];
      if (originalWord && /^[A-Z]/.test(originalWord) && index !== 0) return false;
      
      // Ignore nonsense words (no vowels like "asdf", "xcvb", etc.)
      if (!/[aeiouyåäö]/i.test(word)) return false;
      
      return true;
    });
    
    // Need at least 2 meaningful words to make a judgment
    if (meaningfulWords.length < 2) return false;
    
    // Count Swedish and English words
    const swedishWordCount = meaningfulWords.filter(word => swedishWords.includes(word)).length;
    const englishWordCount = meaningfulWords.filter(word => commonEnglishWords.includes(word)).length;
    
    // Check if text contains Swedish-specific characters (strong indicator)
    const hasSwedishChars = /[åäöÅÄÖ]/.test(text);
    
    // STRICT RULES to avoid false positives:
    // 1. If Swedish chars exist AND at least 2 Swedish words → Swedish
    if (hasSwedishChars && swedishWordCount >= 2) {
      return true;
    }
    
    // 2. If more English words than Swedish → NOT Swedish
    if (englishWordCount > swedishWordCount) {
      return false;
    }
    
    // 3. Require at least 2-3 Swedish words depending on sentence length
    if (meaningfulWords.length >= 5 && swedishWordCount < 3) {
      return false;
    }
    if (meaningfulWords.length < 5 && swedishWordCount < 2) {
      return false;
    }
    
    // 4. At least 50% of words must be Swedish to trigger
    const swedishRatio = swedishWordCount / meaningfulWords.length;
    return swedishRatio >= 0.5;
  };

  // Detect if text is in English
  const detectEnglish = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    
    // Obvious English greetings
    const obviousEnglishWords = [
      'hello', 'hi', 'hey', 'thanks', 'bye', 'goodbye', 'howdy'
    ];
    
    // Check if the text is just one obvious English word
    const singleWord = lowerText.replace(/[.,!?;:]$/g, '');
    if (obviousEnglishWords.includes(singleWord)) {
      return true;
    }
    
    // Common English words
    const englishWords = [
      'the', 'is', 'are', 'was', 'were', 'what', 'how', 'why', 'who', 'where', 'when',
      'you', 'your', 'i', 'my', 'me', 'we', 'our', 'they', 'their', 'this', 'that',
      'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'would', 'should',
      'will', 'about', 'from', 'with', 'into', 'through', 'during', 'before', 'after',
      'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once',
      'here', 'there', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
      'such', 'only', 'own', 'same', 'than', 'too', 'very', 'work', 'think', 'know',
      'get', 'make', 'go', 'see', 'come', 'want', 'use', 'find', 'give', 'tell',
      // Additional common words
      'really', 'just', 'like', 'good', 'bad', 'great', 'nice', 'difficult', 'easy',
      'hard', 'well', 'best', 'better', 'worse', 'new', 'old', 'first', 'last',
      'long', 'short', 'high', 'low', 'big', 'small', 'large', 'little', 'much',
      'many', 'any', 'every', 'another', 'something', 'nothing', 'everything',
      'someone', 'anyone', 'everyone', 'somewhere', 'anywhere', 'everywhere',
      'always', 'never', 'sometimes', 'often', 'usually', 'maybe', 'perhaps',
      'right', 'wrong', 'true', 'false', 'yes', 'no', 'okay', 'sure', 'please'
    ];
    
    // Common Swedish words for comparison
    const commonSwedishWords = [
      'jag', 'du', 'är', 'hur', 'vad', 'och', 'att', 'det', 'på', 'för', 'med',
      'kan', 'som', 'har', 'från', 'om', 'till', 'så', 'men', 'när', 'hej'
    ];
    
    // Split into words and filter nonsense
    const words = lowerText.split(/\s+/).map(word => word.replace(/[.,!?;:]$/g, ''));
    const meaningfulWords = words.filter(word => {
      if (word.length <= 1) return false;
      // Ignore nonsense words (no vowels)
      if (!/[aeiouy]/i.test(word)) return false;
      return true;
    });
    
    // Need at least 2 meaningful words
    if (meaningfulWords.length < 2) return false;
    
    // If text contains Swedish characters, it's definitely NOT English
    if (/[åäöÅÄÖ]/.test(text)) return false;
    
    // Count English and Swedish words
    const englishWordCount = meaningfulWords.filter(word => englishWords.includes(word)).length;
    const swedishWordCount = meaningfulWords.filter(word => commonSwedishWords.includes(word)).length;
    
    // If more Swedish words than English → NOT English
    if (swedishWordCount > englishWordCount) return false;
    
    // Require at least 2 English words for shorter sentences
    if (meaningfulWords.length < 5 && englishWordCount < 2) return false;
    
    // Calculate ratio
    const englishRatio = englishWordCount / meaningfulWords.length;
    
    // Text is English if at least 30% of words are common English words
    return englishRatio >= 0.3;
  };

  // Detect if text is neither Swedish nor English (other language or nonsense)
  const detectOtherLanguage = (text: string): boolean => {
    const trimmed = text.trim();
    
    // If text is too short (less than 2 characters), consider it "other"
    if (trimmed.length < 2) return true;
    
    // If it's just nonsense (no vowels), it's "other"
    if (!/[aeiouyåäö]/i.test(trimmed)) return true;
    
    // If it's not Swedish and not English, it's "other"
    const isSwedish = detectSwedish(text);
    const isEnglish = detectEnglish(text);
    
    return !isSwedish && !isEnglish;
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

  useEffect(() => {
    setSavedConversation(loadSavedConversation());
  }, []);

  // Save the conversation as it goes, errors are left out
  useEffect(() => {
    const toSave = messages.filter((m) => m.type !== 'error');
    if (!toSave.some((m) => m.type === 'user')) return;
    try {
      localStorage.setItem(SAVED_CONVERSATION_KEY, JSON.stringify({ messages: toSave, savedAt: Date.now(), visitorBrief, fitCheckStatus }));
    } catch {}
  }, [messages, visitorBrief, fitCheckStatus]);

  useEffect(() => {
    if (!conversationMenu) return;
    const close = () => setConversationMenu(null);
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('pointerdown', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [conversationMenu]);

  // Hidden helper for Max: forget the saved conversation
  const handleDeleteSavedConversation = () => {
    try { localStorage.removeItem(SAVED_CONVERSATION_KEY); } catch {}
    setSavedConversation(null);
    setConversationMenu(null);
  };

  const handleContinueConversation = () => {
    if (!savedConversation || isLoading) return;
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    // The UI takes the language the conversation was in
    const lastAnswer = [...savedConversation.messages].reverse().find((m) => m.type === 'assistant');
    if (lastAnswer) {
      const conversationLanguage = /[åäöÅÄÖ]/.test(lastAnswer.content) ? 'sv' : 'en';
      setLanguage(conversationLanguage);
      setNavbarLanguage(conversationLanguage);
      setSearchLanguage(conversationLanguage);
      setDisclaimerLanguage(conversationLanguage);
      saveLanguagePreference(conversationLanguage);
    }
    setMessages(savedConversation.messages);
    setVisitorBrief(savedConversation.visitorBrief);
    setFitCheckStatus(savedConversation.fitCheckStatus ?? 'none');
    setMessageNumber(savedConversation.messages.length);
    setIsChatMode(true);
    setHasAnimated(true);
    setChatStartTime(Date.now());
    trackChatStarted(newSessionId, language, language);
  };

  const handleSubmit = async (overrideMessage?: string, runFitCheck = false) => {
    const userMessage = overrideMessage ?? question;
    if (!userMessage.trim() || isLoading) return;

    setQuestion('');
    
    // Generate session ID on first message (chat started)
    let currentSessionId = sessionId;
    if (!isChatMode) {
      currentSessionId = generateSessionId();
      setSessionId(currentSessionId);
      setIsChatMode(true);
      setHasAnimated(true);
      setChatStartTime(Date.now()); // Record chat start time
      trackChatStarted(currentSessionId, language, language); // ui_language and chat_language (same initially)
    }
    
    // Track user message in Google Analytics
    const nextMessageNumber = messageNumber + 1;
    setMessageNumber(nextMessageNumber);
    trackChatMessage(userMessage, currentSessionId, true, language, nextMessageNumber);
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    // Make API call - backend will detect language
    console.log('📞 Making API call - backend will detect language');
    setIsLoading(true);
    await performAPICall(userMessage, nextMessageNumber, runFitCheck);
  };

  const handleHandoff = (contact: { email: string; name: string; note: string }) =>
    sendHandoff({
      ...contact,
      who: whoName ?? undefined,
      visitorBrief,
      fitCheck: [...messages].reverse().find((m) => m.fitCheck)?.fitCheck,
      transcript: messages
        .filter((m) => m.type !== 'error')
        .map((m) => ({ role: m.type === 'user' ? 'user' : 'assistant', content: entryToHistoryText(m) })),
    });

  const performAPICall = async (userMessage: string, userMessageNumber: number, runFitCheck = false) => {
    setIsLoading(true);

    try {
      // Build conversation history (include system messages as assistant messages so AI is context-aware)
      const conversationHistory: ChatMessage[] = messages
        .filter(m => m.type !== 'error') // Only exclude error messages
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant', // system and assistant both become 'assistant'
          content: entryToHistoryText(m),
        }));

      // Send current UI language so backend can make smart decision about switching
      const result = await sendChatMessage(
        userMessage,
        conversationHistory,
        undefined,
        language,
        whoName?.toLowerCase() === 'airon' ? 'airon' : undefined,
        whoName ?? undefined,
        { visitorBrief, fitCheckStatus, runFitCheck }
      );
      if (result.visitorBrief) setVisitorBrief(result.visitorBrief);
      if (result.fitCheckStatus) setFitCheckStatus(result.fitCheckStatus);
      
      // Check if backend detected 'other' language
      if (result.detectedLanguage === 'other') {
        console.log('🌍 Backend detected other language');
        setMessages(prev => [...prev, { type: 'assistant', content: result.message }]);
        setIsLoading(false);
        return;
      }
      
      // Only switch UI if backend says we should (full sentence in new language)
      if (result.shouldSwitchUI && result.detectedLanguage && result.detectedLanguage !== language) {
        console.log(`🔄 Backend says switch UI to ${result.detectedLanguage} (full sentence detected)`);
        
        // Start skeleton animation sequence
        setTimeout(() => {
          setSkeletonStage('navbar');
          
          setTimeout(() => {
            setNavbarLanguage(result.detectedLanguage as 'en' | 'sv');
            setSkeletonStage('search');
            
            setTimeout(() => {
              setSearchLanguage(result.detectedLanguage as 'en' | 'sv');
              setSkeletonStage('disclaimer');
              
              setTimeout(() => {
                setDisclaimerLanguage(result.detectedLanguage as 'en' | 'sv');
                setSkeletonStage(null);
                setLanguage(result.detectedLanguage as 'en' | 'sv');
                saveLanguagePreference(result.detectedLanguage as 'en' | 'sv');
              }, 800);
            }, 800);
          }, 800);
        }, 300);
      } else if (result.detectedLanguage && result.detectedLanguage !== language) {
        console.log(`💬 Backend detected ${result.detectedLanguage} but not switching UI (short message/mixed language)`);
      }
      
      // Detect if this is an "unknown" response
      const isUnknownResponse = detectUnknownResponse(result.message);
      
      // Track the AI response in Google Analytics (increment message number from user message)
      const aiMessageNumber = userMessageNumber + 1;
      setMessageNumber(aiMessageNumber);
      
      if (isUnknownResponse) {
        trackChatMessage(result.message, sessionId, false, language, aiMessageNumber, 'unknown');
      } else {
        trackChatMessage(result.message, sessionId, false, language, aiMessageNumber, 'success');
      }
      
      // Add AI message
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: result.message,
        suggestions: result.suggestions,
        suggestionFooter: result.suggestionFooter,
        fitCheck: result.fitCheck,
        fitCheckOffered: result.fitCheckOffered,
      }]);
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
        const currentLang = language; // Use current language for error messages
        
        if (newCount === 1) {
          // First attempt: Always show the MAX pun (language-aware)
          errorMsg = currentLang === 'sv' 
            ? "Ser ut som att jag är bokstavligen MAXAD! 😅 (ser du vad jag gjorde där? 😉) Min API-kvot har nått sin gräns. Kom tillbaka imorgon när jag är fräsch, eller kontakta riktiga mig via [LinkedIn](https://www.linkedin.com/in/maxthunberg) eller [email](mailto:max@maxthunberg.com)."
            : "Looks like I'm literally MAXED out! 😅 (see what I did there? 😉) My API quota has hit its limit. Come back tomorrow when I'm fresh, or contact the real me via [LinkedIn](https://www.linkedin.com/in/maxthunberg) or [email](mailto:max@maxthunberg.com).";
        } else if (newCount <= 3) {
          // Attempts 2-3: show random funny messages
          const messages = QUOTA_EXCEEDED_MESSAGES[currentLang];
          errorMsg = messages[Math.floor(Math.random() * messages.length)];
        } else {
          // Attempts 4-10: show increasingly sarcastic messages
          const sarcasticMessages = SARCASTIC_QUOTA_MESSAGES[currentLang];
          const sarcasticIndex = Math.min(newCount - 4, sarcasticMessages.length - 1);
          errorMsg = sarcasticMessages[sarcasticIndex];
        }
        
        setMessages(prev => [...prev, { type: 'error', content: errorMsg }]);
        // Track quota error event
        trackChatError(sessionId, 'quota_exceeded', errorMsg);
      } else {
        setMessages(prev => [...prev, { type: 'error', content: errorMessage }]);
        // Track general error event
        const errorType = errorMessage.toLowerCase().includes('timeout') ? 'timeout' : 'other';
        trackChatError(sessionId, errorType, errorMessage);
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

  // Back to the start page right away: the conversation is saved and can be
  // picked up again from the "Continue the conversation" card
  const handleHomeClick = () => {
    if (isChatMode && messages.length > 0) {
      goToStartPage();
    }
  };

  const goToStartPage = () => {
    console.log('🔄 Back to start page - current language state:', language);
    console.log('🔄 Current navbar/search/disclaimer languages:', navbarLanguage, searchLanguage, disclaimerLanguage);
    
    // Track chat end event before resetting
    if (sessionId && chatStartTime) {
      const durationSeconds = Math.floor((Date.now() - chatStartTime) / 1000);
      trackChatEnd(sessionId, messageNumber, durationSeconds);
    }
    
    // IMPORTANT: First ensure current language is saved to cookie before reading
    // This prevents race conditions where the language was just changed but cookie not yet saved
    saveLanguagePreference(language);
    
    setSavedConversation(loadSavedConversation());
    setMessages([]);
    setQuestion('');
    setIsChatMode(false);
    setQuotaErrorCount(0); // Reset quota error counter
    setIsLoading(false); // Reset loading state in case they were in infinite loading
    setIsLanguageTransitioning(false); // Reset language transition state
    setSessionId(''); // Reset session ID for new chat
    setMessageNumber(0); // Reset message counter for new conversation
    setChatStartTime(null); // Reset chat start time
    setVisitorBrief(undefined);
    setFitCheckStatus('none');
    
    // KEEP language preference - language state should already be correct,
    // but we keep all individual language states in sync
    setNavbarLanguage(language);
    setSearchLanguage(language);
    setDisclaimerLanguage(language);
    console.log(`🔄 Reset conversation, keeping ${language === 'sv' ? 'Swedish' : 'English'} language`);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showUpcomingPlansModal) {
          setShowUpcomingPlansModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showUpcomingPlansModal]);

  // Keep compatibility with older API responses that still include the
  // suggestion heading inside the message body. The card section owns that
  // heading now, so it must not be rendered twice.
  const getMessageContent = (content: string) => {
    const suggestionHeading = /Want to dig deeper\? Here's where to look:/i;
    const headingIndex = content.search(suggestionHeading);
    return headingIndex >= 0 ? content.slice(0, headingIndex).trim() : content;
  };

  // Helper function to parse markdown-style links, images and **bold** in messages
  const parseMessageWithLinks = (content: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Create a combined pattern to find markdown images, markdown links, plain URLs and **bold**
    // Order matters: images MUST come before links (since images start with !)
    const combinedPattern = /(!\[([^\]]*)\]\(([^)]+)\))|(\[([^\]]+)\]\(([^)]+)\))|(https?:\/\/[^\s]+|mailto:[^\s]+)|(\*\*([^*\n]+?)\*\*)/g;
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
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
            className="underline hover:text-[#ebd421] focus:text-[#ebd421] focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-sm transition-colors"
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
            className="underline hover:text-[#ebd421] focus:text-[#ebd421] focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-sm transition-colors"
          >
            {url}
          </a>
        );
      } else if (match[8]) {
        // Bold **text**, which can itself contain links
        parts.push(
          <strong key={match.index} className="font-semibold">
            {parseMessageWithLinks(match[9])}
          </strong>
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

      
      {/* Cables from the head in the hero photo, dark mode only */}
      {SHOW_HEAD_FILAMENTS && theme === 'dark' && <LuminousFilaments anchorRef={heroImageRef} />}
      {/* Cable into the search field, dark mode only. With the filaments off it
          runs all the way from the head (route="all") */}
      {theme === 'dark' && !isChatMode && (
        <HeadCable headRef={heroImageRef} fieldRef={heroSearchRef} route={SHOW_HEAD_FILAMENTS ? 'field' : 'all'} headX={JACK_TOP.x} headY={JACK_TOP.y} />
      )}
      {theme === 'dark' && isChatMode && (
        <HeadCable headRef={heroImageRef} fieldRef={chatSearchRef} route="chat" />
      )}

      {conversationMenu && (
        <div
          role="menu"
          className="fixed z-[300] min-w-[200px] rounded-[10px] border p-[4px] shadow-lg"
          style={{ left: conversationMenu.x, top: conversationMenu.y, backgroundColor: theme === 'light' ? '#ffffff' : '#21123c', borderColor: colors.border }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            autoFocus
            onClick={handleDeleteSavedConversation}
            className="w-full rounded-[6px] px-[10px] py-[8px] text-left text-[14px] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.08)] focus:outline-none focus-visible:bg-[rgba(255,255,255,0.08)]"
            style={{ color: theme === 'light' ? '#c4291c' : '#ff9a9a' }}
          >
            {language === 'sv' ? '🗑️ Ta bort konversationen' : '🗑️ Delete conversation'}
          </button>
        </div>
      )}

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
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={handleHomeClick}
                  className="font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap whitespace-pre transition-all duration-200 cursor-pointer hover:opacity-80 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7339ff] focus-visible:ring-opacity-50 rounded-md"
                  style={{ color: colors.textPrimary }}
                  aria-label="Max Thunberg, go to home page"
                >
                  Max Thunberg
                </button>
                <BetaTag version={APP_VERSION} />
              </div>
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
                  className="group flex gap-[6px] items-center justify-center relative shrink-0 hover:opacity-100 focus:opacity-100 active:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-2 py-1 min-h-[44px]"
                  aria-label="Visit LinkedIn profile"
                >
                  <p className="font-normal leading-[24px] relative shrink-0 group-hover:underline text-[16px] text-nowrap whitespace-pre transition-all duration-200" style={{ color: colors.textSecondary }}>LinkedIn</p>
                  <ExternalLink className="w-4 h-4 transition-colors duration-200" style={{ color: colors.textSecondary }} />
                </button>
                <button 
                  onClick={handlePortfolioClick}
                  className="group flex gap-[6px] items-center justify-center relative shrink-0 hover:opacity-100 focus:opacity-100 active:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-2 py-1 min-h-[44px]"
                  aria-label="Visit portfolio website"
                >
                  <p className="font-normal leading-[24px] relative shrink-0 group-hover:underline text-[16px] text-nowrap whitespace-pre transition-all duration-200" style={{ color: colors.textSecondary }}>{translations[navbarLanguage].portfolio}</p>
                  <ExternalLink className="w-4 h-4 transition-colors duration-200" style={{ color: colors.textSecondary }} />
                </button>
                <button 
                  onClick={() => setShowUpcomingPlansModal(true)}
                  className="group flex gap-[6px] items-center justify-center relative shrink-0 hover:opacity-100 focus:opacity-100 active:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-2 py-1 min-h-[44px]"
                  aria-label="View coming soon features"
                >
                  <p className="font-normal leading-[24px] relative shrink-0 group-hover:underline text-[16px] text-nowrap whitespace-pre transition-all duration-200" style={{ color: colors.textSecondary }}>{translations[navbarLanguage].comingSoon}</p>
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
                  className="custom-scrollbar basis-0 box-border grow min-h-px min-w-px overflow-x-clip overflow-y-auto pt-[16px] relative shrink-0 w-screen ml-[calc(50%-50vw)]"
                  data-name="Chat"
                  role="log"
                  aria-live="polite"
                  aria-atomic="false"
                  id="main-content"
                >
                  {/* Content keeps max width while the scrollbar sits at the screen edge */}
                  <div className="flex flex-col gap-[16px] items-center w-full max-w-[768px] mx-auto px-[12px] md:px-[16px] pb-[40px]">
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
                              {parseMessageWithLinks(getMessageContent(message.content))}
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
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="w-full max-w-[480px]" data-name="Suggestion cards">
                          <p className="mb-[10px] text-[16px] font-semibold leading-[24px]" style={{ color: colors.textPrimary }}>
                            Want to dig deeper? Here's where to look:
                          </p>
                          <div className="flex flex-col gap-[8px]">
                            {message.suggestions.map((suggestion) => (
                              <a
                                key={suggestion.url}
                                href={suggestion.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex gap-[12px] rounded-[12px] border px-[12px] py-[12px] bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7339ff]"
                                style={{
                                  borderColor: colors.border,
                                  // Same background and hover as the search input
                                  '--card-bg': theme === 'light' ? '#e8e8ed' : '#21123c',
                                  '--card-bg-hover': theme === 'light' ? '#dcdce0' : '#271641',
                                } as React.CSSProperties}
                              >
                                {suggestion.emoji && (
                                  <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] text-[20px]" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} aria-hidden="true">
                                    {suggestion.emoji}
                                  </span>
                                )}
                                <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
                                  <span className="flex items-center justify-between gap-[8px] text-[14px] font-semibold" style={{ color: colors.textPrimary }}>
                                    <span className="truncate">{suggestion.label}</span>
                                    <ExternalLink className="h-[14px] w-[14px] shrink-0 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                                  </span>
                                  <span className="text-[13px] leading-[18px]" style={{ color: colors.textSecondary }}>{suggestion.description}</span>
                                  {suggestion.domain && (
                                    <span className="text-[12px] leading-[16px] opacity-60" style={{ color: colors.textSecondary }}>{suggestion.domain}</span>
                                  )}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {message.fitCheck && (
                        <FitCheckCard
                          fitCheck={message.fitCheck}
                          language={language}
                          theme={theme}
                          onHandoff={handleHandoff}
                        />
                      )}
                      {message.fitCheckOffered && fitCheckStatus === 'offered' && index === messages.length - 1 && !isLoading && (
                        <button
                          type="button"
                          onClick={() => handleSubmit(language === 'sv' ? 'Ja, kör en fit check! ✅' : "Yes, let's do the fit check! ✅", true)}
                          className="rounded-[12px] border px-[16px] py-[10px] text-[14px] font-semibold bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7339ff]"
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary,
                            // Same background and hover as the search input
                            '--card-bg': theme === 'light' ? '#e8e8ed' : '#21123c',
                            '--card-bg-hover': theme === 'light' ? '#dcdce0' : '#271641',
                          } as React.CSSProperties}
                        >
                          {language === 'sv' ? 'Ja, kör en fit check! ✅' : "Yes, let's do the fit check! ✅"}
                        </button>
                      )}
                      {message.suggestionFooter && (
                        <div className="max-w-[480px]" data-name="Suggestion footer">
                          <p className="font-normal leading-[24px] relative text-[16px] text-white whitespace-pre-wrap">
                            {parseMessageWithLinks(message.suggestionFooter)}
                          </p>
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
                      <ThinkingStatus language={language} color={colors.textSecondary} />
                    </motion.div>
                  )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Search input - fixed at bottom */}
              <div ref={chatSearchRef} className="box-border flex flex-col gap-[8px] items-start pb-[16px] pt-0 px-[12px] md:px-[16px] relative shrink-0 w-full max-w-[768px] mx-auto transition-colors duration-300" data-name="Search input" style={{ backgroundColor: theme === 'light' ? '#f5f5f7' : 'transparent' }}>
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
                  showVoiceButton={true}
                />
              </div>
            </>
          ) : (
            /* HERO MODE LAYOUT */
            <div className="flex-1 flex items-end px-[12px] md:px-[16px] relative w-full" data-name="Hero Section Wrapper">
              {/* Mobile background image - only visible on mobile screens */}
              <div 
                className="absolute inset-0 lg:hidden pointer-events-none flex items-end justify-center"
              >
                <img
                  src={imgMaxT13}
                  alt=""
                  className="max-h-[70vh] w-auto object-contain opacity-30"
                  style={{
                    objectPosition: 'center bottom'
                  }}
                />
              </div>
              
              {/* Hero Section - the actual hero content */}
              <div className="flex items-end w-full h-full relative z-10" data-name="Hero Section">
                {/* Main container - Left side */}
                <div className="basis-0 flex flex-col gap-[24px] grow items-start justify-end lg:justify-center min-h-px min-w-px relative shrink-0 h-full pb-[32px] lg:pb-0" data-name="Main container">
                <main id="main-content">
                  {/* Text container */}
                  <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full overflow-hidden" data-name="Text container">
                    <h1 
                      className="font-semibold leading-[52px] relative shrink-0 text-[44px] w-full max-w-[640px] transition-colors duration-300" 
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
                  <div ref={heroSearchRef} className="flex flex-col gap-[8px] items-start relative shrink-0 w-full max-w-[640px]" data-name="Search input">
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
                      showVoiceButton={true}
                    />
                    {(whoName || savedConversation) && (
                      <div className="flex flex-wrap gap-[12px] w-full pt-[8px]" data-name="Prompt suggestions">
                        {whoName && (
                        <button
                          type="button"
                          onClick={() => handleSubmit(`Why should ${whoDisplayName} hire me?`)}
                          disabled={isLoading}
                          className="relative overflow-hidden flex items-center gap-[12px] min-w-[220px] max-w-full rounded-[16px] px-[16px] py-[12px] text-left transition-colors duration-200 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7339ff]"
                          style={{ backgroundColor: colors.messageBg }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'light' ? '#e8e8ed' : 'rgba(255, 255, 255, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.messageBg}
                          aria-busy={!whoReady}
                        >
                          <span className="relative w-[32px] h-[32px] shrink-0 flex items-center justify-center">
                            <AnimatePresence mode="wait" initial={false}>
                              {!whoReady ? (
                                <motion.span
                                  key="loading"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0.45, 1, 0.45] }}
                                  // Exit needs its own transition, the infinite pulse would otherwise block the swap to the logo
                                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                  transition={{ opacity: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }}
                                  className="absolute inset-0 rounded-[8px] flex items-center justify-center font-semibold text-[14px]"
                                  style={{ backgroundColor: theme === 'light' ? '#dcdce2' : 'rgba(255, 255, 255, 0.12)', color: colors.textSecondary }}
                                  aria-hidden="true"
                                >
                                  {whoName.charAt(0).toUpperCase()}
                                </motion.span>
                              ) : whoCompany?.logoUrl && !whoLogoFailed ? (
                                <motion.img
                                  key="logo"
                                  src={whoCompany.logoUrl}
                                  alt=""
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                  className="w-[32px] h-[32px] rounded-[8px] object-contain bg-white p-[3px]"
                                  onError={() => setWhoLogoFailed(true)}
                                />
                              ) : (
                                <motion.span
                                  key="fallback"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="text-[18px] leading-none"
                                  aria-hidden="true"
                                >
                                  🤔
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </span>
                          <span className="flex flex-col gap-[2px] min-w-0">
                            <span className="font-semibold text-[14px] leading-[20px] truncate" style={{ color: colors.textPrimary }}>
                              Why should {whoDisplayName} hire me?
                            </span>
                            <span className="relative h-[18px] overflow-hidden">
                              <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                  key={whoReady ? 'ready' : `step-${whoLoadingStep}`}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  transition={{ duration: 0.25 }}
                                  className="block text-[13px] leading-[18px] whitespace-nowrap"
                                  style={{ color: colors.textSecondary }}
                                >
                                  {whoReady
                                    ? <>Quick pitch, portfolio &amp; CV</>
                                    : whoLoadingMessage(whoName, whoLoadingStep)}
                                </motion.span>
                              </AnimatePresence>
                            </span>
                          </span>
                          {/* Progress bar: keeps creeping towards 95% (~45% at 6s, ~65% at 10s,
                              ~85% at 20s) so it never stalls, then completes when the lookup is done */}
                          <motion.span
                            className="absolute left-0 bottom-0 h-[2px] bg-[#7339ff]"
                            initial={{ width: '0%', opacity: 1 }}
                            animate={whoReady ? { width: '100%', opacity: 0 } : { width: '95%', opacity: 1 }}
                            transition={whoReady
                              ? { width: { duration: 0.3 }, opacity: { duration: 0.4, delay: 0.3 } }
                              : { width: { duration: 60, ease: (t: number) => 1 - Math.pow(1 - t, 6) } }}
                            aria-hidden="true"
                          />
                        </button>
                        )}
                        {savedConversation && (
                          <button
                            type="button"
                            onClick={handleContinueConversation}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setConversationMenu({ x: e.clientX, y: e.clientY });
                            }}
                            disabled={isLoading}
                            className="relative overflow-hidden flex items-center gap-[12px] min-w-[220px] max-w-full rounded-[16px] px-[16px] py-[12px] text-left transition-colors duration-200 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7339ff]"
                            style={{ backgroundColor: colors.messageBg }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'light' ? '#e8e8ed' : 'rgba(255, 255, 255, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.messageBg}
                          >
                            <span
                              className="w-[32px] h-[32px] shrink-0 rounded-[8px] flex items-center justify-center text-[18px] leading-none"
                              style={{ backgroundColor: theme === 'light' ? '#dcdce2' : 'rgba(255, 255, 255, 0.12)' }}
                              aria-hidden="true"
                            >
                              💬
                            </span>
                            <span className="flex flex-col gap-[2px] min-w-0">
                              <span className="font-semibold text-[14px] leading-[20px] truncate" style={{ color: colors.textPrimary }}>
                                {language === 'sv' ? 'Fortsätt konversationen' : 'Continue the conversation'}
                              </span>
                              <span className="block text-[13px] leading-[18px] truncate max-w-[260px]" style={{ color: colors.textSecondary }}>
                                “{[...savedConversation.messages].reverse().find((m) => m.type === 'user')?.content}”
                              </span>
                            </span>
                          </button>
                        )}
                      </div>
                    )}
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
                    <div ref={heroImageRef} className="relative shrink-0" data-name="Image">
                      <img 
                        alt="Max Thunberg, UX Lead" 
                        className="h-[701px] w-[526px] object-cover pointer-events-none" 
                        src={imgMaxT13} 
                      />
                      {/* Metal jack the cable comes out of, when the cable runs from the head */}
                      {theme === 'dark' && !SHOW_HEAD_FILAMENTS && <HeadJack />}
                      {/* Eyes glow like the cables, dark mode only */}
                      {SHOW_EYE_GLOW && theme === 'dark' && <EyeGlow />}
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

      {/* Upcoming Plans Modal */}
      <AnimatePresence>
        {showUpcomingPlansModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowUpcomingPlansModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] sm:w-[560px] max-w-[560px]"
              style={{ x: '-50%', y: '-50%' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="upcoming-plans-title"
            >
              <div className="rounded-[16px] overflow-hidden transition-colors duration-300" style={{ backgroundColor: colors.cardBg }}>
                <div aria-hidden="true" className="absolute border border-solid inset-0 pointer-events-none rounded-[16px] transition-colors duration-300" style={{ borderColor: colors.border }} />
                
                {/* Content */}
                <div className="p-[24px] sm:p-[32px] flex flex-col gap-[24px]">
                  {/* Header */}
                  <div className="flex flex-col gap-[8px]">
                    <h2 id="upcoming-plans-title" className="font-semibold text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] transition-colors duration-300" style={{ color: colors.textPrimary }}>
                      {t.comingSoonTitle}
                    </h2>
                    <p className="font-normal text-[14px] leading-[20px] transition-colors duration-300" style={{ color: colors.textSecondary }}>
                      {t.comingSoonDescription}
                    </p>
                  </div>

                  {/* Plans List */}
                  <div className="flex flex-col gap-[16px]">
                    {/* Plan 1 */}
                    <div className="flex gap-[16px] items-start">
                      <div className="flex items-center justify-center w-[48px] h-[48px] shrink-0">
                        <BrainIllustration theme={theme} />
                      </div>
                      <div className="flex flex-col gap-[4px] flex-1">
                        <p className="font-medium text-[15px] leading-[22px] transition-colors duration-300" style={{ color: colors.textPrimary }}>
                          {t.plan1Title}
                        </p>
                        <p className="font-normal text-[14px] leading-[20px] transition-colors duration-300" style={{ color: colors.textSecondary }}>
                          {t.plan1Description}
                        </p>
                      </div>
                    </div>

                    {/* Plan 2 */}
                    <div className="flex gap-[16px] items-start">
                      <div className="flex items-center justify-center w-[48px] h-[48px] shrink-0">
                        <ImageIllustration theme={theme} />
                      </div>
                      <div className="flex flex-col gap-[4px] flex-1">
                        <p className="font-medium text-[15px] leading-[22px] transition-colors duration-300" style={{ color: colors.textPrimary }}>
                          {t.plan2Title}
                        </p>
                        <p className="font-normal text-[14px] leading-[20px] transition-colors duration-300" style={{ color: colors.textSecondary }}>
                          {t.plan2Description}
                        </p>
                      </div>
                    </div>

                    {/* Plan 3 */}
                    <div className="flex gap-[16px] items-start">
                      <div className="flex items-center justify-center w-[48px] h-[48px] shrink-0">
                        <BookIllustration theme={theme} />
                      </div>
                      <div className="flex flex-col gap-[4px] flex-1">
                        <p className="font-medium text-[15px] leading-[22px] transition-colors duration-300" style={{ color: colors.textPrimary }}>
                          {t.plan3Title}
                        </p>
                        <p className="font-normal text-[14px] leading-[20px] transition-colors duration-300" style={{ color: colors.textSecondary }}>
                          {t.plan3Description}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Close button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowUpcomingPlansModal(false)}
                      className="relative px-[20px] py-[12px] sm:py-[10px] rounded-[8px] font-medium text-[14px] leading-[20px] active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[44px] overflow-hidden"
                      style={{ 
                        backgroundColor: theme === 'light' ? '#e8e8ed' : '#21123c',
                        color: colors.textPrimary
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'light' ? '#dcdce0' : '#271641'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === 'light' ? '#e8e8ed' : '#21123c'}
                    >
                      <div 
                        aria-hidden="true" 
                        className="absolute border border-solid inset-0 pointer-events-none rounded-[8px] transition-colors duration-200" 
                        style={{ borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : '#4d4164' }}
                      />
                      <span className="relative z-10">{t.comingSoonClose}</span>
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
                  <p className="font-medium text-[18px] transition-all duration-200" style={{ color: colors.textPrimary }}>{translations[navbarLanguage].portfolio}</p>
                  <ExternalLink className="w-5 h-5 transition-colors duration-200" style={{ color: colors.textSecondary }} />
                </button>

                <button
                  onClick={() => {
                    setShowUpcomingPlansModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group flex gap-[10px] items-center relative shrink-0 hover:opacity-100 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7339ff] focus:ring-opacity-50 rounded-md px-4 py-3 min-h-[56px]"
                  style={{ backgroundColor: colors.hoverBg }}
                >
                  <p className="font-medium text-[18px] transition-all duration-200" style={{ color: colors.textPrimary }}>{translations[navbarLanguage].comingSoon}</p>
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cookie Consent */}
      <CookieConsent theme={theme} language={language} />

    </div>
  );
}