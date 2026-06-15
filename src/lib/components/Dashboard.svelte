<script>
  import VideoCard from './VideoCard.svelte';
  import VideoModal from './VideoModal.svelte';

  export let videos = [];
  export let profile = "";

  let search = "";
  let selectedCategory = "All";
  let activeVideo = null;

  $: if (!Array.isArray(videos)) {
      videos = [];
  }

  // Build category list
  $: categories = ["All", ...new Set(videos.map(v => v.videoCategory))];

  // Filter by category
  $: categoryFiltered = selectedCategory === "All"
    ? videos
    : videos.filter(v => v.videoCategory === selectedCategory);

  // Apply search
  $: filtered = categoryFiltered.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.channelName.toLowerCase().includes(search.toLowerCase()) ||
    v.summary?.toLowerCase().includes(search.toLowerCase()) ||
    v.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );
  import { WEBAPP_URL } from "$lib/config";

  function handlePlayed(video) {
    // 1. Update local state
    video.watched = true;
    videos = [...videos];
  
    // 2. Send to backend
    fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "watched",
        kid: profile,
        videoId: video.videoId,
        watched: true
      })
    });
  }
</script>

<style>
  .dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #401a60, #b365f2);
  font-family: "Inter", system-ui, sans-serif;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header */
.header {
  font-size: 3rem;
  color: white;
  margin-bottom: 2rem;
  text-align: center;
  animation: fadeIn 0.4s ease-out;
}

/* Category Chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.chip {
  padding: 8px 16px;
  border-radius: 20px;
  background: #eee;
  border: 2px solid #ccc;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  font-size: 1.1rem;
}

.chip:hover {
  transform: translateY(-2px);
}

.chip.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
}

/* Search Box */
.search-box {
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.search-box input {
  width: 90%;
  max-width: 400px;
  padding: 0.8rem;
  font-size: 1.2rem;
  border-radius: 12px;
  border: 2px solid #ccc;
  outline: none;
  transition: 0.2s;
}

.search-box input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74,144,226,0.25);
}

/* Video Grid */
.grid {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  animation: fadeIn 0.4s ease-out;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>

<div class="dashboard-container">
<div class="header">WELCOME!!</div>

<!-- Category Chips -->
<div class="chips">
  {#each categories as cat}
    <div
      class="chip {selectedCategory === cat ? 'active' : ''}"
      on:click={() => selectedCategory = cat}
    >
      {cat}
    </div>
  {/each}
</div>

<!-- Search -->
<div class="search-box">
  <input
    bind:value={search}
    placeholder="Search your videos…"
  />
</div>

<!-- Video Grid -->
<div class="grid">
  {#each filtered as video}
    <VideoCard
      {video}
      onOpen={(v) => activeVideo = v}
    />
  {/each}
</div>

<!-- Modal -->
{#if activeVideo}
  <VideoModal
    video={activeVideo}
    onClose={() => activeVideo = null}
    onPlayed={(v) => {
      console.log("Dashboard received play event for:", v.title);
      v.watched = true;
      handlePlayed;
      videos = [...videos];
    }}
  />
{/if}
</div>
