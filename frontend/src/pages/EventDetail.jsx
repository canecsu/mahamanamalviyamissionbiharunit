import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublic } from "../lib/contentApi";

export default function EventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  useEffect(() => { getPublic("events").then((rows)=>setEvent(rows.find((r)=>r.slug===slug))); }, [slug]);
  if (!event) return <section className="container mx-auto px-4 py-12">Loading event...</section>;
  return <section className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold">{event.title} ({event.year})</h1><p className="my-3">{event.description}</p><div className="grid md:grid-cols-3 gap-3">{(event.images||[]).map((img,idx)=><img key={idx} src={img} alt={`${event.title}-${idx}`} className="rounded-xl h-48 w-full object-cover"/>)}</div><div className="mt-4 space-y-2">{(event.video_links||[]).map((v,idx)=><a key={idx} className="block text-blue-600" href={v} target="_blank" rel="noreferrer">Video {idx+1}</a>)}</div></section>;
}
