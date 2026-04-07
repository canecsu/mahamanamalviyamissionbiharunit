import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ZoomIn, Camera, X, ArrowLeft, Calendar, 
  Images, ChevronLeft, ChevronRight, Loader2, AlertCircle 
} from 'lucide-react';

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  // Base API URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // State for Data
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Navigation and Modals
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Helper for font consistency
  const getFont = () => ({
    fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif'
  });

  // Fetch Events from Backend and format them as Albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch gallery albums.');
        }
        const data = await response.json();
        
        // Filter out events that don't have any images, then format them
        const formattedAlbums = data
          .filter(event => event.images && event.images.length > 0)
          .map(event => ({
            id: event.id,
            year: event.year,
            title: event.title,
            coverImage: event.images[0], // Use first image as cover
            images: event.images.map((imgUrl, idx) => ({
              url: imgUrl,
              // Since the backend 'images' is just a list of strings, we generate a title
              title: `${event.title} - ${idx + 1}` 
            }))
          }));

        setAlbums(formattedAlbums);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [API_BASE_URL]);

  // Prevent scrolling on the body when the modal is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxIndex]);

  // Navigate to Previous Image
  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    if (selectedAlbum && lightboxIndex !== null) {
      setLightboxIndex((prevIndex) => 
        prevIndex === 0 ? selectedAlbum.images.length - 1 : prevIndex - 1
      );
    }
  }, [selectedAlbum, lightboxIndex]);

  // Navigate to Next Image
  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    if (selectedAlbum && lightboxIndex !== null) {
      setLightboxIndex((prevIndex) => 
        prevIndex === selectedAlbum.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  }, [selectedAlbum, lightboxIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-[#F4C430] selection:text-[#111111]">
      
      {/* Hero Header Section */}
      <section className="pt-24 pb-12 relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4C430]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[#F4C430] font-bold tracking-widest uppercase mb-4 flex justify-center items-center gap-2 text-sm" style={getFont()}>
              <Camera className="w-4 h-4" /> Visual Journey
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111111] mb-6 tracking-tight" style={getFont()}>
              {selectedAlbum ? selectedAlbum.title : t('gallery.heading', 'Event Gallery')}
            </h1>
            <div className="w-24 h-1.5 bg-[#F4C430] mx-auto rounded-full mb-8"></div>
            <p className="text-gray-600 text-lg leading-relaxed" style={getFont()}>
              {selectedAlbum 
                ? `${selectedAlbum.year} • ${selectedAlbum.images.length} ${currentLanguage === 'hi' ? 'तस्वीरें' : 'Photos'}` 
                : t('gallery.subheading', 'Journey through our milestones. Select an event to view the memories we have created over the years.')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24 min-h-[500px]">
        <div className="container mx-auto px-4 max-w-[90rem]">
          
          {/* Handle Loading & Error States First */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((skeleton) => (
                <div key={skeleton} className="animate-pulse bg-gray-200 rounded-[2rem] aspect-square border border-gray-100"></div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-3xl border border-red-100">
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to load gallery</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <Images className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Images Found</h3>
              <p className="text-gray-500">Check back later for updates to our event gallery.</p>
            </div>
          ) : !selectedAlbum ? (
            
            /* VIEW 1: ALBUM FOLDERS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="group relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gray-200 aspect-square border border-gray-100"
                  onClick={() => setSelectedAlbum(album)}
                >
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
                  />
                  
                  <div className="absolute top-6 right-6 bg-[#F4C430] text-[#111111] px-4 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 z-20">
                    <Calendar className="w-4 h-4" />
                    {album.year}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/40 to-transparent flex flex-col justify-end p-8">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-extrabold text-2xl mb-2 leading-tight" style={getFont()}>
                        {album.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                        <Images className="w-4 h-4 text-[#F4C430]" />
                        <span>{album.images.length} {currentLanguage === 'hi' ? 'तस्वीरें' : 'Photos'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            
            /* VIEW 2: INSIDE AN ALBUM (IMAGES GRID) */
            <div className="animate-fade-in-up">
              {/* Back Button Area */}
              <div className="mb-10 flex items-center justify-between border-b border-gray-200 pb-6">
                <button 
                  onClick={() => {
                    setSelectedAlbum(null);
                    setLightboxIndex(null);
                  }}
                  className="group flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:bg-[#111111] hover:text-white transition-all shadow-sm"
                  style={getFont()}
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  {currentLanguage === 'hi' ? 'सभी इवेंट्स पर वापस जाएं' : 'Back to All Events'}
                </button>
              </div>

              {/* Images Grid for Selected Album */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedAlbum.images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100 aspect-[4/3]"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center text-[#111111]">
                          <ZoomIn className="w-5 h-5" />
                        </div>
                        <p className="text-white font-bold text-lg truncate" style={getFont()}>
                          {image.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* VIEW 3: FULLSCREEN SCROLLABLE LIGHTBOX MODAL */}
      {lightboxIndex !== null && selectedAlbum && (
        <div
          className="fixed inset-0 bg-[#111111]/95 backdrop-blur-xl z-[100] flex items-center justify-center animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Prevent clicks inside the content area from closing the modal */}
          <div 
            className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Image Counter and Close Button */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-[#111111]/80 to-transparent">
              <div className="text-white font-medium tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                {lightboxIndex + 1} / {selectedAlbum.images.length}
              </div>
              <button
                className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#F4C430] hover:text-[#111111] border border-white/10 transition-all duration-300 group"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close modal"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Left Navigation Arrow */}
            <button
              className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#F4C430] hover:text-[#111111] transition-all duration-300 z-[110] group hover:scale-110"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Main Full-Size Image Container */}
            <div className="w-full h-full flex justify-center items-center px-16 sm:px-32">
              <img
                key={lightboxIndex} // Force re-render for animation on change
                src={selectedAlbum.images[lightboxIndex].url}
                alt={selectedAlbum.images[lightboxIndex].title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-fade-in-up"
              />
            </div>

            {/* Right Navigation Arrow */}
            <button
              className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#F4C430] hover:text-[#111111] transition-all duration-300 z-[110] group hover:scale-110"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Caption Banner at Bottom */}
            <div className="absolute bottom-10 left-0 right-0 text-center z-[110]">
              <span className="inline-block bg-[#F4C430] text-[#111111] px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(244,196,48,0.3)] transform transition-all">
                <p className="font-bold text-xl tracking-wide" style={getFont()}>
                  {selectedAlbum.images[lightboxIndex].title}
                </p>
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
