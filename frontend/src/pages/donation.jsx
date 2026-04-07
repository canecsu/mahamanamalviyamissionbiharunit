import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, GraduationCap, Award, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Activities = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Base API URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Font styling helper for clean typography management
  const getFont = () => ({
    fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif'
  });

  // Icon pool to cycle through since icons aren't stored in the DB
  const iconPool = [Calendar, Users, GraduationCap, Award];

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetching published activities from the backend
        const response = await fetch(`${API_BASE_URL}/activities`);
        if (!response.ok) {
          throw new Error('Failed to fetch activities data');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-[#F4C430] selection:text-[#111111]">
      
      {/* 1. Core Activities Section */}
      <section className="py-24 relative overflow-hidden bg-white min-h-[80vh]">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-50 to-white -z-10"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-[#F4C430]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#F4C430] font-bold tracking-widest uppercase mb-4 block text-sm" style={getFont()}>
              Our Initiatives
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111111] mb-6 leading-tight" style={getFont()}>
              {t('activities.heading') || "Key Activities"}
            </h1>
            <div className="w-24 h-1.5 bg-[#F4C430] mx-auto rounded-full"></div>
          </div>

          {/* Conditional Rendering based on API State */}
          {loading ? (
            // Loading Skeletons
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
              {[1, 2, 3, 4].map((skeleton) => (
                <div key={skeleton} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm animate-pulse flex flex-col h-[500px]">
                  <div className="w-full h-64 bg-gray-200 rounded-2xl mb-8"></div>
                  <div className="w-3/4 h-8 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="w-full h-4 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="w-5/6 h-4 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="w-4/6 h-4 bg-gray-200 rounded-lg mt-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-3xl border border-red-100">
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : activities.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Activities Found</h3>
              <p className="text-gray-500">We are currently updating our activities schedule. Check back later!</p>
            </div>
          ) : (
            // Data Mapping
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
              {activities.map((activity, index) => {
                // Dynamically assign an icon from the pool
                const ActivityIcon = iconPool[index % iconPool.length];
                
                // Fallback image if backend image_url is empty
                const fallbackImage = 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxzZW1pbmFyfGVufDB8fHx8MTc3MTQxNTA1MHww&ixlib=rb-4.1.0&q=85';

                return (
                  <div
                    key={activity.id || index}
                    className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gray-100 shrink-0">
                      <div className="absolute inset-0 bg-[#111111]/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      <img
                        src={activity.image_url || fallbackImage}
                        alt={activity.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                      />
                      {/* Floating Category/Date Tag (Optional: Since backend provides category/date) */}
                      {(activity.category || activity.date) && (
                        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#111111] shadow-lg">
                          {activity.date ? new Date(activity.date).toLocaleDateString() : activity.category}
                        </div>
                      )}

                      {/* Floating Icon Badge */}
                      <div className="absolute bottom-0 left-8 transform translate-y-1/2 z-20">
                        <div className="w-16 h-16 bg-[#F4C430] rounded-2xl flex items-center justify-center text-[#111111] shadow-lg group-hover:-translate-y-2 transition-transform duration-300 border-4 border-white">
                          <ActivityIcon className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Container */}
                    <div className="p-8 pt-12 flex-grow flex flex-col">
                      <h3 className="text-2xl lg:text-3xl font-bold text-[#111111] mb-4 group-hover:text-[#F4C430] transition-colors" style={getFont()}>
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg flex-grow" style={getFont()}>
                        {activity.description}
                      </p>
                      
                      {/* Subtle Interaction cue */}
                      <div className="mt-8 flex items-center gap-2 text-[#111111] font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        Explore Program <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Activities;
