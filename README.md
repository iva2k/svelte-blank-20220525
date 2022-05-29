# Blank Svelte App

## create-svelte

Built by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

```bash
# create a new project in my-app
npm init svelte my-app
cd my-app
npm install ;#(or pnpm install)
git init && git add -A && git commit -m "Initial commit" (optional)
```

## Developing

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

To preview the production build, execute `npm run preview`.

To deploy the app, need to install an [adapter](https://kit.svelte.dev/docs/adapters) for the target environment.

## Fix Issues That Might Come Up

Run `npm run XXX` replacing XXX for each of the scripts in `package.json`. It's a good idea to fix all errors and warnings that might come up, and re-check after each major addition.

### Issue with test

When running `npm run test`:

> You need svelte2tsx and typescript if you want to generate type definitions.

Fix:

```bash
npm install -D svelte2tsx
```

### Issue with imports linting

<https://github.com/sveltejs/kit/issues/1560>

Fix:

Install `eslint-import-resolver-typescript` package for resolving aliases set by "path" in `tsconfig.json`, and install `eslint-plugin-import` package for checking imports:

```bash
npm i -D eslint-plugin-import eslint-import-resolver-typescript
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
- There are `include` and `exclude` in `.svelte-kit/tsconfig.json`, so can't add to those. `include` is generated, `exclude` is static, so we can replace `exclude` with low risk of it breaking later.
- This fix uncovers a hidden issue in @sveltejs/kit - there are some missing types in the published package. Run `npm run check` or `tsc` to see the "type not found" errors ("outDir" addition just redirects the files generated by `tsc` command so they don't clash with existing .js files).
