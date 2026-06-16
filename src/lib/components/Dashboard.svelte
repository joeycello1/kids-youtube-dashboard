<script>
  import VideoCard from './VideoCard.svelte';
  import VideoModal from './VideoModal.svelte';
  import { onMount } from "svelte";
  import { loadKidsData } from "../utils/fetchData.js";   // ✅ Correct import

  export let videos = [];
  export let profile = "";

  // -----------------------------
  //  Random Greeting
  // -----------------------------
  const greetings = [
    "Welcome!!",
    "Hello there!",
    "Hiya!",
    "Greetings, Earthling!",
    "Ahoy!",
    "Howdy!",
    "Yo!",
    "Sup!",
    "Bonjour!",
    "Hola!",
    "Ciao!",
    "Konnichiwa!",
    "Guten Tag!",
    "Namaste!",
    "Salutations!",
    "Aloha!",
    "Hej!",
    "Shalom!",
    "Yassas!",
    "Wassup!",
    "Welcome back, adventurer!",
    "Enter the Fun Zone!",
    "Ready for action?",
    "Let’s watch something awesome!"
  ];

  let greeting = "";
  onMount(() => {
    greeting = greetings[Math.floor(Math.random() * greetings.length)];
  });

  // -----------------------------
  //  Update Banner State
  // -----------------------------
  let hasUpdate = false;
  let updateCount = 0;

  // -----------------------------
  //  UI State
  // -----------------------------
  let search = "";
  let selectedCategory = "All";
  let activeVideo = null;

  // -----------------------------
  //  Category List
  // -----------------------------
  $: categories = ["All", ...new Set(videos.map(v => v.videoCategory))];

  // -----------------------------
  //  Category Filter
  // -----------------------------
  $: categoryFiltered =
    selectedCategory === "All"
      ? videos
      : videos.filter(v => v.videoCategory === selectedCategory);

  // -----------------------------
  //  Search Filter
  // -----------------------------
  $: filtered = categoryFiltered.filter(v =>
    v.title?.toLowerCase().includes(search.toLowerCase()) ||
    v.channelName?.toLowerCase().includes(search.toLowerCase()) ||
    v.summary?.toLowerCase().includes(search.toLowerCase()) ||
    (Array.isArray(v.keywords) &&
      v.keywords.some(k =>
        k?.toLowerCase().includes(search.toLowerCase())
      ))
  );


  // -----------------------------
  //  Watched / Broken Handlers
  // -----------------------------
  const WATCHED_WEBAPP_URL =
    "https://script.google.com/macros/s/AKfycbwlSjP3ReIarEvWm-1Le9XysxKDhh78BMtA7hPRBgHMNJLaLTNmykOnYjZkOi9mrF4nBw/exec";

  function markWatched(videoId, kid) {
    fetch(`${WATCHED_WEBAPP_URL}?action=watched&videoId=${videoId}&kid=${kid}`);
  }

  function onPlayed(video) {
    video.watched = true;
    videos = [...videos];
    markWatched(video.videoId, profile);
  }

  function onBroken(video) {
    video.broken = true;
    videos = [...videos];
  }

  function onRated(video, value) {
    video.rating = value;
    videos = [...videos];
  }

  // -----------------------------
  //  New Video Detection
  // -----------------------------
  function countNewVideos(oldList, newList) {
    const oldIds = new Set(oldList.map(v => v.videoId));
    let count = 0;

    for (const v of newList) {
      if (!oldIds.has(v.videoId)) {
        count++;
      }
    }

    return count;
  }

  async function checkForUpdates() {
    const { videos: fresh } = await loadKidsData(profile);

    const newCount = countNewVideos(videos, fresh);

    if (newCount > 0) {
      updateCount = newCount;
      hasUpdate = true;
    }
  }

  onMount(() => {
    setInterval(checkForUpdates, 60000);
  });

  function reloadPage() {
    location.reload();
  }
</script>

<div class="dashboard-container">

  {#if hasUpdate}
    <div class="update-banner" on:click={reloadPage}>
      {updateCount} New Videos Added! — click to refresh
    </div>
  {/if}

  <div class="header">{greeting} — BUILD TEST</div>

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
      profile={profile}
      on:close={() => (activeVideo = null)}
      on:played={() => onPlayed(activeVideo)}
      on:broken={() => onBroken(activeVideo)}
      on:rating={(e) => onRated(e.detail.video, e.detail.value)}
    />
  {/if}

</div>

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

  /* Header (now supports random greeting) */
  .header {
    font-size: 3rem;
    color: white;
    margin-bottom: 2rem;
    text-align: center;
    animation: fadeIn 0.4s ease-out, pop 0.4s ease-out;
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

  /* Update Banner */
  .update-banner {
    background: #ffcc00;
    color: #000;
    padding: 12px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
    border-bottom: 3px solid #e0b200;
    position: sticky;
    top: 0;
    z-index: 999;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Greeting pop animation */
  @keyframes pop {
    0% { transform: scale(0.6); opacity: 0; }
    80% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); }
  }
</style>

