import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const spotlightSource = await readFile(
  new URL('../components/story/templates/SpotlightStoryCard.vue', import.meta.url),
  'utf8'
)
const storyPreviewSource = await readFile(
  new URL('../components/story/StoryPreview.vue', import.meta.url),
  'utf8'
)

async function readOptional(relativePath) {
  try {
    return await readFile(new URL(relativePath, import.meta.url), 'utf8')
  } catch {
    return ''
  }
}

const dragHandleSource = await readOptional('../components/story/SpotlightDragHandle.vue')

test('renders Spotlight artwork with a reactive horizontal focal crop', () => {
  assert.match(spotlightSource, /absolute inset-0 h-full w-full object-cover/)
  assert.match(spotlightSource, /spotlightX: number/)
  assert.match(spotlightSource, /objectPosition: `\$\{spotlightX\}% 50%`/)
  assert.match(spotlightSource, /grayscale/)
  assert.match(spotlightSource, /contrast-\[1\.1\]/)
  assert.doesNotMatch(spotlightSource, /transition-/)
})

test('places the Spotlight drag handle outside the exported canvas', () => {
  const canvasEnd = storyPreviewSource.indexOf('</div>\n    <SpotlightDragHandle')

  assert.notEqual(canvasEnd, -1)
  assert.match(storyPreviewSource, /templateId === 'spotlight' && metadata/)
  assert.match(storyPreviewSource, /@update:model-value="emit\('update:spotlightX', \$event\)"/)
})

test('supports pointer capture and keyboard nudging on the horizontal handle', () => {
  assert.match(dragHandleSource, /MoveHorizontal/)
  assert.match(dragHandleSource, /setPointerCapture/)
  assert.match(dragHandleSource, /releasePointerCapture/)
  assert.match(dragHandleSource, /@pointermove\.stop\.prevent="moveDrag"/)
  assert.match(dragHandleSource, /@keydown\.left\.stop\.prevent="nudge\(-5\)"/)
  assert.match(dragHandleSource, /@keydown\.right\.stop\.prevent="nudge\(5\)"/)
})
