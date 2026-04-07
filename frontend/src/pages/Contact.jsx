import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-4 text-center" style={{ fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif' }}>
            {t('contact.heading')}
          </h1>
          <div className="w-24 h-1 bg-[#F4C430] mx-auto mb-16"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white border-2 border-[#F4C430] rounded-lg p-6 hover:shadow-2xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-[#111111] w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111111] mb-2" style={{ fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif' }}>
                      {t('contact.office')}
                    </h3>
                    <p
                      className="text-gray-700 leading-relaxed"
                      style={{ fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: t('contact.officeAddress') }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-[#F4C430] rounded-lg p-6 hover:shadow-2xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-[#111111] w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111111] mb-2" style={{ fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif' }}>
                      {t('contact.phone')}
                    </h3>
                    <p className="text-gray-700">+91-9876543210</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-[#F4C430] rounded-lg p-6 hover:shadow-2xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-[#111111] w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111111] mb-2" style={{ fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif' }}>
                      {t('contact.email')}
                    </h3>
                    <p className="text-gray-700">biharunit@malaviyamission.org</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-[#F4C430] rounded-lg p-6 hover:shadow-2xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-[#111111] w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111111] mb-2" style={{ fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif' }}>
                      {t('contact.hours')}
                    </h3>
                    <p className="text-gray-700" style={{ fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif' }}>
                      {t('contact.hoursText')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white border-2 border-[#F4C430] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d472.56646845799855!2d85.03327304569397!3d25.561545388451034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2a9edfd9c7c1d%3A0x2e74b8c58b242e2c!2sHari%20Nagar%20township%2C%20Phuliya%20tola%20road%2C%20near%20AIIMS%20Road%2C%20Patna%2C%20Bihar%20801505!5e0!3m2!1sen!2sin!4v1775468014772!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
