import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), 'utf8')
}

const [indexSource, shareSource, carouselSource, workspaceSource] = await Promise.all([
  read('../pages/index.vue'),
  read('../pages/share/[videoId].vue'),
  read('../components/story/StoryTemplateCarousel.vue'),
  read('../components/story/StoryShareWorkspace.vue')
])

test('restores and forwards Spotlight crop on the Home route', () => {
  assert.match(indexSource, /ref\(parseSpotlightX\(route\.query\.spotlightX\)\)/)
  assert.match(indexSource, /v-model:spotlight-x="spotlightX"/)
  assert.match(indexSource, /spotlightX: spotlightX\.value/)
  assert.match(carouselSource, /'update:spotlightX': \[value: number\]/)
})

test('preserves Spotlight crop through Share, refresh, and Back to Edit', () => {
  assert.match(shareSource, /ref\(parseSpotlightX\(route\.query\.spotlightX\)\)/)
  assert.match(shareSource, /spotlightX=\$\{encodeURIComponent\(spotlightX\.value\)\}/)
  assert.match(shareSource, /spotlightX: spotlightX\.value/)
  assert.match(workspaceSource, /@update:spotlight-x="emit\('update:spotlightX', \$event\)"/)
})

test('regenerates the Share asset after the Spotlight crop changes', () => {
  assert.match(shareSource, /function setSpotlightX\(value: number\)/)
  assert.match(shareSource, /const nextValue = clampSpotlightX\(value\)/)
  assert.match(shareSource, /spotlightX\.value = nextValue/)
  assert.match(shareSource, /preparedAsset\.value = null/)
  assert.match(shareSource, /void prepareShareAsset\(\)/)
})
