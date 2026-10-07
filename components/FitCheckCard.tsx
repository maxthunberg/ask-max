"use client";

import React, { useState } from 'react';
import type { FitCheck } from '../utils/chat-api';

interface FitCheckCardProps {
  fitCheck: FitCheck;
  language: 'en' | 'sv';
  theme: 'light' | 'dark';
  // Sends the conversation to the real Max, rejects with an error code
  onHandoff: (contact: { email: string; name: string; note: string }) => Promise<void>;
}

const TEXT = {
  en: {
    matches: '✅ Where we match',
    risks: "⚠️ Where I might not be your guy",
    unknowns: '❓ Still unclear',
    handoff: '📨 Send this to the real Max',
    handoffIntro: "I'll pass on this conversation and the fit check, so the real me doesn't start from zero.",
    email: 'Your email',
    name: 'Your name (optional)',
    note: 'Anything you want to add? (optional)',
    send: 'Send to Max',
    sending: 'Sending…',
    cancel: 'Cancel',
    privacy: 'Sends this conversation and summary to Max by email. Nothing else is saved.',
    sent: "Sent! 🎉 The real Max will get back to you. He's slower than me, but way better at coffee ☕",
    invalidEmail: "That email doesn't look quite right 🤔",
    failed: "Hmm, that didn't go through 😅 Reach out at max@maxthunberg.com instead.",
  },
  sv: {
    matches: '✅ Där vi matchar',
    risks: '⚠️ Där jag kanske inte är rätt person',
    unknowns: '❓ Fortfarande oklart',
    handoff: '📨 Skicka det här till riktiga Max',
    handoffIntro: 'Jag skickar vidare samtalet och fit checken, så att riktiga jag inte börjar från noll.',
    email: 'Din e-post',
    name: 'Ditt namn (valfritt)',
    note: 'Något du vill lägga till? (valfritt)',
    send: 'Skicka till Max',
    sending: 'Skickar…',
    cancel: 'Avbryt',
    privacy: 'Skickar samtalet och sammanfattningen till Max via mejl. Inget annat sparas.',
    sent: 'Skickat! 🎉 Riktiga Max hör av sig. Han är långsammare än jag, men mycket bättre på kaffe ☕',
    invalidEmail: 'Den e-posten ser lite konstig ut 🤔',
    failed: 'Hmm, det gick inte iväg 😅 Hör av dig på max@maxthunberg.com istället.',
  },
};

export function FitCheckCard({ fitCheck, language, theme, onHandoff }: FitCheckCardProps) {
  const t = TEXT[language];
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const colors = {
    textPrimary: theme === 'light' ? '#1d1d1f' : '#ffffff',
    textSecondary: theme === 'light' ? '#6e6e73' : '#c7c1cc',
    border: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
    // Same as the search input
    cardBg: theme === 'light' ? '#e8e8ed' : '#21123c',
    fieldBg: theme === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
  };

  const sections = [
    { title: t.matches, items: fitCheck.matches },
    { title: t.risks, items: fitCheck.risks },
    { title: t.unknowns, items: fitCheck.unknowns },
  ].filter((section) => section.items.length > 0);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.invalidEmail);
      return;
    }
    setError('');
    setStatus('sending');
    try {
      await onHandoff({ email: email.trim(), name: name.trim(), note: note.trim() });
      setStatus('sent');
    } catch {
      setStatus('error');
      setError(t.failed);
    }
  };

  const fieldClass = 'w-full rounded-[8px] border px-[12px] py-[10px] text-[14px] leading-[20px] focus:outline-none focus:ring-2 focus:ring-[#7339ff]';
  const fieldStyle = { borderColor: colors.border, backgroundColor: colors.fieldBg, color: colors.textPrimary };

  return (
    <div
      className="w-full max-w-[480px] rounded-[12px] border px-[16px] py-[16px] flex flex-col gap-[16px]"
      style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}
      data-name="Fit check"
    >
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-[6px]">
          <p className="text-[14px] font-semibold leading-[20px]" style={{ color: colors.textPrimary }}>{section.title}</p>
          <ul className="flex flex-col gap-[6px] pl-[18px] list-disc">
            {section.items.map((item) => (
              <li key={item} className="text-[14px] leading-[20px]" style={{ color: colors.textSecondary }}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="border-t pt-[16px]" style={{ borderColor: colors.border }}>
        {status === 'sent' ? (
          <p className="text-[14px] leading-[20px]" style={{ color: colors.textPrimary }}>{t.sent}</p>
        ) : !formOpen ? (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="rounded-[8px] bg-[#7339ff] hover:bg-[#5e2dd9] active:bg-[#4d24b8] px-[14px] py-[10px] text-[14px] font-semibold text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7339ff] focus-visible:ring-offset-2"
          >
            {t.handoff}
          </button>
        ) : (
          <form onSubmit={handleSend} className="flex flex-col gap-[8px]" noValidate>
            <p className="text-[14px] leading-[20px]" style={{ color: colors.textPrimary }}>{t.handoffIntro}</p>
            <input type="email" required autoComplete="email" placeholder={t.email} aria-label={t.email} value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} style={fieldStyle} />
            <input type="text" autoComplete="name" placeholder={t.name} aria-label={t.name} value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} style={fieldStyle} />
            <textarea rows={3} placeholder={t.note} aria-label={t.note} value={note} onChange={(e) => setNote(e.target.value)} className={`${fieldClass} resize-none`} style={fieldStyle} />
            {error && <p className="text-[13px] leading-[18px]" style={{ color: theme === 'light' ? '#c4291c' : '#ff9a9a' }} role="alert">{error}</p>}
            <div className="flex items-center gap-[8px]">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="rounded-[8px] bg-[#7339ff] hover:bg-[#5e2dd9] active:bg-[#4d24b8] disabled:opacity-50 px-[14px] py-[10px] text-[14px] font-semibold text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7339ff] focus-visible:ring-offset-2"
              >
                {status === 'sending' ? t.sending : t.send}
              </button>
              <button
                type="button"
                onClick={() => { setFormOpen(false); setError(''); setStatus('idle'); }}
                className="rounded-[8px] px-[14px] py-[10px] text-[14px] transition-colors duration-200 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7339ff]"
                style={{ color: colors.textSecondary }}
              >
                {t.cancel}
              </button>
            </div>
            <p className="text-[12px] leading-[16px]" style={{ color: colors.textSecondary }}>{t.privacy}</p>
          </form>
        )}
      </div>
    </div>
  );
}
