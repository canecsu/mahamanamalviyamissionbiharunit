const API_BASE = process.env.REACT_APP_ADMIN_API_URL || "https://mahamanamalviyamissionbiharunit.onrender.com";

export const CONTENT_TYPES = [
  "pages",
  "gallery",
  "members",
  "news",
  "activities",
  "events",
  "blogs",
  "videos",
  "store",
  "donations",
];

function getToken() {
  return localStorage.getItem("admin_token");
}

function headers(json = true) {
  const h = {};
  if (json) h["Content-Type"] = "application/json";
  const token = getToken();
  if (token) h["x-admin-token"] = token;
  return h;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.detail || data.message || message;
    } catch (_e) {}
    throw new Error(message);
  }
  return res.json();
}

export function logoutAdmin() {
  localStorage.removeItem("admin_token");
}

export function isLoggedIn() {
  return !!getToken();
}

export function adminLogin(token) {
  return request("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  }).then((data) => {
    localStorage.setItem("admin_token", data.token);
    return data;
  });
}

export function fetchCollection(type, admin = false) {
  return request(`${admin ? "/admin" : ""}/${type}`, { headers: headers(false) });
}

export function createItem(type, payload) {
  return request(`/admin/${type}`, { method: "POST", headers: headers(), body: JSON.stringify(payload) });
}

export function updateItem(type, id, payload) {
  return request(`/admin/${type}/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(payload) });
}

export function deleteItem(type, id) {
  return request(`/admin/${type}/${id}`, { method: "DELETE", headers: headers(false) });
}

export function submitDonation(payload) {
  return request("/donations/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function fetchBlogBySlug(slug) {
  return request(`/blogs/slug/${slug}`);
}
