import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublic } from "../lib/contentApi";

export default function Blog() {
  const [items, setItems] = useState([]);
  useEffect(() => { getPublic("blogs").then(setItems); }, []);
  return <section className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold mb-4">Blog</h1><div className="grid md:grid-cols-3 gap-4">{items.map((b) => <article key={b.id} className="border bg-white rounded-xl overflow-hidden">{b.image_url && <img src={b.image_url} alt={b.title} className="w-full h-44 object-cover" />}<div className="p-4"><h2 className="font-bold">{b.title}</h2><p className="text-sm text-gray-500">{b.date || ""} {b.author ? `• ${b.author}` : ""}</p><p className="line-clamp-3 mt-2">{b.content}</p><Link className="inline-block mt-3 text-blue-600" to={`/blog/${b.slug}`}>Read more</Link></div></article>)}</div>{items.length===0&&<p>No blog posts available.</p>}</section>;
}
