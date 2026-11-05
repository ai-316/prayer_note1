export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function toKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function todayKey(): string {
  return toKey(new Date());
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return startOfDay(next);
}

export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(
    date.getDate(),
    new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate(),
  );
  return new Date(target.getFullYear(), target.getMonth(), day);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function daysBetween(a: Date, b: Date): number {
  const first = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const second = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((second - first) / 86_400_000);
}

export function formatKoreanDate(key: string): string {
  const date = fromKey(key);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
}

export function formatLongKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
}

export function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function formatRangeLabel(start: Date, end: Date): string {
  if (start.getFullYear() !== end.getFullYear()) {
    return `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getFullYear()}년 ${end.getMonth() + 1}월 ${end.getDate()}일`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getMonth() + 1}월 ${end.getDate()}일`;
  }
  return `${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getDate()}일`;
}

export function relativeDayLabel(key: string): string {
  const diff = daysBetween(new Date(), fromKey(key));
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  if (diff === 2) return "그제";
  if (diff === -1) return "내일";
  if (diff === -2) return "모레";
  return formatKoreanDate(key);
}

/** 42 cells (6 weeks), Sunday-first, covering the given month. */
export function monthCells(year: number, monthIndex: number): Date[] {
  const first = new Date(year, monthIndex, 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

export function monthEntryCounts(
  entries: Record<string, { date: string }>,
  year: number,
  monthIndex: number,
): number {
  const prefix = `${year}-${`${monthIndex + 1}`.padStart(2, "0")}-`;
  return Object.keys(entries).filter((key) => key.startsWith(prefix)).length;
}

export function greeting(date = new Date()): { eyebrow: string; title: string } {
  const hour = date.getHours();
  if (hour < 5) return { eyebrow: "고요한 밤이에요", title: "마지막 마음을\n조용히 남겨요" };
  if (hour < 11) return { eyebrow: "포근한 아침이에요", title: "오늘의 마음을\n천천히 적어봐요" };
  if (hour < 17) return { eyebrow: "따뜻한 오후예요", title: "잠시 멈추고\n마음을 들여다봐요" };
  if (hour < 21) return { eyebrow: "차분한 저녁이에요", title: "하루의 기도를\n조용히 담아둬요" };
  return { eyebrow: "편안한 밤이에요", title: "오늘 하루도\n수고 많았어요" };
}

export function weekdayColorClass(date: Date): string {
  if (date.getDay() === 0) return "text-petal-500";
  if (date.getDay() === 6) return "text-sage-deep";
  return "text-muted";
}

export function isFuture(key: string): boolean {
  return key > todayKey();
}

export function isEditable(key: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && !Number.isNaN(fromKey(key).getTime());
}
