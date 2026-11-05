import { fromKey, isEditable, toKey } from "./date";

export type PrayerEntry = {
  date: string;
  content: string;
  updatedAt: string;
};

export type EntryMap = Record<string, PrayerEntry>;

const STORAGE_KEY = "prayer-note.entries.v1";

const SEEDS: Array<{ offset: number; content: string }> = [
  {
    offset: 1,
    content:
      "아버지, 오늘 하루도 무사히 지나가게 해주셔서 감사합니다.\n바쁘다는 이유로 놓쳤던 작은 순간들을 떠올려 봅니다. 창문으로 들어온 햇살, 따뜻한 차 한 잔, 나를 기다려준 사람들. 당연하게 여겼던 것들에 오늘은 조금 더 천천히 감사해 봅니다.",
  },
  {
    offset: 2,
    content:
      "마음이 자꾸 조급해질 때, 잠깐 멈추고 숨을 고르게 됩니다.\n내 계획대로 되지 않아도 괜찮다고, 지금 이 자리에서 최선을 다하면 된다고 스스로에게 말해봅니다. 오늘은 비교하지 않기로 했어요.",
  },
  {
    offset: 4,
    content:
      "오래 연락하지 못했던 친구에게 먼저 안부를 전했습니다.\n작은 용기가 필요한 하루였는데, 막상 전하고 나니 마음이 가벼워졌어요. 관계를 소중히 여기는 마음을 잃지 않게 해주세요.",
  },
  {
    offset: 8,
    content:
      "아침 산책길에 만난 나무가 참 곱게 피어 있었습니다.\n아무 말 없이도 계절을 지켜내는 것들이 고맙게 느껴집니다. 저도 조용히, 그러나 꾸준히 제자리를 지키는 사람이 되고 싶어요.",
  },
  {
    offset: 13,
    content:
      "걱정이 많았던 일이 생각보다 잘 풀렸습니다.\n너무 앞서 걱정하며 지친 저를 돌아봅니다. 오늘의 몫만 오늘 감당하면 된다는 것을 다시 배웠어요. 남은 하루도 평안히 지켜주세요.",
  },
];

function createSeedEntries(): EntryMap {
  const now = new Date();
  const map: EntryMap = {};
  SEEDS.forEach(({ offset, content }) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    const key = toKey(date);
    const stamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 21, 30);
    map[key] = { date: key, content, updatedAt: stamp.toISOString() };
  });
  return map;
}

export function loadEntries(): EntryMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seeded = createSeedEntries();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return normalizeEntries(parsed as Record<string, unknown>);
  } catch {
    return {};
  }
}

export function normalizeEntries(input: Record<string, unknown>): EntryMap {
  const result: EntryMap = {};
  Object.values(input).forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    const date = String((entry as PrayerEntry).date || "");
    const content = typeof (entry as PrayerEntry).content === "string" ? (entry as PrayerEntry).content : "";
    if (!isEditable(date) || !content.trim()) return;
    result[date] = {
      date,
      content,
      updatedAt: (entry as PrayerEntry).updatedAt || new Date().toISOString(),
    };
  });
  return result;
}

export function saveEntries(entries: EntryMap): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage may be unavailable in private mode; the UI remains usable for the session.
  }
}

export function sortEntries(entries: EntryMap, direction: "asc" | "desc" = "desc"): PrayerEntry[] {
  return Object.values(entries).sort((a, b) =>
    direction === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
  );
}

export function calculateStats(entries: EntryMap): {
  total: number;
  thisMonth: number;
  streak: number;
} {
  const keys = Object.keys(entries).sort();
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-`;
  const thisMonth = keys.filter((key) => key.startsWith(monthPrefix)).length;

  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!entries[toKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (entries[toKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { total: keys.length, thisMonth, streak };
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function buildCsv(entries: EntryMap): string {
  const header = ["date", "content", "updated_at"];
  const rows = sortEntries(entries, "asc").map((entry) => [
    entry.date,
    entry.content,
    entry.updatedAt,
  ]);
  const lines = [header, ...rows].map((row) => row.map((cell) => escapeCsv(String(cell ?? ""))).join(","));
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export function downloadCsv(entries: EntryMap): void {
  const csv = buildCsv(entries);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `prayer-note-backup-${toKey(new Date())}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Handles quoted fields, escaped quotes, CRLF and embedded newlines. */
export function parseCsv(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < clean.length; index += 1) {
    const char = clean[index];
    if (inQuotes) {
      if (char === '"') {
        if (clean[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // ignore; the \n branch closes the row
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

function normalizeDateCell(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const compact = trimmed.replace(/[./]/g, "-");
  const match = compact.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (Number.isNaN(date.getTime())) return null;
    return toKey(date);
  }
  const ymd = compact.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (ymd) {
    const date = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    if (Number.isNaN(date.getTime())) return null;
    return toKey(date);
  }
  return null;
}

export type ImportResult = {
  entries: EntryMap;
  imported: number;
  skipped: number;
  error?: string;
};

export function parseBackupCsv(text: string): ImportResult {
  let rows: string[][];
  try {
    rows = parseCsv(text);
  } catch {
    return { entries: {}, imported: 0, skipped: 0, error: "CSV 파일을 읽을 수 없어요." };
  }

  if (rows.length === 0) {
    return { entries: {}, imported: 0, skipped: 0, error: "비어 있는 파일이에요." };
  }

  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  const looksLikeHeader = header.some((cell) =>
    ["date", "날짜", "content", "내용", "updated_at", "작성일"].includes(cell),
  );

  const findIndex = (names: string[], fallback: number) => {
    const index = header.findIndex((cell) => names.includes(cell));
    return index >= 0 ? index : fallback;
  };

  const dateIndex = looksLikeHeader ? findIndex(["date", "날짜"], 0) : 0;
  const contentIndex = looksLikeHeader ? findIndex(["content", "내용", "기도", "메모"], 1) : 1;
  const stampIndex = looksLikeHeader ? findIndex(["updated_at", "작성일", "시간"], 2) : 2;

  const body = looksLikeHeader ? rows.slice(1) : rows;
  const entries: EntryMap = {};
  let skipped = 0;

  body.forEach((cells) => {
    const date = normalizeDateCell(cells[dateIndex] ?? "");
    const content = (cells[contentIndex] ?? "").trim();
    if (!date || !content) {
      skipped += 1;
      return;
    }
    const rawStamp = (cells[stampIndex] ?? "").trim();
    const parsedStamp = rawStamp ? new Date(rawStamp) : new Date();
    const updatedAt = Number.isNaN(parsedStamp.getTime()) ? new Date().toISOString() : parsedStamp.toISOString();
    entries[date] = { date, content, updatedAt };
  });

  if (Object.keys(entries).length === 0) {
    return {
      entries,
      imported: 0,
      skipped,
      error: "불러올 기록을 찾지 못했어요. date, content 형식의 CSV인지 확인해 주세요.",
    };
  }

  return { entries, imported: Object.keys(entries).length, skipped };
}

export function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  const time = `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
  if (sameDay) return `오늘 ${time}`;
  return `${fromKey(toKey(date)).getMonth() + 1}월 ${date.getDate()}일 ${time}`;
}
