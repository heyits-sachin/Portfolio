import React from 'react';

export const TechIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-4 h-4' }) => {
  const norm = name.toLowerCase().trim();

  // Python
  if (norm.includes('python')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2c-3.1 0-5.1 1.4-5.1 3.5v2.6h5.2v.7H4.5C2.4 8.8 1 10.8 1 13.9c0 3.1 1.4 5.1 3.5 5.1h1.5v-2.6c0-2.1 1.7-3.9 3.9-3.9h5.1c1.8 0 3.2-1.4 3.2-3.2V5.5C18.2 3.4 16.8 2 11.9 2zm-1.8 1.9c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1z" fill="#3776AB"/>
        <path d="M12.1 22c3.1 0 5.1-1.4 5.1-3.5v-2.6h-5.2v-.7h7.5c2.1 0 3.5-2 3.5-5.1 0-3.1-1.4-5.1-3.5-5.1H18v2.6c0 2.1-1.7 3.9-3.9 3.9H9c-1.8 0-3.2 1.4-3.2 3.2v3.8c0 2.1 1.4 3.5 6.3 3.5zm1.8-1.9c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1z" fill="#FFD43B"/>
      </svg>
    );
  }

  // C++
  if (norm.includes('c++')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.5 3.5L3.5 8.2v7.6l8 4.7 8-4.7V8.2l-8-4.7z" fill="#00599C"/>
        <path d="M11.5 5.3l6.5 3.8v7.6l-6.5 3.8-6.5-3.8V9.1l6.5-3.8z" fill="#004482"/>
        <path d="M11.5 9.2a3.8 3.8 0 100 7.6 3.8 3.8 0 000-7.6z" fill="#659AD2"/>
        <path d="M17.5 12h2m-1-1v2m3.5-1h2m-1-1v2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
  }

  // TypeScript
  if (norm.includes('typescript')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M12.5 11.5h-8v2h3v8.5h2v-8.5h3v-2zm3.8 4.8c.8.6 1.8 1 2.8 1 1 0 1.6-.4 1.6-1.1 0-.7-.5-1-1.7-1.5-1.9-.7-3.1-1.6-3.1-3.2 0-2 1.6-3.3 3.8-3.3 1.3 0 2.4.4 3.1.9l-.8 1.8c-.6-.4-1.4-.7-2.3-.7-1.1 0-1.7.5-1.7 1.1 0 .6.5 1 1.8 1.4 2 .8 3 1.7 3 3.4 0 2.1-1.6 3.4-4 3.4-1.5 0-2.8-.5-3.6-1.1l1.1-2.1z" fill="#fff"/>
      </svg>
    );
  }

  // JavaScript
  if (norm.includes('javascript') || norm === 'js') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
        <path d="M7 19.5l1.6-1c.4.7.9 1.2 1.7 1.2.9 0 1.4-.4 1.4-1.4V11H14v7.3c0 2-1.2 3-3.2 3-1.7 0-2.8-.9-3.8-2.3zm8.8-.4l1.6-1c.5.8 1.2 1.3 2.1 1.3 1 0 1.6-.5 1.6-1.2 0-.8-.7-1.1-1.8-1.6-1.6-.7-2.7-1.6-2.7-3.2 0-1.8 1.4-3.1 3.4-3.1 1.4 0 2.4.5 3.1 1.6l-1.5 1c-.4-.6-.9-.9-1.6-.9-.7 0-1.2.4-1.2.9 0 .6.4.9 1.4 1.3 1.8.8 3.1 1.6 3.1 3.4 0 2-1.6 3.2-3.8 3.2-2.1 0-3.3-1-4.2-2.7z" fill="#000"/>
      </svg>
    );
  }

  // HTML5
  if (norm === 'html5' || norm === 'html' || norm.includes('html5/css3')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 3l1.5 16.5L12 21.5l6.5-2L20 3H4z" fill="#E34F26"/>
        <path d="M12 4.5v15.4l5.2-1.6L18.4 4.5H12z" fill="#EF652A"/>
        <path d="M12 9H7.8l.3 3H12v2.8l-2.7-.8-.2-1.8H6.5l.4 3.8 5.1 1.5V9zm0 0h4.5l-.5 5.5-4 1.2v-2.8l2-.6.2-2.3H12V9z" fill="#fff"/>
      </svg>
    );
  }

  // CSS3 (Blue Shield with '3' - matches second icon in image_8ff446ef.png)
  if (norm === 'css3' || norm === 'css') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 3l1.5 16.5L12 21.5l6.5-2L20 3H4z" fill="#1572B6"/>
        <path d="M12 4.5v15.4l5.2-1.6L18.4 4.5H12z" fill="#33A9DC"/>
        <path d="M7.5 8h9l-.3 2.5H11l.2 2h4.7l-.5 5-3.4 1-3.4-1-.2-2.5h2.3l.1 1.1 1.2.4 1.2-.4.2-1.6H7.8L7.5 8z" fill="#fff"/>
      </svg>
    );
  }

  // Prolog
  if (norm.includes('prolog')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.5" stroke="#EC4899" strokeWidth="1.8" fill="rgba(236,72,153,0.15)"/>
        <path d="M8 15l4-7 4 7H8z" stroke="#F472B6" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="12" cy="13" r="1.5" fill="#F472B6"/>
      </svg>
    );
  }

  // React
  if (norm.includes('react')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.2" fill="#61DAFB"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.3" transform="rotate(0 12 12)"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.3" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.3" transform="rotate(120 12 12)"/>
      </svg>
    );
  }

  // Flask
  if (norm.includes('flask')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M10 2v7.31a2 2 0 0 1-.37 1.17l-4.7 6.82A2 2 0 0 0 6.57 20h10.86a2 2 0 0 0 1.64-2.7l-4.7-6.82A2 2 0 0 1 14 9.31V2" stroke="#38BDF8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 2h7" stroke="#38BDF8" strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M6.8 15.5h10.4L18.5 18H5.5l1.3-2.5z" fill="rgba(56,189,248,0.35)"/>
      </svg>
    );
  }

  // Django
  if (norm.includes('django')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0C4B33"/>
        <path d="M11 4.5h2.6v11c-1 .2-2 .3-2.8.3-2.6 0-4.1-1.3-4.1-3.6 0-2.2 1.6-3.7 4-3.7.1 0 .2 0 .3.1V4.5zm0 6c-.1 0-.2-.1-.4-.1-1.1 0-1.8.7-1.8 1.8 0 1.1.7 1.8 1.8 1.8.2 0 .3 0 .4-.1v-3.4zm5-2h2.5v7.5c0 2.6-1 3.7-3.4 4.2l-1.2-1.8c1.5-.3 2.1-.9 2.1-2.5V8.5zm0-4h2.5v2.4H16V4.5z" fill="#44B78B"/>
      </svg>
    );
  }

  // REST APIs
  if (norm.includes('rest') || (norm.includes('api') && !norm.includes('gemini') && !norm.includes('openai'))) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="2.5" stroke="#A78BFA" strokeWidth="1.7"/>
        <circle cx="18" cy="6" r="2.5" stroke="#38BDF8" strokeWidth="1.7"/>
        <circle cx="12" cy="18" r="2.5" stroke="#F59E0B" strokeWidth="1.7"/>
        <path d="M8.2 7.2L15.8 7.2M7.2 8.2L10.8 15.8M16.8 8.2L13.2 15.8" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // OAuth 2.0 / Auth / Security
  if (norm.includes('oauth') || norm.includes('security')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 5.5v6c0 5.2 3.4 9.9 8 11.5 4.6-1.6 8-6.3 8-11.5v-6L12 2z" fill="rgba(16,185,129,0.18)" stroke="#10B981" strokeWidth="1.7"/>
        <path d="M9 12l2 2 4-4" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // PostgreSQL
  if (norm.includes('postgres')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" fill="rgba(51,103,145,0.35)" stroke="#60A5FA" strokeWidth="1.6"/>
        <path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" stroke="#60A5FA" strokeWidth="1.6"/>
        <path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" stroke="#3B82F6" strokeWidth="1.6"/>
      </svg>
    );
  }

  // SQLite (Blue rounded square with feather quill — matches bottom-left icon in image_8ff446ef.png)
  if (norm.includes('sqlite')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="sqlite-sq" x1="3" y1="3" x2="18" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4FA3E3"/>
            <stop offset="1" stopColor="#044A7F"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3.5" width="13.5" height="17" rx="2.5" fill="url(#sqlite-sq)"/>
        <path d="M19.5 3.2c-3.2.5-6.1 3.6-7.6 7.8-1 2.7-1.4 5.8-1.5 9.2h1.4c.4-2.5 1.1-4.6 2.1-6.2 2.4-.5 4.4-2.2 5.4-4.8.9-2.2 1-4.3.2-6z" fill="#0B3B5E"/>
        <path d="M19.2 3.5c-2.6.8-5.1 3.7-6.5 7.6-.9 2.5-1.3 5.4-1.4 8.6" stroke="#7CC5F8" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
  }

  // SQL / MySQL Database Cylinder with Green Play Badge (matches bottom-middle icon in image_8ff446ef.png)
  if (norm.includes('sql') || norm.includes('database') || norm.includes('mysql')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <ellipse cx="10.5" cy="5.5" rx="6.5" ry="2.5" fill="#CBD5E1"/>
        <path d="M4 5.5v4c0 1.38 2.91 2.5 6.5 2.5s6.5-1.12 6.5-2.5v-4" fill="#94A3B8"/>
        <ellipse cx="10.5" cy="9.5" rx="6.5" ry="2.2" fill="#CBD5E1"/>
        <path d="M4 10.5v4c0 1.38 2.91 2.5 6.5 2.5s6.5-1.12 6.5-2.5v-4" fill="#94A3B8"/>
        <path d="M4 15v3.5C4 19.88 6.91 21 10.5 21s6.5-1.12 6.5-2.5V15" fill="#64748B"/>
        <circle cx="17.5" cy="18" r="4.2" fill="#65A30D" stroke="#ECFCCB" strokeWidth="1.2"/>
        <path d="M16.3 16.2l3 1.8-3 1.8v-3.6z" fill="#fff"/>
      </svg>
    );
  }

  // OpenAI (Interlocking white hexagonal knot — matches bottom row 4th icon in image_8ff446ef.png)
  if (norm.includes('openai') || norm.includes('chatgpt')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8.2" r="4.2" stroke="currentColor" strokeWidth="1.7"/>
        <circle cx="15.3" cy="10.1" r="4.2" stroke="currentColor" strokeWidth="1.7"/>
        <circle cx="15.3" cy="13.9" r="4.2" stroke="currentColor" strokeWidth="1.7"/>
        <circle cx="12" cy="15.8" r="4.2" stroke="currentColor" strokeWidth="1.7"/>
        <circle cx="8.7" cy="13.9" r="4.2" stroke="currentColor" strokeWidth="1.7"/>
        <circle cx="8.7" cy="10.1" r="4.2" stroke="currentColor" strokeWidth="1.7"/>
      </svg>
    );
  }

  // Tailwind CSS
  if (norm.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12.5 6.5c-2.3 0-3.7 1.2-4.2 3.5 1-.8 2.1-1.1 3.2-.8.6.2 1.1.7 1.6 1.2 1 1 2 2.1 4.4 2.1 2.3 0 3.7-1.2 4.2-3.5-1 .8-2.1 1.1-3.2.8-.6-.2-1.1-.7-1.6-1.2-1-1-2-2.1-4.4-2.1zm-8 7c-2.3 0-3.7 1.2-4.2 3.5 1-.8 2.1-1.1 3.2-.8.6.2 1.1.7 1.6 1.2 1 1 2 2.1 4.4 2.1 2.3 0 3.7-1.2 4.2-3.5-1 .8-2.1 1.1-3.2.8-.6-.2-1.1-.7-1.6-1.2-1-1-2-2.1-4.4-2.1z" fill="#06B6D4"/>
      </svg>
    );
  }

  // Git / GitHub
  if (norm.includes('git')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M21.7 10.3l-8-8c-.4-.4-1.1-.4-1.5 0L10.3 4.2l2.3 2.3c.5-.2 1.1-.1 1.5.3.4.4.5 1 .3 1.5l2.2 2.2c.5-.2 1.1-.1 1.5.3.6.6.6 1.6 0 2.2-.6.6-1.6.6-2.2 0-.4-.4-.5-1-.3-1.5L13.5 9.4v5.3c.2.1.3.3.4.5.6.6.6 1.6 0 2.2-.6.6-1.6.6-2.2 0-.6-.6-.6-1.6 0-2.2.2-.2.4-.4.6-.5V9.3c.2-.1.4-.3.6-.5.4-.4.5-1 .3-1.5l-2.3-2.3L2.3 12.3c-.4.4-.4 1.1 0 1.5l8 8c.4.4 1.1.4 1.5 0l9.9-9.9c.4-.5.4-1.2 0-1.6z" fill="#F05032"/>
      </svg>
    );
  }

  // Pandas
  if (norm.includes('pandas')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="3" height="18" rx="1.2" fill="#130754" stroke="#818CF8" strokeWidth="1"/>
        <rect x="9.5" y="3" width="3" height="5" rx="1" fill="#818CF8"/>
        <rect x="9.5" y="10" width="3" height="3" rx="0.8" fill="#F59E0B"/>
        <rect x="9.5" y="15" width="3" height="6" rx="1" fill="#818CF8"/>
        <rect x="15" y="3" width="3" height="18" rx="1.2" fill="#130754" stroke="#818CF8" strokeWidth="1"/>
      </svg>
    );
  }

  // NumPy
  if (norm.includes('numpy')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="rgba(77,171,207,0.25)" stroke="#4DABCF" strokeWidth="1.6"/>
        <path d="M12 12L3 7m9 5l9-5m-9 5v10" stroke="#4DABCF" strokeWidth="1.5"/>
      </svg>
    );
  }

  // Scikit-learn
  if (norm.includes('scikit')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="14" r="6" fill="rgba(247,147,30,0.85)"/>
        <circle cx="15.5" cy="9.5" r="4.5" fill="rgba(52,152,219,0.85)"/>
      </svg>
    );
  }

  // NLTK
  if (norm.includes('nltk')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h11M4 18h14" stroke="#34D399" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="19" cy="12" r="2.2" fill="#F59E0B"/>
      </svg>
    );
  }

  // Matplotlib / Chart.js
  if (norm.includes('matplotlib') || norm.includes('chart')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="8" rx="1" fill="#F43F5E"/>
        <rect x="10" y="6" width="4" height="14" rx="1" fill="#3B82F6"/>
        <rect x="17" y="9" width="4" height="11" rx="1" fill="#F59E0B"/>
      </svg>
    );
  }

  // Gemini API / AI (Wordmark with sparkle star matching image_8ff446ef.png)
  if (norm.includes('gemini') || norm.includes('ai')) {
    return (
      <svg className={className} viewBox="0 0 64 24" fill="none">
        <defs>
          <linearGradient id="gemini-wordmark" x1="0" y1="0" x2="64" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA"/>
            <stop offset="0.55" stopColor="#A855F7"/>
            <stop offset="1" stopColor="#F43F5E"/>
          </linearGradient>
        </defs>
        <text
          x="2"
          y="17"
          fill="url(#gemini-wordmark)"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          fontSize="15"
          letterSpacing="-0.02em"
        >
          Gemini
        </text>
        <path d="M51 3c0 2.5 1.8 4.2 4.2 4.2-2.4 0-4.2 1.7-4.2 4.2 0-2.5-1.8-4.2-4.2-4.2 2.4 0 4.2-1.7 4.2-4.2z" fill="#A855F7"/>
      </svg>
    );
  }

  // ReportLab / PDF
  if (norm.includes('reportlab') || norm.includes('pdf')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="1.6"/>
        <path d="M14 2v6h6" stroke="#EF4444" strokeWidth="1.6"/>
        <path d="M8 13h8M8 17h5" stroke="#FCA5A5" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    );
  }

  // Linux / Bash
  if (norm.includes('linux') || norm.includes('bash')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.5"/>
        <path d="M6 9l3.5 3L6 15" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 15H16" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  }

  // Vercel
  if (norm.includes('vercel')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 3L22 20H2L12 3z" fill="currentColor"/>
      </svg>
    );
  }

  // Render
  if (norm.includes('render')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M5 4h8a6 6 0 0 1 0 12H9v4H5V4z" fill="#46E3B7"/>
        <circle cx="17" cy="17" r="3" fill="#6366F1"/>
      </svg>
    );
  }

  // SEO / Schema.org
  if (norm.includes('seo') || norm.includes('schema')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#F59E0B" strokeWidth="1.8" fill="rgba(245,158,11,0.12)"/>
        <path d="M20 20l-4-4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 12l2 2 4-4" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // Node / Express
  if (norm.includes('node') || norm.includes('express')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l9 5.2v10.4L12 23l-9-5.4V7.2L12 2z" fill="#339933"/>
        <path d="M12 4.4L5.4 8.2v7.6L12 19.6l6.6-3.8V8.2L12 4.4z" fill="#fff"/>
        <path d="M12 7l4.5 2.6v5.2L12 17.4l-4.5-2.6V9.6L12 7z" fill="#339933"/>
      </svg>
    );
  }

  // Supabase
  if (norm.includes('supabase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M13.2 2.5a.7.7 0 00-1.2.6v8.4H3.8c-.8 0-1.2 1-.6 1.6l8.8 9.9c.6.7 1.8.2 1.8-.7v-8.4h8.2c.8 0 1.2-1 .6-1.6L13.2 2.5z" fill="#3ECF8E"/>
      </svg>
    );
  }

  // Default fallback code tag icon
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
};
