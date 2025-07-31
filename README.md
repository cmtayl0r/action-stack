<a name="top"></a>

# Action Stack

[![Accessibility](https://img.shields.io/badge/WCAG-2.2%20AA-green.svg)](https://www.w3.org/WAI/WCAG22/quickref/)
[![TypeScript](https://img.shields.io/badge/TypeScript-💪-blue.svg)](https://www.typescriptlang.org/)
[![AI Powered](https://img.shields.io/badge/AI-Thoughtfully%20Integrated-purple.svg)](#ai-features)
[![Built with Love](https://img.shields.io/badge/Built%20with-❤️%20and%20☕-red.svg)](#)

> _Enjoying building things to be inclusive for everyone, one learning moment at a time._

---

## 🎯 **What This Does**

### 1️⃣ **The Problem**

[Brief, relatable problem statement]

### 2️⃣ **The Solution**

[Your app's approach in one compelling sentence]

### 3️⃣ **The Magic**

[What makes this special - AI + accessibility focus]

### 🌟 **Key Features**

- TBD

### 👨‍🔧 **My objective**

Explore advance React Patterns that are built with Accessibility as a focus in the process and Learning journey.

### 🛣️ **Project standards**

The learning journey is to always try and attain:

- ♿ **Accessibility First** - Works with screen readers, keyboard navigation, and assistive tech
- 🤖 **AI Enhancements** - AI used thoughtfully, that actually make sense and help users
- 🎨 **Thoughtful Design** - Every interaction designed for positive UX and usability
- 📱 **Responsiveness** - Consideration for phone, tablet, or desktop
- 🚀 **Performance** - Built with modern tech to help performance

<!-- ---

## 🧠 **The AI Philosophy**

> *"AI should make you smarter, not lazier. Technology should include everyone, not just some."*

This project aims to demonstrate:
- 🎭 **Human-Centered AI** - AI features enhance human capability rather than replace it
- 🔍 **Transparent Decisions** - You always know what the AI is thinking and why
- 🎛️ **User Control** - Easy to modify, override, or disable AI features
- ♿ **Inclusive by Design** - AI that works with assistive technology from day one -->

---

## 🛠️ **Tech Stack**

Built with the good stuff:

| Layer          | Technology            | Why I Chose It                      |
| -------------- | --------------------- | ----------------------------------- |
| **Frontend**   | React 18 + TypeScript | Type safety + modern patterns       |
| **Styling**    | Vanilla CSS           | Scalable Learning-focused approach  |
| **Backend**    | Supabase              | Simple → AI-optimized progression   |
| **Testing**    | Vitest + axe-core     | Essential testing without overwhelm |
| **Deployment** | Vercel                | Zero-config, maximum performance    |

---

## ♿ **Accessibility Features**

Inclusion baked into the process:

- **🔍 Screen Reader Tested** - Tested with VoiceOver on iOS and MacOS
- **⌨️ Keyboard Navigation** - Every feature accessible without a mouse
- **🎨 High Contrast Support** - Respects user display preferences
- **📱 Touch Friendly** - 44px+ touch targets for motor accessibility
- **🧠 Cognitive Support** - Clear language, predictable interactions
- **🎵 Motion Aware** - Respects `prefers-reduced-motion` settings
- **🌈 Foundation assets** - Design Tokens structured to consider visual impairments

<!-- ---

## 🚀 **Quick Start**

```bash
# Clone and get running in 30 seconds
git clone https://github.com/username/PROJECT_NAME.git
cd PROJECT_NAME
npm install
npm run dev

# Open http://localhost:5173 and start exploring! 🎉
```

---

## 🧪 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run test:a11y    # Run accessibility tests
npm run lint         # Check code quality
``` -->

---

## 🕟 Significant Versions

### v1.0 MVP

- Work in Progress

### v0.1 (April 2025)

- Experiment to test patterns and structure ideas
- Using localStorage as data structure and low-level CRUD as temporary measure (API Layer).
- Compound Component Pattern utilised for Modal and Toast components.
- Flux Architecture Pattern used for Modal and Toast, with context for each used to "manage" multiple instances.
- Context provider (AppProvider) to give global theme change and sidebar controls.
- Context provider (ActionsContext, StacksContext) 🌎 provide data slices (via the hooks) that can be supplied globally across the app.
- Context State used for Modals and Toast to allow any component, in various scenarios, to trigger them.
- Used Registry pattern to "register" all modal variations in a registry which is used lazy loading and centralised management of a reusable component. Modal variations connected from registry to context via an passed value for an id prop.
- Multiple toasts for real-time feedback, with auto-dismiss and manual close.
- Toast component uses direct rendering (no registry), but caters for multiple toasts simultaneously. Not just one at a time.
- Basic Vanilla CSS Modules put in place.
- React Router used for routing, and Loader functions for the router responsible for fetching data before rendering the component.
- Responsive sidebar for navigation and stack management.
- Global modals for adding stacks and actions, with lazy loading for performance.
- Inline editing and completion toggling for actions.
- Stack filters for completed and active actions.
- Framer Motion used for smooth UI animations.
- Theme switching support via context (planned).
- Modular file structure with separation of features, UI, and context logic.

---

## 🤝 **Contributing**

Want to make this better? Amazing!

1. **🍴 Fork** the repository
2. **🌱 Create** a feature branch (`git checkout -b feature/amazing-improvement`)
3. **♿ Ensure** accessibility compliance
4. **🧪 Add** tests for new features
5. **📝 Commit** with clear messages
6. **🚀 Push** and create a Pull Request

---

## 📄 **License**

MIT License - build amazing things! 🚀

---

## 👋 **Connect**

Built by Chris Taylor - Design Engineer specializing in accessible AI

- 💼 LinkedIn: [Chris Taylor](https://www.linkedin.com/in/uxchristophertaylor/)
- 📧 Email: [chris@pathtobravery.dev](mailto:chris@pathtobravery.dev)
<!-- - 🌐 Portfolio: [apathofbravery.com](http://www.apathofbravery.com) -->

---

_"Making technology that works for everyone isn't just good practice—it's better business, better design, and better for humanity."_

[Back to top](#top)
