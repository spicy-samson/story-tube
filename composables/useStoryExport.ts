import { toBlob, toPng } from 'html-to-image'
import type { StoryExportAsset, StoryShareVariant } from '~/shared/types/story-share'

const EXPORT_WIDTH = 1080
const EXPORT_HEIGHT = 1920
const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
const SRGB_CHUNK = new Uint8Array([0, 0, 0, 1, 115, 82, 71, 66, 0, 174, 206, 28, 233])

type StoryExportStatus = 'idle' | 'rendering' | 'sharing' | 'success' | 'error'
type ShareResult = 'shared' | 'cancelled' | 'downloaded' | 'failed'

function logExport(stage: string, details?: unknown) {
  console.info(`[Posterize export] ${stage}`, details ?? '')
}

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

export async function fetchImageAsDataUrl(source: string) {
  logExport('Fetching image', source)
  const response = await fetch(source)

  if (!response.ok) throw new Error('A story image could not be loaded.')

  const blob = await response.blob()
  logExport('Image fetched', { source, bytes: blob.size, type: blob.type })
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let binary = ''

  for (let offset = 0; offset < bytes.length; offset += 32_768) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32_768))
  }

  return `data:${blob.type || 'application/octet-stream'};base64,${btoa(binary)}`
}

async function inlineImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll('img'))
  const sources = [...new Set(images
    .map(image => image.currentSrc || image.src)
    .filter(source => !source.startsWith('data:')))]
  logExport('Inlining images', { imageCount: images.length, sources })
  const dataUrls = new Map(await Promise.all(
    sources.map(async source => [source, await fetchImageAsDataUrl(source)] as const)
  ))

  images.forEach((image) => {
    const dataUrl = dataUrls.get(image.currentSrc || image.src)

    if (!dataUrl) return
    image.srcset = ''
    image.src = dataUrl
  })

  await waitForImages(element)
  logExport('Images ready in clone', images.map(image => ({
    complete: image.complete,
    height: image.naturalHeight,
    inlined: image.src.startsWith('data:'),
    width: image.naturalWidth
  })))
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

export async function renderPngWithFallback(
  renderBlob: () => Promise<Blob | null>,
  renderDataUrl: () => Promise<string>
) {
  try {
    logExport('Rendering with toBlob')
    const blob = await renderBlob()
    if (blob) {
      logExport('toBlob succeeded', { bytes: blob.size, type: blob.type })
      return blob
    }
    logExport('toBlob returned null; using toPng fallback')
  } catch (error) {
    console.warn('[Posterize export] toBlob failed; using toPng fallback', error)
  }

  const dataUrl = await renderDataUrl()
  const blob = await fetch(dataUrl).then(response => response.blob())
  logExport('toPng fallback succeeded', { bytes: blob.size, type: blob.type })
  return blob
}

export async function tagPngAsSrgb(blob: Blob) {
  const png = new Uint8Array(await blob.arrayBuffer())

  if (!PNG_SIGNATURE.every((byte, index) => png[index] === byte)) {
    throw new Error('The rendered image is not a valid PNG.')
  }

  for (let offset = 8; offset + 12 <= png.length;) {
    const chunkLength = new DataView(png.buffer, png.byteOffset + offset, 4).getUint32(0)
    const chunkType = new TextDecoder().decode(png.subarray(offset + 4, offset + 8))

    if (chunkType === 'sRGB') return blob
    if (chunkType === 'IDAT') break
    offset += chunkLength + 12
  }

  const tagged = new Uint8Array(png.length + SRGB_CHUNK.length)
  tagged.set(png.subarray(0, 33))
  tagged.set(SRGB_CHUNK, 33)
  tagged.set(png.subarray(33), 33 + SRGB_CHUNK.length)

  return new Blob([tagged], { type: 'image/png' })
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
      logExport('Render started', {
        height: artboard.clone.getBoundingClientRect().height,
        pixelRatio: artboard.pixelRatio,
        userAgent: navigator.userAgent,
        variant,
        width: artboard.clone.getBoundingClientRect().width
      })

      await document.fonts.ready
      logExport('Fonts ready')
      await inlineImages(artboard.clone)
      await waitForPaint()
      logExport('Clone painted')

      const renderOptions = {
        width: artboard.clone.getBoundingClientRect().width,
        height: artboard.clone.getBoundingClientRect().height,
        pixelRatio: artboard.pixelRatio,
        cacheBust: true,
        includeQueryParams: true,
        onImageErrorHandler: (event: Event | string) => {
          console.error('[Posterize export] html-to-image rejected an image', event)
        },
        skipAutoScale: true
      }
      const renderedBlob = await renderPngWithFallback(
        () => toBlob(artboard.clone, renderOptions),
        () => toPng(artboard.clone, renderOptions)
      )
      const blob = await tagPngAsSrgb(renderedBlob)
      logExport('PNG tagged as sRGB', { bytes: blob.size })

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
      logExport('Asset ready', { filename, height: EXPORT_HEIGHT, width: EXPORT_WIDTH })
      return asset
    } catch (error) {
      console.error('[Posterize export] Render failed', error)
      status.value = 'error'
      message.value = 'Export failed. Reload the video and try again.'
      return null
    } finally {
      exportWrapper?.remove()
    }
  }

  function downloadAsset(asset: StoryExportAsset) {
    logExport('Download requested', {
      bytes: asset.blob.size,
      filename: asset.filename,
      type: asset.blob.type
    })
    const objectUrl = URL.createObjectURL(asset.blob)
    const downloadLink = document.createElement('a')

    downloadLink.href = objectUrl
    downloadLink.download = asset.filename
    downloadLink.target = '_blank'
    downloadLink.rel = 'noopener'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    logExport('Download link clicked', { objectUrl })
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000)

    status.value = 'success'
    message.value = `${asset.variant === 'qr' ? 'QR' : 'Clean'} story downloaded. If Safari opened it, use Share > Save Image.`
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
