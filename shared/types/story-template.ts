export type StoryTemplateId =
  | 'frame'
  | 'headline'
  | 'spotlight'
  | 'bulletin'
  | 'caption'
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
