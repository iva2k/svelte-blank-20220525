<script lang="ts">
  import { Switch } from 'agnostic-svelte'; // Must assign `id` for Switch to work properly.  import Header from '$lib/header/Header.svelte';
  import Header from '$lib/header/Header.svelte';
  // import '../app.css';
  import 'agnostic-svelte/css/common.min.css';

  // Code for AgnosticUI dark/light theme toggle
  const STORAGE_KEY = 'ag-color-scheme';

  // First checks localStorage then system preferences
  const getColorScheme = () => {
    // Only run this if NOT in SSR mode aka on the client
    if (!import.meta.env.SSR) {
      // If we have stored the user's preferences we will prefer that
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return stored;
      }
      // Otherwise, we check their OS settings
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  };

  const setStoredColorScheme = (colorScheme: string | undefined) => {
    if (colorScheme && !import.meta.env.SSR) {
      localStorage.setItem(STORAGE_KEY, colorScheme);
    }
  };

  const setTheme = (colorScheme: string | undefined) => {
    if (colorScheme && !import.meta.env.SSR) {
      document.firstElementChild?.setAttribute('color-scheme', colorScheme);
    }
  };

  // Sets the theme as early as possible to avoid a flash of incorrect theme
  setTheme(getColorScheme());

  let checkedValue = getColorScheme() === 'dark';
  const onToggleDarkMode = () => {
    // Get the current color mode then toggle it and update the store
    const currentMode = document.firstElementChild?.getAttribute('color-scheme');

    const toggledColorScheme = currentMode === 'dark' ? 'light' : 'dark';

    // Set toggled content and set html `color-scheme` attribute. Also, update local storage.
    // toggle.textContent = toggledColorScheme === 'dark' ? '🔆' : '🌙';
    setTheme(toggledColorScheme);
    setStoredColorScheme(toggledColorScheme);
  };
</script>

<Header --corner-right-width="6em">
  <!-- <Input id="c1" type="switch" label="Dark" bind:checked={dark} on:change={onToggleDarkMode} /> -->
  <Switch
    id="switch-1"
    label={checkedValue ? '🔆' : '🌙'}
    labelPosition="left"
    bind:isChecked={checkedValue}
    on:change={onToggleDarkMode}
  />
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
