import { createError, defineEventHandler, getQuery } from "h3"; //even without import statement this will not throw a compile time error sicne nuxt is nuxt
import type { YoutubeMetadata } from "../../../shared/types/youtube-metadata";
import { parseYoutubeUrl } from "../../../shared/utils/youtube-url";

interface YoutubeOEmbedResponse {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
  provider_name?: string;
}

export default defineEventHandler(async (event): Promise<YoutubeMetadata> => {
  const query = getQuery(event);
  const rawUrl = Array.isArray(query.url) ? query.url[0] : query.url;

  if (typeof rawUrl !== "string" || !rawUrl.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing "url" query parameter',
    });
  }

  const parsedUrl = parseYoutubeUrl(rawUrl);

  if (!parsedUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: "Enter a valid YouTube watch, Shorts, or youtu.be link",
    });
  }

  const oEmbedUrl = new URL("https://www.youtube.com/oembed");
  oEmbedUrl.searchParams.set("url", parsedUrl.canonicalUrl);
  oEmbedUrl.searchParams.set("format", "json");

  let metadata: YoutubeOEmbedResponse;

  try {
    metadata = await $fetch<YoutubeOEmbedResponse>(oEmbedUrl.toString());
  } catch (error: unknown) {
    const statusCode = getFetchStatusCode(error);

    if (
      statusCode === 400 ||
      statusCode === 401 ||
      statusCode === 403 ||
      statusCode === 404
    ) {
      throw createError({
        statusCode: 404,
        statusMessage:
          "This YouTube video is unavailable or cannot be embedded",
      });
    }

    throw createError({
      statusCode: 502,
      statusMessage: "Could not fetch metadata from YouTube right now",
    });
  }

  if (!metadata.title || !metadata.author_name || !metadata.thumbnail_url) {
    throw createError({
      statusCode: 502,
      statusMessage: "YouTube returned incomplete metadata for this video",
    });
  }

  return {
    videoId: parsedUrl.videoId,
    canonicalUrl: parsedUrl.canonicalUrl,
    title: metadata.title,
    channelName: metadata.author_name,
    thumbnailUrl: metadata.thumbnail_url,
    provider: "youtube",
    source: "oembed",
  };
});

function getFetchStatusCode(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const maybeError = error as {
    statusCode?: number;
    status?: number;
    response?: {
      status?: number;
      statusCode?: number;
    };
  };

  return (
    maybeError.statusCode ??
    maybeError.status ??
    maybeError.response?.statusCode ??
    maybeError.response?.status
  );
}
