import { useAppContext } from "../context/app/AppContext";
import { ThemeTransitionOptions } from "@/types/app";

export function useThemeTransition(options: ThemeTransitionOptions = {}) {
  const { toggleTheme, toggleContrast } = useAppContext();
  const duration = options.duration || 600;
  const easing = options.easing || "cubic-bezier(.76,.32,.29,.99)";

  // 🎬 View Transitions API implementation (Chrome 111+)
  const startViewTransition = (
    callback: () => void,
    event?: React.MouseEvent
  ) => {
    // ✨ Check if View Transitions API is supported
    if (!document.startViewTransition) {
      // Fallback: simple transition
      callback();
      return;
    }

    // 📍 Get click coordinates for circular transition
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    // 📐 Calculate radius for full screen coverage
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 🎭 Start the view transition
    const transition = document.startViewTransition(() => {
      callback();
    });

    // 🎨 Apply circular reveal animation
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing,
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  // 🎨 Smooth theme toggle with transition
  const smoothToggleTheme = (event?: React.MouseEvent) => {
    startViewTransition(toggleTheme, event);
  };

  // ♿ Smooth contrast toggle with transition
  const smoothToggleContrast = (event?: React.MouseEvent) => {
    startViewTransition(toggleContrast, event);
  };

  return {
    smoothToggleTheme,
    smoothToggleContrast,
    startViewTransition,
  };
}
