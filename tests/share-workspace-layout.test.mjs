import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const workspace = await readFile(
  new URL('../components/story/StoryShareWorkspace.vue', import.meta.url),
  'utf8'
)
const storyExport = await readFile(
  new URL('../composables/useStoryExport.ts', import.meta.url),
  'utf8'
)

test('fits the share workspace inside the dynamic viewport', () => {
  assert.match(workspace, /h-\[100dvh\] overflow-hidden/)
  assert.match(workspace, /my-5 grid h-\[calc\(100dvh-6rem\)\]/)
  assert.match(workspace, /grid-rows-\[62%_38%\]/)
  assert.match(workspace, /ResizeObserver\(updatePreviewScale\)/)
  assert.match(workspace, /translate\(-50%, -50%\) scale\(\$\{previewScale\}\)/)
  assert.match(storyExport, /const sourceWidth = source\.offsetWidth/)
  assert.match(storyExport, /const sourceHeight = source\.offsetHeight/)
})
