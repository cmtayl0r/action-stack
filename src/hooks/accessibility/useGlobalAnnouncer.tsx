import { useState, useCallback, useRef } from "react";

interface Announcement {
  id: string;
  message: string;
  type: "polite" | "assertive";
}

/**
 * Global screen reader announcer - handles all accessibility announcements
 *
 * COMMON USE CASES:
 * 1. ASYNC OPERATIONS: "Profile saved", "Delete failed", "Loading complete"
 * 2. FORM VALIDATION: "3 errors found", "All fields valid", "Email is required"
 * 3. CONTENT UPDATES: "Search found 12 results", "5 items added to list"
 * 4. NAVIGATION: "Page loaded", "Modal opened", "Tab selected"
 * 5. PROGRESSIVE DISCLOSURE: "Menu expanded", "More content loaded"
 *
 * WHY ONE ANNOUNCER:
 * - Prevents competing/overlapping announcements that confuse screen readers
 * - Consistent timing and behavior across the entire application
 * - Simpler mental model for developers (one source of truth)
 * - Better performance (fewer DOM nodes and React state)
 */
export const useGlobalAnnouncer = () => {
  // Separate state for each politeness level - screen readers cache aria-live on mount
  const [politeMessages, setPoliteMessages] = useState<Announcement[]>([]);
  const [assertiveMessages, setAssertiveMessages] = useState<Announcement[]>(
    []
  );

  // Debounce prevents rapid-fire announcements from overwhelming users
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const announce = useCallback(
    (message: string, type: "polite" | "assertive" = "polite") => {
      // Guard against empty or whitespace-only messages
      if (!message.trim()) return;

      // Clear any pending announcement to prevent spam
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce announcements by 150ms to group rapid updates
      debounceRef.current = setTimeout(() => {
        const announcement: Announcement = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: message.trim(),
          type,
        };

        // Add to appropriate message queue based on urgency
        if (type === "assertive") {
          // ASSERTIVE: Interrupts screen reader immediately
          // Use for: errors, critical failures, urgent warnings
          // Examples: "Error: Failed to save", "Connection lost"
          setAssertiveMessages((prev) => [...prev, announcement]);
        } else {
          // POLITE: Waits for screen reader to finish current speech
          // Use for: success messages, info updates, navigation
          // Examples: "Saved successfully", "3 results found", "Page loaded"
          setPoliteMessages((prev) => [...prev, announcement]);
        }

        // Auto-clear messages after 1 second to keep regions clean
        // This prevents old announcements from re-reading if user navigates to the region
        setTimeout(() => {
          if (type === "assertive") {
            setAssertiveMessages((prev) =>
              prev.filter((msg) => msg.id !== announcement.id)
            );
          } else {
            setPoliteMessages((prev) =>
              prev.filter((msg) => msg.id !== announcement.id)
            );
          }
        }, 1000);
      }, 150);
    },
    []
  );

  /**
   * Render live regions - must be present on initial page load
   * These are invisible to sighted users but announce messages to screen readers
   */
  const AnnouncerRegions = () => (
    <>
      {/* POLITE region: Non-urgent announcements */}
      <div
        className="sr-only" // Screen reader only styling
        aria-live="polite" // Waits for natural pause in speech
        aria-atomic="true" // Reads entire content when it changes
        role="status" // Semantic role for status updates
      >
        {politeMessages.map((msg) => (
          <span key={msg.id}>{msg.message}</span>
        ))}
      </div>

      {/* ASSERTIVE region: Urgent announcements */}
      <div
        className="sr-only"
        aria-live="assertive" // Interrupts current speech immediately
        aria-atomic="true"
        role="alert" // Semantic role for urgent alerts
      >
        {assertiveMessages.map((msg) => (
          <span key={msg.id}>{msg.message}</span>
        ))}
      </div>
    </>
  );

  return { announce, AnnouncerRegions };
};

/*
USAGE EXAMPLES:

// Toast notifications (success/error feedback)
const { announce } = useGlobalAnnouncer();
toast.success('Profile saved') → announce('Profile saved', 'polite')
toast.error('Save failed') → announce('Error: Save failed', 'assertive')

// Form validation (real-time feedback)
handleValidation(errors) → announce(`${errors.length} errors found`, 'assertive')
handleFieldValid() → announce('Email is valid', 'polite')

// Search/filter results (content updates)
onSearchComplete(results) → announce(`${results.length} products found`, 'polite')
onFilterChange(count) → announce(`${count} items match filters`, 'polite')

// Navigation feedback (SPA route changes)
onRouteChange(pageName) → announce(`${pageName} page loaded`, 'polite')
onModalOpen(title) → announce(`${title} dialog opened`, 'polite')

// Progressive disclosure (show/hide content)
onAccordionExpand(section) → announce(`${section} expanded`, 'polite')
onLazyLoad(count) → announce(`${count} more items loaded`, 'polite')

POLITENESS LEVEL GUIDELINES:
- Use 'assertive' for: Errors, failures, critical warnings, urgent feedback
- Use 'polite' for: Success messages, info updates, navigation, content changes
*/
