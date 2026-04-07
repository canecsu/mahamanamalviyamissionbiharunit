const API_BASE = process.env.REACT_APP_ADMIN_API_URL || "https://mahamanamalviyamissionbiharunit.onrender.com/docs";

export async function getPublic(type) {
  const res = await fetch(`${API_BASE}/${type}`);
  if (!res.ok) throw new Error(`Failed to load ${type}`);
  return res.json();
}

export async function getBlog(slug) {
  const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
  if (!res.ok) throw new Error("Blog not found");
  return res.json();
}
