import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Newspaper, UserCircle2, BookOpen, HeartHandshake, Globe2, QrCode, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Font styling helper
  const getFontStyle = (delay = '') => ({
    fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif',
    ...(delay && { animationDelay: delay })
  });

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-[#F4C430] selection:text-[#111111]">
      
      {/* Self-contained CSS for the perfect seamless Marquee Ticker and custom masking. */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker 30s linear infinite; 
        }
        .ticker-wrapper:hover .animate-ticker {
          animation-play-state: paused;
        }
        .fade-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1671512226295-67a722ce5b6b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxCYW5hcmFzJTIwdW5pdmVyc2l0eXxlbnwwfHx8fDE3NzE0MTE0Mzd8MA&ixlib=rb-4.1.0&q=85"
            alt="Hero Background"
            className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/80 via-[#111111]/60 to-[#111111]/90 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-fade-in-up leading-tight drop-shadow-lg" style={getFontStyle('0.1s')}>
            {t('hero.welcome')}
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 animate-fade-in-up leading-tight drop-shadow-lg" style={getFontStyle('0.1s')}>
            {t('hero.ready')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/join"
              className="group inline-flex items-center gap-3 bg-[#F4C430] text-[#111111] px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(244,196,48,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
              style={getFontStyle()}
            >
              {t('hero.joinBtn')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SEAMLESS NEWS TICKER SECTION */}
      <section className="bg-white border-b border-gray-200 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#111111] px-5 py-2 rounded-full shadow-md z-10 shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#F4C430] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Newspaper className="text-[#F4C430] group-hover:text-[#111111] w-4 h-4 relative z-10 transition-colors" />
              <span className="text-white group-hover:text-[#111111] font-bold text-xs uppercase tracking-wider relative z-10 transition-colors" style={getFontStyle()}>
                {t('hero.newsLabel', 'Latest Updates')}
              </span>
            </div>
            
            <div className="flex-1 overflow-hidden fade-edges ticker-wrapper cursor-default">
              <div className="animate-ticker text-gray-800 font-medium text-sm md:text-base" style={getFontStyle()}>
                <div className="flex items-center gap-8 pr-8">
                  <span>✨ {t('hero.newsText', 'Welcome to Mahamana Malviya Mission Bihar. Join us in our upcoming events and social initiatives.')}</span>
                  <span className="text-gray-300">•</span>
                  <span>📅 Upcoming Event: Annual Gathering 2026 - Registrations now open!</span>
                  <span className="text-gray-300">•</span>
                  <span>🤝 Volunteer training camp scheduled for next month.</span>
                  <span className="text-gray-300">•</span>
                </div>
                <div className="flex items-center gap-8 pr-8" aria-hidden="true">
                  <span>✨ {t('hero.newsText', 'Welcome to Mahamana Malviya Mission Bihar. Join us in our upcoming events and social initiatives.')}</span>
                  <span className="text-gray-300">•</span>
                  <span>📅 Upcoming Event: Annual Gathering 2026 - Registrations now open!</span>
                  <span className="text-gray-300">•</span>
                  <span>🤝 Volunteer training camp scheduled for next month.</span>
                  <span className="text-gray-300">•</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPACT & PROFESSIONAL MALVIYA JI INSPIRATION SECTION */}
      <section className="py-16 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#111111] to-gray-900 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10 md:gap-14">
            
            {/* Subtle Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4C430]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            
            {/* Image Box */}
            <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 relative group mx-auto md:mx-0">
              <div className="absolute inset-0 bg-[#F4C430] rounded-full transform translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500 opacity-60"></div>
              <img 
                src="/Madan-Mohan-Malaviya.jpg" 
                alt="Mahamana Madan Mohan Malaviya" 
                className="relative w-full h-full object-cover rounded-full border-4 border-[#111111] shadow-lg z-10 grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
                onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/4/4b/Madan_Mohan_Malaviya.jpg"; }}
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="inline-flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#F4C430]"></div>
                <span className="text-[#F4C430] font-bold uppercase tracking-widest text-xs" style={getFontStyle()}>Our Inspiration</span>
                <div className="w-8 h-[2px] bg-[#F4C430] md:hidden"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5 leading-tight" style={getFontStyle()}>
                Mahamana Pandit <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C430] to-yellow-200">Madan Mohan Malaviya</span>
              </h2>
              
              <blockquote className="text-lg md:text-xl text-gray-300 italic mb-5 leading-relaxed relative" style={getFontStyle()}>
                <span className="absolute -left-4 -top-2 text-4xl text-[#F4C430]/20 font-serif hidden md:block">"</span>
                {t('malviya.quote', 'A truly educated person is one who is guided by the light of knowledge and driven by a heart full of compassion.')}
              </blockquote>
              
              <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light max-w-2xl" style={getFontStyle()}>
                {t('malviya.description', "Visionary founder of Banaras Hindu University and a towering figure in India's independence. His lifelong dedication to education, cultural revival, and social harmony continues to guide our mission towards a brighter, united future.")}
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* PROFESSIONAL QUICK ABOUT SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F4C430]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#111111]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Image Composition */}
            <div className="relative group mx-auto lg:mx-0 w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#F4C430] to-yellow-100 rounded-[2.5rem] transform -rotate-3 group-hover:rotate-0 transition-transform duration-500 opacity-60"></div>
              
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white z-10 aspect-[4/4] lg:aspect-[4/3] bg-gray-100">
                <img
                  src="/lanka_e8105f8365.jpg"
                  alt="About"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#111111]/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              <div className="absolute -bottom-8 -right-8 lg:-right-12 bg-white p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-20 border border-gray-50 flex items-center gap-4 transform group-hover:-translate-y-2 transition-transform duration-500 hidden sm:flex">
                <div className="w-14 h-14 bg-[#111111] rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-[#F4C430]" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[#111111]">10k+</p>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Lives Impacted</p>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:pl-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[3px] bg-[#F4C430] rounded-full"></div>
                <span className="text-[#111111] font-bold uppercase tracking-[0.2em] text-sm" style={getFontStyle()}>Our Mission</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111111] mb-8 leading-[1.15]" style={getFontStyle()}>
                {t('homeAbout.title') || "Empowering Communities Through Vision"}
              </h2>
              
              <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed font-light" style={getFontStyle()}>
                {t('homeAbout.description') || "We are dedicated to upholding the values and principles of Mahamana Malviya ji. Our mission is to foster education, social harmony, and sustainable development across Bihar, creating a future rooted in cultural pride and modern progress."}
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-[#F4C430]/20 p-1.5 rounded-md"><Globe2 className="w-4 h-4 text-[#111111]" /></div>
                  <span className="text-gray-800 font-medium">Statewide Reach</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-[#F4C430]/20 p-1.5 rounded-md"><BookOpen className="w-4 h-4 text-[#111111]" /></div>
                  <span className="text-gray-800 font-medium">Education First</span>
                </div>
              </div>
              
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-3 bg-transparent border-2 border-[#111111] text-[#111111] px-8 py-3.5 rounded-full font-bold text-lg hover:bg-[#111111] hover:text-white transition-all duration-300"
                style={getFontStyle()}
              >
                {t('hero.learnMoreBtn')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Initiatives Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111111] mb-6" style={getFontStyle()}>
              {t('initiatives.title')}
            </h2>
            <div className="w-24 h-1 bg-[#F4C430] mx-auto rounded-full mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: t('initiatives.cards.0.heading'), desc: t('initiatives.cards.0.text') },
              { icon: HeartHandshake, title: t('initiatives.cards.1.heading'), desc: t('initiatives.cards.1.text') },
              { icon: Globe2, title: t('initiatives.cards.2.heading'), desc: t('initiatives.cards.2.text') }
            ].map((card, idx) => (
              <div key={idx} className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-[#F4C430]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#F4C430] group-hover:rotate-6 transition-all duration-300">
                  <card.icon className="w-8 h-8 text-[#F4C430] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#111111]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed" style={getFontStyle()}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#F4C430 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:divide-x divide-gray-800/50">
            {[
              { number: '5+', label: currentLanguage === 'hi' ? 'वर्षों की संगठन' : 'Years of Organization' },
              { number: '500+', label: currentLanguage === 'hi' ? 'सदस्य' : 'Members' },
              { number: '50+', label: currentLanguage === 'hi' ? 'कार्यक्रम' : 'Programs' },
              { number: '10000+', label: currentLanguage === 'hi' ? 'लाभार्थी' : 'Beneficiaries' }
            ].map((stat, index) => (
              <div key={index} className="text-center group px-4">
                <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#F4C430] to-yellow-600 mb-4 transform group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {stat.number}
                </div>
                <div className="text-gray-400 font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors" style={getFontStyle()}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-gray-50 rounded-[2.5rem] p-4 md:p-10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-2/5 flex-shrink-0 relative group">
                <div className="absolute inset-0 bg-[#F4C430] rounded-[2rem] transform translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
                <img
                  src="bipin.jpeg"
                  alt="Director"
                  className="relative w-full aspect-[4/5] object-cover rounded-[2rem] shadow-xl z-10 grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="w-full lg:w-3/5 p-4 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <UserCircle2 className="w-6 h-6 text-[#F4C430]" />
                  <span className="text-[#F4C430] font-bold text-sm uppercase tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {t('leadership.heading', 'Leadership')}
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-8" style={getFontStyle()}>
                  {t('leadership.leaderName')}
                </h3>
                <p className="text-4xl md:text-xl font-extrabold text-[#111111] mb-8" style={getFontStyle()}>
                  {t('leadership.post')}
                </p>
                <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-10 leading-relaxed border-l-4 border-[#F4C430] pl-6 md:pl-8 py-2 relative" style={getFontStyle()}>
                  <span className="absolute -top-4 -left-2 text-6xl text-[#F4C430]/20 font-serif">"</span>
                  {t('leadership.philosophy')}
                </blockquote>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 bg-[#111111] text-white px-8 py-4 rounded-full font-bold hover:bg-[#F4C430] hover:text-[#111111] transition-all duration-300 shadow-xl hover:shadow-2xl"
                  style={getFontStyle()}
                >
                  {t('hero.learnMoreBtn')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-[#111111] rounded-3xl shadow-2xl overflow-hidden relative">
            {/* Decorative mesh gradient */}
            <div className="absolute top-0 right-0 w-full h-full opacity-30" style={{ background: 'radial-gradient(circle at 100% 0%, #F4C430 0%, transparent 50%)' }}></div>
            
            <div className="flex flex-col md:flex-row items-center p-8 md:p-16 gap-12 relative z-10">
              <div className="w-full md:w-3/5">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight" style={getFontStyle()}>
                  Support <span className="text-[#F4C430]">Mahamana Malviya Mission</span> Bihar
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed" style={getFontStyle()}>
                  {t('donation.description') || 'Your generous contributions help us sustain our programs and reach more people in need. Scan the QR code to make a secure donation.'}
                </p>
                <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
                  <div className="p-3 bg-[#F4C430] rounded-lg">
                    <QrCode className="w-6 h-6 text-[#111111]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Official UPI ID</p>
                    <p className="font-mono font-bold text-white text-lg tracking-wide">
                      7209329329m@pnb
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/5 flex justify-center">
                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl transform hover:-translate-y-2 transition-transform duration-300">
                  <img
                    src="qr.jpeg"
                    alt="Donation QR Code"
                    className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-xl"
                  />
                  <div className="mt-6 text-center">
                    <p className="text-[#111111] font-extrabold uppercase tracking-widest text-sm" style={getFontStyle()}>
                      {t('donation.scanToDonate') || 'Scan to Donate'}
                    </p>
                    <p className="text-gray-500 font-medium text-xs mt-2">Accepts all UPI apps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#F4C430] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-white/20 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[20px] border-black/5 rounded-full"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#111111] mb-6" style={getFontStyle()}>
            {t('cta.heading')}
          </h2>
          <p className="text-[#111111]/80 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium" style={getFontStyle()}>
            {t('cta.subtext')}
          </p>
          <Link
            to="/join"
            className="group inline-flex items-center gap-3 bg-[#111111] text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-900 transform hover:scale-105 transition-all shadow-[0_10px_30px_rgba(17,17,17,0.3)]"
            style={getFontStyle()}
          >
            {t('cta.volunteerBtn')}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
