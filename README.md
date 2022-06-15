# Blank Svelte Kit App + Tauri + Capacitor + Storybook + Prettier + ESLint + Stylelint + Postcss

A cross-platform Desktop / Mobile / Web application starter.

<!-- prettier-ignore -->
| [![Netlify Status](https://api.netlify.com/api/v1/badges/8a3028e8-f005-4617-9190-f54092b6e9c3/deploy-status)](https://app.netlify.com/sites/svelte-blank-20220525/deploys) |  [![Vercel Status](https://shields.io/github/deployments/iva2k/svelte-blank-20220525/production?style=flat&label=vercel&logo=vercel)](https://vercel.com/iva2k/svelte-blank-20220525) | |
|:-:|:-:|:-:|
| [App Demo](https://svelte-blank-20220525.netlify.app) |  | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/iva2k/svelte-blank-20220525) |

Note: StackBlitz is not able to install and build this project.

Note: Vercel is not able to install and build this project (Vercel does not support Node 18 yet).

Built with:

- [Svelte](https://svelte.dev) – UI framework
- [Svelte Kit](https://kit.svelte.dev) – UI build system
- [Tauri](https://tauri.studio) – Desktop Application framework
- [Capacitor](https://capacitorjs.com) - Building crossplatform apps
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
pnpm run svelte:dev

# or start the development server and open the app in a new browser tab
pnpm run svelte:dev -- --open
```

## Building

To create a production version of the web app (to be hosted on a server):

```bash
pnpm run svelte:build
```

To preview the production build of the web app, execute `pnpm run preview`.

To deploy the app, need to install an [adapter](https://kit.svelte.dev/docs/adapters) for the target environment.

## Desktop App

To run desktop app (using Tauri)

```bash
pnpm run dev
```

To create desktop executable:

```bash
pnpm run build
```

## Mobile App

To update mobile app project (Android):

```bash
pnpm run svelte:build
cap open android
```

iOS platform is not installed in this repo, but can easily be added. See [CREATING](./CREATING.md)

## How This App Was Created

See [CREATING](./CREATING.md).
