# Blank Svelte Kit App + Tauri + Storybook + Prettier + ESLint

A cross-platform Desktop application starter.

Built with:

- [Svelte](https://svelte.dev) – UI framework
- [Svelte Kit](https://kit.svelte.dev) – UI build system
- [Tauri](https://tauri.studio) – Desktop Application framework

This file describes how this app was created.

## create-svelte

Svelte scaffolding is set up by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

```bash
# create a new project in my-app
npm init svelte my-app
cd my-app
pnpm install
git init && git add -A && git commit -m "Initial commit" (optional)
```

## Developing Locally

Please follow the [Tauri Getting Started Guide](https://tauri.studio/en/docs/getting-started/intro#steps) to setup your system with the Rust toolchain.

This application is built like a typical Node.js application. However, instead of `npm`, [`pnpm`](https://pnpm.io/) is used for package management.

> **Note:** You may use `yarn` or `npm`, but only a `pnpm` lockfile is included.

Start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of the app:

```bash
pnpm run build
```

To preview the production build, execute `pnpm run preview`.

To deploy the app, need to install an [adapter](https://kit.svelte.dev/docs/adapters) for the target environment.

## Fix Issues That Might Come Up

Run `pnpm run XXX` replacing XXX for each of the scripts in `package.json`. It's a good idea to fix all errors and warnings that might come up, and re-check after each major addition.

### Issue with test

When running `pnpm run test`:

> You need svelte2tsx and typescript if you want to generate type definitions.

Fix:

```bash
pnpm install -D svelte2tsx
```

### Issue with imports linting

<https://github.com/sveltejs/kit/issues/1560>

Fix:

Install `eslint-import-resolver-typescript` package for resolving aliases set by "path" in `tsconfig.json`, and install `eslint-plugin-import` package for checking imports:

```bash
pnpm i -D eslint-plugin-import eslint-import-resolver-typescript
```

Add to `.eslintrc.cjs` file:

```cjs
{
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
+    'plugin:import/recommended',
    'prettier'
  ],
  plugins: [
    ...
+    'import'
  ],
  settings: {
+    'import/resolver': {
+      typescript: {}
+    }
    ...
  },
  parserOptions: {
+    project: ['./tsconfig.json', './tsconfig.lint.json'},
+    tsconfigRootDir: './',
    ...
  }
}
```

Create file `tsconfig.lint.json` with:

```json
{
  "extends": "./tsconfig.json",
  "include": ["./playwright.config.ts", "./svelte.config.js", "./tests/**/*.ts"]
}
```

Add few lines to tsconfig.json:

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    ...
+    "outDir": ".types",
+    "paths": {
+      "$app/*": ["./.svelte-kit/runtime/app/*"],
+      "$lib": ["./src/lib"],
+      "$lib/*": ["./src/lib/*"]
+    }
  },
+  "exclude": ["./node_modules/**", ".svelte-kit/**", ".types"]
}
```

Some background info on these changes:

- Svelte-kit generates `.svelte-kit/tsconfig.json` which is called by "extend" in `./tsconfig.json`.
- Typescript does not have a true extend mechanism (it is really just an override).
- There are `include` and `exclude` in `.svelte-kit/tsconfig.json`, so can't add to those. `include` is generated, `exclude` is static, so we can replace `exclude` with low risk of it breaking later (there is still some risk, just keep in mind where to look should anything break after an update).
- This fix uncovers a hidden issue in @sveltejs/kit - there are some missing types in the published package. Run `pnpm run check` or `tsc` to see the "type not found" errors ("outDir" addition above just redirects the files generated by `tsc` command so they don't clash with existing .js files). Filed issue <https://github.com/sveltejs/kit/issues/5114>.

When running `pnpm run build`:

> Could not detect a supported production environment. See <https://kit.svelte.dev/docs/adapters> to learn how to configure your app to run on the platform of your choosing

Fix:

See [Remove Default Sever](#remove-default-server) below.

## Additions

### Remove Default Server

For using Tauri (standalone app) - explicitly opt out of SvelteKit\'s assumption needing a server. Just attach the @sveltejs/adapter-static in `svelte.config.js`:

```bash
pnpm i -D @sveltejs/adapter-static
```

```js
// svelte.config.js
- import adapter from '@sveltejs/adapter-auto';
+ import adapter from '@sveltejs/adapter-static';
```

Note: Tauri-based app could still use a server if needed. Add and setup a necessary adapter as needed.

### Add Tauri

Add desktop support using Tauri.

Note: iOS and Android support is promised in Tauri discussions, but not implemented yet as of 2022-05.

```bash
pnpm i -D @tauri-apps/api @tauri-apps/cli
```

Add scripts to package.json:

```json
   {
     scripts {
-      "dev": "svelte-kit dev",
-      "build": "svelte-kit build",
+      "dev": "tauri dev",
+      "build": "tauri build",
+      "svelte:dev": "svelte-kit dev --port 3000",
+      "svelte:build": "svelte-kit build",
+      "tauri": "tauri",
     }
   }
```

```bash
pnpm run tauri init
# Use ../build for "Where are your web assets (HTML/CSS/JS) located"
# What is your app name? - svelte-blank-20220525
# What should the window title be? - svelte-blank-20220525
# Where are your web assets (HTML/CSS/JS) located, relative to the "<current dir>/src-tauri/tauri.conf.json" file that will be created? - ../build
# What is the url of your dev server? - http://localhost:3000
```

Add `ssr:false` to `src/hooks.ts`:

```ts
export const handle: Handle = async ({ event, resolve }) => {
  ...
-  const response = await resolve(event);
+  const response = await resolve(event, {
+    ssr: false, // For Tauri (since 1.0.0-next.222)
+  });
  return response;
};
```

To fix this warning:

> You should set `config.kit.prerender.default` to `true` if no fallback is specified

Add the following to `svelte.config.js`:

```js
const config = {
  ...
  kit: {
    adapter: adapter({}),
+    prerender: {
+      // This can be false when using a fallback (i.e. SPA mode)
+      default: true,
+    },
```

Change bundle identifier (to remove the issue "Error: You must change the bundle identifier in `tauri.conf.json > tauri > bundle > identifier`. The default value `com.tauri.dev` is not allowed as it must be unique across applications.")

```json
// src-tauri/tauri.conf.json
{
  ...
  "tauri": {
    ...
    "bundle": {
      ...
-      "identifier": "com.tauri.dev",
+      "identifier": "com.iva2k.svelte-blank-20220525",
      ...
```

### Add Storybook

```bash
## pnpm is a bit tricky with storybook install, use "-s" to skip installing dependencies.
npx sb init -s --builder @storybook/builder-vite
pnpm install
pnpm install -D @storybook/addon-controls @storybook/addon-docs @storybook/addon-svelte-csf
```

Add peer dependencies (some may be already installed):

```baseh
pnpm i -D vite @babel/core babel-loader @storybook/core-common @storybook/addons @storybook/api @storybook/client-api @storybook/client-logger @storybook/node-logger @storybook/components @storybook/core-events @storybook/theming @storybook/preview-web
pnpm i -D  react@^17.0.0 react-dom@^17.0.0 @mdx-js/react @types/react@^17.0.0
```

Disable Storybook telemetry:

```js
// .storybook/main.js
module.exports = {
  addons: [
     ...
+    '@storybook/addon-svelte-csf',
     ...
  ],
  core: {
+    disableTelemetry: true, // 👈 Disables telemetry
  }
};
```

To fix error in `.storybook/main.js`, add file `.storybook/package.json` with the following:

```json
// .storybook/package.json
{
  "type": "commonjs"
}
```

Remove example stories and components:

```bash
npx rimraf src/stories
```

### Solve Storybook Issues

#### Preprocess in .storybook/main.js

It turned out that storybook `main.js` trying to import preprocess from `svelte.config.js` is not viable (import is async, returns Promis, and can't await in top-level .cjs files). The solution was to hard-code same preprocess in `.storybook/main.js` same as in `svelte.config.js`.

```js
// .storybook/main.js
+ const preprocess = require('svelte-preprocess');
module.exports = {
  ...
  svelteOptions: {
-    preprocess: require('../svelte.config.js').preprocess
+    preprocess: preprocess(),
  },
```

#### Node version

Note: As of 2022-0522 Node 17 and 18 have breaking changes (migrated to ssl3):

- `Error: error:0308010C:digital envelope routines::unsupported`
- <https://github.com/webpack/webpack/issues/14532>
- <https://github.com/storybookjs/storybook/issues/18019>
- <https://github.com/storybookjs/storybook/issues/16555>

One solution would be to use node<17.0.0 in package.json "engines" and engine-strict=true in .npmrc, however...

The problem with node<17.0.0 is it breaks playwright which requires node>17. No solution to use playwrigh with node<17 yet. Argh!

For all other issues, adding `cross-env NODE_OPTIONS=--openssl-legacy-provider` to all affected scripts (storybook ones) in `package.json` is the only practical solution for now (it opens up old security vulnerabilities in legacy openssl).

```bash
pnpm i -D cross-env
```

TODO: When there's a fix for node>17 and storybook / webpack@4, remove `NODE_OPTIONS=--openssl-legacy-provider` from `package.json`.
