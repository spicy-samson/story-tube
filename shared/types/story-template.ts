export type StoryTemplateId =
  | 'centered'
  | 'editorial'
  | 'poster'
  | 'progress'
  | 'clean-poster'
  | 'full-bleed'
  | 'glass'
  | 'chromatic'
  | 'split'
  | 'liquid'

export interface StoryPalette {
  background: string
  backgroundAlt: string
  accent: string
  foreground: string
  muted: string
}

export interface StoryTemplateOption {
  id: StoryTemplateId
  name: string
  description: string
  swatchClass: string
}
