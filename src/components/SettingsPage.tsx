import { useRef, useState } from "react";
import workflowYml from "../../.github/workflows/android-apk.yml?raw";
import noteDesk from "../assets/note-desk.png";
import { calculateStats, downloadCsv, formatUpdatedAt, parseBackupCsv, type EntryMap } from "@/lib/storage";
import { downloadSourceZip } from "@/lib/source-export";
import { cn } from "@/utils/cn";
import {
  CheckIcon,
  ChevronDown,
  DownloadIcon,
  GithubIcon,
  LeafIcon,
  ShieldIcon,
  SmartphoneIcon,
  SparkleIcon,
  TrashIcon,
  UploadIcon,
} from "./icons";

const LAST_BACKUP_KEY = "prayer-note.last-backup";

function Section({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-petal-100/90 bg-paper p-4 shadow-[0_10px_28px_-26px_rgba(142,83,97,0.6)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-serif text-[15px] text-ink">{title}</h2>
          {description && (
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{description}</p>
          )}
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-petal-50 px-2 py-1 text-[8.5px] font-medium tracking-wide text-petal-500 ring-1 ring-petal-100">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export function SettingsPage({
  entries,
  onImport,
  onClearAll,
  onNotify,
  onEditToday,
  onOpenJournal,
}: {
  entries: EntryMap;
  onImport: (imported: EntryMap) => void;
  onClearAll: () => void;
  onNotify: (message: string, tone?: "success" | "info" | "error") => void;
  onEditToday: () => void;
  onOpenJournal: () => void;
}) {
  const stats = calculateStats(entries);
  const [lastBackup, setLastBackup] = useState<string | null>(() =>
    typeof window === "undefined" ? null : window.localStorage.getItem(LAST_BACKUP_KEY),
  );
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (stats.total === 0) {
      onNotify("아직 백업할 기록이 없어요.", "info");
      return;
    }
    downloadCsv(entries);
    const stamp = new Date().toISOString();
    try {
      window.localStorage.setItem(LAST_BACKUP_KEY, stamp);
    } catch {
      // ignore storage errors
    }
    setLastBackup(stamp);
    onNotify("CSV 파일로 마음을 백업했어요.");
  };

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    setImportNotice(null);
    try {
      const text = await file.text();
      const result = parseBackupCsv(text);
      if (result.error) {
        setImportNotice(result.error);
        onNotify("CSV 파일을 확인해 주세요.", "error");
        return;
      }
      onImport(result.entries);
      const message = result.skipped
        ? `${result.imported}일의 기록을 불러왔어요. (${result.skipped}줄은 건너뜀)`
        : `${result.imported}일의 기록을 불러왔어요.`;
      setImportNotice(message);
      onNotify("마음의 기록을 불러왔어요.");
    } catch {
      setImportNotice("파일을 읽지 못했어요. 다시 시도해 주세요.");
      onNotify("파일을 읽지 못했어요.", "error");
    }
  };

  const handleSourceDownload = async () => {
    setSourceLoading(true);
    try {
      await downloadSourceZip();
      onNotify("앱 소스 ZIP을 내려받았어요.");
    } catch {
      onNotify("ZIP을 만드는 중 문제가 생겼어요. 다시 시도해 주세요.", "error");
    } finally {
      setSourceLoading(false);
    }
  };

  const copyWorkflow = async () => {
    try {
      await navigator.clipboard.writeText(workflowYml);
      setCopied(true);
      onNotify("빌드 워크플로를 복사했어요.");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      onNotify("복사하지 못했어요. 파일 내용을 직접 선택해 주세요.", "error");
    }
  };

  return (
    <div className="animate-fade-rise pt-1">
      <header className="px-0.5">
        <p className="text-[10px] font-medium tracking-[0.18em] text-petal-500">SETTINGS & BACKUP</p>
        <h1 className="mt-0.5 font-serif text-[23px] text-ink">설정</h1>
        <p className="mt-1 text-[11px] text-muted">기도노트를 오래, 안전하게 간직하는 방법</p>
      </header>

      <div className="relative mt-4 overflow-hidden rounded-[26px] border border-petal-100 bg-gradient-to-br from-petal-50 via-paper to-[#f8f1e7] p-4 shadow-soft">
        <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-petal-100/70 blur-2xl" />
        <div className="relative flex items-center gap-3.5">
          <div className="h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[20px] border-2 border-white/90 shadow-[0_12px_24px_-18px_rgba(120,70,80,0.9)]">
            <img src={noteDesk} alt="아침 책상 수채화" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-serif text-[16px] text-ink">기도노트</p>
              <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[8px] tracking-wide text-petal-500 ring-1 ring-petal-100">
                v1.0
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[10px] leading-relaxed text-muted">
              <ShieldIcon className="h-3 w-3 shrink-0 text-sage-deep" />
              기록은 이 기기 안에만 저장됩니다
            </p>
            <div className="mt-2 flex gap-1.5">
              <button
                type="button"
                onClick={onEditToday}
                className="rounded-full bg-petal-500 px-2.5 py-1 text-[9.5px] font-medium text-white transition hover:bg-petal-600"
              >
                오늘 적기
              </button>
              <button
                type="button"
                onClick={onOpenJournal}
                className="rounded-full border border-petal-200 bg-white/60 px-2.5 py-1 text-[9.5px] text-petal-600 transition hover:bg-white"
              >
                기록 보기
              </button>
            </div>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-3 divide-x divide-petal-100 rounded-2xl bg-white/55 py-2.5 text-center ring-1 ring-petal-100/70 backdrop-blur-sm">
          {[
            { label: "총 기록", value: stats.total },
            { label: "이번 달", value: stats.thisMonth },
            { label: "연속 기록", value: stats.streak },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-serif text-[17px] leading-none text-petal-600">{item.value}</p>
              <p className="mt-1 text-[8.5px] text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3.5">
        <Section
          title="백업 & 복원"
          description="CSV 파일로 마음을 안전하게 간직하고, 언제든 다시 불러오세요."
          badge="CSV"
        >
          <div className="grid gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-3 rounded-2xl border border-petal-200 bg-gradient-to-r from-petal-50 to-white px-3.5 py-3 text-left transition hover:border-petal-300 hover:from-petal-100/70"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-petal-500 text-white shadow-[0_8px_18px_-12px_rgba(142,83,97,1)]">
                <DownloadIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] font-medium text-ink">CSV로 내보내기</span>
                <span className="mt-0.5 block text-[9px] leading-relaxed text-muted">
                  전체 {stats.total}일의 기도를 파일로 저장해요
                </span>
              </span>
              <span className="text-[9px] text-petal-400">백업</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 rounded-2xl border border-petal-100 bg-white px-3.5 py-3 text-left transition hover:border-petal-200 hover:bg-petal-50/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-petal-100 text-petal-600">
                <UploadIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] font-medium text-ink">CSV 불러오기</span>
                <span className="mt-0.5 block text-[9px] leading-relaxed text-muted">
                  백업해 둔 기도노트 파일을 다시 열어요
                </span>
              </span>
              <span className="text-[9px] text-petal-400">복원</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv,text/plain"
              className="hidden"
              onChange={(event) => {
                void handleImportFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>

          <div className="mt-2.5 flex items-start gap-1.5 rounded-xl bg-cream/60 px-2.5 py-2">
            <SparkleIcon className="mt-[1px] h-3 w-3 shrink-0 text-sun" />
            <p className="text-[8.5px] leading-relaxed text-muted">
              {lastBackup
                ? `마지막 백업 · ${formatUpdatedAt(lastBackup)}`
                : "아직 백업한 적이 없어요. 소중한 기록은 가끔 파일로 남겨주세요."}
              <br />
              <span className="text-muted/75">불러온 기록은 같은 날짜의 기존 기록을 덮어씁니다.</span>
            </p>
          </div>

          {importNotice && (
            <p className="mt-2 flex items-center gap-1.5 rounded-xl border border-sage/30 bg-[#f2f5ee] px-2.5 py-2 text-[9.5px] leading-relaxed text-sage-deep">
              <CheckIcon className="h-3 w-3 shrink-0" />
              {importNotice}
            </p>
          )}
        </Section>

        <Section
          title="안드로이드 앱으로 만들기"
          description="이 앱의 소스를 ZIP으로 내려받아 GitHub에서 APK를 만들 수 있어요."
          badge="APK"
        >
          <div className="space-y-1.5">
            {[
              {
                step: "01",
                title: "GitHub에 소스 올리기",
                body: "새 저장소를 만들고 ZIP을 푼 파일을 업로드해요.",
              },
              {
                step: "02",
                title: "Actions에서 빌드 실행",
                body: "‘APK 빌드’를 고르고 Run workflow를 누르면 자동으로 진행돼요.",
              },
              {
                step: "03",
                title: "APK 내려받아 설치",
                body: "5~8분 뒤 Artifacts의 prayer-tree-apk를 내려받아 설치해요.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-2.5 rounded-xl bg-petal-50/40 px-2.5 py-2">
                <span className="mt-[1px] font-serif text-[11px] text-petal-400">{item.step}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-ink-soft">{item.title}</p>
                  <p className="mt-0.5 text-[8.5px] leading-relaxed text-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => void handleSourceDownload()}
            disabled={sourceLoading}
            className={cn(
              "mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[11.5px] font-medium transition",
              sourceLoading
                ? "bg-petal-100 text-petal-400"
                : "bg-gradient-to-r from-petal-500 to-petal-600 text-white shadow-[0_10px_22px_-14px_rgba(142,83,97,1)] hover:from-petal-600 hover:to-petal-700 active:scale-[0.99]",
            )}
          >
            <DownloadIcon className="h-4 w-4" />
            {sourceLoading ? "소스 ZIP을 준비하고 있어요..." : "앱 소스 ZIP 내려받기"}
          </button>
          <p className="mt-1.5 text-center text-[8.5px] leading-relaxed text-muted">
            .github·capacitor 설정·안내문(README)까지 모두 들어 있어요.
          </p>

          <button
            type="button"
            onClick={() => setShowWorkflow((value) => !value)}
            className="mt-2.5 flex w-full items-center justify-between rounded-xl border border-petal-100 bg-white px-3 py-2 text-[9.5px] text-ink-soft transition hover:bg-petal-50/50"
          >
            <span className="flex items-center gap-1.5">
              <GithubIcon className="h-3.5 w-3.5 text-ink-soft" />
              android-apk.yml 빌드 설정 보기
            </span>
            <ChevronDown
              className={cn("h-3.5 w-3.5 text-muted transition-transform", showWorkflow && "rotate-180")}
            />
          </button>
          {showWorkflow && (
            <div className="mt-2 animate-fade-rise overflow-hidden rounded-xl border border-petal-100 bg-[#fcf8f4]">
              <div className="flex items-center justify-between border-b border-petal-100 px-2.5 py-1.5">
                <span className="font-mono text-[8.5px] text-muted">.github/workflows/android-apk.yml</span>
                <button
                  type="button"
                  onClick={() => void copyWorkflow()}
                  className="rounded-full bg-paper px-2 py-0.5 text-[8.5px] text-petal-600 ring-1 ring-petal-100 hover:bg-petal-50"
                >
                  {copied ? "복사됨" : "복사"}
                </button>
              </div>
              <pre className="no-scrollbar max-h-52 overflow-auto px-2.5 py-2 font-mono text-[8px] leading-relaxed text-ink-soft/90">
                {workflowYml}
              </pre>
            </div>
          )}
        </Section>

        <Section title="기록 관리" description="이 기기에 저장된 기도 기록을 관리해요.">
          <div className="flex items-center justify-between rounded-xl bg-petal-50/50 px-3 py-2.5">
            <div>
              <p className="text-[10.5px] font-medium text-ink-soft">저장된 기록</p>
              <p className="mt-0.5 text-[8.5px] text-muted">지우면 되돌릴 수 없어요</p>
            </div>
            <span className="font-serif text-[15px] text-petal-600">{stats.total}일</span>
          </div>

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full border border-petal-200 bg-white py-2 text-[10px] text-petal-600 transition hover:bg-petal-50"
            >
              <TrashIcon className="h-3 w-3" />
              모든 기록 삭제하기
            </button>
          ) : (
            <div className="mt-2 animate-fade-rise rounded-xl border border-petal-200 bg-petal-50 px-3 py-2.5">
              <p className="text-[10px] leading-relaxed text-petal-700">
                정말 {stats.total}일의 기록을 모두 지울까요?
                <br />
                <span className="text-[9px] text-petal-600/80">
                  먼저 CSV로 백업해 두면 마음을 지킬 수 있어요.
                </span>
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                    setImportNotice(null);
                    onNotify("모든 기록을 정리했어요.", "info");
                  }}
                  className="flex-1 rounded-full bg-petal-500 py-1.5 text-[10px] font-medium text-white transition hover:bg-petal-600"
                >
                  모두 지우기
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 rounded-full border border-petal-200 bg-paper py-1.5 text-[10px] text-ink-soft transition hover:bg-white"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </Section>

        <div className="rounded-[24px] border border-white/70 bg-gradient-to-br from-[#f9eae5] via-paper to-[#f6ede2] p-4 text-center">
          <LeafIcon className="mx-auto h-4 w-4 text-sage-deep/80" />
          <p className="mt-2 font-serif text-[12px] leading-[1.9] text-ink-soft">
            “아무것도 염려하지 말고
            <br />
            다만 모든 일에 기도와 간구로”
          </p>
          <p className="mt-2 flex items-center justify-center gap-1 text-[8.5px] text-muted">
            <SmartphoneIcon className="h-3 w-3" />
            기도노트 · 마음이 머무는 작은 정원
          </p>
        </div>
      </div>
    </div>
  );
}
