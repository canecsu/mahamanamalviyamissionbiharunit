import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeartHandshake, Mail, Phone, ShieldCheck } from "lucide-react";

export default function Donation() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <section className="container mx-auto max-w-5xl px-4">
        <div className="rounded-[2rem] overflow-hidden shadow-xl bg-white border border-gray-100">
          <div className="bg-[#111111] text-white p-8 md:p-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F4C430] text-[#111111] flex items-center justify-center mb-5">
              <HeartHandshake className="w-9 h-9" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">{t("donation.heading")}</h1>
            <div className="mx-auto mt-5 w-24 h-1 bg-[#F4C430]" />
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg mt-6">{t("donation.description")}</p>
          </div>
          <div className="p-8 md:p-12 space-y-7">
            <p className="text-lg leading-relaxed text-gray-700">{t("donation.instructions")}</p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0" />
              <p className="text-gray-800">{t("donation.safetyNote")}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="mailto:mmmbiharunit@gmail.com?subject=Donation%20Enquiry%20-%20Mahamana%20Malaviya%20Mission" className="rounded-xl bg-[#F4C430] hover:bg-yellow-400 text-[#111111] p-5 font-bold flex items-center gap-3 transition-colors">
                <Mail className="w-6 h-6" />{t("donation.emailUs")}
              </a>
              <a href="tel:+917992362557" className="rounded-xl border-2 border-[#111111] hover:bg-gray-100 text-[#111111] p-5 font-bold flex items-center gap-3 transition-colors">
                <Phone className="w-6 h-6" />+91 79923 62557
              </a>
            </div>
            <div className="text-center">
              <Link to="/contact" className="text-[#9A6B00] font-semibold hover:underline">{t("donation.contactPage")}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
