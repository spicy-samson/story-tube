export type StoryShareVariant = 'clean' | 'qr'

export type QrPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface StoryExportAsset {
  blob: Blob
  file: File
  filename: string
  height: 1920
  variant: StoryShareVariant
  width: 1080
}
