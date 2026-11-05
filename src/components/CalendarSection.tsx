import { cn } from "@/utils/cn";
import {
  WEEKDAYS,
  addDays,
  addMonths,
  formatMonthLabel,
  isSameDay,
  monthEntryCounts,
  toKey,
} from "@/lib/date";
import type { EntryMap } from "@/lib/storage";
import { HalfYearView, MonthView, WeekView, YearView } from "./CalendarViews";
import { ChevronLeft, ChevronRight, SunIcon } from "./icons";

export type ViewMode = "week" | "month" | "half" | "year";

const VIEW_OPTIONS: Array<{ id: ViewMode; label: string }> = [
  { id: "week", label: "1주" },
  { id: "month", label: "1달" },
  { id: "half", label: "6개월" },
  { id: "year", label: "1년" },
];

export function ViewSwitch({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="달력 보기 기간"
      className="grid grid-cols-4 gap-1 rounded-full border border-petal-100 bg-paper/90 p-1 shadow-[0_8px_22px_-20px_rgba(142,83,97,0.8)]"
    >
      {VIEW_OPTIONS.map((option) => {
        const active = option.id === view;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-full py-2 text-[12px] font-medium tracking-wide transition-all duration-300",
              active
                ? "bg-gradient-to-b from-petal-500 to-petal-600 text-white shadow-[0_6px_16px_-9px_rgba(142,83,97,1)]"
                : "text-muted hover:bg-petal-50 hover:text-petal-700",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function CalendarSection({
  view,
  anchor,
  entries,
  onViewChange,
  onAnchorChange,
  onOpenDay,
}: {
  view: ViewMode;
  anchor: Date;
  entries: EntryMap;
  onViewChange: (view: ViewMode) => void;
  onAnchorChange: (date: Date) => void;
  onOpenDay: (key: string) => void;
}) {
  const todayDate = new Date();
  const today = toKey(todayDate);
  const centeredOnToday = isSameDay(anchor, todayDate);

  const move = (direction: 1 | -1) => {
    if (view === "week") onAnchorChange(addDays(anchor, direction * 7));
    else if (view === "month") onAnchorChange(addMonths(anchor, direction));
    else if (view === "half") onAnchorChange(addMonths(anchor, direction * 6));
    else onAnchorChange(new Date(anchor.getFullYear() + direction, anchor.getMonth(), 1));
  };

  let title = "";
  let subtitle = "";

  if (view === "week") {
    const start = addDays(anchor, -3);
    const end = addDays(anchor, 3);
    title =
      start.getMonth() === end.getMonth()
        ? `${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getDate()}일`
        : `${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getMonth() + 1}월 ${end.getDate()}일`;
    subtitle = centeredOnToday ? "오늘을 중심으로" : `7일의 마음 · ${anchor.getFullYear()}년`;
  } else if (view === "month") {
    title = formatMonthLabel(anchor);
    const count = monthEntryCounts(entries, anchor.getFullYear(), anchor.getMonth());
    subtitle = count > 0 ? `${count}일의 기도가 머물러 있어요` : "천천히, 오늘부터 시작해요";
  } else if (view === "half") {
    const start = addMonths(anchor, -2);
    const end = addMonths(anchor, 3);
    title =
      start.getFullYear() === end.getFullYear()
        ? `${start.getFullYear()}년 ${start.getMonth() + 1}월 – ${end.getMonth() + 1}월`
        : `${start.getFullYear()}년 ${start.getMonth() + 1}월 – ${end.getFullYear()}년 ${end.getMonth() + 1}월`;
    subtitle = "6개월의 마음 둘러보기";
  } else {
    title = `${anchor.getFullYear()}년`;
    subtitle = "한 해의 기도를 한눈에";
  }

  const monthToView = (date: Date) => {
    onAnchorChange(date);
    onViewChange("month");
  };

  return (
    <section aria-label="기도 달력">
      <div className="mb-3 flex items-end justify-between px-0.5">
        <div>
          <p className="text-[10px] font-medium tracking-[0.18em] text-petal-500">MY PRAYER GARDEN</p>
          <h2 className="mt-0.5 font-serif text-[17px] text-ink">마음의 달력</h2>
        </div>
        <button
          type="button"
          onClick={() => onAnchorChange(new Date())}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10.5px] font-medium transition",
            centeredOnToday
              ? "border-petal-200 bg-petal-50 text-petal-600"
              : "border-petal-100 bg-paper text-muted hover:border-petal-200 hover:text-petal-600",
          )}
        >
          <SunIcon className="h-3 w-3" />
          오늘로
        </button>
      </div>

      <ViewSwitch view={view} onChange={onViewChange} />

      <div className="mt-3 rounded-[26px] border border-petal-100 bg-paper p-4 shadow-soft sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="이전 기간"
            onClick={() => move(-1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-petal-100 bg-paper text-ink-soft transition hover:border-petal-200 hover:bg-petal-50 hover:text-petal-700 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 text-center">
            <h3 className="truncate font-serif text-[16px] leading-tight text-ink">{title}</h3>
            <p className="mt-0.5 text-[10px] tracking-wide text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            aria-label="다음 기간"
            onClick={() => move(1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-petal-100 bg-paper text-ink-soft transition hover:border-petal-200 hover:bg-petal-50 hover:text-petal-700 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {view === "week" && (
          <WeekView anchor={anchor} entries={entries} today={today} onOpenDay={onOpenDay} />
        )}
        {view === "month" && (
          <MonthView anchor={anchor} entries={entries} today={today} onOpenDay={onOpenDay} />
        )}
        {view === "half" && (
          <HalfYearView
            anchor={anchor}
            entries={entries}
            today={today}
            onOpenDay={onOpenDay}
            onOpenMonth={monthToView}
          />
        )}
        {view === "year" && (
          <YearView anchor={anchor} entries={entries} today={today} onOpenMonth={monthToView} />
        )}

        <div className="mt-4 flex items-center justify-between border-t border-petal-100/80 pt-2.5">
          <p className="text-[9.5px] leading-relaxed text-muted">
            날짜를 누르면 그날의 기도를 적을 수 있어요
          </p>
          <span className="flex items-center gap-1 text-[9px] text-muted/80">
            <span className="h-1.5 w-1.5 rounded-full bg-petal-300" />
            기록 있음
          </span>
        </div>
      </div>
    </section>
  );
}

export { WEEKDAYS };
