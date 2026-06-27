import { useEffect } from "react";
import { useThemeStore } from "@/store";

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: "light" | "dark") => {
      if (t === "dark") root.classList.add("dark"); else root.classList.remove("dark");
    };
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "dark" : "light");
      const cb = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    }
    apply(theme);
  }, [theme]);
  return { theme, setTheme };
}

export function usePortfolioStats() {
  // recomputed via subscription in component
  return null;
}
