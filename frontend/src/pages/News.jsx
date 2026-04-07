import React, { useEffect, useState } from "react";
import { getPublic } from "../lib/contentApi";

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublic("news").then(setItems).finally(() => setLoading(false));
  }, []);

  return <section className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold mb-4">Latest News</h1>{loading ? <p>Loading...</p> : items.length ? <div className="grid md:grid-cols-2 gap-4">{items.map((n) => <article key={n.id} className="border rounded-xl p-4 bg-white"><h2 className="font-bold text-xl">{n.title}</h2><p className="text-sm text-gray-500">{n.date || "-"}</p><p className="mt-2">{n.description}</p>{n.image_url && <img alt={n.title} src={n.image_url} className="mt-3 w-full h-48 object-cover rounded" />}</article>)}</div> : <p>No news published yet.</p>}</section>;
}
