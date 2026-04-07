// frontend/src/admin/MembersManager.jsx
import React, { useEffect, useState } from "react";
import { fetchMembers, createMember, updateMember, deleteMember } from "./api";

export default function MembersManager() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", photo_url: "", bio: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(()=>{ load(); }, []);

  async function load() {
    const m = await fetchMembers();
    setMembers(m);
  }

  function edit(member) {
    setEditingId(member._id);
    setForm({ name: member.name, role: member.role || "", photo_url: member.photo_url || "", bio: member.bio || "" });
  }

  async function save() {
    try {
      if (editingId) {
        await updateMember(editingId, form);
      } else {
        await createMember(form);
      }
      setForm({ name: "", role: "", photo_url: "", bio: "" });
      setEditingId(null);
      await load();
    } catch (err) {
      alert("Save failed");
    }
  }

  async function remove(id) {
    if (!confirm("Delete member?")) return;
    await deleteMember(id);
    await load();
  }

  return (
    <div>
      <h3>Members</h3>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h4>{editingId ? "Edit Member" : "Add Member"}</h4>
          <div><label>Name</label><input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} style={{width:"100%"}}/></div>
          <div><label>Role</label><input value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})} style={{width:"100%"}}/></div>
          <div><label>Photo URL</label><input value={form.photo_url} onChange={(e)=>setForm({...form, photo_url: e.target.value})} style={{width:"100%"}}/></div>
          <div><label>Bio</label><textarea value={form.bio} onChange={(e)=>setForm({...form, bio: e.target.value})} style={{width:"100%", minHeight: 120}}/></div>
          <div style={{marginTop:8}}><button onClick={save}>{editingId ? "Update" : "Add"}</button></div>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Existing Members</h4>
          <ul>
            {members.map(m => (
              <li key={m._id} style={{ marginBottom: 12 }}>
                <img src={m.photo_url} alt={m.name} style={{ width: 80, height: 80, objectFit: "cover" }} />
                <div><strong>{m.name}</strong> — {m.role}</div>
                <div>{m.bio}</div>
                <div>
                  <button onClick={()=>edit(m)}>Edit</button>
                  <button onClick={()=>remove(m._id)} style={{ marginLeft: 8 }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}