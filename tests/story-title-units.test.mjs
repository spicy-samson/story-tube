import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const templatePaths = [
  '../components/story/templates/ChromaticStoryCard.vue',
  '../components/story/templates/LiquidStoryCard.vue',
  '../components/story/templates/SplitStoryCard.vue',
  '../components/story/templates/SpotlightStoryCard.vue'
]

test('keeps exported story titles off container query units', async () => {
  const sources = await Promise.all(templatePaths.map(async path => readFile(new URL(path, import.meta.url), 'utf8')))

  for (const source of sources) {
    assert.doesNotMatch(source, /cqw/)
    assert.doesNotMatch(source, /container-type:inline-size/)
  }
})
