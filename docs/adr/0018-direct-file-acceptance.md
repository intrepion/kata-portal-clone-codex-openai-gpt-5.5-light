# Direct File Acceptance

The double-clickable build is accepted only when the root `index.html` opens under `file://`, renders the game without CORS or Vite module errors, starts pointer lock, and completes at least the MVP one traversal smoke route. A page that merely opens is not enough because stale dev-server references can leave a direct-file build visually present but unplayable.
