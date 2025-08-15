# Repository Guidelines

## Project Structure & Module Organization
- `src/`: TypeScript source (planned modules like `functions.tsx`, `arithmetic.tsx`, `narrowing.tsx`, `continued-fractions.tsx`, `parse.tsx`).
- `index.tsx`: Package entry that re-exports public APIs.
- `tests/`: Test files (`*.test.{js,ts}`). Example: `tests/first-run.test.js`.
- `docs/`: Design and plan notes (`design.md`, `plan.md`).
- `README.md`, `LICENSE`: Top-level docs and license.

## Build, Test, and Development Commands
- `bun install`: Install dependencies. Note: `ratmath` is an SSH Git dependency (`git@github.com:...`); ensure GitHub SSH access or switch to HTTPS in `package.json` for local setup.
- `bun test`: Run all tests in `tests/`.
- `bun test --coverage`: Run tests with coverage report.
- `bun run <file.tsx>`: Execute TypeScript directly during development if needed.
Notes: There is no dedicated build step yet; the library is TypeScript-first and developed with Bun.

## Coding Style & Naming Conventions
- **Language**: TypeScript (`.tsx`). Use strict, typed APIs and named exports.
- **Indentation**: 2 spaces; keep lines reasonably short (~100 chars).
- **Naming**: `camelCase` for variables/functions, `PascalCase` for types/interfaces, `kebab-case` file names in `src/` (e.g., `continued-fractions.tsx`).
- **Imports/exports**: Prefer named exports from modules and aggregate in `index.tsx`.
- **Formatting**: Keep consistent quotes and semicolons. If adding a formatter, use Prettier with the above conventions.

## Testing Guidelines
- **Runner**: Bun’s test runner (`bun test`). Place tests under `tests/` with `*.test.{ts,js}`.
- **Scope**: Unit-test pure functions and interval logic; include edge cases (e.g., empty/degenerate intervals, divide-by-zero handling).
- **Coverage**: Aim for 80%+ for core modules (`src/arithmetic.tsx`, `src/narrowing.tsx`).
- **Examples**: `bun test -t "sqrt narrows via bisection"` to run a single test by name.

## Commit & Pull Request Guidelines
- **Commits**: User will commit. Just when summary, give a nice, terse commit message that the user can use. 

