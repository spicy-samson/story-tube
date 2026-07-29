import QRCode from 'qrcode'

export function useStoryQrCode() {
  const dataUrl = ref('')
  const error = ref('')
  const isGenerating = ref(false)

  async function generate(url: string) {
    if (!import.meta.client || !url) return ''

    isGenerating.value = true
    error.value = ''

    try {
      dataUrl.value = await QRCode.toDataURL(url, {
        color: {
          dark: '#09090b',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 512
      })

      return dataUrl.value
    } catch (generationError) {
      console.error('QR code generation failed:', generationError)
      dataUrl.value = ''
      error.value = 'Could not create the QR version. The clean story is still available.'
      return ''
    } finally {
      isGenerating.value = false
    }
  }

  function reset() {
    dataUrl.value = ''
    error.value = ''
  }

  return {
    dataUrl,
    error,
    generate,
    isGenerating,
    reset
  }
}
