export type StoryShareVariant = 'clean' | 'qr'

export type QrPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface StoryExportAsset {
  blob: Blob
  file: File
  filename: string
  height: 1920
  variant: StoryShareVariant
  width: 1080
}
