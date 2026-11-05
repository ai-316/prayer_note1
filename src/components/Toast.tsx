import { CheckIcon, LeafIcon } from "./icons";

export type ToastTone = "success" | "info" | "error";

export function Toast({ message, tone }: { message: string; tone: ToastTone }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[86px] z-[70] flex justify-center px-5"
    >
      <div className="animate-toast-in flex max-w-[340px] items-center gap-2 rounded-full border border-white/70 bg-[#4b383d]/95 px-4 py-2.5 text-white shadow-[0_18px_40px_-18px_rgba(69,51,56,0.8)] backdrop-blur">
        {tone === "success" ? (
          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#f3d3d1]" />
        ) : (
          <LeafIcon className="h-3.5 w-3.5 shrink-0 text-[#f3d3d1]" />
        )}
        <span className="text-[11px] leading-snug tracking-tight">{message}</span>
      </div>
    </div>
  );
}
