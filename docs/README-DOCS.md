# Documentation Strategy

This project uses a centralized `docs/` directory to store all project specifications, architectural plans, and feature documentation.

## Core Principles

- **Separation of Concerns:** The `src/` directory is reserved exclusively for application source code. All planning and specification documents reside in `docs/`.
- **Mirrored Structure:** The directory structure within `docs/` mirrors the structure of `src/`. For example, specifications for a component located at `src/components/ui/Button.tsx` would be found at `docs/components/ui-specs/Button.md`.
- **Version Controlled:** The `docs/` directory is tracked by Git. It is considered an essential part of the project's intellectual blueprint and should be kept up-to-date alongside the source code.

This approach ensures that project documentation is easy to find, clearly organized, and versioned C.
