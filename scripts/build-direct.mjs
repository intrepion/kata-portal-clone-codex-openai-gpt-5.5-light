import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const direct = resolve(root, 'file-dist');

await rm(direct, { force: true, recursive: true });
await rm(resolve(root, 'assets'), { force: true, recursive: true });
await mkdir(direct, { recursive: true });
await mkdir(resolve(root, 'assets'), { recursive: true });
await mkdir(resolve(direct, 'assets'), { recursive: true });

await build({
  entryPoints: [resolve(root, 'src/main.ts')],
  bundle: true,
  format: 'iife',
  target: 'es2022',
  outfile: resolve(root, 'assets/portal-clone.js'),
  loader: {
    '.css': 'css',
  },
  logLevel: 'silent',
});

await build({
  entryPoints: [resolve(root, 'src/main.ts')],
  bundle: true,
  format: 'iife',
  target: 'es2022',
  outfile: resolve(direct, 'assets/portal-clone.js'),
  loader: {
    '.css': 'css',
  },
  logLevel: 'silent',
});

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portal Clone Direct Launch</title>
    <link rel="stylesheet" href="./assets/portal-clone.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="./assets/portal-clone.js"></script>
  </body>
</html>
`;

await writeFile(resolve(direct, 'index.html'), html);
await writeFile(resolve(root, 'index.html'), html);
