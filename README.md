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

Install `eslint-import-resolver-typescript` package for resolving aliases set by "path" in `tsconfig.json`, and install `eslint-plugin-import` package for checking imports:

```bash
npm i -D eslint-plugin-import eslint-import-resolver-typescript
```

Add to `.eslintrc.cjs` file:

```cjs
{
  plugins: [
    ...
    'import'
  ],
  settings: {
    'import/resolver': {
      typescript: {}
    }
    ...
  },
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.lint.json'},
    tsconfigRootDir: './',
    ...
  }
}
```

Create file `tsconfig.lint.json` and add `"include": ["./playwright.config.ts", etc. ]` to it ([see the file](tsconfig.lint.json)).

Note: Svelte-kit generates `.svelte-kit/tsconfig.json` which is called by "extend" in `./tsconfig.json`, and ts does not have true extend mechanism (it is really just an override), but there are no `files` in `.svelte-kit/tsconfig.json`, so adding explicit files is ok.
