<script lang="ts">
  import { page } from '$app/stores';
  import PureHeader from './PureHeader.svelte';
</script>

<div>
  <PureHeader pathname={$page.url.pathname} />
  <!-- <PureHeader pathname={'/'} /> -->
</div>
