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
  let greeting = "";

  const defaultGreetings = [
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
    "Welcome back!",
    "Let’s watch something awesome!"
  ];

  // Category-specific greetings
  const categoryGreetings = {
    Cartoons: [
      "C'mon, {name}! Why don't you watch something educational?",
      "You like cartoons, huh? What about science?",
      "Cartoon time! Let’s find something hilarious.",
      "Animation magic coming right up!",
      "Good choice! Cartoons always hit the spot."
    ],
    Science: [
      "Science mode activated!",
      "Ready to learn something mind-blowing?",
      "Let’s explore the universe!",
      "Experiments await — goggles on!"
    ],
    LEGO: [
      "Minifigure {name} reporting for duty!",
      "The LEGO universe awaits your next move.",
      "You’ve unlocked: Builder Mode.",
      "Warning: High levels of imagination detected"
    ],
    "Mr Bean": [
      "Good choice, {name}! Let’s check out some Mr Bean.",
      "Time for some Bean-level chaos!",
      "Mr Bean incoming — prepare for giggles.",
      "Classic Bean moments coming right up!"
    ],
    Minecraft: [
      "Minecraft time! Let’s dig into something cool.",
      "Ready to craft an awesome adventure?",
      "Blocks, mobs, and fun — let’s go!",
      "Mining some good videos today?"
    ]
  };

  function pickGreeting(category) {
    let list =
      category && categoryGreetings[category]
        ? categoryGreetings[category]
        : defaultGreetings;

    let base = list[Math.floor(Math.random() * list.length)];

    // Capitalize kid name
    const kidName = profile
      ? profile.charAt(0).toUpperCase() + profile.slice(1)
      : null;

    // Seasonal greeting override
    const seasonal = getTimeOfDayGreeting();
    if (!category && seasonal) {
      base = seasonal;
    }

    // Time-of-day greeting override (only if no category selected)
    if (!category && !seasonal) {
      base = getTimeOfDayGreeting();
    }

    // Replace {name}
    if (kidName) {
      base = base.replace("{name}", kidName);
    }

    greeting = base;
  }

  onMount(() => {
    pickGreeting(null);
  });

  function getTimeOfDayGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning, {name}!";
    if (hour < 17) return "Good afternoon, {name}!";
    if (hour < 20) return "{name}, it's a bit late for this, dontcha think?";
    return "Go to Bed!";
  }

  function getSeasonalGreeting() {
    const month = new Date().getMonth(); // 0 = Jan

    if (month === 11) return "Happy Holidays, {name}!";
    if (month === 9) return "Spooky season is here, {name}!";
    if (month === 5 || month === 6) return "Summer vibes, {name}!";
    if (month === 2 || month === 3) return "Springtime fun, {name}!";

    return null; // no seasonal override
  }

  // -----------------------------
  //  Update Banner State
  // -----------------------------
  let hasUpdate = false;
  let updateCount = 0;

// -----------------------------
//  Initial UI State
// -----------------------------
const today = new Date().toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD reliably

let selectedCategory = "New Today";
let firstLoad = true;
let search = "";
let activeVideo = null;

// -----------------------------
//  Category List
// -----------------------------
$: categories = ["New Today", ...new Set(videos.map(v => v.videoCategory))];

// -----------------------------
//  New Videos
// -----------------------------
$: newVideos = videos.filter(v => 
  v.firstSeen?.startsWith(today)
);

// -----------------------------
//  Category Filter
// -----------------------------
$: categoryFiltered =
  selectedCategory === "New Today"
    ? newVideos
    : selectedCategory
      ? videos.filter(v => 
          v.videoCategory === selectedCategory &&
          v.firstSeen <= today // <-- future-proofing here too
        )
      : videos.filter(v => v.firstSeen <= today);

// -----------------------------
//  Search Filter (GLOBAL FILTER)
// -----------------------------
$: filtered = firstLoad
  ? newVideos
  : search
    ? videos.filter(v => {
        // Hide future videos globally
        if (v.firstSeen > today) return false;

        return (
          v.title?.toLowerCase().includes(search.toLowerCase()) ||
          v.channelName?.toLowerCase().includes(search.toLowerCase()) ||
          v.summary?.toLowerCase().includes(search.toLowerCase()) ||
          (Array.isArray(v.keywords) &&
            v.keywords.some(k =>
              k?.toLowerCase().includes(search.toLowerCase())
            ))
        );
      })
    : categoryFiltered;

  function capitalize(name) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
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

  {#key greeting}
    <div class="header">{greeting}</div>
  {/key}

  <!-- Category Chips -->
  <div class="chips">
    {#each categories as cat}
      <div
        class="chip {selectedCategory === cat ? 'active' : ''}"
        on:click={() => {
          firstLoad = false;
          selectedCategory = cat;
          pickGreeting(cat);
        }}
      >
        {cat}
        {#if cat === "New Today"}
          ({newVideos.length})
        {/if}
      </div>
    {/each}
  </div>

  <!-- Search -->
  <div class="search-box">
    <input
      type="text"
      bind:value={search}
      on:input={() => {
        firstLoad = false;
        if (!search) {
          firstLoad = true;
          selectedCategory = "New Today";
        }
      }}
      placeholder="Search your videos…"
    />
    {#if search}
      <button class="clear-search" on:click={() => {
          search = "";
          firstLoad = true;
          selectedCategory = "New Today";
        }}
      >
        ✕
      </button>
    {/if}
  </div>

  <!-- Video Grid -->
  {#if firstLoad && newVideos.length === 0}
      <div class="no-new">
        No Brand New videos today... yet.<br> Check out your favorite categories!
      </div>
    {:else}
    <div class="grid">
      {#each filtered as video}
        <VideoCard
          {video}
          onOpen={(v) => activeVideo = v}
        />
      {/each}
    </div>
  {/if}

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
  :global(#app) {
    width: 100% !important;
    max-width: none !important;
    margin: 0; /* removes the auto-centering */
  }

  .dashboard-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #401a60, #b365f2);
    font-family: "Inter", system-ui, sans-serif;
    padding: 2rem 3rem;
    display: flex;
    flex-direction: column;
  }

  /* Header (now supports random greeting) */
  :global(.header) {
    font-size: 3rem;
    font-weight: 700;
    color: white;
    margin-bottom: 2rem;
    text-align: center;
    animation: fadeIn 0.4s ease-out, pop 0.4s ease-out;
  }

  .no-new {
    font-size: 3rem;
    font-weight: 700;
    color: rgb(222, 219, 22);
    line-height: normal;
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
    background: #66348e;
    border: 2px solid #ccc;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    font-weight: 700;
    user-select: none;
    transition: transform 0.15s ease;
    font-size: 1.1rem;
    box-shadow: 0 8px 14px rgba(0,0,0,0.45);
  }

  .chip:hover {
    transform: scale(1.10);
    box-shadow: 0 10px 18px rgba(0,0,0,0.55);
  }

  .chip.active {
    transform: scale(1.16);
    background: #4a90e2;
    transition: transform 0.08s ease-out;
    color: white;
    border-color: #b5d8ff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.35);
  }

  /* Search Box */
  .search-box {
    margin: 0 auto 1.5rem auto; /* centers it horizontally */
    position: relative;
    margin-bottom: 1.5rem;
    width: min(500px, 90%);
    display: flex;
    justify-content: center;
    box-shadow: 0 8px 14px rgba(0,0,0,0.45);
  }

  .search-box input {
    width: 100%;
    padding-right: 40px; /* space for the X */
    padding-left: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 1.1rem;
    border-radius: 10px;
    border: 1px solid #ccc;
  }

  .search-box input:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74,144,226,0.25);
  }

  .clear-search {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

    background: #ff6666;
    color: white;
    border: none;
    border-radius: 6px;

    width: 26px;
    height: 26px;
    font-size: 1.1rem;
    font-weight: 900;

    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 3px 0 rgba(0,0,0,0.25);
    transition: transform 0.15s ease;
  }

  .clear-search:active {
    transform: translateY(calc(-50% + 2px));
    box-shadow: 0 1px 0 rgba(0,0,0,0.25);
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
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes pop {
    0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
    60% { transform: scale(1.2) rotate(3deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); }
  }
  /* ------------------------------
   GRID CONTAINER
  ------------------------------ */
  .grid {
    display: grid;
    margin-top: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0 2rem;
    width: 100%;
  }

  .grid > * {
    animation: fadeIn 0.4s ease-out;
  }

  /* ------------------------------
    RESPONSIVE BREAKPOINTS
  ------------------------------ */

  /* Large screens: bigger cards, more breathing room */
  @media (min-width: 1400px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
  }

  /* Tablets: fewer columns, bigger cards */
  @media (max-width: 900px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.2rem;
    }
  }

  /* Phones: giant cards, 1–2 per row */
  @media (max-width: 600px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
  }
</style>

