import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  ArrowUp,
  Github,
  Linkedin,
  Code2,
  Twitter,
  Instagram,
  FileText,
  Send,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/staticData';
import { soundEngine } from '../utils/soundEngine';

interface ContactSectionProps {
  onToggleDream?: () => void;
  totalSolved?: number;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onToggleDream,
  totalSolved = 133,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('SWE / Full-Stack Internship');
  const [senderName, setSenderName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [dispatchSent, setDispatchSent] = useState(false);

  const topics = [
    'SWE / Full-Stack Internship',
    'Python & AI Collaboration',
    'Freelance / Product Build',
    'General Hi',
  ];

  const handleCopyEmail = async () => {
    soundEngine.playClick();
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleQuickDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    const subject = encodeURIComponent(
      `[Portfolio Inquiry] ${selectedTopic}${senderName ? ` — from ${senderName}` : ''}`
    );
    const body = encodeURIComponent(
      messageText.trim() ||
        `Hi Sachin,\n\nI came across your portfolio and wanted to connect regarding ${selectedTopic}.\n\nBest,\n${senderName || 'Recruiter / Collaborator'}`
    );
    setDispatchSent(true);
    setTimeout(() => setDispatchSent(false), 4000);
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
  };

  const socials = [
    { label: 'GitHub', sub: '@heyits-sachin', href: PERSONAL_INFO.githubUrl, icon: Github },
    { label: 'LinkedIn', sub: 'in/heyits-sachin', href: PERSONAL_INFO.linkedinUrl, icon: Linkedin },
    { label: 'LeetCode', sub: `${totalSolved}+ Solved (C++)`, href: PERSONAL_INFO.leetcodeUrl, icon: Code2 },
    { label: 'X (Twitter)', sub: '@TechGam54440224', href: PERSONAL_INFO.xUrl, icon: Twitter },
    { label: 'Instagram', sub: '@_sachin.sachin_0000', href: PERSONAL_INFO.instagramUrl, icon: Instagram },
    { label: 'Résumé PDF', sub: 'Download CV', href: PERSONAL_INFO.resumeUrl, icon: FileText, download: true },
  ];

  return (
    <section
      id="contact"
      className="depth-section py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8 border-t border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 relative"
    >
      {/* =====================================================================
          DAIKI FUJITA GIANT "SAY HELLO." KINETIC DISPLAY STAGE + STUDIO
         ===================================================================== */}
      <div className="mb-12 gsap-reveal">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 text-[11px] font-mono uppercase tracking-[0.18em] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            <span>Available for 2026 SWE &amp; AI Roles · Delhi, India</span>
          </span>

          <div className="flex items-center gap-5 text-[11px] font-mono uppercase tracking-[0.2em]">
            {onToggleDream && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onToggleDream();
                }}
                className="text-neutral-200 dark:text-neutral-200 light:text-[#141413] hover:text-amber-500 font-semibold cursor-pointer"
              >
                STILL AWAKE? ENTER THE DREAM →
              </button>
            )}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-amber-500 cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Per-Character Kinetic Display Headline */}
        <h2
          aria-label="SAY HELLO."
          className="text-[15vw] sm:text-[13vw] md:text-[148px] font-bold uppercase tracking-[-0.045em] leading-[0.86] text-neutral-100 dark:text-neutral-100 light:text-[#141413] mb-6 select-none"
        >
          <span className="inline-block">
            {'SAY'.split('').map((ch, i) => (
              <span
                key={`say-${i}`}
                onMouseEnter={() => soundEngine.playHover()}
                className="gsap-char inline-block transition-transform duration-300 hover:-translate-y-3 hover:text-amber-500 cursor-default"
              >
                {ch}
              </span>
            ))}
          </span>
          <br />
          <span className="inline-block">
            {'HELLO'.split('').map((ch, i) => (
              <span
                key={`hello-${i}`}
                onMouseEnter={() => soundEngine.playHover()}
                className="gsap-char inline-block transition-transform duration-300 hover:-translate-y-3 hover:text-purple-400 cursor-default"
              >
                {ch}
              </span>
            ))}
            <span className="gsap-char inline-block text-amber-500 dark:text-amber-400 light:text-purple-700">
              .
            </span>
          </span>
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 max-w-2xl leading-relaxed">
          Have a full-stack product, AI/ML pipeline, or software engineering opportunity in mind?
          Reach out directly or dispatch an instant note below.
        </p>
      </div>

      {/* =====================================================================
          3. DIRECT INBOX & INTERACTIVE QUICK-DISPATCH COMPOSER
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Direct Email Channel + Social Matrix */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-6">
          <div className="gsap-reveal p-6 sm:p-8 rounded-3xl border border-indigo-500/25 dark:border-indigo-500/25 light:border-stone-300 bg-[#0D0E20]/90 dark:bg-[#0D0E20]/90 light:bg-[#F6F5F0] shimmer-card shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 text-[11px] font-mono uppercase tracking-wider font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Available for 2026 Roles</span>
              </span>
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Delhi, India</span>
              </span>
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mb-1.5">
              Direct Inbox
            </div>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              onClick={() => soundEngine.playClick()}
              className="text-2xl sm:text-3xl font-mono font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 hover:text-amber-500 transition-colors flex items-center gap-2 break-all mb-6"
            >
              <span>{PERSONAL_INFO.email}</span>
              <ArrowUpRight className="w-5 h-5 text-amber-500 shrink-0" />
            </a>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopyEmail}
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-950/75 dark:bg-neutral-950/75 light:bg-white text-neutral-200 dark:text-neutral-200 light:text-neutral-800 hover:border-amber-500/60 hover:text-amber-500 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-500" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                onClick={() => soundEngine.playClick()}
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Open Mail App</span>
              </a>
            </div>
          </div>

          {/* 6-Card Social & Résumé Directory */}
          <div className="gsap-stagger-grid grid grid-cols-2 sm:grid-cols-3 gap-3">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  download={s.download}
                  target={s.download ? undefined : '_blank'}
                  rel={s.download ? undefined : 'noopener noreferrer'}
                  onClick={() => soundEngine.playClick()}
                  onMouseEnter={() => soundEngine.playHover()}
                  className="gsap-stagger-item p-4 rounded-2xl border border-indigo-500/20 dark:border-indigo-500/20 light:border-stone-300/90 bg-[#0D0E20]/75 dark:bg-[#0D0E20]/75 light:bg-[#F6F5F0] shimmer-card hover-lift flex flex-col justify-between gap-2 group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-amber-500" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                      {s.label}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-500 truncate mt-0.5">
                      {s.sub}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Quick-Dispatch Composer */}
        <div className="lg:col-span-6 gsap-reveal">
          <form
            onSubmit={handleQuickDispatch}
            className="h-full p-6 sm:p-8 rounded-3xl border border-indigo-500/25 dark:border-indigo-500/25 light:border-stone-300 bg-[#0D0E20]/90 dark:bg-[#0D0E20]/90 light:bg-[#F6F5F0] shimmer-card flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Quick Message Composer</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-500">
                  Instant Mailto Dispatch
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-2">
                  1. Select Topic
                </label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedTopic(topic);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                        selectedTopic === topic
                          ? 'bg-amber-500 text-neutral-950 border-amber-500 font-semibold shadow-sm'
                          : 'bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-white border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:border-amber-500/50'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="contact-sender-name"
                  className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-1.5"
                >
                  2. Your Name / Organization
                </label>
                <input
                  id="contact-sender-name"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g., Priya Sharma · Engineering Recruiter"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-white text-xs sm:text-sm text-neutral-100 dark:text-neutral-100 light:text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="contact-message-body"
                  className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-1.5"
                >
                  3. Message Note
                </label>
                <textarea
                  id="contact-message-body"
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Tell me about the role, project timeline, or collaboration idea..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-white text-xs sm:text-sm text-neutral-100 dark:text-neutral-100 light:text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-neutral-800/70 dark:border-neutral-800/70 light:border-stone-200">
              <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                {dispatchSent
                  ? '✓ Mail client launched with your message!'
                  : 'Routes directly to ks6911843@gmail.com'}
              </span>
              <button
                type="submit"
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-white light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-white hover:bg-amber-500 dark:hover:bg-amber-400 light:hover:bg-amber-500 light:hover:text-neutral-950 text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Prepare &amp; Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
