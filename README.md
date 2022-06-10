# Blank Svelte Kit App + Tauri + Storybook + Prettier + ESLint + Stylelint + Postcss

A cross-platform Desktop application starter.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/iva2k/svelte-blank-20220525)

Built with:

- [Svelte](https://svelte.dev) – UI framework
- [Svelte Kit](https://kit.svelte.dev) – UI build system
- [Tauri](https://tauri.studio) – Desktop Application framework
- [Storybook](https://storybook.js.org) – Tool for building UI components and pages in isolation
- [Prettier](https://prettier.io/) - Opinionated Code Formatter
- [ESLint](https://eslint.org) - Pluggable JavaScript linter
- [Stylelint](https://stylelint.io/) - A mighty, modern CSS linter
- [Postcss](https://postcss.org/) - Transforming styles with JS plugins

## Developing Locally

Please follow the [Tauri Getting Started Guide](https://tauri.studio/en/docs/getting-started/intro#steps) to setup your system with the required Rust toolchain.

This application is built like a typical Node.js application. However, instead of `npm`, [`pnpm`](https://pnpm.io/) is used for package management.

> **Note:** You may use `yarn` or `npm`, but only a `pnpm` lockfile is included.

### Get repo

```bash
git clone https://github.com/iva2k/svelte-blank-20220525.git
cd svelte-blank-20220525
pnpm install # or npm install
```

### Start development server

```bash
pnpm run dev

# or start the development server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of the app:

```bash
pnpm run build
```

To preview the production build, execute `pnpm run preview`.

To deploy the app, need to install an [adapter](https://kit.svelte.dev/docs/adapters) for the target environment.

## How This App Was Created

See [CREATING](./CREATING.md).
