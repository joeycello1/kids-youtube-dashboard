<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { tick } from "svelte";

  export let video;
  export let profile;

  const dispatch = createEventDispatcher();

  let player;
  let errorMessage = "";
  let isPlaying = false;

  function togglePlay() {
    if (!player) return;

    const state = player.getPlayerState ? player.getPlayerState() : null;

    // If currently playing, pause
    if (state === 1 || isPlaying) {
      player.pauseVideo();
      isPlaying = false;
      return;
    }

    // Otherwise, play
    player.playVideo();
    isPlaying = true;
  }

  function restartVideo() {
    if (!player) return;

    // Stop (reset to 0) then auto-play
    player.stopVideo();
    player.playVideo();
    isPlaying = true;
  }

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

  async function enableOverlay() {
    await tick(); // wait for DOM to exist

    const overlay = document.querySelector(".player-overlay");
    if (!overlay) {
      console.warn("Overlay not found");
      return;
    }

    // ⭐ Allow center play button at first
    overlay.classList.remove("block-ui");

    // ⭐ After 1 second, block all YouTube UI
    setTimeout(() => {
      overlay.classList.add("block-ui");
    }, 1000);
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
        onReady: async () => {
          console.log("VideoModal onReady fired");

          isPlaying = false;

          await enableOverlay();
        },

        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true;
            video.watched = true;
            dispatch("played", video);
          }

          if (event.data === YT.PlayerState.PAUSED) {
            isPlaying = false;
          }

          if (event.data === YT.PlayerState.ENDED) {
            isPlaying = false;
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

    fetch(
      `${WEBAPP_URL}?action=rate&videoId=${video.videoId}&profile=${profile}&value=${value}`
    );

    dispatch("rating", { video, value, profile });
  }

  onMount(initPlayer);

  onDestroy(() => {
    if (player?.destroy) player.destroy();
  });
</script>

<div class="overlay" on:click={() => dispatch("close")}>
  <div class="modal" on:click|stopPropagation>
    {#if errorMessage}
      <div class="broken-banner">🚨 This video is broken! 🚨</div>

      <button
        class="police-button"
        on:click={() => {
          video.broken = true;
          callThePolice(video.videoId);
          dispatch("broken", video);
          dispatch("close");
        }}
      >
        Oh No! This Video is Broken!!
        🚨 Call the Police! 🚨
      </button>
    {/if}

    <!-- Rating buttons ABOVE video -->
    <div class="rating-buttons">
      <button class="rate up" on:click={() => rateVideo("up")}>
        <span class="emoji">👍</span> YEP!
      </button>
      <button
        class="rate down"
        on:click={() => {
          rateVideo("down");
          dispatch("close");
        }}
      >
        <span class="emoji">👎</span> NOPE!
      </button>
    </div>

    <!-- Video area -->
    <div class="player-wrapper">
      <div id="player"></div>
      <div class="player-overlay"></div>
    </div>

    <!-- Controls BELOW video -->
    <div class="controls">
      <button class="restart-button" on:click={restartVideo}>
        ⏮️ START ME OVER
      </button>

      <button class="play-button" on:click={togglePlay}>
        {isPlaying ? "STOP ME!" : "PLAY ME!"}
      </button>
    </div>

    <!-- Close button at bottom -->
    <button class="close-button" on:click={() => dispatch("close")}>
      Close Me (bye bye)
    </button>
  </div>
</div>

<style>
  /* ------------------------------
     OVERLAY + MODAL
  ------------------------------ */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    animation: fadeIn 0.25s ease-out;
  }

  .modal {
    position: relative;
    background: #420c47;
    padding: 1rem;
    border-radius: 12px;
    width: 90vw;
    max-width: 1200px;
    height: 90vh;
    max-height: 800px;
    z-index: 10;
    animation: popIn 0.25s ease-out;
    display: flex;
    flex-direction: column;
  }

  /* ------------------------------
     VIDEO WRAPPER
  ------------------------------ */
  .player-wrapper {
    position: relative;
    width: 100%;
    flex: 1;
    overflow: hidden;
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.45);
    background: black;
  }

  #player {
    width: 100%;
    height: 100%;
  }

  .player-overlay {
    position: absolute;
    inset: 0;
    pointer-events: auto;
    background: transparent;
    z-index: 9999;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  /* ------------------------------
     UNIVERSAL BUTTON FEEL
  ------------------------------ */

  /* Hover = gentle grow */
  button:hover {
    transform: scale(1.03);
  }

  /* Click = squish */
  button:active {
    transform: scale(0.92);
    transition: transform 0.05s ease-out;
  }

  /* All buttons share these traits */
  button {
    cursor: pointer;
    border-radius: 10px;
    font-weight: 700;
    transition: transform 0.15s ease;
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.45);
  }

  /* ------------------------------
     RATING BUTTONS
  ------------------------------ */
  .rating-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .rate {
    flex: 1;
    padding: 12px;
    font-size: 1.7rem;
    border: none;
  }

  .rate.up {
    background: #228041;
    color: white;
    border: 1px solid #93591f;
  }

  .rate.down {
    background: #93591f;
    color: white;
    border: 1px solid #228041;
  }

  .rate .emoji {
    font-size: 1.8rem;
    font-weight: 900;
    margin-right: 0.4rem;
  }

  /* ------------------------------
     CONTROL BAR (Restart + Play)
  ------------------------------ */
  .controls {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .restart-button,
  .play-button {
    padding: 16px;
    font-size: 1.4rem;
    border: none;
    border-radius: 12px;
  }

  .restart-button {
    flex: 0 0 30%;
    background: #ff9900;
    color: #420c47;
  }

  .play-button {
    flex: 1;
    background: #ffcc00;
    color: #7b1484;
  }

  /* ------------------------------
     CLOSE BUTTON
  ------------------------------ */
  .close-button {
    width: 100%;
    padding: 12px;
    font-size: 1.1rem;
    border: 1px solid #ffcc00;
    background: #7b1484;
    color: white;
    margin-top: 1rem;
  }

  /* ------------------------------
     BROKEN VIDEO + POLICE BUTTON
  ------------------------------ */
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
    width: 100%;
    margin-bottom: 1rem;
    animation: policePulse 1.4s infinite ease-in-out;
  }

  .police-button:hover {
    transform: scale(1.08);
  }

  .police-button:active {
    transform: scale(0.96);
    animation: policeFlash 0.25s linear;
  }

  /* ------------------------------
     ANIMATIONS
  ------------------------------ */
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

