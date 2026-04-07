import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, ChevronRight, MapPin } from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const getFont = () => ({
    fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif'
  });

  return (
    <footer className="bg-[#111111] text-white relative overflow-hidden border-t border-white/10">
      
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F4C430]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* 1. Brand & About Section (Spans 5 columns on large screens) */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <Link to="/" className="flex items-center gap-4 mb-8 group inline-flex">
              <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-[#F4C430] to-[#ffd700] rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-[#111111] group-hover:scale-105 transition-transform duration-300">
                <img src="malviyamissionbiharlogo.png" alt="Logo" className="w-[85%] h-[85%] object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight group-hover:text-[#F4C430] transition-colors duration-300" style={getFont()}>
                  {t('header.title')}
                </h3>
              </div>
            </Link>
            <p className="text-gray-400 text-base leading-relaxed mb-8 font-light" style={getFont()}>
              {t('footer.tagline', 'Dedicated to preserving and promoting the ideals of Mahamana Pandit Madan Mohan Malaviya for the betterment of society and nation building.')}
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  className="w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#F4C430] hover:text-[#111111] hover:border-[#F4C430] transform hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  aria-label="Social Media Link"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links (Spans 3 columns) */}
          <div className="lg:col-span-3">
            <h3 className="text-[#F4C430] font-bold text-lg uppercase tracking-widest mb-8" style={getFont()}>
              {currentLanguage === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h3>
            <ul className="space-y-4">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/about', label: t('nav.about') },
                { path: '/objectives', label: t('nav.objectives') },
                { path: '/activities', label: t('nav.activities') },
                { path: '/join', label: t('nav.join') }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="group flex items-center text-gray-400 hover:text-white transition-colors text-base" 
                    style={getFont()}
                  >
                    <ChevronRight className="w-4 h-4 text-[#F4C430] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Info (Spans 4 columns) */}
          <div className="lg:col-span-4">
            <h3 className="text-[#F4C430] font-bold text-lg uppercase tracking-widest mb-8" style={getFont()}>
              {t('contact.heading', 'Contact Us')}
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group cursor-default">
                <div className="w-10 h-10 bg-[#F4C430]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#F4C430] transition-colors duration-300">
                  <MapPin className="text-[#F4C430] w-5 h-5 group-hover:text-[#111111] transition-colors duration-300" />
                </div>
                <div className="pt-2">
                  <p className="text-gray-400 text-sm leading-relaxed" style={getFont()}>
                    Mahamana Malviya Mission<br/>
                    Bihar State Unit, India
                  </p>
                </div>
              </div>

              <a href="tel:+919876543210" className="flex items-center gap-4 group hover:text-white transition-colors">
                <div className="w-10 h-10 bg-[#F4C430]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#F4C430] transition-colors duration-300">
                  <Phone className="text-[#F4C430] w-5 h-5 group-hover:text-[#111111] transition-colors duration-300" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors text-sm" style={getFont()}>+91-9876543210</span>
              </a>

              <a href="mailto:biharunit@malaviyamission.org" className="flex items-center gap-4 group hover:text-white transition-colors">
                <div className="w-10 h-10 bg-[#F4C430]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#F4C430] transition-colors duration-300">
                  <Mail className="text-[#F4C430] w-5 h-5 group-hover:text-[#111111] transition-colors duration-300" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors text-sm break-all" style={getFont()}>
                  biharunit@malaviyamission.org
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left" style={getFont()}>
            {t('footer.copyright', `© ${new Date().getFullYear()} Mahamana Malviya Mission Bihar. All rights reserved.`)}
          </p>
          
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy-policy" className="hover:text-[#F4C430] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#F4C430] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
