<script>
  export let video;
  export let onOpen;
</script>

<!--
  ⭐ PRIORITY LOGIC (top → bottom)
  1. broken → overrides everything
  2. rating === "down" → orange overlay
  3. rating === "up" → green badge
  4. watched → ribbon
-->

<div
  class="card 
    {video.broken ? 'broken' : ''} 
    {video.rating === 'down' ? 'rated-down' : ''} 
    {video.rating === 'up' ? 'rated-up' : ''} 
    {video.watched ? 'watched' : ''}"
  on:click={() => onOpen(video)}
>

  <!-- ⭐ Broken overlay (highest priority) -->
  {#if video.broken}
    <div class="broken-overlay"></div>
  {/if}

  <!-- ⭐ Rating: DOWN (second priority) -->
  {#if !video.broken && video.rating === "down"}
    <div class="rating-down-overlay">
      👎 Not sure about this — under review
    </div>
  {/if}

  <!-- ⭐ Rating: UP (third priority) -->
  {#if !video.broken && video.rating === "up"}
    <div class="rating-up">👍</div>
  {/if}

  <!-- ⭐ Watched ribbon (lowest priority) -->
  {#if !video.broken && video.rating !== "down" && video.watched}
    <div class="watched-ribbon">watched</div>
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

  /* ⭐ Rating UP badge */
  .rating-up {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #2ecc71;
    color: white;
    padding: 6px 10px;
    border-radius: 12px;
    font-size: 1.2rem;
    z-index: 12;
    box-shadow: 0 3px 6px rgba(0,0,0,0.35);
  }

  /* ⭐ Rating DOWN overlay */
  .rating-down-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 165, 0, 0.75);
    color: black;
    font-weight: 700;
    font-size: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem;
    z-index: 12;
    pointer-events: none;
  }

  /* ⭐ Broken Overlay */
  .broken-overlay {
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
    z-index: 14;
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
    z-index: 15;
    pointer-events: none;
  }
</style>
