// All frontend requests must use the same backend in production and Preview.
const DEFAULT_API_URL = "https://mahamanamalviyamissionbiharunit.onrender.com";

export const API_BASE_URL = (process.env.REACT_APP_ADMIN_API_URL || DEFAULT_API_URL)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/docs$/, "");

// A single absolute endpoint builder avoids double slashes and misconfigured /docs paths.
export function apiUrl(path = "") {
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, "")}`;
}
