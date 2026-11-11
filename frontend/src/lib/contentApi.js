const DEFAULT_API_URL = "https://mahamanamalviyamissionbiharunit.onrender.com";
const configuredApi = process.env.REACT_APP_ADMIN_API_URL || DEFAULT_API_URL;
const API_BASE = configuredApi.replace(/\/+$/, "").replace(/\/docs$/, "");

const PUBLIC_COLLECTIONS = new Set([
  "pages", "gallery", "members", "news", "activities",
  "events", "blogs", "videos", "store"
]);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
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
