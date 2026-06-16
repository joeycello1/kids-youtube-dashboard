<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";

  export let video;
  export let profile;

  const dispatch = createEventDispatcher();

  let player;
  let errorMessage = "";

  // Load YouTube API
  function loadYouTubeAPI() {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => resolve();
    });
  }

  async function initPlayer() {
    await loadYouTubeAPI();

    player = new YT.Player("player", {
      videoId: video.videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        controls: 1,
        showinfo: 0
      },

      events: {
        onReady: (event) => {
          console.log("VideoModal onReady fired");
        },

        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            video.watched = true;
            dispatch("played", video);
          }
        },

        onError: (event) => {
          if (event.data === 100 || event.data === 101 || event.data === 150) {
            video.broken = true;
            errorMessage = "This video is broken!";
            callThePolice(video.videoId);
            dispatch("broken", video);
          }
        }
      }
    });
  }

  const WEBAPP_URL =
    "https://script.google.com/macros/s/AKfycbwlSjP3ReIarEvWm-1Le9XysxKDhh78BMtA7hPRBgHMNJLaLTNmykOnYjZkOi9mrF4nBw/exec";

  function callThePolice(videoId) {
    fetch(`${WEBAPP_URL}?action=broken&videoId=${videoId}`);
  }

  function rateVideo(value) {
    video.rating = value;

    fetch(`${WEBAPP_URL}?action=rate&videoId=${video.videoId}&profile=${profile}&value=${value}`);

    dispatch("rating", { video, value, profile });
  }

  onMount(initPlayer);

  onDestroy(() => {
    if (player?.destroy) player.destroy();
  });

  // Block all UI except center play
  document.querySelector(".player-overlay").classList.add("block-ui");

  // Allow center play button for 1 second
  setTimeout(() => {
    document.querySelector(".player-overlay").classList.remove("block-ui");
  }, 1000);
</script>

<div class="overlay" on:click={() => dispatch("close")}>
  <div class="modal" on:click|stopPropagation>

    {#if errorMessage}
      <div class="broken-banner">🚨 This video is broken! 🚨</div>

      <button class="police-button"
        on:click={() => {
          video.broken = true;
          callThePolice(video.videoId);
          dispatch("broken", video);
        }}>
        Oh No! This Video is Broken!!
        🚨 Call the Police! 🚨
      </button>
    {/if}

    <div class="rating-buttons">
      <button class="rate up" on:click={() => rateVideo("up")}>👍 I like this</button>
      <button class="rate down" on:click={() => rateVideo("down")}>👎 Don't like</button>
    </div>

    <!-- ⭐ Correct wrapper structure -->
    <div class="player-wrapper">
      <div id="player"></div>
      <div class="player-overlay"></div>
    </div>

    <!-- ⭐ Close button belongs OUTSIDE the wrapper -->
    <button class="close" on:click={() => dispatch("close")}>Close</button>

  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    animation: fadeIn 0.25s ease-out;
  }

  .modal {
    position: relative;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    max-width: 800px;
    width: 90%;
    z-index: 10;
    animation: popIn 0.25s ease-out;
  }

  .player-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  /* The actual YouTube player */
  #player {
    width: 100%;
    height: 100%;
  }

  /* ⭐ The invisible shield */
  .player-overlay {
    position: absolute;
    top: 0;
    left: 0;  
    width: 100%;
    height: 100%;

    /* This blocks ALL clicks to YouTube UI */
    pointer-events: none; /* allow clicks through normally */

    /* Fully transparent */
    background: rgba(0, 0, 0, 0);

    /* Prevent right-click → open in new tab */
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .player-overlay.block-ui {
    pointer-events: auto; /* block clicks when needed */
  }

  .close {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  /* ⭐ Rating Buttons */
  .rating-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .rate {
    flex: 1;
    padding: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    transition: transform 0.15s ease;
  }

  .rate.up {
    background: #2ecc71;
    color: white;
  }

  .rate.down {
    background: #e67e22;
    color: white;
  }

  .rate:hover {
    transform: scale(1.05);
  }

  .broken-banner {
    background: #cc0000;
    color: white;
    padding: 10px;
    font-weight: 900;
    text-align: center;
    border-radius: 8px;
    margin-bottom: 10px;
    animation: flash 0.6s ease-in-out infinite alternate;
  }

  .police-button {
    background: linear-gradient(135deg, #ff1a1a, #cc0000);
    color: white;
    font-weight: 900;
    font-size: 1.1rem;
    padding: 14px 22px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    width: 100%;
    margin-bottom: 1rem;
    box-shadow: 0 0 12px rgba(255, 0, 0, 0.6), 0 0 4px rgba(255, 255, 255, 0.4) inset;
    transition: transform 0.15s ease, box-shadow 0.2s ease;
    animation: policePulse 1.4s infinite ease-in-out;
  }

  .police-button:hover {
    transform: scale(1.08);
    box-shadow: 0 0 18px rgba(255, 0, 0, 0.9), 0 0 6px rgba(255, 255, 255, 0.6) inset;
  }

  .police-button:active {
    animation: policeFlash 0.25s linear;
    transform: scale(0.96);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes popIn {
    0% { transform: scale(0.7); opacity: 0; }
    80% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); }
  }

  @keyframes policePulse {
    0% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); }
    50% { box-shadow: 0 0 18px rgba(255, 0, 0, 1); }
    100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); }
  }

  @keyframes policeFlash {
    0% { background: #ff1a1a; }
    50% { background: #ffffff; color: #ff1a1a; }
    100% { background: #ff1a1a; }
  }

  @keyframes flash {
    0% { opacity: 1; }
    100% { opacity: 0.6; }
  }
</style>
