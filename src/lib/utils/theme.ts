import { Theme } from "@/types/app";

// =============================================================================
// THEME UTILITIES - Reusable theme logic
// =============================================================================

// =============================================================================
// SYSTEM DETECTION
// =============================================================================

// 🔍 Check if user prefers dark mode from system
export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  // Try localStorage first
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark") return saved;

  // Return system preference if no saved preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// ♿ Get initial contrast from localStorage or system preference
export function getInitialContrast(): boolean {
  if (typeof window === "undefined") return false;

  // Try localStorage first
  const saved = localStorage.getItem("highContrast");
  if (saved === "true") return true;
  if (saved === "false") return false;

  // Fallback to system preference
  return window.matchMedia("(prefers-contrast: high)").matches;
}

// =============================================================================
// THEME APPLICATION
// =============================================================================

// 💾 Apply resolved theme to DOM and save to storage
export function applyTheme(theme: Theme, highContrast: boolean): void {
  if (typeof window === "undefined") return;

  // Apply theme
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  // Apply contrast
  document.documentElement.dataset.contrast = highContrast ? "high" : "normal";
  localStorage.setItem("highContrast", String(highContrast));
}
