import heroHill from "../assets/hero-hill.png";
import { cn } from "@/utils/cn";
import {
  formatLongKoreanDate,
  formatKoreanDate,
  fromKey,
  greeting,
  relativeDayLabel,
  toKey,
} from "@/lib/date";
import { calculateStats, sortEntries, type EntryMap } from "@/lib/storage";
import { CalendarSection, type ViewMode } from "./CalendarSection";
import { ChevronRight, LeafIcon, PenIcon, QuoteIcon, SunIcon } from "./icons";

export function HomePage({
  entries,
  view,
  anchor,
  onViewChange,
  onAnchorChange,
  onOpenDay,
  onOpenJournal,
  onEditToday,
}: {
  entries: EntryMap;
  view: ViewMode;
  anchor: Date;
  onViewChange: (view: ViewMode) => void;
  onAnchorChange: (date: Date) => void;
  onOpenDay: (key: string) => void;
  onOpenJournal: () => void;
  onEditToday: () => void;
}) {
  const now = new Date();
  const today = toKey(now);
  const { title, eyebrow } = greeting(now);
  const stats = calculateStats(entries);
  const recent = sortEntries(entries).slice(0, 3);
  const todayEntry = entries[today];

  return (
    <div className="animate-fade-rise">
      <section className="relative mt-1 overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-[#fdf1ec] via-[#f9e5e1] to-[#f3ded7] p-5 shadow-soft">
        <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/35 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-[#f7d8d2]/60 blur-2xl" />
        <div className="relative flex items-stretch justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-petal-700/85">
                <SunIcon className="h-3 w-3 text-petal-500" />
                {formatLongKoreanDate(now)}
              </p>
              <p className="mt-2 text-[10.5px] text-petal-700/65">{eyebrow}</p>
              <h1 className="mt-1 whitespace-pre-line font-serif text-[22px] leading-[1.5] tracking-[-0.01em] text-ink">
                {title}
              </h1>
              <p className="mt-2 text-[11px] leading-relaxed text-petal-700/65">
                마음의 소리를 조용히 적어두는 곳, 기도노트.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/65 px-2.5 py-1 text-[9.5px] font-medium text-petal-700 ring-1 ring-white/70 backdrop-blur-sm">
                <LeafIcon className="h-3 w-3 text-sage-deep" />
                {stats.streak > 0 ? `${stats.streak}일 이어가는 중` : "첫 기도를 기다려요"}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/45 px-2.5 py-1 text-[9.5px] text-petal-700/80 ring-1 ring-white/60 backdrop-blur-sm">
                이번 달 {stats.thisMonth}일의 기도
              </span>
            </div>
          </div>

          <div className="relative w-[104px] shrink-0 self-stretch xs:w-[116px]">
            <div className="absolute inset-0 overflow-hidden rounded-b-[22px] rounded-t-[54px] border border-white/70 shadow-[0_16px_30px_-20px_rgba(120,70,80,0.7)]">
              <img
                src={heroHill}
                alt="연한 분홍빛 언덕 위의 나무 수채화"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#e7b9b2]/20 to-transparent" />
            </div>
            <span className="absolute -left-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/80 bg-white/85 text-petal-500 shadow-sm backdrop-blur-sm">
              <QuoteIcon className="h-3 w-3" />
            </span>
          </div>
        </div>
      </section>

      <div className="mt-3.5 flex items-center justify-center gap-2.5 px-4">
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-petal-200" />
        <p className="text-center text-[10px] leading-relaxed tracking-wide text-muted">
          오늘 하루도 당신의 걸음에 평안이 있기를
        </p>
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-petal-200" />
      </div>

      <div className="mt-6">
        <CalendarSection
          view={view}
          anchor={anchor}
          entries={entries}
          onViewChange={onViewChange}
          onAnchorChange={onAnchorChange}
          onOpenDay={onOpenDay}
        />
      </div>

      <section className="mt-6" aria-label="최근 기도 기록">
        <div className="flex items-end justify-between px-0.5">
          <div>
            <p className="text-[10px] font-medium tracking-[0.18em] text-petal-500">RECENT MOMENTS</p>
            <h2 className="mt-0.5 font-serif text-[17px] text-ink">마음의 기록</h2>
          </div>
          <button
            type="button"
            onClick={onOpenJournal}
            className="inline-flex items-center gap-0.5 pb-1 text-[10.5px] text-muted transition hover:text-petal-600"
          >
            전체 보기
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-petal-200 bg-petal-50/40 px-5 py-7 text-center">
            <p className="font-serif text-[13px] leading-relaxed text-ink-soft">
              아직 담긴 마음이 없어요.
            </p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
              오늘의 작은 기도부터 천천히 시작해 보세요.
            </p>
            <button
              type="button"
              onClick={onEditToday}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-petal-500 px-3.5 py-2 text-[11px] font-medium text-white shadow-[0_8px_20px_-12px_rgba(142,83,97,1)] transition hover:bg-petal-600"
            >
              <PenIcon className="h-3.5 w-3.5" />
              오늘의 기도 적기
            </button>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {recent.map((entry, index) => {
              const date = fromKey(entry.date);
              return (
                <li key={entry.date} className={cn(index > 0 && "hidden xs:block")}>
                  <button
                    type="button"
                    onClick={() => onOpenDay(entry.date)}
                    className="group flex w-full items-start gap-3 rounded-2xl border border-petal-100/90 bg-paper px-3.5 py-3 text-left shadow-[0_6px_18px_-18px_rgba(142,83,97,0.7)] transition hover:border-petal-200 hover:bg-petal-50/30"
                  >
                    <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0 rounded-xl bg-gradient-to-b from-petal-50 to-petal-100/70 text-petal-600 ring-1 ring-petal-100">
                      <span className="text-[8.5px] tracking-wide text-petal-500">
                        {date.getMonth() + 1}월
                      </span>
                      <span className="font-serif text-[16px] leading-none">{date.getDate()}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-medium text-petal-600/90">
                          {relativeDayLabel(entry.date)}
                          {entry.date === today && (
                            <span className="ml-1.5 rounded-full bg-petal-100 px-1.5 py-[1px] text-[8.5px] text-petal-600">
                              오늘
                            </span>
                          )}
                        </span>
                        <ChevronRight className="h-3 w-3 shrink-0 text-petal-200 transition group-hover:translate-x-0.5 group-hover:text-petal-400" />
                      </span>
                      <span className="mt-1 line-clamp-2 block font-serif text-[12px] leading-[1.75] text-ink-soft/90">
                        {entry.content}
                      </span>
                      <span className="mt-0.5 block text-[9px] text-muted/70">
                        {formatKoreanDate(entry.date)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {!todayEntry && recent.length > 0 && (
          <button
            type="button"
            onClick={onEditToday}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-petal-200 bg-petal-50/30 py-2.5 text-[10.5px] text-petal-600 transition hover:bg-petal-50"
          >
            <PenIcon className="h-3 w-3" />
            오늘의 마음은 아직 비어 있어요 · 적어보기
          </button>
        )}
      </section>
    </div>
  );
}
