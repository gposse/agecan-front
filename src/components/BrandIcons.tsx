// lucide-react (as pinned in package.json) ships only generic UI icons —
// brand/logo marks (Instagram, Facebook, Google, TikTok, WhatsApp) were
// removed from the package, so these are small hand-rolled inline SVGs used
// in place of the fa-brands classes from the original Angular app.

interface IconProps {
  className?: string;
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-1.02-.9-1.6-2.19-1.6-3.62h-3.13v13.09a2.62 2.62 0 1 1-1.87-2.51V9.6a5.75 5.75 0 1 0 5 5.7V9.66a7.13 7.13 0 0 0 4.13 1.31V7.87c-.85 0-1.68-.24-2.53-.68a4.7 4.7 0 0 1-2-1.37Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.6 1.4 5.1L2 22l5.13-1.47a9.87 9.87 0 0 0 4.91 1.28c5.46 0 9.91-4.45 9.91-9.9C21.95 6.45 17.5 2 12.04 2Zm5.72 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.4.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.29.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.44.2.51.31.07.11.07.65-.17 1.33Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-2.98c-1.08.72-2.45 1.15-4.05 1.15-3.12 0-5.76-2.1-6.7-4.93H1.3v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path fill="#FBBC05" d="M5.3 14.34a7.2 7.2 0 0 1 0-4.68V6.57H1.3a12 12 0 0 0 0 10.86l4-3.09z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.57l4 3.09c.94-2.83 3.58-4.91 6.7-4.91z"
      />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}
