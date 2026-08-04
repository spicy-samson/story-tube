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

test('inlines story images before Safari renders the export', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(new Blob(['posterize'], { type: 'image/png' }))

  try {
    assert.equal(
      await exportModule.fetchImageAsDataUrl('/story.png'),
      'data:image/png;base64,cG9zdGVyaXpl'
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('tags every exported PNG with Safari sRGB', async () => {
  const png = Uint8Array.from(Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X1WitAAAAABJRU5ErkJggg==',
    'base64'
  ))
  const tagged = new Uint8Array(await (await exportModule.tagPngAsSrgb(new Blob([png]))).arrayBuffer())

  assert.deepEqual([...tagged.subarray(33, 46)], [0, 0, 0, 1, 115, 82, 71, 66, 0, 174, 206, 28, 233])
})
