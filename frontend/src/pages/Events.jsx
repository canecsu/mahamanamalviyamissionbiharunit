import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPublic } from "../lib/contentApi";

export default function Events() {
  const [events, setEvents] = useState([]);
  useEffect(() => { getPublic("events").then(setEvents); }, []);
  const grouped = useMemo(() => events.reduce((acc, e) => { (acc[e.year] ||= []).push(e); return acc; }, {}), [events]);
  const years = Object.keys(grouped).sort((a,b)=>Number(b)-Number(a));
  return <section className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold mb-6">Year-wise Events</h1>{years.map((y)=><div key={y} className="mb-8"><h2 className="text-2xl font-semibold mb-3">{y}</h2><div className="grid md:grid-cols-2 gap-4">{grouped[y].map((e)=><article className="border rounded-xl p-4 bg-white" key={e.id}><h3 className="font-bold text-xl">{e.title}</h3><p>{e.description}</p><Link className="text-blue-600" to={`/events/${e.slug}`}>Open event</Link></article>)}</div></div>)}{!years.length&&<p>No events available.</p>}</section>;
}
