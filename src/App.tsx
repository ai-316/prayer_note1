import { useEffect, useRef, useState } from "react";
import { BottomNav, type TabId } from "@/components/BottomNav";
import type { ViewMode } from "@/components/CalendarSection";
import { DayEditor } from "@/components/DayEditor";
import { HomePage } from "@/components/HomePage";
import { JournalPage } from "@/components/JournalPage";
import { SettingsPage } from "@/components/SettingsPage";
import { Toast, type ToastTone } from "@/components/Toast";
import { TreeMark, PenIcon } from "@/components/icons";
import { addDays } from "@/lib/date";
import {
  downloadCsv,
  loadEntries,
  saveEntries,
  type EntryMap,
} from "@/lib/storage";
import { toKey } from "@/lib/date";

type ToastState = { message: string; tone: ToastTone; id: number } | null;

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export default function App() {
  const [entries, setEntries] = useState<EntryMap>(() => loadEntries());
  const [tab, setTab] = useState<TabId>("calendar");
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState<Date>(() => startOfToday());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const notify = (message: string, tone: ToastTone = "success") => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ message, tone, id: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const openDay = (key: string) => setEditingKey(key);

  const editToday = () => {
    setTab("calendar");
    setEditingKey(toKey(new Date()));
  };

  const saveEntry = (content: string, key: string) => {
    setEntries((previous) => {
      const next: EntryMap = {
        ...previous,
        [key]: { date: key, content, updatedAt: new Date().toISOString() },
      };
      saveEntries(next);
      return next;
    });
    setEditingKey(null);
    notify("마음에 담았어요. 오늘도 평안하세요.");
  };

  const deleteEntry = (key: string) => {
    setEntries((previous) => {
      const next = { ...previous };
      delete next[key];
      saveEntries(next);
      return next;
    });
    setEditingKey(null);
    notify("그날의 기록을 조용히 비웠어요.", "info");
  };

  const importEntries = (imported: EntryMap) => {
    setEntries((previous) => {
      const next = { ...previous, ...imported };
      saveEntries(next);
      return next;
    });
  };

  const clearAll = () => {
    setEntries({});
    saveEntries({});
  };

  const exportBackup = () => {
    if (Object.keys(entries).length === 0) {
      notify("아직 백업할 기록이 없어요.", "info");
      return;
    }
    downloadCsv(entries);
    notify("CSV 파일로 마음을 백업했어요.");
  };

  return (
    <div className="relative min-h-dvh w-full">
      <div className="pointer-events-none fixed left-[max(1.5rem,calc(50%-39rem))] top-0 hidden h-full w-56 flex-col justify-center lg:flex">
        <p className="font-serif text-[27px] leading-[1.65] text-petal-700/45">
          조용한 마음의
          <br />
          작은 정원
        </p>
        <p className="mt-4 text-[9px] tracking-[0.28em] text-muted/60">EVERY DAY, A LITTLE PRAYER</p>
        <span className="mt-4 h-px w-12 bg-petal-300/50" />
        <p className="mt-4 max-w-[190px] text-[10px] leading-[1.9] text-muted/70">
          하루의 끝에 마음을 내려놓고,
          <br />
          오늘의 기도를 천천히 적어보세요.
        </p>
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-paper shadow-[0_0_90px_-30px_rgba(100,60,70,0.5)] sm:my-5 sm:min-h-[calc(100dvh-2.5rem)] sm:rounded-[32px] sm:border sm:border-white/80">
        <header className="sticky top-0 z-30 border-b border-petal-100/60 bg-paper/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl sm:rounded-t-[32px]">
          <div className="flex h-[58px] items-center justify-between gap-2 px-4">
            <button
              type="button"
              onClick={() => setTab("calendar")}
              aria-label="기도노트 홈으로"
              className="flex items-center gap-2 text-left"
            >
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[12px] bg-gradient-to-br from-petal-100 to-petal-200 text-petal-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <TreeMark className="h-[23px] w-[23px]" />
              </span>
              <span>
                <span className="block font-serif text-[16px] leading-none tracking-tight text-ink">
                  기도노트
                </span>
                <span className="mt-[3px] block text-[7px] tracking-[0.24em] text-muted">
                  PRAYER NOTE
                </span>
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="hidden rounded-full border border-petal-100 bg-petal-50/60 px-2.5 py-1.5 text-[9.5px] text-petal-600 xs:inline-flex">
                {Object.keys(entries).length}일의 마음
              </span>
              <button
                type="button"
                onClick={editToday}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-petal-500 to-petal-600 px-3 py-1.5 text-[10px] font-medium text-white shadow-[0_8px_18px_-12px_rgba(142,83,97,1)] transition hover:from-petal-600 hover:to-petal-700 active:scale-95"
              >
                <PenIcon className="h-3 w-3" />
                오늘 적기
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-8 pt-3">
          {tab === "calendar" && (
            <HomePage
              entries={entries}
              view={view}
              anchor={anchor}
              onViewChange={setView}
              onAnchorChange={(date) => setAnchor(addDays(date, 0))}
              onOpenDay={openDay}
              onOpenJournal={() => setTab("journal")}
              onEditToday={editToday}
            />
          )}

          {tab === "journal" && (
            <JournalPage
              entries={entries}
              onOpenDay={openDay}
              onExport={exportBackup}
              onGoCalendar={() => setTab("calendar")}
              onEditToday={editToday}
            />
          )}

          {tab === "settings" && (
            <SettingsPage
              entries={entries}
              onImport={importEntries}
              onClearAll={clearAll}
              onNotify={notify}
              onEditToday={editToday}
              onOpenJournal={() => setTab("journal")}
            />
          )}

          {tab === "calendar" && (
            <div className="mt-6 flex flex-col items-center gap-1.5 px-4 text-center">
              <TreeMark className="h-4 w-4 text-sage/80" />
              <p className="text-[9px] leading-relaxed tracking-wide text-muted/70">
                기도노트 · 마음이 머무는 작은 정원
              </p>
            </div>
          )}
        </main>

        <BottomNav tab={tab} onChange={setTab} />
      </div>

      {editingKey && (
        <DayEditor
          dateKey={editingKey}
          entry={entries[editingKey]}
          onSave={(content) => saveEntry(content, editingKey)}
          onDelete={() => deleteEntry(editingKey)}
          onClose={() => setEditingKey(null)}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.message} tone={toast.tone} />}
    </div>
  );
}
