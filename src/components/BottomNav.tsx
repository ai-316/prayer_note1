import { cn } from "@/utils/cn";
import { CalendarIcon, JournalIcon, SettingsIcon } from "./icons";

export type TabId = "calendar" | "journal" | "settings";

const TABS: Array<{ id: TabId; label: string; Icon: typeof CalendarIcon }> = [
  { id: "calendar", label: "달력", Icon: CalendarIcon },
  { id: "journal", label: "기록", Icon: JournalIcon },
  { id: "settings", label: "설정", Icon: SettingsIcon },
];

export function BottomNav({ tab, onChange }: { tab: TabId; onChange: (tab: TabId) => void }) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky bottom-0 z-40 mt-auto border-t border-petal-100/80 bg-paper/95 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-xl"
    >
      <div className="grid grid-cols-3 gap-1 px-4">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex flex-col items-center gap-1 rounded-2xl py-1.5 transition",
                active ? "text-petal-600" : "text-muted hover:text-petal-500",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-11 items-center justify-center rounded-full transition-all duration-300",
                  active ? "bg-petal-100/90 text-petal-600" : "bg-transparent group-hover:bg-petal-50",
                )}
              >
                <Icon className={cn("h-[18px] w-[18px]", active && "stroke-[1.9]")} />
              </span>
              <span className={cn("text-[9.5px] tracking-wide", active && "font-medium")}>{label}</span>
              <span
                className={cn(
                  "absolute -bottom-[3px] h-1 w-1 rounded-full bg-petal-500 transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
