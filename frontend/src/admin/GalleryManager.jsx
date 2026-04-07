// frontend/src/admin/GalleryManager.jsx
import React, { useEffect, useState } from "react";
import { fetchGallery, createGallery, updateGallery, deleteGallery } from "./api";

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ url: "", caption: "", alt: "", order: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(()=>{ load(); }, []);

  async function load() {
    const g = await fetchGallery();
    setItems(g);
  }

  function edit(it) {
    setEditingId(it._id);
    setForm({ url: it.url, caption: it.caption || "", alt: it.alt || "", order: it.order || 0 });
  }

  async function save() {
    try {
      if (editingId) {
        await updateGallery(editingId, form);
      } else {
        await createGallery(form);
      }
      setForm({ url: "", caption: "", alt: "", order: 0 });
      setEditingId(null);
      await load();
    } catch (err) {
      alert("Save failed");
    }
  }

  async function remove(id) {
    if (!confirm("Delete image?")) return;
    await deleteGallery(id);
    await load();
  }

  return (
    <div>
      <h3>Gallery</h3>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h4>{editingId ? "Edit" : "Add Image"}</h4>
          <div><label>Image URL</label><input value={form.url} onChange={(e)=>setForm({...form, url:e.target.value})} style={{width:"100%"}}/></div>
          <div><label>Caption</label><input value={form.caption} onChange={(e)=>setForm({...form, caption:e.target.value})} style={{width:"100%"}}/></div>
          <div><label>Alt</label><input value={form.alt} onChange={(e)=>setForm({...form, alt:e.target.value})} style={{width:"100%"}}/></div>
          <div><label>Order</label><input type="number" value={form.order} onChange={(e)=>setForm({...form, order: Number(e.target.value)})} /></div>
          <div style={{marginTop:8}}><button onClick={save}>{editingId ? "Update" : "Add"}</button></div>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Existing</h4>
          <ul>
            {items.map(it => (
              <li key={it._id} style={{ marginBottom: 12 }}>
                <img src={it.url} alt={it.alt || ""} style={{ width: 120, height: 80, objectFit: "cover" }} />
                <div>{it.caption}</div>
                <div>
                  <button onClick={()=>edit(it)}>Edit</button>
                  <button onClick={()=>remove(it._id)} style={{ marginLeft: 8 }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}