Copilot instructions — automation-game-prototype

Quick commands

- Build (one-off):
  - npx tsc -p tsconfig.json
    - Produces package.js (single-file bundle) as configured in tsconfig.json.
- Dev / watch (Windows helper):
  - Run start.bat (starts tsc --watch, node server.js, and opens http://localhost:8000/)
- Run server (dev/preview):
  - node server.js (serves project root at http://localhost:8000)
- Tests: none present. package.json's "test" is a placeholder (exits with error).
- Lint: no linter configured in this repo.

High-level architecture

- Entry and bundle:
  - main.ts is the authoring entry. It uses triple-slash reference directives to pull in files from libs/ and src/ and relies on TypeScript's outFile to concatenate everything into package.js. index.html loads package.js.
- Runtime:
  - Browser-based canvas game prototype. main.ts bootstraps the game loop, camera, and entities (update + draw). Assets are loaded from images/.
- Code layout:
  - libs/: low-level engine/utilities (vector math, event system, camera, utils). Note: some libs (domutils.js) are plain JS.
  - src/: gameplay entities and systems (belt, inserter, machine, item, player, recipe, inventory, etc.).
  - package.js: generated bundle (do not edit directly). main.ts + referenced files are the source of truth.
  - server.js: very small Express static server (port 8000). start.bat launches tsc --watch, server, and opens browser.

Key conventions and patterns

- Triple-slash references and single-file bundling
  - Files use "/// <reference path=\"...\" />" to express dependency ordering. The build relies on that ordering; keep dependencies referenced before dependents.
  - tsconfig.json uses "outFile": "./package.js" and "inlineSourceMap": true. Rebuild with tsc to regenerate package.js.
- Generated artifact
  - package.js is the build output. Treat it as generated; modify .ts sources and rebuild instead of editing package.js.
- Mixed TS/JS sources
  - libs/utils/domutils.js is plain JS and included via allowJs:true in tsconfig. Be mindful when changing it (no TypeScript types).
- Dev helper
  - start.bat is the simplest reproducible dev startup on Windows. When adding CI or cross-platform scripts, add npm scripts to package.json to keep commands discoverable.

Files and automation the assistant checked for merging

- No CONTRIBUTING.md, CLAUDE.md, AGENTS.md, AIDER_CONVENTIONS.md, or other AI-assistant config files were found in the repository root to merge into these instructions.

Notes for future Copilot sessions

- Focus edits on the .ts sources under src/ and libs/ and use npx tsc -p tsconfig.json or start.bat for rebuilds.
- If you need to run the app locally, run node server.js (or start.bat on Windows) and open http://localhost:8000/.

Playwright testing (added)

- Installed devDependency: @playwright/test
- Scripts added to package.json:
  - npm run test:playwright -> runs Playwright tests
  - npm run test:playwright:headed -> runs tests in headed mode
  - npm run playwright:install -> installs Playwright browsers

Quick test usage

- Start the static server: node server.js
- Install browsers (once): npm run playwright:install
- Run tests: npm run test:playwright

Notes

- Example test at tests/playwright.spec.ts expects the server at http://localhost:8000. Keep server running when running tests.

CI (GitHub Actions)

- A workflow was added at .github/workflows/playwright.yml to run Playwright tests on push and pull requests to main/master.
- Workflow steps:
  - checkout, setup-node, npm ci
  - npm run playwright:install
  - start the local server (node server.js) in background and wait for http://localhost:8000
  - run npm run test:playwright

If you want this file expanded (add example workflows, npm scripts, or CI snippets), say which area to cover and the assistant will update it.
