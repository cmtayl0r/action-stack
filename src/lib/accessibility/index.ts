// Barrel export file for clean imports
export { useFocusManagement } from "./focus-management";
export { useAnnouncements } from "./announcements";
export { useKeyboardNavigation } from "./keyboard-navigation";

// USAGE EXAMPLES:
// import { useFocusManagement } from '@/lib/accessibility/focus-management'
// import { useAnnouncements } from '@/lib/accessibility/announcements'
// import { useKeyboardNavigation } from '@/lib/accessibility/keyboard-navigation'

// OR import from barrel file:
// import { useFocusManagement, useAnnouncements } from '@/lib/accessibility'

// Re-export types for consumers
export type { AnnouncementPriority } from "./announcements";
export type {
  FocusDirection,
  KeyboardNavigationOptions,
} from "./keyboard-navigation";
export type { FocusManagementReturn } from "./focus-management";
export type { AnnouncementsReturn } from "./announcements";
export type { KeyboardNavigationReturn } from "./keyboard-navigation";
