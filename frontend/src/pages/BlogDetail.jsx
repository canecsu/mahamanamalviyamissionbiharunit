import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBlog } from "../lib/contentApi";

export default function BlogDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [state, setState] = useState({ blog: null, loading: true, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ blog: null, loading: true, error: "" });
    getBlog(slug, { signal: controller.signal })
      .then((blog) => setState({ blog, loading: false, error: "" }))
      .catch((err) => {
        if (err.name !== "AbortError") setState({ blog: null, loading: false, error: err.message });
      });
    return () => controller.abort();
  }, [slug]);

  if (state.loading) return <section role="status" className="container mx-auto px-4 pt-32 pb-16">{t("content.loading")}</section>;
  if (state.error) return <section role="alert" className="container mx-auto px-4 pt-32 pb-16">
    <h1 className="text-2xl font-bold">{state.error === "NOT_FOUND" ? t("content.notFound") : t("content.error")}</h1>
    <Link to="/blog" className="text-[#9A6B00] inline-block mt-4 hover:underline">{t("content.backToBlogs")}</Link>
  </section>;
  const blog = state.blog;
  return <section className="container mx-auto max-w-4xl px-4 pt-32 pb-16">
    <Link to="/blog" className="text-[#9A6B00] hover:underline">{t("content.backToBlogs")}</Link>
    <h1 className="text-3xl md:text-5xl font-bold mt-5">{blog.title}</h1>
    <p className="text-gray-500 my-4">{[blog.date, blog.author].filter(Boolean).join(" • ")}</p>
    {blog.image_url && <img src={blog.image_url} alt={blog.title} className="w-full max-h-[480px] object-cover rounded-2xl mb-6" />}
    <article className="whitespace-pre-wrap leading-relaxed text-gray-800">{blog.content}</article>
  </section>;
}
