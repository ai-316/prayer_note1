import { useMemo, useState } from "react";
import noteDesk from "../assets/note-desk.png";
import {
  formatKoreanDate,
  formatLongKoreanDate,
  fromKey,
  relativeDayLabel,
} from "@/lib/date";
import { formatUpdatedAt, sortEntries, type EntryMap } from "@/lib/storage";
import { CalendarIcon, DownloadIcon, PenIcon, SearchIcon } from "./icons";

export function JournalPage({
  entries,
  onOpenDay,
  onExport,
  onGoCalendar,
  onEditToday,
}: {
  entries: EntryMap;
  onOpenDay: (key: string) => void;
  onExport: () => void;
  onGoCalendar: () => void;
  onEditToday: () => void;
}) {
  const [query, setQuery] = useState("");
  const all = useMemo(() => sortEntries(entries), [entries]);
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? all.filter((entry) => {
        const readable = `${formatLongKoreanDate(fromKey(entry.date))} ${relativeDayLabel(entry.date)} ${entry.content}`;
        return readable.toLowerCase().includes(normalizedQuery);
      })
    : all;

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, entry) => {
    const date = fromKey(entry.date);
    const label = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    if (!acc[label]) acc[label] = [];
    acc[label].push(entry);
    return acc;
  }, {});

  return (
    <div className="animate-fade-rise pt-1">
      <header className="flex items-end justify-between gap-3 px-0.5">
        <div>
          <p className="text-[10px] font-medium tracking-[0.18em] text-petal-500">PRAYER JOURNAL</p>
          <h1 className="mt-0.5 font-serif text-[23px] text-ink">마음의 기록</h1>
          <p className="mt-1 text-[11px] text-muted">
            {all.length > 0 ? `${all.length}일의 기도가 조용히 쌓였어요` : "천천히, 하나씩 쌓여갑니다"}
          </p>
        </div>
        <button
          type="button"
          onClick={onExport}
          aria-label="CSV로 백업하기"
          className="mb-1 flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-petal-100 bg-paper px-3 text-[10.5px] font-medium text-petal-600 transition hover:border-petal-200 hover:bg-petal-50"
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          CSV
        </button>
      </header>

      {all.length > 0 && (
        <div className="relative mt-4">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-petal-300" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="기도 내용이나 날짜로 찾아보세요"
            aria-label="기도 기록 검색"
            className="w-full rounded-2xl border border-petal-100 bg-paper py-2.5 pl-9 pr-9 text-[11.5px] text-ink placeholder:text-muted/70 shadow-[0_6px_18px_-20px_rgba(142,83,97,0.7)] focus:border-petal-300 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full px-1.5 py-0.5 text-[10px] text-muted hover:bg-petal-50"
            >
              지우기
            </button>
          )}
        </div>
      )}

      {all.length === 0 && (
        <div className="mt-6 overflow-hidden rounded-[26px] border border-petal-100 bg-gradient-to-br from-petal-50 to-paper px-5 py-7 text-center shadow-soft">
          <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white/80 shadow-[0_16px_30px_-22px_rgba(120,70,80,0.8)]">
            <img src={noteDesk} alt="따뜻한 아침 책상 수채화" className="h-full w-full object-cover" />
          </div>
          <p className="mt-4 font-serif text-[16px] text-ink">첫 마음을 기다리고 있어요</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
            잘 쓰지 않아도 괜찮아요.
            <br />
            오늘 떠오른 한 문장이면 충분합니다.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={onEditToday}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-petal-500 to-petal-600 py-2.5 text-[12px] font-medium text-white shadow-[0_10px_22px_-14px_rgba(142,83,97,1)] transition hover:from-petal-600 hover:to-petal-700"
            >
              <PenIcon className="h-3.5 w-3.5" />
              오늘의 기도 적기
            </button>
            <button
              type="button"
              onClick={onGoCalendar}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-petal-100 bg-white/70 py-2.5 text-[11px] text-ink-soft transition hover:bg-white"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              달력으로 돌아가기
            </button>
          </div>
        </div>
      )}

      {all.length > 0 && filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-petal-200 bg-petal-50/40 px-5 py-9 text-center">
          <p className="font-serif text-[13.5px] text-ink-soft">검색된 마음이 없어요</p>
          <p className="mt-1 text-[10.5px] text-muted">다른 단어나 날짜로 찾아보세요.</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 rounded-full border border-petal-200 bg-paper px-3.5 py-1.5 text-[10.5px] text-petal-600 hover:bg-petal-50"
          >
            전체 기록 보기
          </button>
        </div>
      )}

      <div className="mt-5 space-y-6">
        {Object.entries(grouped).map(([monthLabel, monthEntries]) => (
          <section key={monthLabel} aria-label={monthLabel}>
            <div className="mb-2 flex items-center gap-2.5 px-1">
              <h2 className="font-serif text-[13px] text-petal-700">{monthLabel}</h2>
              <span className="text-[9.5px] text-muted">{monthEntries.length}일</span>
              <span className="h-px flex-1 bg-gradient-to-r from-petal-100 to-transparent" />
            </div>
            <ul className="space-y-2">
              {monthEntries.map((entry) => (
                <li key={entry.date}>
                  <button
                    type="button"
                    onClick={() => onOpenDay(entry.date)}
                    className="group w-full rounded-2xl border border-petal-100/90 bg-paper px-4 py-3.5 text-left shadow-[0_6px_18px_-20px_rgba(142,83,97,0.7)] transition hover:border-petal-200 hover:bg-petal-50/30"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-[10.5px] font-medium text-petal-600">
                          {relativeDayLabel(entry.date)}
                        </span>
                        <span className="h-2.5 w-px bg-petal-200" />
                        <span className="text-[10px] text-muted">{formatKoreanDate(entry.date)}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-petal-50 px-2 py-0.5 text-[8.5px] text-petal-500">
                        {entry.content.trim().length}자
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-4 whitespace-pre-line font-serif text-[12.5px] leading-[1.9] text-ink-soft/95">
                      {entry.content}
                    </p>
                    <div className="mt-2 flex items-center justify-between border-t border-petal-100/60 pt-1.5">
                      <span className="text-[8.5px] text-muted/70">
                        마지막 기록 {formatUpdatedAt(entry.updatedAt)}
                      </span>
                      <span className="text-[8.5px] text-petal-400 opacity-0 transition group-hover:opacity-100">
                        이어 적기 →
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {all.length > 0 && (
        <p className="mt-7 text-center text-[9.5px] leading-relaxed text-muted/70">
          모든 기록은 이 기기 안에만 머물러 있어요.
          <br />
          소중한 마음은 가끔 CSV로 백업해 주세요.
        </p>
      )}
    </div>
  );
}
