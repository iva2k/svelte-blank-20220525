<script lang="ts">
  import { page } from '$app/stores';
  import PureHeader from './PureHeader.svelte';
</script>

<PureHeader pathname={$page.url.pathname}>
  <slot />
</PureHeader>
