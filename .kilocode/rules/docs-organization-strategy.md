# Documentation Organization Strategy

## Core Principle

All project specifications, architectural plans, and feature documentation (`.md` files) will be centralized in a root-level `/docs` directory. The `src` directory should contain only application source code.

## Initialization Workflow ("initialize memory bank")

When in `architect` mode and instructed to "initialize memory bank," the following steps for documentation must be followed:

1.  Create a root-level `/docs` directory.
2.  Create a `README.md` file inside `/docs` to explain the documentation strategy.
3.  Populate the `/docs` directory with all other specification files.
4.  The internal structure of `/docs` should mirror the `src` directory structure (e.g., component specs go into `docs/components`, hook specs go into `docs/hooks`).
5.  Do NOT place any `.md` specification files inside the `/src` directory.

## Rationale

- **Separation of Concerns:** Keeps the `src` folder clean and dedicated to production code.
- **Clarity:** Provides a single, clear location for all project planning and specification documents.
- **Discoverability:** Makes it easy for any team member to find the "why" behind the "what" of the codebase.
- **Version Control:** This `docs` folder should be tracked by Git as it contains the intellectual blueprint of the project.
