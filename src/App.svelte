<script>
  import Login from './lib/components/Login.svelte';
  import Dashboard from './lib/components/Dashboard.svelte';
  import { loadKidsData } from './lib/utils/fetchData.js';

  let profile = null;   // "Jonah" or "Kieran"
  let videos = [];
  let loading = false;
  let error = null;

  async function handleLogin(event) {
    profile = event.detail.profile;
    loading = true;

    try {
      const data = await loadKidsData(profile);
      videos = data.videos;
    } catch (err) {
      console.error(err);
      error = "Could not load your videos.";
    }

    loading = false;
  }
</script>

{#if !profile}
  <Login on:login={handleLogin} />

{:else if loading}
  <div style="margin-top: 3rem; font-size: 2rem;">Loading your videos…</div>

{:else if error}
  <div style="margin-top: 3rem; color: red; font-size: 2rem;">{error}</div>

{:else}
  <Dashboard {videos} {profile} />
{/if}
