import type { StoryTemplateOption } from '../types/story-template'

export const STORY_TEMPLATES: StoryTemplateOption[] = [
  {
    id: 'frame',
    name: 'Frame',
    description: 'White editorial',
    swatchBackground: '#f7f7f3'
  },
  {
    id: 'headline',
    name: 'Headline',
    description: 'Black glass',
    swatchBackground: '#101012'
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Image forward',
    swatchBackground: '#31506b'
  },
  {
    id: 'chromatic',
    name: 'Chromatic',
    description: 'Soft-focus gallery',
    swatchBackground: 'linear-gradient(135deg, #19364b 0%, #dc7b67 100%)'
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Image & type',
    swatchBackground: 'linear-gradient(180deg, #b35d48 0%, #b35d48 50%, #17232c 50%, #17232c 100%)'
  },
  {
    id: 'liquid',
    name: 'Liquid',
    description: 'Glass color flow',
    swatchBackground: 'linear-gradient(135deg, #f8fafc 0%, #76a7c8 36%, #17232c 100%)'
  }
]
