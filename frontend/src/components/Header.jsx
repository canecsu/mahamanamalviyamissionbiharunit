import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronRight, ChevronDown, User, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Import the Auth Context

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  // Extract user state and logout function from Context
  const { user, logout } = useAuth(); 

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Safely lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; 
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const currentLanguage = i18n.language || 'en';
  const getFont = () => ({
    fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif'
  });

  const toggleMobileDropdown = (label) => {
    setActiveMobileDropdown(activeMobileDropdown === label ? null : label);
  };

  const navLinks = [
    {
      label: currentLanguage === 'hi' ? 'हमारे बारे में' : 'About Us',
      dropdown: true,
      items: [
        { path: '/about', label: t('nav.about') },
        { path: '/mahamana', label: t('nav.mahamana') },
        { path: '/objectives', label: t('nav.objectives') }
      ]
    },
    { path: '/activities', label: t('nav.activities') },
    {
      label: currentLanguage === 'hi' ? 'मीडिया' : 'Media',
      dropdown: true,
      items: [
        { path: '/news', label: 'News' },
        { path: '/events', label: 'Events' },
        { path: '/blog', label: 'Blog' },
        { path: '/video-tour', label: 'Video Tour' },
        { path: '/gallery', label: t('nav.gallery') }
      ]
    },
    { path: '/store', label: 'Store' },
    { path: '/contact', label: t('nav.contact') }
  ];

  return (
    <>
      <header 
        className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#111111]/95 backdrop-blur-md shadow-2xl py-1.5 border-b border-white/5' 
            : 'bg-[#111111] py-3 md:py-4'
        }`}
      >
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-between gap-1">
            
            {/* --- LEFT: Logo & Brand --- */}
            <Link to="/" className="flex items-center gap-2 group z-50 shrink-0" onClick={() => setMobileMenuOpen(false)}>
              <div className={`shrink-0 bg-gradient-to-br from-[#F4C430] to-[#ffd700] rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-[#111111] group-hover:scale-105 transition-transform duration-300 ${scrolled ? 'w-9 h-9 md:w-11 md:h-11' : 'w-11 h-11 md:w-14 md:h-14'}`}>
                <img src="malviyamissionbiharlogo.png" alt="Logo" className="w-[85%] h-[85%] object-contain" />
              </div>
              <div className="hidden sm:block min-w-max">
                <h1 
                  className={`text-white font-extrabold tracking-tight transition-all duration-300 group-hover:text-[#F4C430] leading-none whitespace-nowrap ${scrolled ? 'text-sm md:text-lg' : 'text-base md:text-xl'}`} 
                  style={getFont()}
                >
                  {t('header.title')}
                </h1>
              </div>
            </Link>

            {/* --- CENTER: Desktop Navigation --- */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {navLinks.map((link) => {
                if (link.dropdown) {
                  const isAnyChildActive = link.items.some(item => location.pathname === item.path);
                  return (
                    <div className="relative group" key={link.label}>
                      <button 
                        className={`flex items-center gap-1 relative whitespace-nowrap px-2.5 xl:px-3.5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                          isAnyChildActive ? 'text-[#F4C430]' : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        style={getFont()}
                      >
                        {link.label}
                        <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-2 overflow-hidden backdrop-blur-xl">
                          {link.items.map(subItem => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <Link 
                                key={subItem.path} 
                                to={subItem.path} 
                                className={`block px-4 py-2.5 mb-1 last:mb-0 rounded-lg text-sm font-semibold transition-all ${
                                  isSubActive ? 'bg-[#F4C430] text-[#111111]' : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative whitespace-nowrap px-2.5 xl:px-3.5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                      isActive ? 'text-[#111111] bg-[#F4C430] shadow-[0_0_15px_rgba(244,196,48,0.3)]' : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    style={getFont()}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* --- RIGHT: Actions --- */}
            <div className="flex items-center gap-1.5 md:gap-2 z-50 shrink-0">
              
              {/* Language Switcher */}
              <div className="flex items-center p-0.5 bg-black/40 border border-white/10 rounded-full shadow-inner">
                <button
                  onClick={() => changeLanguage('hi')}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                    currentLanguage === 'hi' ? 'bg-[#F4C430] text-[#111111] shadow-md' : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                    currentLanguage === 'en' ? 'bg-[#F4C430] text-[#111111] shadow-md' : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  ENG
                </button>
              </div>

              {/* Authentication Section (Desktop Only) */}
              <div className="hidden lg:flex items-center ml-2 border-l border-white/10 pl-2">
                {user ? (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 pl-4 pr-1.5 py-1.5 rounded-full">
                    <span className="text-gray-300 text-sm font-medium">Hi, {user.name.split(' ')[0]}</span>
                    
                    {/* Admin Dashboard Link */}
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-1 text-[#F4C430] hover:text-white text-xs font-bold transition-colors uppercase tracking-wider bg-[#F4C430]/10 px-2 py-1 rounded-md">
                        <ShieldAlert className="w-3 h-3" /> Admin
                      </Link>
                    )}
                    
                    <button 
                      onClick={logout} 
                      className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 p-1.5 rounded-full transition-colors" 
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-1.5 text-gray-300 hover:text-[#F4C430] px-3 py-2 text-sm font-bold transition-all"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                )}
              </div>

              {/* Prominent "Join Us" Button (Desktop Only) */}
              <Link
                to="/donation"
                className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-[#F4C430] to-[#ffd700] text-[#111111] px-4 xl:px-5 py-2 rounded-full font-extrabold text-sm hover:shadow-[0_0_20px_rgba(244,196,48,0.4)] transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap ml-1"
                style={getFont()}
              >
                {t('nav.donation')}
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                className="lg:hidden text-[#F4C430] p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE NAVIGATION OVERLAY --- */}
        <div 
          className={`lg:hidden fixed inset-0 top-[65px] md:top-[73px] bg-[#111111]/98 backdrop-blur-xl border-t border-white/10 transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-6 pb-24 overflow-y-auto">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                
                // If it's a Dropdown on Mobile (Accordion logic)
                if (link.dropdown) {
                  const isExpanded = activeMobileDropdown === link.label;
                  return (
                    <div key={link.label} className="flex flex-col gap-1">
                      <button
                        className="flex items-center justify-between p-4 rounded-xl font-bold text-lg transition-all text-white border border-white/5 hover:bg-white/10"
                        onClick={() => toggleMobileDropdown(link.label)}
                        style={getFont()}
                      >
                        {link.label}
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? '-rotate-180 text-[#F4C430]' : 'text-gray-400'}`} />
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col gap-2 pl-4 border-l-2 border-white/10 ml-4 py-2">
                          {link.items.map((subItem) => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`p-2 rounded-lg font-semibold text-base transition-all ${
                                  isSubActive ? 'text-[#F4C430]' : 'text-gray-400 hover:text-white hover:translate-x-1'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Standard Mobile Link
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between p-4 rounded-xl font-bold text-lg transition-all ${
                      isActive ? 'bg-[#F4C430] text-[#111111]' : 'text-white border border-white/5 hover:bg-white/10'
                    }`}
                    style={getFont()}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                    {isActive && <ChevronRight className="w-5 h-5" />}
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile Auth & CTA Section */}
            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
              
              {/* Mobile Auth Profile */}
              {user ? (
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center text-[#111111] font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold leading-tight">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[#F4C430] text-xs font-bold uppercase tracking-wide bg-[#F4C430]/10 px-2 py-1 rounded">
                        Admin
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 p-3 rounded-lg font-bold transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-2 w-full bg-white/10 text-white border border-white/20 p-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" /> Login / Register
                </Link>
              )}

              <Link
                to="/donation"
                className="flex items-center justify-center gap-2 w-full bg-[#F4C430] text-[#111111] p-4 rounded-xl font-extrabold text-lg"
                style={getFont()}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.join')}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* --- INVISIBLE SPACER --- */}
      <div className="h-[68px] md:h-[88px] w-full shrink-0"></div>
    </>
  );
};

export default Header;
