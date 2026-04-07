import React, { useEffect, useState } from "react";
import { getPublic } from "../lib/contentApi";

export default function Store() {
  const [items, setItems] = useState([]);
  useEffect(()=>{getPublic("store").then(setItems);},[]);
  return <section className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold mb-6">Store</h1><div className="grid md:grid-cols-3 gap-4">{items.map((p)=><article key={p.id} className="bg-white border rounded-xl p-4">{p.image_url&&<img src={p.image_url} alt={p.product_name} className="w-full h-40 object-cover rounded"/>}<h3 className="font-bold mt-2">{p.product_name}</h3><p>{p.description}</p><p className="font-semibold">₹{p.price}</p><p className="text-sm text-gray-500">Stock: {p.stock}</p></article>)}</div>{items.length===0&&<p>No products available.</p>}</section>;
}
