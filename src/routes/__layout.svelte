<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import * as _ from '@shoelace-style/shoelace';
  import type { SlSwitch } from '@shoelace-style/shoelace';

  import Header from '$lib/header/Header.svelte';
  // import '../app.css';

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  let dark = darkModeQuery.matches;
  try {
    // Chrome & Firefox
    darkModeQuery.addEventListener('change', (event) => {
      dark = event.matches;
    });
  } catch (e1) {
    try {
      // Safari
      darkModeQuery.addListener((event) => {
        dark = event.matches;
      });
    } catch (e2) {
      console.error(e2);
    }
  }

  $: if (typeof window !== 'undefined') {
    document.documentElement.classList?.[dark ? 'add' : 'remove']?.('sl-theme-dark');
  }

  /* for SlSwitch */
  const onChange = (e: Event) => {
    dark = (e.target as SlSwitch).checked;
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="vendor/shoelace/themes/{dark ? 'dark' : 'light'}.css" />
</svelte:head>

<Header>
  <!-- <label><input type="checkbox" bind:checked={dark} />Dark</label> -->
  <sl-switch checked={dark} on:sl-change={onChange}>Dark</sl-switch>
</Header>

<main>
  <slot />
</main>

<footer>
  <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
