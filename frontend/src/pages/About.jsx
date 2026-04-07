"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Target, Shield, Sparkles, Award, CalendarDays, ChevronRight } from 'lucide-react';

const About = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const textStyle = {
    fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif'
  };

  // Helper function to safely ensure we always get an array for .map()
  const getSafeArray = (key) => {
    const data = t(key, { returnObjects: true });
    return Array.isArray(data) ? data : [];
  };

  // Safely fetching arrays
  const objectives = getSafeArray('objectives.categories');
  const futureFeatures = getSafeArray('futureInitiative.features');
  const leaderAchievements = getSafeArray('leadership.achievements');
  const events = getSafeArray('keyEvents.events');
  const annualFocusAreas = getSafeArray('keyEvents.annualPrograms.focusAreas');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 selection:bg-[#F4C430] selection:text-[#111111]">
      
      {/* 1. Hero / Introduction Section */}
      <section className="pt-32 pb-24 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F4C430]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <span className="text-[#F4C430] font-bold tracking-widest uppercase mb-4 block text-sm" style={textStyle}>
              {t('about.subheading', 'Who We Are')}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#111111] tracking-tight mb-6" style={textStyle}>
              {t('about.heading', 'Introduction of the Organization')}
            </h1>
            <div className="w-24 h-1.5 bg-[#F4C430] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#F4C430] rounded-2xl transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6 -z-10"></div>
              <div className="absolute inset-0 border-2 border-[#111111] rounded-2xl transform -translate-x-4 -translate-y-4 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2 -z-20"></div>
              <img
                src="/Madan-Mohan-Malaviya.jpg"
                alt="About Us"
                className="rounded-2xl shadow-xl w-full object-cover h-[450px] lg:h-[550px] grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="space-y-8">
              <p className="text-xl text-gray-600 leading-relaxed font-light" style={textStyle}>
                {t('about.content1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed" style={textStyle}>
                {t('about.content2')}
              </p>
              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#F4C430] shadow-sm">
                <p className="text-lg text-[#111111] leading-relaxed font-medium italic" style={textStyle}>
                  "{t('about.content3')}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Banner */}
      <section className="bg-gradient-to-br from-[#111111] to-gray-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#F4C430 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Target className="w-12 h-12 text-[#F4C430] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-8 tracking-wide uppercase text-sm" style={textStyle}>
            {t('about.missionTitle', 'Mission Statement')}
          </h2>
          <p className="text-[#F4C430] text-2xl md:text-4xl font-light max-w-5xl mx-auto leading-tight" style={textStyle}>
            "{t('about.missionText')}"
          </p>
        </div>
      </section>

      {/* 2. Objectives & Areas of Work */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-6" style={textStyle}>
              {t('objectives.heading', 'Objectives & Areas of Work')}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg" style={textStyle}>
              Committed to bringing meaningful change across key sectors of society through dedicated action and structured programs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((category, index) => (
              <div key={index} className="group bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#F4C430] transition-colors duration-300">
                  <span className="text-gray-400 font-bold text-2xl group-hover:text-[#111111] transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#111111] mb-6" style={textStyle}>
                  {category.title}
                </h3>
                <ul className="space-y-4 flex-grow">
                  {Array.isArray(category.points) && category.points.map((point, idx) => (
                    <li key={idx} className="flex items-start text-gray-600 group/item" style={textStyle}>
                      <CheckCircle2 className="w-5 h-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0 group-hover/item:text-[#F4C430] transition-colors" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Philosophy & Future Initiative */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Philosophy */}
            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#F4C430]" />
                  <h2 className="text-3xl font-extrabold text-[#111111]" style={textStyle}>
                    {t('corePhilosophy.heading', 'Our Core Philosophy')}
                  </h2>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed font-light" style={textStyle}>
                  {t('corePhilosophy.description')}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#F4C430] group-hover:w-3 transition-all"></div>
                <h3 className="text-2xl font-bold text-[#111111] mb-4 pl-4" style={textStyle}>
                  {t('commitment.heading', 'Our Commitment')}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-4" style={textStyle}>
                  {t('commitment.description')}
                </p>
              </div>
            </div>

            {/* Future Initiative */}
            <div className="bg-[#111111] text-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4C430] opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-[#F4C430]" />
                  <h2 className="text-sm uppercase tracking-widest text-[#F4C430] font-bold" style={textStyle}>
                    {t('futureInitiative.heading', 'Future Initiative')}
                  </h2>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight" style={textStyle}>
                  {t('futureInitiative.subHeading')}
                </h3>
                <p className="text-gray-400 mb-10 text-lg leading-relaxed" style={textStyle}>
                  {t('futureInitiative.description')}
                </p>
                
                <ul className="space-y-5">
                  {futureFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-4 bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-colors border border-white/5">
                      <div className="w-2 h-2 rounded-full bg-[#F4C430] flex-shrink-0 shadow-[0_0_10px_rgba(244,196,48,0.5)]"></div>
                      <span className="text-gray-200 font-medium" style={textStyle}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Leadership & Events */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Leadership Box */}
            <div className="lg:col-span-5">
              <div className="bg-gray-50 p-10 rounded-[2rem] shadow-sm sticky top-24 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <Award className="w-8 h-8 text-[#F4C430]" />
                  <h2 className="text-2xl font-extrabold text-[#111111]" style={textStyle}>
                    {t('leadership.heading', 'Visionary Leadership')}
                  </h2>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#111111] mb-3" style={textStyle}>
                    {t('leadership.leaderName')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed" style={textStyle}>
                    {t('leadership.philosophy')}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {leaderAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100">
                      <ChevronRight className="w-5 h-5 text-[#F4C430] flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium" style={textStyle}>{achievement}</span>
                    </div>
                  ))}
                </div>
                
                <blockquote className="border-l-4 border-[#111111] pl-5 py-2 text-gray-500 italic text-sm bg-white rounded-r-lg" style={textStyle}>
                  "{t('leadership.idealsPromotion')}"
                </blockquote>
              </div>
            </div>

            {/* Events Timeline/List */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <CalendarDays className="w-8 h-8 text-[#F4C430]" />
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111]" style={textStyle}>
                    {t('keyEvents.heading', 'Key Events & Programs')}
                  </h2>
                </div>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
                  {events.map((event, index) => (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#F4C430] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform"></div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                        <h3 className="text-xl font-bold text-[#111111] mb-2" style={textStyle}>
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed" style={textStyle}>
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Annual Programs Highlight */}
              <div className="bg-gradient-to-r from-[#F4C430] to-[#ffd700] p-10 rounded-[2rem] shadow-lg text-[#111111] relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                {/* Decorative background circle */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 border-4 border-[#111111]/10 rounded-full"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold mb-4" style={textStyle}>
                    {t('keyEvents.annualPrograms.title', 'Annual Lectures & Ideological Programs')}
                  </h3>
                  <p className="mb-8 font-medium text-[#111111]/80 text-lg max-w-xl" style={textStyle}>
                    {t('keyEvents.annualPrograms.description')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {annualFocusAreas.map((area, index) => (
                      <span key={index} className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm hover:bg-gray-800 transition-colors cursor-default" style={textStyle}>
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
