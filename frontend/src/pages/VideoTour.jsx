import React, { useEffect, useState } from "react";
import { getPublic } from "../lib/contentApi";

export default function VideoTour() {
  const [videos, setVideos] = useState([]);
  useEffect(()=>{getPublic("videos").then(setVideos);},[]);
  return <section className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold mb-6">Video Tour</h1><div className="grid md:grid-cols-2 gap-4">{videos.map((v)=><article key={v.id} className="bg-white border rounded-xl p-4"><h3 className="font-bold">{v.title}</h3><p className="text-sm text-gray-500">{v.event_year || ""}</p><a className="text-blue-600" href={v.video_url} target="_blank" rel="noreferrer">Watch video</a></article>)}</div>{videos.length===0&&<p>No videos published yet.</p>}</section>;
}
