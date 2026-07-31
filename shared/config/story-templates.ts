import type { StoryTemplateOption } from '../types/story-template'

export const STORY_TEMPLATES: StoryTemplateOption[] = [
  {
    id: 'frame',
    name: 'Frame',
    description: 'Balanced default',
    swatchBackground: '#f2f2ef'
  },
  {
    id: 'headline',
    name: 'Headline',
    description: 'Type first',
    swatchBackground: '#111111'
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Image forward',
    swatchBackground: '#31506b'
  },
  {
    id: 'bulletin',
    name: 'Bulletin',
    description: 'Upload notice',
    swatchBackground: '#e8e8e4'
  },
  {
    id: 'caption',
    name: 'Caption',
    description: 'Compact editorial',
    swatchBackground: '#d9dbd6'
  },
  {
    id: 'chromatic',
    name: 'Chromatic',
    description: 'Color-matched poster',
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
