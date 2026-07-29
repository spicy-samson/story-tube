import { toBlob } from 'html-to-image'

const EXPORT_WIDTH = 1080
const EXPORT_HEIGHT = 1920

type StoryExportStatus = 'idle' | 'rendering' | 'success' | 'error'

function makeFilename(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72)

  return `${slug || 'youtube-story'}-1080x1920.png`
}

async function waitForImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll('img'))

  await Promise.all(images.map((image) => {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve()

    return new Promise<void>((resolve, reject) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => reject(new Error('A story image could not be loaded.')), { once: true })
    })
  }))
}

function createExportArtboard(element: HTMLElement) {
  const source = element.firstElementChild instanceof HTMLElement
    ? element.firstElementChild
    : element
  const sourceRect = source.getBoundingClientRect()
  const sourceWidth = sourceRect.width
  const sourceHeight = sourceRect.height
  const pixelRatio = EXPORT_WIDTH / sourceWidth
  const wrapper = document.createElement('div')
  const clone = source.cloneNode(true) as HTMLElement

  wrapper.setAttribute('aria-hidden', 'true')
  Object.assign(wrapper.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: `${sourceWidth}px`,
    height: `${sourceHeight}px`,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: '-1'
  })

  Object.assign(clone.style, {
    width: `${sourceWidth}px`,
    height: `${sourceHeight}px`,
    maxWidth: 'none',
    minWidth: '0',
    borderRadius: '0',
    boxShadow: 'none'
  })

  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  return { clone, pixelRatio, wrapper }
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

export function useStoryExport() {
  const status = ref<StoryExportStatus>('idle')
  const message = ref('')

  const isExporting = computed(() => status.value === 'rendering')

  async function exportPng(element: HTMLElement | null, title: string) {
    if (!import.meta.client || !element || isExporting.value) return

    status.value = 'rendering'
    message.value = 'Rendering your HD story...'
    const downloadLink = document.createElement('a')
    const supportsDownload = 'download' in downloadLink
    const fallbackWindow = supportsDownload ? null : window.open('', '_blank')
    let exportWrapper: HTMLElement | null = null

    try {
      const artboard = createExportArtboard(element)
      exportWrapper = artboard.wrapper

      await document.fonts.ready
      await waitForImages(artboard.clone)
      await waitForPaint()

      const blob = await toBlob(artboard.clone, {
        width: artboard.clone.getBoundingClientRect().width,
        height: artboard.clone.getBoundingClientRect().height,
        pixelRatio: artboard.pixelRatio,
        cacheBust: true,
        skipAutoScale: true
      })

      if (!blob) throw new Error('The browser could not create the PNG.')

      const objectUrl = URL.createObjectURL(blob)

      if (supportsDownload) {
        downloadLink.href = objectUrl
        downloadLink.download = makeFilename(title)
        downloadLink.style.display = 'none'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        downloadLink.remove()
        message.value = 'Your 1080 x 1920 PNG has been downloaded.'
      } else if (fallbackWindow) {
        fallbackWindow.location.href = objectUrl
        message.value = 'The PNG opened in a new tab. Save it from there.'
      } else {
        throw new Error('The browser blocked the PNG download window.')
      }

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000)
      status.value = 'success'
    } catch (error) {
      fallbackWindow?.close()
      console.error('Story export failed:', error)
      status.value = 'error'
      message.value = 'Export failed. Try another browser or reload the video and try again.'
    } finally {
      exportWrapper?.remove()
    }
  }

  function resetExportStatus() {
    status.value = 'idle'
    message.value = ''
  }

  return {
    exportPng,
    isExporting,
    message,
    resetExportStatus,
    status
  }
}
