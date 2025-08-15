# PWA Strategy

This document outlines the strategy for implementing Progressive Web App (PWA) features for the Action Stack application.

## 1. Vision

The application should be installable on users' home screens (desktop and mobile) and should provide a basic level of offline functionality. This enhances the user experience by making the app feel more like a native application and ensuring reliability even with a poor network connection.

## 2. Web App Manifest (`manifest.json`)

The `manifest.json` file is the cornerstone of a PWA. It provides metadata about the application. Below is a template for our `public/manifest.json`.

```json
{
  "short_name": "Action Stack",
  "name": "Action Stack: Accessible Task Management",
  "description": "An accessible task management app for overwhelmed minds.",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/icons/icon-512x512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#007aff", // Example theme color
  "background_color": "#ffffff"
}
```

**Required Assets:** We will need to create the app icons (e.g., `icon-192x192.png`) and place them in the `public/icons` directory.

## 3. Service Worker Strategy

The service worker is a script that runs in the background and enables features like offline caching and push notifications. For our MVP, the primary goal is offline asset caching.

**Strategy: Cache-First for Static Assets**

We will use a library like `workbox` (often integrated with build tools like Vite via a plugin) to automatically generate a service worker.

**Configuration (`vite.config.ts` using `vite-plugin-pwa`):**

```typescript
import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // Cache these file types
      },
      manifest: {
        /* The content from manifest.json above */
      },
    }),
  ],
};
```

**How it works:**

1.  **Static Assets:** The service worker will precache all static assets (JS, CSS, images). When the user requests these files, the service worker will serve them directly from the cache, making subsequent loads extremely fast and enabling offline access to the application shell.
2.  **API Requests (Data):** For MVP, API requests (to Supabase) will **not** be cached for offline use. This means the user will need a connection to see their data. Full offline data synchronization with background sync is a more advanced feature and is planned for a future release. The app should gracefully handle the offline case by displaying an informative message if a connection to Supabase cannot be established.
