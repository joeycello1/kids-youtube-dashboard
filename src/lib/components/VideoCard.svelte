<script>
  export let video;
  export let onOpen;
</script>

<style>
  .card {
  position: relative;
  background: #4b2a78; /* deep purple to match dashboard */
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

/* Subtle gradient overlay for readability */
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

/* ⭐ Watched Badge — upgraded */
.star-badge {
  position: absolute;
  z-index: 5;
  top: 10px;
  right: 10px;
  background: radial-gradient(circle at 30% 30%, #ffe066, #f5b400);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 8px rgba(0,0,0,0.35);
  border: 2px solid rgba(255,255,255,0.8);
  pointer-events: none;
  transform: scale(1);
  transition: transform 0.2s ease;
}

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

/* Little pop animation when it appears */
.card.watched .star-badge {
  animation: popIn 0.25s ease-out;
}

.card.watched::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
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


@keyframes popIn {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

</style>

<div
  class="card {video.watched ? 'watched' : ''} {video.broken ? 'broken' : ''}"
  on:click={() => onOpen(video)}
>


  {#if video.watched}
    <div class="watched-ribbon">★</div>
  {/if}
  {#if video.broken}
    <div class="broken-overlay">
      🚨 Broken Video 🚨
    </div>
  {/if}

  <img class="thumb" src={video.thumbnail} alt="thumbnail" />

  <div class="info">
    <div class="title">{video.title}</div>
    <div class="channel">{video.channelName}</div>
  </div>
</div>
