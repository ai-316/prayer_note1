import JSZip from "jszip";
import heroHill from "../assets/hero-hill.png";
import noteDesk from "../assets/note-desk.png";

import packageJson from "../../package.json?raw";
import packageLock from "../../package-lock.json?raw";
import indexHtml from "../../index.html?raw";
import tsconfig from "../../tsconfig.json?raw";
import viteConfig from "../../vite.config.ts?raw";
import capacitorConfig from "../../capacitor.config.json?raw";
import readme from "../../README.md?raw";
import gitignore from "../../.gitignore?raw";
import workflow from "../../.github/workflows/android-apk.yml?raw";

const sourceFiles = import.meta.glob("/src/**/*.{ts,tsx,css}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const IMAGE_ASSETS = [
  { url: heroHill, path: "src/assets/hero-hill.png" },
  { url: noteDesk, path: "src/assets/note-desk.png" },
];

export async function downloadSourceZip(): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder("prayer-tree");
  if (!root) throw new Error("ZIP 폴더를 만들 수 없습니다.");

  root.file("package.json", packageJson);
  root.file("package-lock.json", packageLock);
  root.file("index.html", indexHtml);
  root.file("tsconfig.json", tsconfig);
  root.file("vite.config.ts", viteConfig);
  root.file("capacitor.config.json", capacitorConfig);
  root.file("README.md", readme);
  root.file(".gitignore", gitignore);
  root.file(".github/workflows/android-apk.yml", workflow);

  Object.entries(sourceFiles).forEach(([path, content]) => {
    const cleanPath = path.replace(/^\//, "");
    root.file(cleanPath, content);
  });

  await Promise.all(
    IMAGE_ASSETS.map(async (asset) => {
      try {
        const response = await fetch(asset.url);
        if (!response.ok) return;
        const buffer = await response.arrayBuffer();
        root.file(asset.path, buffer);
      } catch {
        // The source still exports without the optional illustration.
      }
    }),
  );

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "prayer-tree-source.zip";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
