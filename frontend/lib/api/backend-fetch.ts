const DEFAULT_BACKEND_URLS = [
  "http://127.0.0.1:8000",
  "http://localhost:8000",
  "http://127.0.0.1:8001",
  "http://localhost:8001",
];

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

export function getBackendBaseUrls() {
  const candidates = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.BACKEND_URL,
    ...DEFAULT_BACKEND_URLS,
  ]
    .filter((value): value is string => Boolean(value && value !== "undefined"))
    .map(normalizeBaseUrl);

  return [...new Set(candidates)];
}

export async function fetchBackend(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const urls = getBackendBaseUrls();
  const requestPath = path.startsWith("/") ? path : `/${path}`;
  const errors: string[] = [];

  for (const baseUrl of urls) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${baseUrl}${requestPath}`, {
        ...init,
        signal: init.signal ?? controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      const message =
        error instanceof Error ? error.message : "Unknown connection error";
      errors.push(`${baseUrl}: ${message}`);
    }
  }

  throw new Error(
    `Impossible de joindre le backend. Tentatives: ${errors.join(" | ")}`
  );
}
