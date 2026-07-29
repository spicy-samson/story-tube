import type { StoryTemplateOption } from '../types/story-template'

export const STORY_TEMPLATES: StoryTemplateOption[] = [
  {
    id: 'centered',
    name: 'Centered',
    description: 'Media card',
    swatchBackground: 'linear-gradient(135deg, #050505 0%, #201b1a 100%)'
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Bold & dark',
    swatchBackground: 'linear-gradient(135deg, #444444 0%, #050505 78%)'
  },
  {
    id: 'poster',
    name: 'Poster',
    description: 'Serif editorial',
    swatchBackground: '#416f9f'
  },
  {
    id: 'progress',
    name: 'Progress',
    description: 'Player inspired',
    swatchBackground: 'linear-gradient(180deg, #6b554b 0%, #080808 100%)'
  },
  {
    id: 'clean-poster',
    name: 'Clean',
    description: 'Type first',
    swatchBackground: '#f2f2ef'
  },
  {
    id: 'full-bleed',
    name: 'Full bleed',
    description: 'Image forward',
    swatchBackground: 'linear-gradient(90deg, #030303 0%, #795e50 100%)'
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Floating card',
    swatchBackground: 'linear-gradient(135deg, #080909 0%, #66504b 100%)'
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
