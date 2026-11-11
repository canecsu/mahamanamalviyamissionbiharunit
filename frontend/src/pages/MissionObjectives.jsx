import React from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Users, HeartHandshake, Leaf, Shield, Waves, Landmark } from "lucide-react";

const areaIcons = [Shield, Landmark, Waves, HeartHandshake, Leaf];

export default function MissionObjectives() {
  const { t } = useTranslation();
  const categories = t("objectives.categories", { returnObjects: true });
  const area = t("areasOfWork", { returnObjects: true });
  const areas = [
    ["character", "characterDesc"], ["culture", "cultureDesc"],
    ["ganga", "gangaDesc"], ["social", "socialDesc"], ["cow", "cowDesc"]
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <BookOpen className="w-11 h-11 text-[#A77D00] mx-auto mb-4" aria-hidden />
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#111111]">{t("objectives.heading")}</h1>
          <div className="w-24 h-1 bg-[#F4C430] mx-auto mt-5" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 mb-16">
          {(Array.isArray(categories) ? categories : []).map((category, i) => (
            <article key={i} className="bg-white rounded-2xl p-6 md:p-9 border border-gray-100 shadow-sm">
              <div className="flex gap-3 items-center mb-5">
                {i === 0 ? <BookOpen className="text-[#A77D00] w-7 h-7" /> : <Users className="text-[#A77D00] w-7 h-7" />}
                <h2 className="text-xl md:text-2xl font-bold">{category.title}</h2>
              </div>
              <ul className="space-y-3 list-disc pl-6 marker:text-[#D5A600] text-gray-700 leading-relaxed">
                {(Array.isArray(category.points) ? category.points : []).map((point, j) => <li key={j}>{point}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{area.heading || t("areasOfWork.heading")}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map(([titleKey, descriptionKey], index) => {
            const Icon = areaIcons[index];
            return <article key={titleKey} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <Icon className="w-8 h-8 text-[#A77D00] mb-4" aria-hidden />
              <h3 className="font-bold text-lg mb-2">{area[titleKey]}</h3>
              <p className="text-gray-600 leading-relaxed">{area[descriptionKey]}</p>
            </article>;
          })}
        </div>
      </div>
    </div>
  );
}
