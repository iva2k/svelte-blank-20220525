# Blank SvelteKit App

## + Tauri + Capacitor + Storybook + Prettier + ESLint + Stylelint + Postcss

A cross-platform Desktop / Mobile / Web application starter.

ATTENTION! This Repo is obsoleted and will be deleted. This app has moved to latest [iva2k/svelte-blank-20220525](https://github.com/iva2k/svelte-blank-20221125).

<!-- prettier-ignore -->
|Storybook| [![Netlify Status](https://api.netlify.com/api/v1/badges/8a3028e8-f005-4617-9190-f54092b6e9c3/deploy-status)](https://app.netlify.com/sites/svelte-blank-20220525/deploys) |  [![Vercel Status](https://shields.io/github/deployments/iva2k/svelte-blank-20220525/production?style=flat&label=vercel&logo=vercel)](https://vercel.com/iva2k/svelte-blank-20220525) |
|:-:|:-:|:-:|
|| [App Demo](https://svelte-blank-20220525.netlify.app) |  |

Note: Vercel is not able to install and build this project (Vercel does not support Node 18 yet).

Built with:

- [Svelte](https://svelte.dev) - UI framework
- [Svelte Kit](https://kit.svelte.dev) - UI build system
- [Tauri](https://tauri.studio) - Desktop Application framework
- [Capacitor](https://capacitorjs.com) - Building crossplatform apps
- [Storybook](https://storybook.js.org) - Tool for building UI components and pages in isolation
- [Prettier](https://prettier.io/) - Opinionated Code Formatter
- [ESLint](https://eslint.org) - Pluggable JavaScript linter
- [Stylelint](https://stylelint.io/) - A mighty, modern CSS linter
- [Postcss](https://postcss.org/) - Transforming styles with JS plugins

Continuous Integrations:

- [Chromatic](https://www.chromatic.com) - Storybook Github CI

## Install

### Start Your App

To start your app from this project as a template:

```bash
mkdir my-app && cd my-app
npx degit iva2k/svelte-blank-20220525#ui-agnostic
# or
npx degit iva2k/svelte-blank-20220525#ui-bootstrap
# or
npx degit iva2k/svelte-blank-20220525#ui-bulma
# or ... (see other UI framework branches below)
```

### Or Clone the Repo

```bash
git clone https://github.com/iva2k/svelte-blank-20220525.git
cd svelte-blank-20220525
```

## Developing Locally

Please follow the [Tauri Getting Started Guide](https://tauri.studio/en/docs/getting-started/intro#steps) to setup your system with the required Rust toolchain.

This application is built like a typical Node.js application. However, instead of `npm`, [`pnpm`](https://pnpm.io/) is used for package management.

> **Note:** You may use `yarn` or `npm`, but only a `pnpm` lockfile is included, and some scripts call `pnpm` directly and need to be changed to your package manager.

```bash
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

## Styling / UI Components

There are many UI frameworks that work with Svelte / SvelteKit, and choice can be daunting.

<https://bestofsvelte.com/t/ui-library>

<https://sveltesociety.dev/components/>

This project has few of the top UI frameworks integrated in separate git branches:

<!-- prettier-ignore -->
| Git Branch | UI Framework | Dark Theme Switch | Notes |
|-|-|:-:|-|
| [ui-agnostic](../../tree/ui-agnostic)     | [AgnosticUI](https://github.com/AgnosticUI/agnosticui) | Y | |
| [ui-bootstrap](../../tree/ui-bootstrap)   | [Bootstrap](https://github.com/twbs/bootstrap) | Y | [Sveltestrap](https://github.com/bestguy/sveltestrap), Themes from [Bootswatch](https://github.com/thomaspark/bootswatch) |
| [ui-bulma](../../tree/ui-bulma)           | [Bulma](https://bulma.io/) | N | |
| [ui-carbon](../../tree/ui-carbon)         | [Carbon](https://carbon-components-svelte.onrender.com/) | Y | |
| [ui-framework7](../../tree/ui-framework7) | [Framework7](https://framework7.io/svelte/introduction.html) | N | Incomplete and currently broken |
| [ui-shoelace](../../tree/ui-shoelace)     | [Shoelace](https://shoelace.style/) | Y | |
|                                           | Smelte       |   | Material + TailwindCSS |
|                                           | TailwindCSS  |   | May use components - [Flowbite](https://flowbite.com/docs/getting-started/introduction/) |
|                                           | [Ionic](https://ionicframework.com) |   | See good [example](https://github.com/Tommertom/svelte-ionic-app) |
|                                           | [Chota](https://jenil.github.io/chota/) |   | [SvelteChota](https://alexxnb.github.io/svelte-chota/why_chota) |
| | [Svelterial](https://github.com/svelterialjs/svelterial) |   | [Svelte Materialify](https://github.com/TheComputerM/svelte-materialify) is on a deprecation path. |
| | [Tachyons](https://tachyons.io) |   | |
| | [Svelte Material](https://sveltematerialui.com/) |   | |
| | [Svelte Flat UI](https://svelteui.js.org/#/) |   | |
| | [Attractions](https://github.com/illright/attractions) |   | |
