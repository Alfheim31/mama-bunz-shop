/* Small inline SVG icons used around the site. */

const stroke = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const BagIcon = () => (
  <svg {...stroke}>
    <path d="M6 8h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const ChevronLeft = () => (
  <svg {...stroke}><path d="M15 6l-6 6 6 6" /></svg>
);

export const ChevronRight = () => (
  <svg {...stroke}><path d="M9 6l6 6-6 6" /></svg>
);

export const CandleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3c1.6 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .4-2.2 2-4Z" fill="currentColor" />
    <rect x="7" y="11" width="10" height="10" rx="2" />
  </svg>
);

export const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z" />
  </svg>
);

export const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 7.5A4.5 4.5 0 1 0 12 16.5 4.5 4.5 0 0 0 12 7.5Zm0 7.4A2.9 2.9 0 1 1 12 9.1a2.9 2.9 0 0 1 0 5.8ZM17.3 5.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 3c-2.4 0-2.7 0-3.7.1C5 3.2 3.2 5 3.1 8.3 3 9.3 3 9.6 3 12s0 2.7.1 3.7c.1 3.3 1.9 5.1 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.3-.1 5.1-1.9 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7C20.8 5 19 3.2 15.7 3.1 14.7 3 14.4 3 12 3Zm0 1.6c2.4 0 2.6 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1 1 .1 1.2.1 3.6s0 2.6-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-1 .1-1.2.1-3.6.1s-2.6 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-1-.1-1.2-.1-3.6s0-2.6.1-3.6C4.8 6 6 4.8 8.4 4.7c1-.1 1.2-.1 3.6-.1Z" />
  </svg>
);

export const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.4 2 2 6.1 2 11.6c0 2.9 1.2 5.4 3.1 7.1v3.3l3-1.7c1.2.3 2.5.5 3.9.5 5.6 0 10-4.1 10-9.6S17.6 2 12 2Zm1 12.9-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7-5.5 5.8Z" />
  </svg>
);

export const FlameIcon = () => (
  <svg viewBox="0 0 16 22" aria-hidden="true">
    <path d="M8 1c4 4.6 5 7.6 5 10a5 5 0 0 1-10 0c0-2.4 1-5.4 5-10Z" fill="#F2B65A" />
    <path d="M8 9c1.6 1.9 2 3.1 2 4a2 2 0 0 1-4 0c0-.9.4-2.1 2-4Z" fill="#FBF7F1" />
  </svg>
);
