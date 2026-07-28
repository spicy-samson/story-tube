import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'

interface StoryCardState {
  metadata: YoutubeMetadata | null
  isLoading: boolean
  errorMessage: string
}

export function useStoryCardContent(props: StoryCardState) {
  const eyebrow = computed(() => {
    if (props.isLoading) return 'Loading metadata'
    if (props.errorMessage) return 'Preview waiting'
    return props.metadata ? 'Watch now' : 'Your next watch'
  })

  const title = computed(() => {
    if (props.metadata) return props.metadata.title
    if (props.errorMessage) return 'This link could not become a story yet.'
    if (props.isLoading) return 'Fetching the video details...'
    return 'Paste a YouTube link to create your story.'
  })

  const channel = computed(() => {
    if (props.metadata) return props.metadata.channelName
    if (props.errorMessage) return props.errorMessage
    return props.isLoading ? 'Connecting to YouTube' : 'Title, channel and artwork will appear here'
  })

  return { eyebrow, title, channel }
}
