import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { formatKoreanDate, relativeDayLabel } from "@/lib/date";
import { formatUpdatedAt, type PrayerEntry } from "@/lib/storage";
import { CloseIcon, LeafIcon, PenIcon, TrashIcon } from "./icons";

const PROMPTS = [
  "오늘 감사했던 작은 일",
  "마음이 머물렀던 순간",
  "지금 기도하고 싶은 마음",
];

export function DayEditor({
  dateKey,
  entry,
  onSave,
  onDelete,
  onClose,
}: {
  dateKey: string;
  entry?: PrayerEntry;
  onSave: (content: string) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(entry?.content ?? "");
  const [attemptingClose, setAttemptingClose] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dirty = draft !== (entry?.content ?? "");
  const relativeLabel = relativeDayLabel(dateKey);
  const dayLabel = /^(오늘|어제|그제|내일|모레)$/.test(relativeLabel)
    ? `${relativeLabel} · ${formatKoreanDate(dateKey)}`
    : relativeLabel;

  useEffect(() => {
    setDraft(entry?.content ?? "");
  }, [dateKey, entry?.content]);

  useEffect(() => {
    const timer = window.setTimeout(() => textareaRef.current?.focus(), 260);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const save = () => {
    if (!draft.trim()) return;
    onSave(draft.trim());
  };

  const requestClose = () => {
    if (dirty && draft.trim()) {
      setAttemptingClose(true);
      return;
    }
    onClose();
  };

  const discard = () => {
    if (entry) setDraft(entry.content);
    else setDraft("");
    setAttemptingClose(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={`${formatKoreanDate(dateKey)} 기도 기록`}>
      <div
        className="absolute inset-0 animate-veil-in bg-[#3c2b30]/35 backdrop-blur-[3px]"
        onClick={requestClose}
      />
      <div className="relative flex max-h-[92dvh] w-full max-w-[480px] animate-sheet-up flex-col overflow-hidden rounded-t-[32px] border border-petal-100 bg-paper shadow-[0_-20px_60px_-20px_rgba(69,51,56,0.35)]">
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-petal-200" aria-hidden />

        <div className="flex items-start justify-between gap-3 px-5 pb-2 pt-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10.5px] font-medium tracking-[0.12em] text-petal-500">
              <LeafIcon className="h-3 w-3" />
              {dayLabel}
            </p>
            <h2 className="mt-1.5 font-serif text-[21px] leading-tight text-ink">그날의 기도</h2>
            <p className="mt-1 text-[11.5px] text-muted">깨달음과 마음의 소리를 조용히 적어두세요.</p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="닫기"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-petal-100 bg-paper text-muted transition hover:bg-petal-50 hover:text-petal-700"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
          {!draft && !entry && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setDraft(`${prompt}\n`);
                    textareaRef.current?.focus();
                  }}
                  className="rounded-full border border-petal-100 bg-petal-50/70 px-3 py-1.5 text-[10.5px] text-petal-700 transition hover:border-petal-200 hover:bg-petal-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="relative overflow-hidden rounded-2xl border border-petal-100 bg-gradient-to-b from-petal-50/60 to-paper">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  save();
                }
                if (event.key === "Escape") requestClose();
              }}
              placeholder="오늘 마음에 남은 기도와 깨달음을&#10;천천히 적어보세요."
              rows={8}
              className="lined-paper block max-h-[42dvh] min-h-[190px] w-full resize-none border-0 bg-transparent px-4 py-3.5 font-serif text-[14px] leading-[2] text-ink placeholder:font-sans placeholder:text-[12.5px] placeholder:leading-[1.9] placeholder:text-muted/70 focus:outline-none"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-paper to-transparent" />
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-[10px] text-muted/80">
              {draft.trim() ? `${draft.trim().length}자` : "자유롭게 적어보세요"}
            </span>
            <span className="text-[9.5px] text-muted/70">⌘/Ctrl + Enter 로 담기</span>
          </div>

          {entry && !dirty && (
            <p className="mt-2 px-1 text-[10px] text-muted/80">
              마지막 기록 · {formatUpdatedAt(entry.updatedAt)}
            </p>
          )}

          {attemptingClose && (
            <div className="mt-3 animate-fade-rise rounded-2xl border border-petal-200 bg-petal-50 px-3.5 py-3">
              <p className="text-[11.5px] leading-relaxed text-petal-700">
                아직 담지 않은 마음이 있어요. 저장하지 않고 닫을까요?
              </p>
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={save}
                  className="flex-1 rounded-full bg-petal-500 py-2 text-[11px] font-medium text-white transition hover:bg-petal-600"
                >
                  저장하고 담기
                </button>
                <button
                  type="button"
                  onClick={discard}
                  className="flex-1 rounded-full border border-petal-200 bg-paper py-2 text-[11px] text-ink-soft transition hover:bg-petal-50"
                >
                  그냥 닫기
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-petal-100/80 bg-paper/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
          {entry && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("이 날의 기도 기록을 지울까요? 되돌릴 수 없어요.")) onDelete();
              }}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-petal-100 text-muted transition hover:border-petal-200 hover:bg-petal-50 hover:text-petal-600"
              aria-label="기록 지우기"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!draft.trim()}
            className={cn(
              "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-medium transition",
              draft.trim()
                ? "bg-gradient-to-r from-petal-500 to-petal-600 text-white shadow-[0_10px_24px_-14px_rgba(142,83,97,1)] hover:from-petal-600 hover:to-petal-700 active:scale-[0.99]"
                : "bg-petal-100 text-petal-400",
            )}
          >
            <PenIcon className="h-4 w-4" />
            마음에 담기
          </button>
        </div>
      </div>
    </div>
  );
}
