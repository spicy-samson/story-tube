import { toBlob } from 'html-to-image'
import type { StoryExportAsset, StoryShareVariant } from '~/shared/types/story-share'

const EXPORT_WIDTH = 1080
const EXPORT_HEIGHT = 1920

type StoryExportStatus = 'idle' | 'rendering' | 'sharing' | 'success' | 'error'
type ShareResult = 'shared' | 'cancelled' | 'downloaded' | 'failed'

function makeFilename(title: string, variant: StoryShareVariant) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72)
  const suffix = variant === 'qr' ? '-qr' : ''

  return `${slug || 'youtube-story'}${suffix}-1080x1920.png`
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

  function supportsNativeFileShare() {
    if (!import.meta.client || !navigator.share || !navigator.canShare) return false

    try {
      const probe = new File(['story'], 'story.png', { type: 'image/png' })
      return navigator.canShare({ files: [probe] })
    } catch {
      return false
    }
  }

  async function renderPng(
    element: HTMLElement | null,
    title: string,
    variant: StoryShareVariant
  ): Promise<StoryExportAsset | null> {
    if (!import.meta.client || !element) return null

    status.value = 'rendering'
    message.value = `Preparing your ${variant === 'qr' ? 'QR' : 'clean'} story...`
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

      const filename = makeFilename(title, variant)
      const file = new File([blob], filename, { type: 'image/png' })
      const asset: StoryExportAsset = {
        blob,
        file,
        filename,
        height: EXPORT_HEIGHT,
        variant,
        width: EXPORT_WIDTH
      }

      status.value = 'success'
      message.value = `${variant === 'qr' ? 'QR' : 'Clean'} story ready in HD.`
      return asset
    } catch (error) {
      console.error('Story export failed:', error)
      status.value = 'error'
      message.value = 'Export failed. Reload the video and try again.'
      return null
    } finally {
      exportWrapper?.remove()
    }
  }

  function downloadAsset(asset: StoryExportAsset) {
    const objectUrl = URL.createObjectURL(asset.blob)
    const downloadLink = document.createElement('a')

    downloadLink.href = objectUrl
    downloadLink.download = asset.filename
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000)

    status.value = 'success'
    message.value = `${asset.variant === 'qr' ? 'QR' : 'Clean'} story downloaded.`
  }

  async function shareAsset(asset: StoryExportAsset): Promise<ShareResult> {
    if (!supportsNativeFileShare()) {
      downloadAsset(asset)
      message.value = 'Native image sharing is unavailable here, so the PNG was downloaded.'
      return 'downloaded'
    }

    status.value = 'sharing'
    message.value = 'Opening your share sheet...'

    try {
      await navigator.share({
        files: [asset.file],
        title: 'YouTube Story'
      })
      status.value = 'success'
      message.value = 'Story sent to the share sheet.'
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        status.value = 'success'
        message.value = 'Sharing canceled. Your image is still ready.'
        return 'cancelled'
      }

      console.error('Native story sharing failed:', error)
      status.value = 'error'
      message.value = 'Could not open the share sheet. Download the PNG instead.'
      return 'failed'
    }
  }

  function resetExportStatus() {
    status.value = 'idle'
    message.value = ''
  }

  return {
    downloadAsset,
    isExporting,
    message,
    renderPng,
    resetExportStatus,
    shareAsset,
    status,
    supportsNativeFileShare
  }
}
