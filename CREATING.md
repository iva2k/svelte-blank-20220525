# Creating: Blank SvelteKit App

## + Tauri + Capacitor + Storybook + Prettier + ESLint + Stylelint + Postcss + Playwright + Netlify + Vercel

This file describes how this app was created.

It is not a tutorial per se, and uses a dense step-by-step language without too much explanation and expects the reader to dive deeper on their own. Making it into a tutorial will yield a thik book, which is not the goal here.

## Software Mantra

### DRY

DRY - Don't-Repeat-Yourself. Knowledge should always reside in a single place. If code of more than 3 steps is repeated twice, maybe... if thrice - for sure refactor it so it resides in a single place and used from there. DRY is avoiding knowledge duplication (and splintering) and reducing the repetition of code patterns in favor of abstractions and avoiding redundancy. It also can be explained as SST - Single-SourceOf-Truth principle - "every piece of knowledge must have a single, unambiguous, authoritative representation within a system". Code can still be duplicated - it is sometimes a judgement call for balancing with other principles.

### KISS

KISS - Keep-It-Simple,Stupid. Keep the code simple and clear, making it easy to understand. If code needs comments, think hard - the code can probably be simplified by renaming, restructuring, breaking up.

## Prerequisites

Please follow the [Tauri Getting Started Guide](https://tauri.studio/en/docs/getting-started/intro#steps) to setup your system with the required Rust toolchain.

## create-svelte

Svelte scaffolding is set up by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

```bash
# create a new project in my-app
npm init svelte my-app
cd my-app
pnpm install
git init && git add -A && git commit -m "Initial commit" # (optional)
```

## Developing Locally

This application is built like a typical Node.js application. However, instead of `npm`, [`pnpm`](https://pnpm.io/) is used for package management.

> **Note:** You may use `yarn` or `npm`, but only a `pnpm` lockfile is included.

### Start development server

```bash
pnpm run dev

# or start the development server and open the app in a new browser tab
pnpm run dev -- --open
```

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
+    project: ['./tsconfig.json', './tsconfig.lint.json'],
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

- SvelteKit generates `.svelte-kit/tsconfig.json` which is called by "extend" in `./tsconfig.json`.
- TypeScript does not have a true extend mechanism (it is really just an override).
- There are `include` and `exclude` in `.svelte-kit/tsconfig.json`, so can't add to those. `include` is generated, `exclude` is static, so we can replace `exclude` with low risk of it breaking later (there is still some risk, just keep in mind where to look should anything break after an update).
- This fix uncovers a hidden issue in @sveltejs/kit - there are some missing types in the published package. Run `pnpm run check` or `tsc` to see the "type not found" errors ("outDir" addition above just redirects the files generated by `tsc` command so they don't clash with existing .js files). Filed issue <https://github.com/sveltejs/kit/issues/5114>.

### Issue "Could not detect a supported production environment" when running `pnpm run build`

> Could not detect a supported production environment. See <https://kit.svelte.dev/docs/adapters> to learn how to configure your app to run on the platform of your choosing

Fix:

See [Set Svelte SPA mode](#set-svelte-spa-mode) below.

### Issue with entry point

```bash
pnpm package
```

> Cannot generate a "svelte" entry point because the "." entry in "exports" is missing. Please specify one or set a "svelte" entry point yourself

(Issue is unresolved as of 2022-06: <https://github.com/sveltejs/kit/issues/2884>)

Fix: add the following to package.json (note that "." item in "exports" and "types" item refer to the path relative to the output generated by `svelte-kit package` in "package" directory):

```json
// package.json
+  "exports": {
+    ".": "./header/Header.svelte"
+  },
+  "types": "./header/Header.svelte.d.ts",
```

The meaning of that is set a default export/import from the package. It can be any one component.

For types, despite the Svelte-kit documentation stating that emitTypes is enabled by default, the following was needed in svelte.config.js:

```js
// svelte.config.js
  ...
  kit:{
    ...
+    package: {
+      emitTypes: true
+    },
  }
```

## Additions

### Add Tauri

Add desktop support using Tauri (version 1.2 as of writing time).

Why not Electron? - Tauri is way way better.

Note: iOS and Android support is promised in Tauri discussions, but not implemented yet as of 2022-11.

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

#### Change bundle identifier

To remove the issue:

> "Error: You must change the bundle identifier in `tauri.conf.json > tauri > bundle > identifier`. The default value `com.tauri.dev` is not allowed as it must be unique across applications."

Edit file `src-tauri/tauri.conf.json`:

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

### Set Svelte SPA mode

For using Tauri and Capacitor (standalone app) - SvelteKit should be set to SPA mode and explicitly opt out of SvelteKit\'s assumption needing a server.

SPA mode is set by using adapter-static and setting `fallback` option, see <https://github.com/sveltejs/kit/tree/master/packages/adapter-static#spa-mode>.

There are errors in many online sources that give wrong information about `prerender` and `ssr` for SPA mode (including SvelteKit's own documentation).

Note: Tauri and Capacitor -based app could still use a server if needed, but they cannot rely on SvelteKit server-side endpoints.

For deploying web apps, we can add and setup necessary adapters as needed (see below).

```bash
pnpm i -D @sveltejs/adapter-static
```

SvelteKit dynamic routes don't work with adapter-static, unless a fallback is set.

```js
// svelte.config.js
- import adapter from '@sveltejs/adapter-auto';
+ import adapter from '@sveltejs/adapter-static';
...
export default {
  kit: {
    ...
+    adapter: adapter({
+      // default options are shown:
+      // pages: 'build',
+      // assets: 'build',
+      // fallback: null,
+      // precompress: false
+      fallback: 'index.html'
+    }),
+    prerender: {
+      // This can be false when using a fallback (i.e. SPA mode)
+      default: true,
+    },
  }
};
```

Add `ssr` to `src/hooks.ts`:

```ts
export const handle: Handle = async ({ event, resolve }) => {
  ...
-  const response = await resolve(event);
+  const response = await resolve(event, {
+    ssr: true, // We let SvelteKit render all routes on server, so deep links will still work:
+  });
  return response;
};
```

### Deploy on Netlify and Vercel

Though it is recommended to use adapter-auto to choose between adapter-netlify and adapter-vercel, it does not fall back to adapter-static, which we need. So we will do it ourselves.

```bash
pnpm i -D @sveltejs/adapter-netlify @sveltejs/adapter-vercel
```

Load adapters in svelte.config.js:

```js
+ import netlify from '@sveltejs/adapter-netlify';
+ import vercel from '@sveltejs/adapter-vercel';
...
const config = {
  ...
  kit: {
    adapter:
+      process.env.VERCEL ? vercel() :
+      process.env.NETLIFY ? netlify() :
      adapter({
        ...
```

See netlify.toml and vercel.json files for other deploy settings.

Storybook (below) is deployed on Chromatic.

### Add Storybook

```bash
## pnpm is a bit tricky with storybook install, use `pnpx` with "-s" flag to skip installing dependencies.
## see https://github.com/storybookjs/storybook/issues/12995#issuecomment-813630999
pnpx sb init -s --builder @storybook/builder-vite
pnpm install
pnpm install -D @storybook/addon-controls @storybook/addon-docs @storybook/addon-svelte-csf
```

Add peer dependencies (some may be already installed):

```bash
pnpm i -D vite @babel/core babel-loader @storybook/builder-webpack5 @storybook/core-common @storybook/addons @storybook/api @storybook/client-api @storybook/client-logger @storybook/node-logger
pnpm i -D @storybook/components @storybook/core-events @storybook/theming
# The React packages were peer dependencies, somehow they leaked into storybook core dependencies:
pnpm i -D  react@^17.0.0 react-dom@^17.0.0 @mdx-js/react @types/react@^17.0.0
# These packages were throwing errors in "build-storybook" script:
pnpm i -D @storybook/preview-web @storybook/addon-backgrounds @storybook/addon-measure @storybook/addon-outline @storybook/channel-postmessage @storybook/channel-websocket
# These packages fix build errors in Storybook/Vite/pnpm
pnpm i -D @prefresh/vite @prefresh/core preact @mdx-js/preact
```

One might ask - why add react et.al.? Storybook uses `react` & `react-dom` for its UI. Some of @storybook/addon-\* packages list them as peer dependencies, but it does not work well in npm package mess and breaks things. Current solution is to add react and all related packages as devDependencies.

Another ongoing problem with Storybook is heavy reliance on webpack4 and slow migration toward webpack5, and further, it impossible to cleanly cut over to vite and remove all webpack versions as of 2022-06.

Disable Storybook telemetry and add Svelte CSF:

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

It turned out that storybook `main.js` trying to import preprocess from `svelte.config.js` is not viable (import is async, returns Promise, and can't await in top-level .cjs files). The solution was to hard-code same preprocess in `.storybook/main.js` same as in `svelte.config.js`.

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

#### Vite $app and $lib aliases

See <https://github.com/storybookjs/storybook/issues/14952>

Add vite config to .storybook/main.js:

```js
module.exports = {
+  webpackFinal: async (config) => {
+    config.resolve.alias = {
+      ...config.resolve.alias,
+      // $app: path.resolve('./.svelte-kit/dev/runtime/app')
+      $lib: path.resolve(__dirname, '../src/lib')
+      // $components: path.resolve(__dirname, '../src/lib/components')
+    };
+    return config;
+  },
+  async viteFinal(config) {
+    config.resolve.alias = {
+      ...config.resolve.alias,
+      // $app: path.resolve('./.svelte-kit/dev/runtime/app')
+      $lib: path.resolve(__dirname, '../src/lib')
+      // $components: path.resolve(__dirname, '../src/lib/components')
+    };
+    return config;
+  },
  ...
};
```

#### Fix Issue #237 in @storybook/builder-vite, error looking for @mdx-js/react package

See <https://github.com/storybookjs/builder-vite/issues/237>
See <https://github.com/storybookjs/builder-vite/issues/55>

```js
// .storybook/main.js
+ const path = require('path');
const preprocess = require('svelte-preprocess');
module.exports = {
+  // Customize Vite config
+  async viteFinal(config, { configType }) {
+    // Resolve 'Error: [vite-plugin-mdx] "@mdx-js/react" must be installed'
+    // https://github.com/storybookjs/builder-vite/issues/237#issuecomment-1047819614
+    // https://github.com/storybookjs/builder-vite/issues/55
+    config.root = path.dirname(require.resolve('@storybook/builder-vite'));
+
+    return config;
+  },
+
   ...
};
```

However, error in `svelte-kit dev` remains. Still need to `pnpm install -D @mdx-js/react` package.

#### Node version

Note: As of 2022-0522 Node 17 and 18 have breaking changes (migrated to ssl3):

- `Error: error:0308010C:digital envelope routines::unsupported`
- <https://github.com/webpack/webpack/issues/14532>
- <https://github.com/storybookjs/storybook/issues/18019>
- <https://github.com/storybookjs/storybook/issues/16555>

One solution would be to use node<17.0.0 in package.json "engines" and engine-strict=true in .npmrc, however...

The problem with node<17.0.0 is it breaks playwright which requires node>17. No solution to use playwright with node<17 yet. Argh!

For all other issues, adding `cross-env NODE_OPTIONS=--openssl-legacy-provider` to all affected scripts (storybook ones) in `package.json` is the only practical solution for now (it opens up old security vulnerabilities in legacy openssl).

```bash
pnpm i -D cross-env
```

TODO: (blocked by upstream) When there's a fix for node>17 and storybook / webpack@4, remove `NODE_OPTIONS=--openssl-legacy-provider` from `package.json`.

#### Using \*.stories.svelte files

An open/unresolved issue is storybook's v6.5.3 storyStoreV7=true not parsing `.stories.svelte` files. And storyStoreV7=false does not load stories at all (no filed issues). So use only `.stories.tsx` for now.

<https://github.com/storybookjs/storybook/issues/16673>

At least, Storybook is working with stories (.tsx, not .svelte) for Counter and Header (after reworking Header into Header + PureHeader).

However, Counter.svelte has Typescript, and Storybook chokes on it, similar to this issue:

<https://stackoverflow.com/questions/70681325/storybook-vite-svelte-typescript-typescript-not-being-processed-in-st>

That references a bug that has been fixed, however, I'm still getting Storybook not taking .svelte components with Typescript.

#### @prefresh/core

```bash
pnpm svelte:build
```

> @prefresh/core doesn't appear to be written in CJS, but also doesn't appear to be a valid ES module (i.e. it doesn't have "type": "module" or an .mjs extension for the entry point). Please contact the package author to fix

TODO: (blocked by upstream) Find a fix.

### Add @storybook/addon-a11y

```bash
pnpm i -D @storybook/addon-a11y
```

```js
module.exports = {
  ...
  addons: [
    ...
+   '@storybook/addon-a11y'
  ]
```

### Add Storybook App Theme Switcher Addon

There's a default Storybook theming addon: `@storybook/theming`. It allows control over theming of all parts of Storybook app (UI, docs, preview), but it won't affect the components preview.

To add custom theme to Storybook app, create file .storybook/manager.js and .storybook/YourTheme.js with the following code:

```js
// .storybook/manager.js
import { addons } from '@storybook/addons';
// import { themes } from '@storybook/theming';
import yourTheme from './YourTheme';
addons.setConfig({
  // theme: themes.dark
  theme: yourTheme
});
```

```js
// .storybook/YourTheme.js
import { create } from '@storybook/theming';

export default create({
  // base: 'light',
  base: 'dark',
  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://place-hold.it/350x150',
  brandTarget: '_self'

  colorPrimary: 'hotpink',
  colorSecondary: 'deepskyblue',

  // UI
  appBg: 'white',
  appContentBg: 'silver',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: 'black',
  barBg: 'hotpink',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4
});
```

The above will not affect Storybook docs, which have their own theme. To change that, modify .storybook/preview.js:

```js
// .storybook/preview.js
+ // import { themes } from '@storybook/theming';
+ import yourTheme from './YourTheme';
export const parameters = {
+  // for '@storybook/theming':
+  docs: {
+    // theme: themes.dark
+    theme: yourTheme
+  },
  ...
};
```

### Add Storybook Theme Switcher Addon

To change themes in Storybook component previews, use an addon [Theme Switcher addon](https://storybook.js.org/addons/storybook-addon-themes). It can coexist with `@storybook/theming`, though will show two identical icons on the toolbar with different menus.

```bash
pnpm i -D storybook-addon-themes
```

Add plugin to Storybook:

```js
// .storybook/main.js

module.exports = {
  ...
  addons: [
    ...
+    'storybook-addon-themes'
  ],
  ...
```

Add themes list:

```js
// .storybook/preview.js

export const parameters = {
   ...
+  themes: {
+    default: 'twitter',
+    list: [
+      { name: 'twitter', class: 'theme-twt', color: '#00aced' },
+      { name: 'facebook', class: 'theme-fb', color: '#3b5998' }
+    ]
+  }
};
```

The theme only changes class on the root element (which can be chosen to differ from the default \<body\> tag). The actual theme should be provided and can match app theme.

It is possible to load the app theme in .storybook/preview.js, just add the CSS file:

```js
// .storybook/preview.js
+ import '../src/app.css';
```

### Publish Storybook on Chromatic

Login to [www.chromatic.com](https://www.chromatic.com) and setup yor project, get [YOUR_TOKEN]. Then connect:

```bash
pnpm i -D chromatic
npx chromatic --build-script-name=storybook:build --project-token=[YOUR_TOKEN]
```

Also add project token to the Github repo, see <https://www.chromatic.com/docs/github-actions>:

Go to Settings > Secrets > Actions Secrets > New Repository Secret, then enter Name - CHROMATIC_PROJECT_TOKEN and Secret - [YOUR_TOKEN].

Create file '.github/workflows/chromatic.yml' (see contents in sources).

### Add Prettier & ESLint Rules, Stylelint, Postcss and Autoprefixer

ESLint and Prettier is already part of Svelte Kit installation, so some of the packages below are already present.

#### Stylelint and additional ESLint rules (Storybook)

```bash
pnpm install -D stylelint @ronilaukkarinen/stylelint-a11y stylelint-config-standard stylelint-config-recommended
pnpm install -D eslint-plugin-storybook
```

Note: stylelint-a11y original creator / maintainer is AWOL, using an updated and maintained fork.

Edit `.eslintrc.cjs` file:

```js
// .eslintrc.cjs
module.exports = {
  ...
  extends: [
     'eslint:recommended',
     'plugin:@typescript-eslint/recommended',
     'plugin:import/recommended',
+    'plugin:storybook/recommended',
     'prettier'
  ],
  ...
  parserOptions: {
     project: ['./tsconfig.json', './tsconfig.lint.json'],
     tsconfigRootDir: './',
     sourceType: 'module',
     ecmaVersion: 2020,
+    extraFileExtensions: ['.svelte']
  },
  ...
+  rules: {
+    'import/no-mutable-exports': 'off'
+  }
};
```

#### Postcss, Autoprefixer

Autoprefixer is a PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from [Can I Use](https://caniuse.com/). It is recommended by Google and used in Twitter and Alibaba.

```bash
pnpm install -D postcss postcss-cli postcss-import postcss-nesting postcss-html autoprefixer
```

Add file `postcss.config.cjs` with the following contents:

```js
const autoprefixer = require('autoprefixer');

const config = {
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {},
    autoprefixer
  }
};

module.exports = config;
```

Enable postcss & scss in svelte.config.js:

```js
import preprocess from 'svelte-preprocess';
const config = {
  preprocess: preprocess({
    postcss: true,
    scss: { includePaths: ['src', 'node_modules'] }
  }),
  ...
```

#### Prettier and additional Stylelint rules

```bash
pnpm install -D prettier stylelint-config-prettier stylelint-config-html
```

#### Create Stylelint configuration

Add file `.stylelintrc.json`:

```json
// .stylelintrc.json
{
  ... see file in the repo
}
```

#### VSCode formatOnSave

VSCode can format all documents on save, and it should match Stylelint & Prettier.

Some issues can be with VSCode user settings that are not visible right away. If saving any files and then running `pnpm format` shows those files as changed in the process, check "editor.defaultFormatter" for that file type.

For example, VSCode would re-format .json files differently. It turns out VSCode was using different JSON formatter set in user settings, and ignored top-level "editor.defaultFormatter". To fix that, add `jsonc` and `json` settings to `.vscode/settings.json` file as shown below.

Add the following to `.vscode/settings.json` file (if not already there):

```json
// .vscode/settings.json
{
+  "editor.defaultFormatter": "esbenp.prettier-vscode",
+  "editor.formatOnSave": true,
+  "editor.formatOnPaste": true,
+  "editor.formatOnType": false,
+  "editor.codeActionsOnSave": {
+    "source.fixAll.eslint": true,
+    "source.fixAll.html": true
+  },
+  "eslint.validate": ["svelte"],
+  "editor.tokenColorCustomizations": {
+    "[Svelte]": {
+      "textMateRules": [
+        {
+          "settings": {
+            "foreground": "#569CD6" // any color you like
+          },
+          "scope": "support.class.component.svelte" // scope name you want to adjust highlighting for
+        }
+      ]
+    }
+  },
+  "svelte.enable-ts-plugin": true,
+  "javascript.format.enable": false,
+  "files.insertFinalNewline": true,
+  "files.trimFinalNewlines": false,
+  "[json]": {
+    "editor.defaultFormatter": "esbenp.prettier-vscode"
+  },
+  "[jsonc]": {
+    "editor.defaultFormatter": "esbenp.prettier-vscode"
+  },
+  "[svelte]": {
+    "editor.defaultFormatter": "svelte.svelte-vscode"
+  },
+  "[html]": {
+    "editor.defaultFormatter": "vscode.html-language-features"
+  }
}
```

### Add Tooling

```bash
pnpm install -D glob sass shx vite-plugin-static-copy cpy
```

Add assets copying to svelte.config.js:

```js
+ import { viteStaticCopy } from 'vite-plugin-static-copy';
+ import assets from './assets.js';

const config = {
  ...
  kit: {
    ...
+    vite: () => ({
+      plugins: [
+        // copy is needed for vite to work in svelte:dev (especially under "tauri dev")
+        // All copy commands are duplicated in package.json:scripts.svelte:prebuild, for svelte:dev to work correctly.
+        viteStaticCopy({
+          targets: assets,
+          verbose: true
+        })
+      ]
+    })
  }
};
```

### Add Capacitor

Capcitor has 2 largely independent parts that we could use:

1. Plugins to use native functionality on various platforms
2. Build apps for mobile platforms - iOS, Android

Use of Capacitor \#1 native functionality (like Camera, GPS, etc.) can be very handy for some apps.

Since Tauri has no iOS/Android build support (it's in development), we can use Capacitor \#2 to bridge that gap. Once Tauri implements iOS/Android build support, we can revisit \#2, and keep Capacitor just for \#1.

We will target QR code scanning as a very usefull feature for \#1.

#### Setup

The following setup is based on `@sveltejs/adapter-static` which puts output to 'build' folder by default (beware that other adapters place output files into different location).

First, install pre-requisites per <https://capacitorjs.com/docs/getting-started/environment-setup>.

Then, install VSCode extension:

```bash
code --install-extension ionic.ionic
```

Add Capacitor to the project:

```bash
pnpm install @capacitor/core
pnpm install -D @capacitor/cli
# use npx vs. pnpx with cap as pnpx won't run cap (or call cap directly, without npx):
npx cap init svelte-blank-20220525 com.iva2k.svelteblank20220525 --web-dir=build
```

Add few scripts for convenince:

```json
// package.json
{
  ...
  "scripts": {
     ...
+    "android:open": "cap open android",
+    "android:dev": "cap run android",
```

##### Add Android platform

```bash
pnpm install @capacitor/android
npx cap add android
```

##### Add iOS platform

```bash
pnpm install @capacitor/ios
npx cap add ios
```

Now we can use Capacitor plugins for native functionality.

#### Add Geolocation

For a quick example, add Geolocation:

```bash
pnpm install @capacitor/geolocation
npx cap sync
```

Create `src/routes/geolocation.svelte`:

```js
<script lang="ts">
  import { Geolocation, type Position } from '@capacitor/geolocation';

  let loc: Position | null = null;
  async function getCurrentPosition() {
    const res = await Geolocation.getCurrentPosition();
    loc = res;
  }
</script>

<div>
  <h1>Geolocation</h1>
  <p>Your location is:</p>
  <p>Latitude: {loc?.coords.latitude}</p>
  <p>Longitude: {loc?.coords.longitude}</p>

  <button on:click={getCurrentPosition}>Get Current Location</button>
</div>
```

Add the page to the PureHeader links:

```js
<header>
  ...
  <nav>
    ...
    <ul>
      ...
+      <li class:active={pathname === '/geolocation'}>
+        <a sveltekit:prefetch href="/geolocation">Geolocation</a>
+      </li>
        ...
```

Add option to PureHeader.stories.tsx:

```tsx
export default {
  ...
  argTypes: {
    pathname: {
-      options: ['/', '/about'],
+      options: ['/', '/about', '/geolocation'],
    ...
```

For Android, add permissions to "android/app/src/main/AndroidManifest.xml" file:

```xml
<manifest ...>
  ...
+  <!-- Geolocation API -->
+  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
+  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
+  <uses-feature android:name="android.hardware.location.gps" />
</manifest>
```

For iOS, add usage description to "ios/App/App/Info.plist" file:

```xml
<dict>
+  <key>NSLocationAlwaysUsageDescription</key>
+  <string>To be able to use location services when app is in the background</string>
+  <key>NSLocationWhenInUseUsageDescription</key>
+  <string>To be able to use location services when app is running</string>
</dict>
```

#### Add QR Code Scanner

For the QR Code scanner feature, we will use [@capacitor-community/barcode-scanner](https://github.com/capacitor-community/barcode-scanner) plugin.

Note that web platform is not yet supported [#31](https://github.com/capacitor-community/barcode-scanner/issues/31) (it looks quite simple to implement - use some existing lib like zxing on top of web camera and submit a PR).

There are also other plugins to try (sith web platform support):

- see <https://github.com/xulihang/capacitor-plugin-dynamsoft-barcode-reader/tree/main/example>
- see <https://www.npmjs.com/package/qr-scanner>
- see <https://github.com/zxing-js/library>

Because of the fact that the Scanner View will be rendered behind the WebView, we have to call `hideBackground()` to make the WebView and the \<html\> element transparent. Every other element that needs transparency, we will have to handle ourself.

The elements are made transparent by adding `background: 'transparent';` in the \<style\> section.

```bash
pnpm install @capacitor-community/barcode-scanner
npx cap sync
```

Create `src/routes/qrscanner.svelte`:

```js
// See src/routes/qrscanner.svelte file in repo
```

Add the page to the PureHeader links:

```js
<header>
  ...
  <nav>
    ...
    <ul>
      ...
+      <li class:active={pathname === '/qrscanner'}>
+        <a sveltekit:prefetch href="/qrscanner">QR Scanner</a>
+      </li>
```

Add option to PureHeader.stories.tsx:

```tsx
export default {
  ...
  argTypes: {
    pathname: {
-      options: ['/', '/about', '/geolocation'],
+      options: ['/', '/about', '/geolocation', 'qrscanner'],
    ...
```

For Android, add permissions to "android/app/src/main/AndroidManifest.xml" file:

```xml
<manifest
  xmlns:android="http://schemas.android.com/apk/res/android"
+  xmlns:tools="http://schemas.android.com/tools"
  package="com.example">

  <application
    ...
+    android:hardwareAccelerated="true"
  >
  </application>
  ...
+  <!-- QR Scanner -->
+  <uses-permission android:name="android.permission.CAMERA" />
+  <uses-sdk tools:overrideLibrary="com.google.zxing.client.android" />
</manifest>
```

For iOS, add usage description to "ios/App/App/Info.plist" file:

```xml
<dict>
+  <key>NSCameraUsageDescription</key>
+  <string>To be able to scan barcodes</string>
</dict>
```

#### Using PWA Elements

Some Capacitor plugins (such as Camera, Toast) need custom UI elements. May need to add @ionic/pwa-elements to the project (this project does not have that done, and @capacitor-community/barcode-scanner seems to be working just fine without it):

```bash
pnpm install @ionic/pwa-elements
```

A typical installation involves importing the package and registering the elements, or adding a script tag to the \<head\> of the index.html for the app

```js
// src/routes/+layout.svelte
<script>
  ...
+  import { onMount } from 'svelte';
+  // import { defineCustomElements } from '@ionic/pwa-elements/loader'; // Broken -> Directory import '...' is not supported resolving ES modules
+  // Use a hack to import:
+  import loader from '@ionic/pwa-elements/loader/index.cjs.js';
+  onMount(async () => {
+    await loader.defineCustomElements(window);
+  });
  ...
```

#### Interesting Capacitor Community Plugins

- @capacitor-community/bluetooth-le
- @capacitor-community/camera-preview
- @capacitor-community/keep-awake

#### Fix Issues With Capacitor

None to fix.

##### Error in `pnpm run dev:android`

> ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.

TODO: (when needed) Find a fix.
