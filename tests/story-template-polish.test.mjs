import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const liquidSource = await readFile(
  new URL('../components/story/templates/LiquidStoryCard.vue', import.meta.url),
  'utf8'
)
const homeSource = await readFile(
  new URL('../pages/index.vue', import.meta.url),
  'utf8'
)

test('removes the floating Liquid play control', () => {
  assert.doesNotMatch(liquidSource, /<header/)
  assert.doesNotMatch(liquidSource, /StoryPlayButton size="sm"/)
})

test('places one round Share control below the story carousel', () => {
  const carouselIndex = homeSource.indexOf('<StoryTemplateCarousel')
  const shareControlIndex = homeSource.indexOf('aria-label="Share Story"')

  assert.ok(carouselIndex >= 0)
  assert.ok(shareControlIndex > carouselIndex)
  assert.equal(homeSource.match(/aria-label="Share Story"/g)?.length, 1)
  assert.match(homeSource, /size-14/)
  assert.match(homeSource, /rounded-full/)
  assert.match(homeSource, /<Share2/)
  assert.match(homeSource, /<LoaderCircle[^>]*animate-spin/)
})

test('guards Share navigation with local loading state', () => {
  assert.match(homeSource, /const isOpeningShare = ref\(false\)/)
  assert.match(homeSource, /if \(!metadata\.value \|\| isOpeningShare\.value\) return/)
  assert.match(homeSource, /isOpeningShare\.value = true/)
  assert.match(homeSource, /isOpeningShare\.value = false/)
})
