export type StoryTemplateId =
  | 'frame'
  | 'headline'
  | 'spotlight'
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
  swatchBackground: string
}
