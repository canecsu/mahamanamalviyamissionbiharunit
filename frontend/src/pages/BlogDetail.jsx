import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlog } from "../lib/contentApi";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getBlog(slug).then(setBlog).catch((e)=>setError(e.message)); }, [slug]);
  if (error) return <section className="container mx-auto px-4 py-12">{error}</section>;
  if (!blog) return <section className="container mx-auto px-4 py-12">Loading...</section>;
  return <section className="container mx-auto px-4 py-12 max-w-3xl"><h1 className="text-4xl font-bold">{blog.title}</h1><p className="text-gray-500 my-2">{blog.date || ""} {blog.author ? `• ${blog.author}` : ""}</p>{blog.image_url&&<img src={blog.image_url} alt={blog.title} className="w-full max-h-96 object-cover rounded-xl my-4"/>}<article className="whitespace-pre-wrap">{blog.content}</article></section>;
}
