<script lang="ts">
  import Header from '$lib/header/Header.svelte';
  // import '../app.css';
  // import '../../node_modules/bulma/css/bulma.min.css';
  import '../../node_modules/bulma/css/bulma.css';
</script>

<svelte:head>
  <!-- <link
    rel="stylesheet"
    href="vendor/bulma/themes/{dark ? 'darkly' : 'flatly'}/bulma.min.css"
  /> -->

  <link
    rel="stylesheet"
    href="https://bulma.io/vendor/fontawesome-free-5.15.2-web/css/all.min.css"
  />

  <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
  />
</svelte:head>

<Header />

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
