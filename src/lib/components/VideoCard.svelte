<script>
  export let video;
  export let onOpen;

  const today = new Date().toISOString().slice(0, 10);
  $: isNew = video.firstSeen?.startsWith(today);
</script>

<div
  class="video-card 
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

  <!-- ⭐ New Video ribbon -->
  {#if isNew}
    <div class="new-ribbon">NEW!</div>
  {/if}

  <img class="thumb" src={video.thumbnail} alt="thumbnail" />

  <div class="info">
    <div class="title">{video.title}</div>
    <div class="channel">{video.channelName}</div>
  </div>
</div>

<style>
  /* ------------------------------
   CARD CONTAINER
------------------------------ */
.video-card {
  background: #420c47;
  border-radius: 16px;
  padding: 0.6rem;
  box-shadow: 0 8px 14px rgba(0,0,0,0.45);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  position: relative;
  overflow: hidden;
}

/* Hover = gentle lift */
.video-card:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 20px rgba(0,0,0,0.55);
}

/* Click = squish */
.video-card:active {
  transform: scale(0.92);
  transition: transform 0.08s ease-out;
}

/* ------------------------------
   THUMBNAIL
------------------------------ */
.thumb {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 10px rgba(0,0,0,0.35);
}

/* ------------------------------
   INFO AREA
------------------------------ */
.info {
  margin-top: 0.6rem;
}

.title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffcc00;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  line-height: 1.2;
}

.channel {
  font-size: 0.9rem;
  color: #e6c8e8;
  opacity: 0.9;
}

/* ------------------------------
   BADGES + OVERLAYS
------------------------------ */

/* Rating UP badge */
.rating-up {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.8rem;
  padding: 4px 8px;
  border-radius: 10px;
  background: rgba(34,128,65,0.75);
  backdrop-filter: blur(4px);
  z-index: 5;
}

/* Rating DOWN overlay */
.rating-down-overlay {
  position: absolute;
  inset: 0;
  background: rgba(147,89,31,0.85);
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  text-align: center;
  z-index: 6;
  border-radius: 16px;
}

/* Broken overlay */
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
  z-index: 4;
  pointer-events: none;
}

.broken-overlay::after {
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

/* Watched ribbon */
.watched-ribbon {
  position: absolute;
  top: 8px;
  left: -20px;
  background: #228041;
  color: white;
  font-weight: 900;
  padding: 4px 40px;
  transform: rotate(-20deg);
  box-shadow: 0 4px 8px rgba(0,0,0,0.4);
  z-index: 4;
}

.new-ribbon {
  position: absolute;
  top: 140px;
  left: -8px;
  background: #ff3e00;
  color: white;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: bold;
  transform: rotate(-15deg);
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  pointer-events: none;
}

</style>
