import { THEME_STORAGE_KEY } from "@/lib/theme/constants";

export function ThemeInitScript() {
  const script = `
    (function () {
      try {
        var key = ${JSON.stringify(THEME_STORAGE_KEY)};
        var stored = localStorage.getItem(key);
        if (stored !== "dark") {
          stored = localStorage.getItem("theme");
        }
        if (stored === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.style.colorScheme = "dark";
        }
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
