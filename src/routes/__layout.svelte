<script lang="ts">
  import Header from '$lib/header/Header.svelte';
  // import '../app.css';
  import '../../node_modules/bootstrap-icons/font/bootstrap-icons.css';
  import { Input } from 'sveltestrap/src';

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
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="vendor/bootstrap/themes/{dark ? 'darkly' : 'flatly'}/bootstrap.min.css"
  />
</svelte:head>

<Header>
  <!-- <label><input type="checkbox" bind:checked={dark} />Dark</label> -->
  <Input id="c1" type="switch" label="Dark" bind:checked={dark} />
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
