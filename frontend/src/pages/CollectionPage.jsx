import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import usePublicCollection from "../hooks/usePublicCollection";

const pageTitles = {
  activities: "activities", news: "news", events: "events",
  blogs: "blogs", videos: "videos", store: "store"
};

function ExternalLink({ url, children }) {
  if (!/^https?:\/\//i.test(url || "")) return null;
  return <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#9A6B00] hover:underline">{children}</a>;
}

export default function CollectionPage({ type }) {
  const { t, i18n } = useTranslation();
  const { items, loading, error } = usePublicCollection(type);
  const years = useMemo(() => type === "events" ? [...new Set(items.map((item) => item.year))].sort((a, b) => Number(b) - Number(a)) : [], [items, type]);
  const heading = t(`content.${pageTitles[type] || type}`, type);
  const emptyText = t("content.empty", "No published content is available yet.");
  const hindi = i18n.language?.startsWith("hi");

  const cards = (rows) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow">
          {(item.image_url || (type === "events" && item.images?.[0]) || (type === "videos" && item.thumbnail_url)) && (
            <img loading="lazy" src={item.image_url || item.images?.[0] || item.thumbnail_url} alt={item.title || item.product_name || ""} className="w-full h-48 object-cover" />
          )}
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#111111] mb-2">{item.title || item.product_name}</h2>
            {(item.date || item.year || item.category || item.author) && (
              <p className="text-sm text-gray-500 mb-3">{[item.date || item.year, item.category || item.author].filter(Boolean).join(" • ")}</p>
            )}
            {(item.description || (type === "blogs" && item.content)) && <p className="text-gray-600 leading-relaxed whitespace-pre-line line-clamp-4">{item.description || item.content}</p>}
            {type === "activities" && Array.isArray(item.gallery) && item.gallery.length > 0 && (
              <p className="text-sm text-gray-500 mt-3">{item.gallery.length} {t("content.photos", "photos")}</p>
            )}
            {type === "store" && (
              <p className="mt-4 font-semibold text-lg">₹{Number(item.price || 0).toLocaleString("en-IN")}</p>
            )}
            {type === "events" && item.slug && <Link to={`/events/${item.slug}`} className="mt-4 inline-block font-semibold text-[#9A6B00] hover:underline">{t("content.openEvent", "View event")}</Link>}
            {type === "blogs" && item.slug && <Link to={`/blog/${item.slug}`} className="mt-4 inline-block font-semibold text-[#9A6B00] hover:underline">{t("content.readMore", "Read more")}</Link>}
            {type === "videos" && <div className="mt-4"><ExternalLink url={item.video_url}>{t("content.watchVideo", "Watch video")}</ExternalLink></div>}
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <section className="container mx-auto max-w-7xl px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-[#111111]">{heading}</h1>
        <div className="w-24 h-1 bg-[#F4C430] mx-auto mt-5 mb-12" />
        {loading ? <p role="status" className="text-center text-gray-600">{t("content.loading", "Loading…")}</p> :
          error ? <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h2 className="font-bold text-lg">{t("content.error", "Unable to load content right now.")}</h2>
            <p className="text-sm text-gray-600 mt-2">{t("content.tryAgain", "Please try again later.")}</p>
          </div> :
          items.length === 0 ? <p className="text-center text-gray-600">{emptyText}</p> :
          type === "events" ? years.map((year) => (
            <section key={year} className="mb-12"><h2 className="text-2xl font-bold mb-5">{year}</h2>{cards(items.filter((item) => item.year === year))}</section>
          )) : cards(items)}
        {hindi && type === "store" && <p className="text-sm text-gray-500 mt-8 text-center">{t("content.storeNotice", "For product details, please contact the mission.")}</p>}
      </section>
    </div>
  );
}
