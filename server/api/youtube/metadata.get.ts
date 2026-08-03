import {
  createError,
  defineEventHandler,
  getQuery,
  getRequestURL,
  setHeader,
} from "h3";
import type { YoutubeMetadata } from "../../../shared/types/youtube-metadata";
import { parseYoutubeUrl } from "../../../shared/utils/youtube-url";
import {
  createYoutubeMetadataCacheKey,
  getCloudflareDefaultCache,
  METADATA_BROWSER_CACHE_CONTROL,
  resolveYoutubeMetadata,
} from "../../utils/youtube-metadata-cache.js";

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

  const cache = getCloudflareDefaultCache();
  const cacheKey = createYoutubeMetadataCacheKey(
    getRequestURL(event).origin,
    parsedUrl.videoId,
  );
  const executionContext = getCloudflareExecutionContext(event.context);
  const { metadata, cacheStatus } = await resolveYoutubeMetadata({
    cache,
    key: cacheKey,
    loadFresh: () => loadYoutubeMetadata(parsedUrl),
    onCacheError: (operation, error) => {
      logMetadataError(`cache_${operation}_failed`, error);
    },
    defer: executionContext
      ? (promise) => executionContext.waitUntil(promise)
      : undefined,
  });

  setMetadataResponseHeaders(event, cacheStatus);
  logMetadataEvent(`cache_${cacheStatus.toLowerCase()}`);
  return metadata;
});

async function loadYoutubeMetadata(
  parsedUrl: NonNullable<ReturnType<typeof parseYoutubeUrl>>,
): Promise<YoutubeMetadata> {
  const oEmbedUrl = new URL("https://www.youtube.com/oembed");
  oEmbedUrl.searchParams.set("url", parsedUrl.canonicalUrl);
  oEmbedUrl.searchParams.set("format", "json");

  let metadata: YoutubeOEmbedResponse;

  try {
    metadata = await $fetch<YoutubeOEmbedResponse>(oEmbedUrl.toString(), {
      signal: AbortSignal.timeout(5_000),
    });
  } catch (error: unknown) {
    const statusCode = getFetchStatusCode(error);

    if (
      statusCode === 400 ||
      statusCode === 401 ||
      statusCode === 403 ||
      statusCode === 404
    ) {
      logMetadataEvent("provider_unavailable", { providerStatus: statusCode });
      throw createError({
        statusCode: 404,
        statusMessage:
          "This YouTube video is unavailable or cannot be embedded",
      });
    }

    logMetadataEvent("provider_failed", { providerStatus: statusCode ?? null });
    throw createError({
      statusCode: 502,
      statusMessage: "Could not fetch metadata from YouTube right now",
    });
  }

  if (!metadata.title || !metadata.author_name || !metadata.thumbnail_url) {
    logMetadataEvent("provider_incomplete");
    throw createError({
      statusCode: 502,
      statusMessage: "YouTube returned incomplete metadata for this video",
    });
  }

  const normalizedMetadata: YoutubeMetadata = {
    videoId: parsedUrl.videoId,
    canonicalUrl: parsedUrl.canonicalUrl,
    title: metadata.title,
    channelName: metadata.author_name,
    thumbnailUrl: metadata.thumbnail_url,
    provider: "youtube",
    source: "oembed",
  };
  logMetadataEvent("provider_success");
  return normalizedMetadata;
}

type MetadataCacheStatus = "HIT" | "MISS" | "BYPASS";

function setMetadataResponseHeaders(
  event: Parameters<typeof setHeader>[0],
  cacheStatus: MetadataCacheStatus,
) {
  setHeader(event, "Cache-Control", METADATA_BROWSER_CACHE_CONTROL);
  setHeader(event, "X-Posterize-Cache", cacheStatus);
}

function getCloudflareExecutionContext(context: unknown) {
  if (typeof context !== "object" || context === null) {
    return null;
  }

  const cloudflare = (context as {
    cloudflare?: {
      context?: { waitUntil(promise: Promise<unknown>): void };
    };
  }).cloudflare;

  return cloudflare?.context ?? null;
}

function logMetadataEvent(
  outcome: string,
  details: Record<string, unknown> = {},
) {
  console.info({ event: "youtube_metadata", outcome, ...details });
}

function logMetadataError(outcome: string, error: unknown) {
  console.error({
    event: "youtube_metadata",
    outcome,
    error: error instanceof Error ? error.name : "UnknownError",
  });
}

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
