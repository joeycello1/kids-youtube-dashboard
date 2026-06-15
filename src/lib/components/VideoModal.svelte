<script>
  import { onMount, onDestroy } from "svelte";

  export let video;
  export let onClose;
  export let onPlayed;
  export let onBroken;

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
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            video.watched = true;
            onPlayed(video);
          }
        },

        onError: (event) => {
          if (event.data === 100 || event.data === 101 || event.data === 150) {
            video.broken = true;
            errorMessage = "This video is broken!";
            callThePolice(video.videoId);

            if (onBroken) onBroken(video);
          }
        }
      }
    });
  }

  const BROKEN_WEBAPP_URL =
    "https://script.google.com/macros/s/AKfycbwlSjP3ReIarEvWm-1Le9XysxKDhh78BMtA7hPRBgHMNJLaLTNmykOnYjZkOi9mrF4nBw/exec";

  function callThePolice(videoId) {
    fetch(`${BROKEN_WEBAPP_URL}?action=broken&videoId=${videoId}`);
  }

  onMount(initPlayer);

  onDestroy(() => {
    if (player?.destroy) player.destroy();
  });
</script>

<div class="overlay" on:click={onClose}>
  <div class="modal" on:click|stopPropagation>
    
    {#if errorMessage}
      <div class="broken-banner">🚨 This video is broken! 🚨</div>

      <button class="police-button"
        on:click={() => {
          video.broken = true;
          callThePolice(video.videoId);
          if (onBroken) onBroken(video);
        }}>
        Oh No! This Video is Broken!!
        🚨 Call the Police! 🚨
      </button>
    {/if}

    <div id="player"></div>

    <button class="close" on:click={onClose}>Close</button>
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

  #player {
    width: 100%;
    height: 450px;
    border-radius: 8px;
    background: black;
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

  /* Broken banner */
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

  /* Police button */
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

  /* Animations */
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
