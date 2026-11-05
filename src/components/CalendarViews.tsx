import { cn } from "@/utils/cn";
import {
  WEEKDAYS,
  addDays,
  addMonths,
  daysBetween,
  fromKey,
  monthCells,
  toKey,
  weekdayColorClass,
} from "@/lib/date";
import type { EntryMap } from "@/lib/storage";
import { PenIcon, QuoteIcon } from "./icons";

type DayOpenHandler = (key: string) => void;

function EntryDot({ active, light = false }: { active: boolean; light?: boolean }) {
  return (
    <span
      className={cn(
        "block h-[4px] w-[4px] rounded-full transition",
        active ? (light ? "bg-white/90" : "bg-petal-400") : "bg-transparent",
      )}
    />
  );
}

export function WeekView({
  anchor,
  entries,
  today,
  onOpenDay,
}: {
  anchor: Date;
  entries: EntryMap;
  today: string;
  onOpenDay: DayOpenHandler;
}) {
  const start = addDays(anchor, -3);
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const todayEntry = entries[today];
  const currentMonth = new Date().getMonth();
  const showMonth =
    days[0].getMonth() !== days[6].getMonth() || days[0].getMonth() !== currentMonth;

  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = toKey(day);
          const isToday = key === today;
          const hasEntry = Boolean(entries[key]);
          const pastDiff = daysBetween(day, fromKey(today));
          const isDimmed = pastDiff > 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onOpenDay(key)}
              aria-label={`${formatAria(day)}${hasEntry ? ", 기록 있음" : ""}`}
              className={cn(
                "group relative flex flex-col items-center gap-1.5 rounded-2xl px-0.5 pb-2 pt-2.5 transition",
                isDimmed ? "opacity-60 hover:opacity-100" : "opacity-100",
                !isToday && "hover:bg-petal-50",
                isToday && "bg-petal-50/80 ring-1 ring-petal-100",
              )}
            >
              <span className={cn("text-[10px] font-medium tracking-wide", weekdayColorClass(day))}>
                {WEEKDAYS[day.getDay()]}
              </span>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-medium transition",
                  isToday
                    ? "bg-gradient-to-br from-petal-400 to-petal-600 text-white shadow-[0_7px_16px_-8px_rgba(142,83,97,0.85)]"
                    : "text-ink-soft group-hover:bg-white group-hover:text-petal-700",
                )}
              >
                {day.getDate()}
              </span>
              <span className="flex h-1.5 items-center justify-center">
                {hasEntry ? (
                  <EntryDot active light={isToday} />
                ) : (
                  <span className="block h-[4px] w-[4px]" />
                )}
              </span>
              {showMonth && (
                <span className="absolute -bottom-0.5 text-[8px] tracking-tight text-muted/80">
                  {day.getMonth() + 1}월
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-petal-100/90 bg-gradient-to-br from-petal-50 to-[#fdfaf6]">
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5">
          <div className="flex items-center gap-1.5 text-petal-600">
            <QuoteIcon className="h-3.5 w-3.5 opacity-70" />
            <span className="text-[10.5px] font-medium tracking-[0.12em]">오늘의 기도</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenDay(today)}
            className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[10.5px] font-medium text-petal-700 ring-1 ring-petal-200/70 transition hover:bg-white"
          >
            <PenIcon className="h-3 w-3" />
            {todayEntry ? "이어 적기" : "적어보기"}
          </button>
        </div>
        {todayEntry ? (
          <button
            type="button"
            onClick={() => onOpenDay(today)}
            className="block w-full px-4 pb-4 pt-2 text-left"
          >
            <p className="line-clamp-3 whitespace-pre-line font-serif text-[13px] leading-[1.85] text-ink-soft">
              {todayEntry.content}
            </p>
          </button>
        ) : (
          <p className="px-4 pb-4 pt-2 font-serif text-[13px] leading-[1.85] text-muted">
            아직 오늘의 마음이 비어 있어요.
            <br />
            잠시 멈추고, 지금 떠오르는 기도를 담아보세요.
          </p>
        )}
      </div>
    </div>
  );
}

export function MonthView({
  anchor,
  entries,
  today,
  onOpenDay,
}: {
  anchor: Date;
  entries: EntryMap;
  today: string;
  onOpenDay: DayOpenHandler;
}) {
  const cells = monthCells(anchor.getFullYear(), anchor.getMonth());
  return (
    <div>
      <div className="grid grid-cols-7 pb-1">
        {WEEKDAYS.map((label, index) => (
          <span
            key={label}
            className={cn(
              "text-center text-[10.5px] font-medium tracking-wide",
              index === 0 ? "text-petal-400" : index === 6 ? "text-sage-deep/80" : "text-muted",
            )}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1.5">
        {cells.map((day) => {
          const key = toKey(day);
          const outside = day.getMonth() !== anchor.getMonth();
          const isToday = key === today;
          const hasEntry = Boolean(entries[key]);
          const future = key > today;
          return (
            <div key={key} className="flex justify-center">
              <button
                type="button"
                onClick={() => onOpenDay(key)}
                aria-label={`${formatAria(day)}${hasEntry ? ", 기록 있음" : ""}`}
                title={entries[key]?.content.slice(0, 60)}
                className={cn(
                  "relative flex h-10 w-10 flex-col items-center justify-center rounded-full text-[13.5px] transition",
                  isToday &&
                    "bg-gradient-to-br from-petal-400 to-petal-600 font-medium text-white shadow-[0_7px_16px_-9px_rgba(142,83,97,0.9)]",
                  !isToday &&
                    hasEntry &&
                    "bg-petal-100/85 font-medium text-petal-700 ring-1 ring-petal-200/50 hover:bg-petal-100",
                  !isToday && !hasEntry && !outside && !future && "text-ink-soft hover:bg-petal-50",
                  !isToday && !hasEntry && future && "text-petal-300 hover:bg-petal-50/70",
                  !isToday && !hasEntry && outside && "text-petal-200 hover:bg-petal-50/60",
                  !isToday && hasEntry && outside && "opacity-60",
                )}
              >
                <span className={cn(hasEntry && !isToday && "translate-y-[-1px]")}>{day.getDate()}</span>
                <span className="absolute bottom-[6px] flex h-1 items-center justify-center">
                  {hasEntry ? (
                    <EntryDot active light={isToday} />
                  ) : (
                    <span className="block h-[4px] w-[4px]" />
                  )}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniMonth({
  year,
  monthIndex,
  entries,
  today,
  active,
  onOpenDay,
  onOpenMonth,
}: {
  year: number;
  monthIndex: number;
  entries: EntryMap;
  today: string;
  active: boolean;
  onOpenDay: DayOpenHandler;
  onOpenMonth: () => void;
}) {
  const cells = monthCells(year, monthIndex);
  const count = cells.filter(
    (day) => day.getMonth() === monthIndex && entries[toKey(day)],
  ).length;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-paper/90 p-2.5 transition",
        active
          ? "border-petal-300/70 bg-gradient-to-br from-petal-50 to-paper shadow-[0_8px_20px_-16px_rgba(142,83,97,0.7)]"
          : "border-petal-100/80 hover:border-petal-200",
      )}
    >
      <button
        type="button"
        onClick={onOpenMonth}
        className="flex w-full items-center justify-between gap-1 px-0.5"
      >
        <span
          className={cn(
            "font-serif text-[13px]",
            active ? "text-petal-700" : "text-ink-soft",
          )}
        >
          {monthIndex + 1}월
        </span>
        <span className="text-[8.5px] tracking-tight text-muted">
          {count > 0 ? `${count}일` : ""}
        </span>
      </button>
      <div className="mt-1.5 grid grid-cols-7">
        {WEEKDAYS.map((label, index) => (
          <span
            key={label}
            className={cn(
              "pb-0.5 text-center text-[7.5px] font-medium",
              index === 0 ? "text-petal-300" : index === 6 ? "text-sage/80" : "text-muted/60",
            )}
          >
            {label}
          </span>
        ))}
        {cells.map((day) => {
          if (day.getMonth() !== monthIndex) {
            return <span key={toKey(day)} className="h-[22px]" />;
          }
          const key = toKey(day);
          const isToday = key === today;
          const hasEntry = Boolean(entries[key]);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onOpenDay(key)}
              aria-label={`${formatAria(day)}${hasEntry ? ", 기록 있음" : ""}`}
              className={cn(
                "relative mx-auto flex h-[22px] w-[22px] items-center justify-center rounded-full text-[9.5px] transition",
                isToday && "bg-petal-500 font-medium text-white",
                !isToday && hasEntry && "bg-petal-100 font-medium text-petal-700",
                !isToday && !hasEntry && "text-muted/85 hover:bg-petal-50",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HalfYearView({
  anchor,
  entries,
  today,
  onOpenDay,
  onOpenMonth,
}: {
  anchor: Date;
  entries: EntryMap;
  today: string;
  onOpenDay: DayOpenHandler;
  onOpenMonth: (date: Date) => void;
}) {
  const months = Array.from({ length: 6 }, (_, index) => addMonths(anchor, index - 2));
  const todayDate = fromKey(today);
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {months.map((monthDate) => (
        <MiniMonth
          key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}
          year={monthDate.getFullYear()}
          monthIndex={monthDate.getMonth()}
          entries={entries}
          today={today}
          active={
            todayDate.getFullYear() === monthDate.getFullYear() &&
            todayDate.getMonth() === monthDate.getMonth()
          }
          onOpenDay={onOpenDay}
          onOpenMonth={() => onOpenMonth(monthDate)}
        />
      ))}
    </div>
  );
}

export function YearView({
  anchor,
  entries,
  today,
  onOpenMonth,
}: {
  anchor: Date;
  entries: EntryMap;
  today: string;
  onOpenMonth: (date: Date) => void;
}) {
  const year = anchor.getFullYear();
  const todayDate = fromKey(today);
  const yearCount = Object.keys(entries).filter((key) => key.startsWith(`${year}-`)).length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, monthIndex) => {
          const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
          const count = monthEntryCount(entries, year, monthIndex);
          const isCurrent =
            todayDate.getFullYear() === year && todayDate.getMonth() === monthIndex;
          return (
            <button
              key={monthIndex}
              type="button"
              onClick={() => onOpenMonth(new Date(year, monthIndex, 1))}
              aria-label={`${year}년 ${monthIndex + 1}월, ${count}일 기록`}
              className={cn(
                "group rounded-2xl border p-2.5 text-left transition",
                isCurrent
                  ? "border-petal-300/80 bg-gradient-to-br from-petal-50 to-paper"
                  : count > 0
                    ? "border-petal-100 bg-petal-50/40 hover:border-petal-200 hover:bg-petal-50/70"
                    : "border-petal-100/70 bg-paper/70 hover:border-petal-200 hover:bg-petal-50/50",
              )}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className={cn(
                    "font-serif text-[12px]",
                    isCurrent ? "text-petal-700" : "text-ink-soft",
                  )}
                >
                  {monthIndex + 1}월
                </span>
                {count > 0 && (
                  <span className="text-[8px] text-muted group-hover:text-petal-600">{count}</span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-[3px]">
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const key = `${year}-${`${monthIndex + 1}`.padStart(2, "0")}-${`${i + 1}`.padStart(2, "0")}`;
                  const hasEntry = Boolean(entries[key]);
                  const isToday = key === today;
                  return (
                    <span
                      key={key}
                      className={cn(
                        "aspect-square rounded-[2px] transition",
                        hasEntry && "bg-petal-400/85",
                        !hasEntry && "bg-petal-100/70",
                        isToday && "bg-petal-600 ring-1 ring-white",
                      )}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[10px] text-muted">
        {year}년 · {yearCount}일의 기도가 담겨 있어요
      </p>
    </div>
  );
}

function monthEntryCount(entries: EntryMap, year: number, monthIndex: number): number {
  const prefix = `${year}-${`${monthIndex + 1}`.padStart(2, "0")}-`;
  return Object.keys(entries).filter((key) => key.startsWith(prefix)).length;
}

function formatAria(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
}
