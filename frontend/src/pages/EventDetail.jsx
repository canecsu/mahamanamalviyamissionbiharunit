import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPublic } from "../lib/contentApi";

export default function EventDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [state, setState] = useState({ event: null, loading: true, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ event: null, loading: true, error: "" });
    getPublic("events", { signal: controller.signal })
      .then((items) => {
        if (!Array.isArray(items)) throw new Error("INVALID_RESPONSE");
        const event = items.find((row) => row.slug === slug);
        setState({ event: event || null, loading: false, error: event ? "" : "NOT_FOUND" });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setState({ event: null, loading: false, error: err.message });
      });
    return () => controller.abort();
  }, [slug]);

  if (state.loading) return <section role="status" className="container mx-auto px-4 pt-32 pb-16">{t("content.loading")}</section>;
  if (state.error) return <section role="alert" className="container mx-auto px-4 pt-32 pb-16">
    <h1 className="text-2xl font-bold">{state.error === "NOT_FOUND" ? t("content.notFound") : t("content.error")}</h1>
    <Link to="/events" className="text-[#9A6B00] inline-block mt-4 hover:underline">{t("content.backToEvents")}</Link>
  </section>;
  const event = state.event;
  return <section className="container mx-auto max-w-6xl px-4 pt-32 pb-16">
    <Link to="/events" className="text-[#9A6B00] hover:underline">{t("content.backToEvents")}</Link>
    <h1 className="text-3xl md:text-5xl font-bold mt-5">{event.title} ({event.year})</h1>
    <p className="my-5 text-gray-700 whitespace-pre-line">{event.description}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {(Array.isArray(event.images) ? event.images : []).map((url, i) => (
        <img key={i} src={url} alt={`${event.title} – ${i + 1}`} loading="lazy" className="rounded-xl w-full h-56 object-cover" />
      ))}
    </div>
    <div className="mt-6 space-y-3">
      {(Array.isArray(event.video_links) ? event.video_links : [])
        .filter((url) => /^https?:\/\//i.test(url))
        .map((url, i) => <a className="block text-[#9A6B00] hover:underline" key={i} href={url} target="_blank" rel="noopener noreferrer">{t("content.watchVideo")} {i + 1}</a>)}
    </div>
  </section>;
}
