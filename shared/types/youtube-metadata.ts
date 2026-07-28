export type YoutubeMetadataSource = 'oembed' | 'youtube-data-api'

export interface YoutubeMetadata {
  videoId: string
  canonicalUrl: string
  title: string
  channelName: string
  thumbnailUrl: string
  provider: 'youtube'
  source: YoutubeMetadataSource
  duration?: string
}

export interface ParsedYoutubeUrl {
  videoId: string
  canonicalUrl: string
}
