export type StoryTemplateId =
  | 'centered'
  | 'editorial'
  | 'blue-poster'
  | 'progress'
  | 'clean-poster'
  | 'full-bleed'
  | 'glass'

export interface StoryTemplateOption {
  id: StoryTemplateId
  name: string
  description: string
  swatchClass: string
}
