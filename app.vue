<template>
  <main class="app-shell">
    <section class="workspace" aria-labelledby="workspace-title">
      <div class="workspace__panel workspace__panel--controls">
        <p class="eyebrow">PWA scaffold · M1</p>
        <h1 id="workspace-title">Make a YouTube link beautiful for your story.</h1>
        <p class="intro">
          Paste a video link, choose a story format, then export a 9:16 card. Metadata and PNG export land in the next milestones.
        </p>

        <form class="link-form" aria-label="YouTube story maker input">
          <label for="video-url">YouTube link</label>
          <div class="input-row">
            <input
              id="video-url"
              type="url"
              inputmode="url"
              placeholder="https://youtu.be/example"
              autocomplete="off"
              disabled
            >
            <button type="button" disabled>Generate</button>
          </div>
          <p class="field-note">Disabled for M1. M2 wires parsing and metadata.</p>
        </form>

        <div class="template-picker" aria-label="Template picker preview">
          <div class="section-label">
            <span>Templates</span>
            <small>Coming M3-M5</small>
          </div>
          <div class="template-grid">
            <button type="button" class="template-option template-option--active" disabled>
              <span>Minimal</span>
            </button>
            <button type="button" class="template-option" disabled>
              <span>Cinematic</span>
            </button>
            <button type="button" class="template-option" disabled>
              <span>Creator</span>
            </button>
          </div>
        </div>

        <div class="action-strip" aria-label="Export actions">
          <button type="button" class="primary-action" disabled>Export 1080x1920 PNG</button>
          <button type="button" class="secondary-action" disabled>Copy video link</button>
        </div>
      </div>

      <div class="workspace__panel workspace__panel--preview" aria-label="Story card preview">
        <div class="phone-frame">
          <article class="story-card">
            <div class="story-card__source">Watch on YouTube</div>
            <div class="story-card__thumbnail">
              <div class="play-mark" aria-hidden="true"></div>
            </div>
            <div class="story-card__copy">
              <p class="story-card__label">Now watching</p>
              <h2>Paste a video link to build the first card.</h2>
              <p>Title, channel, thumbnail, and export controls plug into this preview after M1.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
