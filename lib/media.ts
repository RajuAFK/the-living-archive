/**
 * All portfolio media lives in the Cloudflare R2 bucket `praxivision-portfolio`.
 * Paths in the database/manifest are stored relative ("/portfolio/…") and get
 * prefixed here, so dev/staging/prod can point at different buckets.
 */
export const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE ??
  "https://pub-b6df9c86ce26430caf9d07b91b02796f.r2.dev";

/** Wrapper page (hosted in R2) that renders a .glb via <model-viewer>. */
export const MODEL_VIEWER_URL = `${MEDIA_BASE}/portfolio/viewers/model.html`;

/** Resolve a manifest/DB media path ("/portfolio/…") to a full URL. */
export function mediaUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${MEDIA_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** URL for the 3D model viewer iframe around a .glb path. */
export function modelViewerUrl(glbPath: string): string {
  return `${MODEL_VIEWER_URL}?src=${encodeURIComponent(mediaUrl(glbPath))}`;
}
