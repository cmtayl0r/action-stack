import { useCallback } from "react";

/**
 * Announces content changes to screen readers
 * Essential for form validation, loading states, and dynamic content
 * Form Validation - Announce errors/success
 * Loading States - Announce progress updates
 * Search Results - Announce result counts
 * Toast/Alert - Screen reader announcements
 * Data Tables - Announce sort/filter changes
 * Shopping Cart - Announce item additions/removals
 * Required CSS for screen reader announcements: sr-only
 *
 * @example
 * const { announce, announceSuccess, announceError } = useAnnouncements();
 *
 * // Form validation
 * announceError('Please fix the email format');
 *
 * // Success feedback
 * announceSuccess('Settings saved successfully');
 *
 * // Loading states
 * announceLoading('Saving your changes');
 *
 * @example
 * function ContactForm() {
 *  const { announceSuccess, announceError } = useAnnouncements();
 *
 *   const handleSubmit = async () => {
 *    try {
 *     await submitForm();
 *     announceSuccess('Form submitted successfully');
 *   } catch (error) {
 *     announceError('Please correct the errors and try again');
 *    }
 * };
 * }
 */

// ? Is this overkill? will this conflict with natural screen reader behavior?

// =============================================================================
// ANNOUNCEMENT TYPES
// =============================================================================

export type AnnouncementPriority = "polite" | "assertive";

// Return Type Interface
export interface AnnouncementsReturn {
  announce: (message: string, priority?: AnnouncementPriority) => void;
  announceSuccess: (message: string) => void;
  announceError: (message: string) => void;
  announceLoading: (message?: string) => void;
}

// =============================================================================
// ANNOUNCEMENT HOOK
// =============================================================================

export function useAnnouncements(): AnnouncementsReturn {
  // Create or get existing live region
  const getOrCreateLiveRegion = useCallback(
    (priority: AnnouncementPriority) => {
      // Create a unique ID for the live region
      const id = `live-region-${priority}`;
      // Get ID of existing live region
      let region = document.getElementById(id);
      // If no existing region, create one
      if (!region) {
        region = document.createElement("div");
        region.id = id;
        region.setAttribute("aria-live", priority);
        region.setAttribute("aria-atomic", "true");
        region.className = "sr-only"; // Screen reader only
        region.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
        document.body.appendChild(region);
      }

      return region;
    },
    [] // No dependencies because the live region is created/queried dynamically
  );

  // Announce message to screen readers
  const announce = useCallback(
    (message: string, priority: AnnouncementPriority = "polite") => {
      // If no message, do nothing
      if (!message.trim()) return;

      // Create or get existing live region
      const region = getOrCreateLiveRegion(priority);

      // Clear previous message
      region.textContent = "";

      // Add new message after small delay to ensure it's announced
      setTimeout(() => {
        region.textContent = message;
      }, 10);

      // Clear message after announcement to avoid repetition
      setTimeout(() => {
        region.textContent = "";
      }, 1000);
    },
    [getOrCreateLiveRegion] // Dependency on the live region creation function
  );

  // Convenience methods for common use cases
  const announceSuccess = useCallback(
    (message: string) => {
      // Use announce function to announce success messages
      announce(`Success: ${message}`, "polite");
    },
    [announce]
  );

  const announceError = useCallback(
    (message: string) => {
      // Use announce function to announce error messages
      announce(`Error: ${message}`, "assertive");
    },
    [announce]
  );

  const announceLoading = useCallback(
    (message: string = "Loading") => {
      // Use announce function to announce loading messages
      announce(message, "polite");
    },
    [announce]
  );

  return {
    announce, // General purpose announcements
    announceSuccess, // Success messages (polite)
    announceError, // Error messages (assertive/urgent)
    announceLoading, // Loading states (polite)
  };
}
