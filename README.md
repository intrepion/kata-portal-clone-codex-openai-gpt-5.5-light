# Portal Clone

A small first-person Portal-inspired browser puzzle game built in vertical MVP slices.

## Run

```sh
npm install
npm run dev
```

## Checks

```sh
npm run check
```

`npm run check` builds the Vite app, regenerates the direct-file root launch, runs unit tests, and runs all browser completion routes against the generated `file://` artifact.

MVP 1 proves visible two-way portal traversal with destination-camera portal views.
MVP 2 proves weighted cube carry, cube portal traversal, pressure button unlock, and chamber exit completion.
MVP 3 proves velocity-preserving fling traversal across a visible gap.
MVP 4 proves the root `index.html` launches under `file://` with the same browser completion routes.
