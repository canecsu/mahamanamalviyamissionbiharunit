import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Landmark, 
  Feather, 
  Gavel,   
  Mic2,    
  Award,   
  School,  
  Newspaper, 
  Flame,
  Globe,
  Quote
} from 'lucide-react';

const Mahamana = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const getFont = () => ({
    fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif'
  });

  return (
    <div className="min-h-screen bg-gray-50 text-[#111111] selection:bg-[#F4C430] selection:text-[#111111]">
      
      {/* Subtle Top Background Element */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none"></div>

      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* --- LEFT SIDE: Sticky Image & Quote --- */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                
                {/* Image Container with Layered Depth */}
                <div className="relative group">
                  {/* Decorative backdrop */}
                  <div className="absolute inset-0 bg-[#F4C430] rounded-[2rem] transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6 -z-10"></div>
                  
                  <div className="relative rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 bg-white">
                    <img 
                      src="/malviyaji.png" 
                      alt="Pandit Madan Mohan Malaviya" 
                      className="w-full h-auto object-cover transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-700 grayscale-[20%] group-hover:grayscale-0"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent p-8 pt-20">
                      <p className="text-[#F4C430] font-bold text-center text-xl tracking-[0.2em]">
                        1861 — 1946
                      </p>
                    </div>
                  </div>
                </div>

                {/* Refined Quote Box */}
                <div className="bg-gradient-to-br from-[#111111] to-gray-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                    <Quote className="w-32 h-32 text-[#F4C430]" />
                  </div>
                  <div className="relative z-10">
                    <Feather className="text-[#F4C430] w-8 h-8 mb-6 drop-shadow-md" />
                    <p className="text-gray-100 italic text-xl leading-relaxed font-light" style={getFont()}>
                      "{t('mahamana.quote')}"
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* --- RIGHT SIDE: All Detailed Content (Scrollable) --- */}
            <div className="lg:col-span-8 space-y-20 mt-8 lg:mt-0">
              
              {/* HEADER SECTION */}
              <div className="pb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4C430]/10 border border-[#F4C430]/20 text-[#B8860B] font-bold text-sm tracking-widest uppercase mb-6">
                  <Flame className="w-4 h-4" />
                  Visionary Founder
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#111111] mb-8 leading-tight tracking-tight" style={getFont()}>
                  {t('mahamana.heading')}
                </h1>
                <p className="text-gray-600 text-xl md:text-2xl leading-relaxed font-light mb-10" style={getFont()}>
                  {t('mahamana.intro')}
                </p>
                
                {/* Premium Badges */}
                <div className="flex flex-wrap gap-3">
                  {['Educationist', 'Freedom Fighter', 'Journalist', 'Reformer', 'Karmayogi'].map((role) => (
                    <span key={role} className="bg-white text-gray-700 px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase border border-gray-200 shadow-sm hover:border-[#F4C430] hover:text-[#111111] transition-all cursor-default">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* 1. LIFE SKETCH SECTION */}
              <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100" style={getFont()}>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                    <BookOpen className="w-7 h-7 text-[#F4C430]" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#111111]">
                    {t('mahamana.sections.life.title')}
                  </h2>
                </div>
                
                {/* Elegant Vertical Timeline */}
                <div className="relative pl-8 md:pl-0 before:absolute before:inset-0 before:left-[1.35rem] md:before:left-[15px] before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent space-y-12">
                  {[
                    { title: 'Early Life', desc: t('mahamana.sections.life.early') },
                    { title: 'Career Trajectory', desc: t('mahamana.sections.life.career') },
                    { title: 'Political Leadership', desc: t('mahamana.sections.life.politics') }
                  ].map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-8 md:-left-[15px] w-4 h-4 bg-white border-4 border-gray-200 rounded-full mt-1.5 group-hover:border-[#F4C430] transition-colors duration-300 z-10 shadow-sm"></div>
                      <div className="pl-6 md:pl-10">
                        <h4 className="font-bold text-[#111111] text-2xl mb-3 group-hover:text-[#F4C430] transition-colors">{item.title}</h4>
                        <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. VISION SECTION */}
              <div style={getFont()}>
                <div className="flex items-center gap-4 mb-10 pl-4">
                  <Flame className="w-8 h-8 text-[#F4C430]" />
                  <h2 className="text-3xl font-extrabold text-[#111111]">
                    {t('mahamana.sections.vision.title')}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#F4C430] transition-colors">
                      <Globe className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors"/>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{t('mahamana.sections.vision.synthesis')}</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#F4C430] transition-colors">
                      <School className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors"/>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{t('mahamana.sections.vision.education')}</p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-3xl border border-gray-100 md:col-span-2 shadow-sm border-l-4 border-l-[#F4C430]">
                    <p className="text-[#111111] text-xl font-medium leading-relaxed">"{t('mahamana.sections.vision.harmony')}"</p>
                  </div>
                </div>
              </div>

              {/* 3. BHU SECTION (Monumental Treatment) */}
              <div className="bg-[#111111] text-white p-10 md:p-14 rounded-[3rem] relative overflow-hidden group shadow-2xl">
                {/* Glowing orb effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4C430] opacity-10 rounded-full blur-[100px] group-hover:opacity-20 transition-opacity duration-700"></div>
                <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 transform group-hover:scale-110">
                  <Landmark className="w-80 h-80 text-[#F4C430]" />
                </div>
                
                <div className="relative z-10" style={getFont()}>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                      <Landmark className="w-8 h-8 text-[#F4C430]" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white">
                      {t('mahamana.sections.bhu.title')}
                    </h2>
                  </div>
                  
                  <div className="space-y-10">
                    <div>
                        <h5 className="text-[#F4C430] font-bold uppercase text-sm tracking-[0.2em] mb-3">The Dream</h5>
                        <p className="text-gray-300 text-lg leading-relaxed">{t('mahamana.sections.bhu.dream')}</p>
                    </div>
                    <div className="pl-6 md:pl-8 border-l-2 border-white/10">
                        <h5 className="text-[#F4C430] font-bold uppercase text-sm tracking-[0.2em] mb-3">The Great Beggar</h5>
                        <p className="text-gray-300 text-lg leading-relaxed">{t('mahamana.sections.bhu.beggar')}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-inner">
                        <p className="text-[#F4C430] text-xl italic font-light leading-relaxed">
                          "{t('mahamana.sections.bhu.realization')}"
                        </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. NATION BUILDING */}
              <div className="bg-white border border-gray-100 p-10 md:p-12 rounded-[2.5rem] shadow-sm" style={getFont()}>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-[#F4C430]/10 rounded-2xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-[#F4C430]" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#111111]">
                    {t('mahamana.sections.nation.title')}
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                   {[
                     { icon: Gavel, text: t('mahamana.sections.nation.freedom') },
                     { icon: Newspaper, text: t('mahamana.sections.nation.journalism') },
                     { icon: Mic2, text: t('mahamana.sections.nation.hindi') }
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                       <div className="bg-white p-3 rounded-xl shadow-sm flex-shrink-0">
                         <item.icon className="w-6 h-6 text-[#F4C430]" />
                       </div>
                       <span className="text-gray-700 text-lg pt-1 leading-relaxed">{item.text}</span>
                     </div>
                   ))}
                </div>

                {/* Motto Banner */}
                <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-[#F4C430] to-[#ffd700] p-8 rounded-2xl shadow-lg mt-8 transform hover:-translate-y-1 transition-transform">
                   <div className="bg-[#111111] p-3 rounded-full shadow-md flex-shrink-0">
                     <Award className="w-6 h-6 text-[#F4C430]" />
                   </div>
                   <span className="text-[#111111] font-extrabold text-2xl md:text-3xl text-center tracking-tight">
                     "{t('mahamana.sections.nation.motto')}"
                   </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mahamana;
