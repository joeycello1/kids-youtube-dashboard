<script>
  import { onMount, onDestroy } from "svelte";

  export let video;
  export let onClose;
  export let onPlayed;

  let player;
  let apiReady = false;
  let errorMessage = "";

  // Load YouTube IFrame API if not already loaded
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
          console.log("PLAY DETECTED via Player API");
          onPlayed(video);
        }
      },

      onError: (event) => {
        console.log("YouTube error:", event.data);

        // 100 = not found
        // 101/150 = embedding disabled
        if (event.data === 100 || event.data === 101 || event.data === 150) {
          handleBrokenVideo();
        }
      }
    }
  });
}

  import { WEBAPP_URL } from "$lib/config";

  async function handleBrokenVideo() {
    // 1. Show kid-friendly message
    errorMessage = "Oh drat! This video is Broken! Try another one.";

    // 2. Mark locally
    video.broken = true;

    // 3. Update dashboard state
    videos = [...videos];

    // 4. Send to Apps Script
    await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "broken",
        kid: profile,
        videoId: video.videoId,
        channelId: video.channelId,
        reason: "broken"
      })
    });
  }

  // 5. Close modal after a short delay
  setTimeout(() => onClose(), 1200);
}


  onMount(() => {
    initPlayer();
  });

  onDestroy(() => {
    if (player && player.destroy) {
      player.destroy();
    }
  });
</script>

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

<div class="overlay" on:click={onClose}>
  <div class="modal" on:click|stopPropagation>
    {#if errorMessage}
    <div class="broken-overlay">{errorMessage}</div>
    {/if}
    <div id="player"></div>

    <button class="close" on:click={onClose}>
      Close
    </button>
  </div>
</div>
