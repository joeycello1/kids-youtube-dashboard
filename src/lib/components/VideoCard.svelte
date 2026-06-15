<script>
  export let video;
  export let onOpen;
</script>

<div
  class="card {video.watched ? 'watched' : ''} {video.broken ? 'broken' : ''}"
  on:click={() => onOpen(video)}
>
  {#if video.watched}
    <div class="watched-ribbon">watched</div>
  {/if}

  {#if video.broken}
    <div class="broken-overlay"></div>
  {/if}

  <img class="thumb" src={video.thumbnail} alt="thumbnail" />

  <div class="info">
    <div class="title">{video.title}</div>
    <div class="channel">{video.channelName}</div>
  </div>
</div>

<style>
  .card {
    position: relative;
    background: #4b2a78;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 14px rgba(0,0,0,0.45);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0,0,0,0.55);
  }

  /* Thumbnail */
  .thumb {
    width: 100%;
    height: 160px;
    object-fit: cover;
    background: #2d1a45;
    position: relative;
  }

  .thumb::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35));
  }

  /* Info section */
  .info {
    padding: 1rem;
    color: white;
  }

  .title {
    font-weight: 700;
    margin-bottom: 0.4rem;
    font-size: 1.1rem;
    line-height: 1.2;
  }

  .channel {
    color: #d3c6e8;
    font-size: 0.9rem;
  }

  /* ⭐ Watched Ribbon */
  .watched-ribbon {
    position: absolute;
    top: 12px;
    left: -40px;
    background: #d84848;
    color: white;
    padding: 6px 50px;
    font-size: 0.9rem;
    font-weight: bold;
    transform: rotate(-45deg);
    box-shadow: 0 3px 8px rgba(0,0,0,0.35);
    pointer-events: none;
    letter-spacing: 0.5px;
    z-index: 10;
  }

  /* Dim watched cards */
  .card.watched::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 4;
    pointer-events: none;
  }

  /* ⭐ Broken Overlay (your markup referenced this but CSS was missing) */
  /*.broken-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 0, 0, 0.55);
    color: white;
    font-size: 1.4rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0 0 6px black;
    z-index: 6;
    pointer-events: none;
  }

  /* Broken diagonal stripes */
  .card.broken::after {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      #ffcc00,
      #ffcc00 20px,
      #000 20px,
      #000 40px
    );
    opacity: 0.85;
    z-index: 4;
    pointer-events: none;
  }

  .card.broken::before {
    content: "BROKEN";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-10deg);
    color: white;
    font-size: 2rem;
    font-weight: 900;
    text-shadow: 0 3px 6px rgba(0,0,0,0.5);
    z-index: 5;
    pointer-events: none;
  }

  @keyframes popIn {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .card.watched .star-badge {
    animation: popIn 0.25s ease-out;
  }
</style>
