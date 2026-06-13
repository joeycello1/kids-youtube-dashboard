<script>
  export let video;
  export let onKeywordClick;
  export let onOpenVideo;
</script>

<div class="card">
  <!-- Thumbnail (clickable) -->
  <div
    class="thumbnail"
    role="button"
    tabindex="0"
    on:click={() => onOpenVideo(video)}
    on:keydown={(e) => e.key === 'Enter' && onOpenVideo(video)}
  >
    <img src={video.thumbnail} alt={video.title} />
  </div>

  <h3 class="title">{video.title}</h3>
  <p class="channel">{video.channelName}</p>
  {#if video.watched}
    <div class="watched-ribbon">WATCHED</div>
  {/if}

  <!-- Keyword chips -->
  <div class="chip-row">
    {#each video.keywords as kw}
      <button
        class="chip"
        type="button"
        on:click={() => onKeywordClick(kw)}
      >
        {kw}
      </button>
    {/each}
  </div>
</div>

<style>
  .card {
    border: 1px solid #333;
    position: relative;
    border-radius: 8px;
    padding: 8px;
    width: 250px;
    background: #000;
    color: #eee;
  }

  .thumbnail {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius: 6px;
  }

  .thumbnail img {
    width: 100%;
    height: auto;
    transition: transform 0.2s ease, filter 0.2s ease;
    display: block;
  }

  .thumbnail:hover img {
    transform: scale(1.03);
    filter: brightness(0.9);
  }

  .title {
    font-size: 0.95rem;
    margin: 6px 0 2px;
    line-height: 1.2;
  }

  .channel {
    margin: 0 0 8px;
    color: #aaa;
    font-size: 0.8rem;
  }

  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    border: 1px solid #444;
    background: #1e1e1e;
    border-radius: 12px;
    padding: 4px 10px;
    cursor: pointer;
    font-size: 0.75rem;
    color: #ddd;
    transition: background 0.15s ease;
  }

  .chip:hover {
    background: #333;
  }

  .watched-ribbon {
    position: absolute;
    top: 0;
    right: 0;
    background: #e50914; /* Netflix red */
    color: white;
    padding: 4px 8px;
    font-size: 0.7rem;
    font-weight: bold;
    border-bottom-left-radius: 4px;
    z-index: 10;
  }

</style>
