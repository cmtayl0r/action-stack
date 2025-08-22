import { useState, useCallback, useEffect } from "react";

// Debounce function to prevent spamming screen readers
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

interface AnnouncerProps {
  message: string;
  assertiveness?: "assertive" | "polite";
}

const useScreenReaderAnnouncer = () => {
  const [announcement, setAnnouncement] = useState<AnnouncerProps | null>(null);

  const announce = useCallback(
    debounce(
      (message: string, assertiveness: "assertive" | "polite" = "polite") => {
        setAnnouncement({ message, assertiveness });
      },
      150
    ), // 150ms debounce delay
    []
  );

  const AnnouncerRegion = () => (
    <div
      className="sr-only"
      role="status"
      aria-live={announcement?.assertiveness || "polite"}
      aria-atomic="true"
    >
      {announcement?.message}
    </div>
  );

  // Clear the message after it has been announced
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement(null);
      }, 1000); // Let the message be available for 1 second
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  return { announce, AnnouncerRegion };
};

export default useScreenReaderAnnouncer;
