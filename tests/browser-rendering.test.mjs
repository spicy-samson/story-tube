import test from 'node:test'
import assert from 'node:assert/strict'
import * as paletteModule from '../composables/useThumbnailPalette.ts'
import * as exportModule from '../composables/useStoryExport.ts'

test('builds a rich dark palette from normalized thumbnail pixels', () => {
  const pixels = new Uint8ClampedArray(64)

  for (let index = 0; index < pixels.length; index += 16) {
    pixels.set([24, 64, 128, 255], index)
  }

  assert.deepEqual(paletteModule.createPalette(pixels), {
    background: 'hsl(217 62% 15%)',
    backgroundAlt: 'hsl(217 68% 30%)',
    accent: 'hsl(217 68% 62%)',
    foreground: '#ffffff',
    muted: 'hsl(217 31% 78%)'
  })
})

test('falls back to a PNG data URL when Blob rendering fails', async () => {
  const blob = await exportModule.renderPngWithFallback(
    async () => { throw new Error('Safari Blob render failed') },
    async () => 'data:image/png;base64,iVBORw0KGgo='
  )

  assert.equal(blob.type, 'image/png')
  assert.equal(blob.size, 8)
})
