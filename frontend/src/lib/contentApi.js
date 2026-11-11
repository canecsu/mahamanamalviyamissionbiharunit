import { apiUrl } from "./apiConfig";

const PUBLIC_COLLECTIONS = new Set([
  "pages", "gallery", "members", "news", "activities",
  "events", "blogs", "videos", "store"
]);

async function request(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    signal: options.signal,
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("NOT_FOUND");
    throw new Error(`API_ERROR_${response.status}`);
  }
  return response.json();
}

export function getPublic(type, options = {}) {
  if (!PUBLIC_COLLECTIONS.has(type)) throw new Error("Unknown public content type");
  return request(`/${type}`, options);
}

export function getBlog(slug, options = {}) {
  return request(`/blogs/slug/${encodeURIComponent(slug)}`, options);
}
