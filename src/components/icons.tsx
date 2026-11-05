import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function TreeMark({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden {...props}>
      <path d="M20 32V13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M20 18c0-6 4.6-9.6 9.6-9.6 0 6-4.6 9.6-9.6 9.6Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M20 25c0-4.6-3.6-8.2-8.2-8.2 0 4.6 3.6 8.2 8.2 8.2Z" fill="currentColor" opacity="0.55" />
      <path d="M20 32c-4 0-6.5-1.6-7.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 32c4 0 6.5-1.6 7.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="m14.5 5.5-6 6.5 6 6.5" />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="m9.5 5.5 6 6.5-6 6.5" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <rect x="3.2" y="5" width="17.6" height="16" rx="4" />
      <path d="M8 3v4M16 3v4M3.5 10.2h17" />
      <path d="M8 14.2h.01M12 14.2h.01M16 14.2h.01M8 17.8h.01M12 17.8h.01" strokeWidth="2.2" />
    </svg>
  );
}

export function JournalIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M5 5.6A2.6 2.6 0 0 1 7.6 3H19v15.5H7.7A2.7 2.7 0 0 0 5 21.2V5.6Z" />
      <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19M9 7.5h6M9 11h4.5" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.36a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.82-2.83l.06-.06A1.7 1.7 0 0 0 4.53 15a1.7 1.7 0 0 0-1.55-1H2.9a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.54 8.9a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.82-2.82l.06.06A1.7 1.7 0 0 0 9 4.54h.08a1.7 1.7 0 0 0 1-1.55V2.9a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.82 2.82l-.06.06A1.7 1.7 0 0 0 19.46 9v.08a1.7 1.7 0 0 0 1.55 1h.09a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4 16.5v1.8A2.7 2.7 0 0 0 6.7 21h10.6a2.7 2.7 0 0 0 2.7-2.7v-1.8" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M12 15.5v-11M7.5 8.5 12 4l4.5 4.5M4 16.5v1.8A2.7 2.7 0 0 0 6.7 21h10.6a2.7 2.7 0 0 0 2.7-2.7v-1.8" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <circle cx="10.8" cy="10.8" r="6.6" />
      <path d="m16 16 4.4 4.4" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M4 7h16M9.5 7V4.8A1.8 1.8 0 0 1 11.3 3h1.4a1.8 1.8 0 0 1 1.8 1.8V7M6.5 7l.8 11.2A2.8 2.8 0 0 0 10 21h4a2.8 2.8 0 0 0 2.7-2.8L17.5 7M10 11v6M14 11v6" />
    </svg>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="m14.2 5.2 4.6 4.6M4 20l1.1-4.7L15.8 4.6a2.3 2.3 0 0 1 3.3 0l.3.3a2.3 2.3 0 0 1 0 3.3L8.7 18.9 4 20Z" />
      <path d="m13.6 6.8 3.6 3.6" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M5 19c0-7.5 5.5-13 14-14 .5 8.5-5 14-14 14Z" />
      <path d="M4 21c2.5-6 6-9.5 12-12" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M12 3.5c.8 4.6 2.9 6.7 7.5 7.5-4.6.8-6.7 2.9-7.5 7.5-.8-4.6-2.9-6.7-7.5-7.5 4.6-.8 6.7-2.9 7.5-7.5Z" />
      <path d="M18.5 16.5c.3 1.7 1.1 2.5 2.8 2.8-1.7.3-2.5 1.1-2.8 2.8-.3-1.7-1.1-2.5-2.8-2.8 1.7-.3 2.5-1.1 2.8-2.8Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M6.5 17.5 17.5 6.5M8.5 6.5h9v9" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M12 3 5 6v5.5c0 4.4 2.9 7.6 7 9.5 4.1-1.9 7-5.1 7-9.5V6l-7-3Z" />
      <path d="m8.8 12.2 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.32 9.32 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function SmartphoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
      <path d="M10.5 5.5h3M11 18.5h2" />
    </svg>
  );
}

export function QuoteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M9.5 5.5c-3.2 1.4-5 4.2-5 7.9v5.1h6.2v-6.2H7.4c0-2.2 1-3.7 2.9-4.6l-.8-2.2Zm9.2 0c-3.2 1.4-5 4.2-5 7.9v5.1h6.2v-6.2h-3.3c0-2.2 1-3.7 2.9-4.6l-.8-2.2Z" />
    </svg>
  );
}
