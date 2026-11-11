import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <section className="min-h-[75vh] flex flex-col items-center justify-center px-5 text-center pt-28 pb-20 bg-gray-50">
      <p className="font-black text-7xl text-[#E0B52C] mb-5">404</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-5">{t("content.notFound")}</h1>
      <Link to="/" className="bg-[#F4C430] rounded-full px-8 py-4 text-[#111111] font-bold hover:bg-yellow-400 transition-colors">{t("nav.home")}</Link>
    </section>
  );
}
