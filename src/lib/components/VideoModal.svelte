<script>
  import { onMount, onDestroy } from "svelte";

  export let video;
  export let onClose;
  export let onPlayed;

  let player;
  let errorMessage = "";

  // RESTORED: YouTube API loader
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
            onPlayed(video);
          }
        },

        onError: (event) => {
          console.log("YouTube error:", event.data);

          // Show the button, but do NOT auto-report
          if (event.data === 100 || event.data === 101 || event.data === 150) {
            errorMessage = "This video is broken!";
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
      <button on:click={() => callThePolice(video.videoId)}>
        🚨 Call the Police on this Bad Boy 🚨
      </button>
    {/if}

    <div id="player"></div>

    <button class="close" on:click={onClose}>Close</button>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal {
    position: relative;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    max-width: 800px;
    width: 90%;
    z-index: 10;
  }

  #player {
    width: 100%;
    height: 450px;
    border-radius: 8px;
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

  .broken-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    font-size: 2rem;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    border-radius: 20px;
    animation: fadeIn 0.3s ease-out;
    z-index: 20;
  }
</style>
