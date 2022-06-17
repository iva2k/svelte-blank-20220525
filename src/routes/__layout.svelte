<script lang="ts">
  // Framework7 common init
  import Framework7 from 'framework7/lite-bundle';
  import Framework7Svelte from 'framework7-svelte';
  Framework7.use(Framework7Svelte);
  // ? import '../../node_modules/framework7/framework7-min.css';
  // ? import 'framework7/framework7-min.css';
  import 'framework7/css';

  import Header from '$lib/header/Header.svelte';
  import '../app.css';
</script>

<Header />

<main>
  <slot />
</main>

<footer>
  <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<!-- <style lang="scss" global>
  // @use 'framework7/framework7-min.css';
  // @import 'framework7/framework7-min';
  @import '../../node_modules/framework7/framework7-bundle';
  // @import '../../node_modules/framework7/framework7-min';
</style> -->
<style>
  /* :global() {
    /* @use 'framework7/framework7-min.css'; * /
    /* @import 'framework7/framework7-min'; * /
    @import '../../node_modules/framework7/framework7-min';
    /* @import '../../node_modules/framework7/framework7-bundle'; * /
  } */

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
