import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createItem, deleteItem, fetchCollection, updateItem } from "./api";

const SCHEMA = {
  pages: ["title", "slug", "content", "language", "published"],
  gallery: ["url", "caption", "alt", "order"],
  members: ["name", "role", "photo_url", "bio"],
  news: ["title", "description", "image_url", "date", "status", "published"],
  activities: ["title", "description", "image_url", "gallery", "date", "category", "status", "published"],
  events: ["year", "title", "slug", "description", "images", "video_links", "status", "published"],
  blogs: ["title", "slug", "content", "author", "image_url", "date", "status", "published"],
  videos: ["title", "video_url", "thumbnail_url", "event_id", "event_year", "status", "published"],
  store: ["product_name", "category", "description", "price", "stock", "image_url", "status", "published"],
  donations: ["donor_name", "email", "phone", "amount", "transaction_id", "message", "status"],
};

const defaults = (keys) =>
  Object.fromEntries(
    keys.map((k) => [k, ["published"].includes(k) ? false : ["price", "stock", "order", "year", "event_year", "event_id", "amount"].includes(k) ? "0" : ""]),
  );

export default function PagesManager({ type = "pages" }) {
  const fields = useMemo(() => SCHEMA[type] || [], [type]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(defaults(fields));
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await fetchCollection(type, true));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    setForm(defaults(fields));
    setEditing(null);
    load();
  }, [fields, load]);

  const normalize = (payload) => {
    const out = { ...payload };
    ["price", "amount"].forEach((k) => out[k] !== undefined && (out[k] = Number(out[k] || 0)));
    ["stock", "order", "year", "event_year", "event_id"].forEach((k) => out[k] !== undefined && (out[k] = out[k] === "" ? null : Number(out[k])));
    ["gallery", "images", "video_links"].forEach((k) => out[k] !== undefined && (out[k] = String(out[k]).split("\n").map((v) => v.trim()).filter(Boolean)));
    return out;
  };

  const onSave = async (e) => {
    e.preventDefault();
    const payload = normalize(form);
    if (!window.confirm(editing ? "Update this item?" : "Create this item?")) return;
    try {
      if (editing) await updateItem(type, editing, payload);
      else await createItem(type, payload);
      setForm(defaults(fields));
      setEditing(null);
      load();
    } catch (e2) {
      setError(e2.message);
    }
  };

  const startEdit = (row) => {
    setEditing(row.id);
    const val = {};
    fields.forEach((k) => {
      const v = row[k];
      val[k] = Array.isArray(v) ? v.join("\n") : v ?? "";
    });
    setForm(val);
  };

  const filtered = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">{type} Manager</h1>
      {error && <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded">{error}</div>}
      <div className="grid lg:grid-cols-2 gap-4">
        <form className="bg-white border rounded-xl p-4 space-y-3" onSubmit={onSave}>
          {fields.map((key) => (
            <label key={key} className="block">
              <span className="text-sm font-medium capitalize">{key.replaceAll("_", " ")}</span>
              {key === "published" ? (
                <input type="checkbox" checked={!!form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="ml-2" />
              ) : ["content", "description", "bio", "message", "gallery", "images", "video_links"].includes(key) ? (
                <textarea value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full border rounded p-2 min-h-24" />
              ) : (
                <input
                  value={form[key] ?? ""}
                  type={["price", "stock", "order", "year", "event_year", "event_id", "amount"].includes(key) ? "number" : key === "date" ? "date" : "text"}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="mt-1 w-full border rounded p-2"
                  required={["title", "name", "product_name", "donor_name"].includes(key)}
                />
              )}
            </label>
          ))}
          <div className="flex gap-2">
            <button className="bg-black text-white px-4 py-2 rounded">{editing ? "Update" : "Create"}</button>
            {editing && (
              <button type="button" className="border px-4 py-2 rounded" onClick={() => { setEditing(null); setForm(defaults(fields)); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-white border rounded-xl p-4">
          <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-3 w-full border rounded p-2" />
          {loading ? <p>Loading...</p> : filtered.length === 0 ? <p className="text-gray-500">No records found.</p> : (
            <div className="space-y-2 max-h-[70vh] overflow-auto">
              {filtered.map((row) => (
                <div key={row.id} className="border rounded p-3">
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(row, null, 2)}</pre>
                  <div className="flex gap-2 mt-2">
                    <button className="border rounded px-2 py-1" onClick={() => startEdit(row)}>Edit</button>
                    <button className="border rounded px-2 py-1 text-red-600" onClick={async () => { if (window.confirm("Delete this item?")) { await deleteItem(type, row.id); load(); } }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
