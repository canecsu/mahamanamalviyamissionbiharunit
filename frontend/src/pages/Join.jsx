import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle, User, MapPin, Phone, Mail, Briefcase, Users, Heart, BookOpen, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const Join = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    address: '',
    phone: '',
    email: '',
    occupation: ''
  });

  const getFont = () => ({
    fontFamily: currentLanguage === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.fatherName || !formData.address || !formData.phone) {
      toast.error(t('join.errorMsg', 'Please fill in all required fields.'));
      return;
    }

    // Simulate form submission
    toast.success(t('join.successMsg', 'Membership application submitted successfully!'));
    setFormData({
      name: '',
      fatherName: '',
      address: '',
      phone: '',
      email: '',
      occupation: ''
    });
  };

  // Membership Benefits Data for the right column
  const benefits = [
    {
      icon: Heart,
      title: currentLanguage === 'hi' ? 'सामाजिक प्रभाव' : 'Social Impact',
      desc: currentLanguage === 'hi' ? 'शिक्षा और समाज कल्याण के अभियानों में सीधा योगदान दें।' : 'Contribute directly to education and social welfare campaigns.'
    },
    {
      icon: Users,
      title: currentLanguage === 'hi' ? 'मजबूत नेटवर्क' : 'Strong Network',
      desc: currentLanguage === 'hi' ? 'समर्पित और समान विचारधारा वाले लोगों के समुदाय से जुड़ें।' : 'Connect with a community of dedicated, like-minded individuals.'
    },
    {
      icon: BookOpen,
      title: currentLanguage === 'hi' ? 'सांस्कृतिक कार्यक्रम' : 'Cultural Events',
      desc: currentLanguage === 'hi' ? 'हमारे विशेष सेमिनार और आयोजनों में भाग लेने का अवसर।' : 'Exclusive opportunities to participate in our seminars and events.'
    },
    {
      icon: ShieldCheck,
      title: currentLanguage === 'hi' ? 'विरासत का संरक्षण' : 'Preserve Heritage',
      desc: currentLanguage === 'hi' ? 'महामना मालवीय जी के आदर्शों को आगे बढ़ाने में भागीदार बनें।' : 'Become a partner in carrying forward the ideals of Mahamana Malaviya ji.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-[#F4C430] selection:text-[#111111]">
      
      {/* Header Section */}
      <section className="pt-24 pb-12 bg-white border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4C430]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-[2px] bg-[#F4C430]"></div>
            <span className="text-[#F4C430] font-bold uppercase tracking-widest text-sm" style={getFont()}>
              {currentLanguage === 'hi' ? 'हमारे साथ जुड़ें' : 'Join Our Mission'}
            </span>
            <div className="w-10 h-[2px] bg-[#F4C430]"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111111] mb-6" style={getFont()}>
            {t('join.heading', 'Become a Member')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed" style={getFont()}>
            {t('join.content', 'Join Mahamana Malaviya Mission Bihar and become a vital part of our journey towards educational excellence and social harmony.')}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            
            {/* LEFT COLUMN: Membership Form (Takes up 3/5 width on desktop) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                {/* Decorative Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F4C430] to-yellow-200"></div>
                
                <h2 className="text-2xl font-bold text-[#111111] mb-8" style={getFont()}>
                  {currentLanguage === 'hi' ? 'सदस्यता फॉर्म भरें' : 'Fill Membership Form'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700" style={getFont()}>
                      {t('join.name', 'Full Name')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#F4C430] focus:ring-4 focus:ring-[#F4C430]/10 transition-all outline-none text-[#111111]"
                        placeholder={currentLanguage === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                        required
                      />
                    </div>
                  </div>

                  {/* Father's Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700" style={getFont()}>
                      {t('join.fatherName', "Father's Name")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#F4C430] focus:ring-4 focus:ring-[#F4C430]/10 transition-all outline-none text-[#111111]"
                        placeholder={currentLanguage === 'hi' ? 'पिता का नाम दर्ज करें' : "Enter father's name"}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700" style={getFont()}>
                        {t('join.phone', 'Phone Number')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#F4C430] focus:ring-4 focus:ring-[#F4C430]/10 transition-all outline-none text-[#111111]"
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700" style={getFont()}>
                        {t('join.email', 'Email Address')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#F4C430] focus:ring-4 focus:ring-[#F4C430]/10 transition-all outline-none text-[#111111]"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700" style={getFont()}>
                      {t('join.address', 'Full Address')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#F4C430] focus:ring-4 focus:ring-[#F4C430]/10 transition-all outline-none text-[#111111] resize-none"
                        placeholder={currentLanguage === 'hi' ? 'अपना पूरा पता दर्ज करें' : 'Enter your complete address'}
                        required
                      ></textarea>
                    </div>
                  </div>

                  {/* Occupation */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700" style={getFont()}>
                      {t('join.occupation', 'Occupation')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#F4C430] focus:ring-4 focus:ring-[#F4C430]/10 transition-all outline-none text-[#111111]"
                        placeholder={currentLanguage === 'hi' ? 'अपना पेशा दर्ज करें (वैकल्पिक)' : 'Enter your occupation (Optional)'}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="group w-full bg-[#111111] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#F4C430] hover:text-[#111111] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                      style={getFont()}
                    >
                      {t('join.submitBtn', 'Submit Application')}
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> 
                      {currentLanguage === 'hi' ? 'आपकी जानकारी पूरी तरह सुरक्षित है।' : 'Your information is completely secure.'}
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Benefits of Joining (Takes up 2/5 width on desktop) */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#111111] to-gray-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden h-full">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4C430]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white mb-2" style={getFont()}>
                    {currentLanguage === 'hi' ? 'सदस्य क्यों बनें?' : 'Why Become a Member?'}
                  </h2>
                  <div className="w-16 h-1 bg-[#F4C430] mb-8 rounded-full"></div>

                  <div className="space-y-8">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-[#F4C430] group-hover:border-[#F4C430] transition-colors duration-300">
                          <benefit.icon className="w-6 h-6 text-[#F4C430] group-hover:text-[#111111] transition-colors" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1" style={getFont()}>
                            {benefit.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed" style={getFont()}>
                            {benefit.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Motivational Quote at bottom */}
                  <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="flex gap-3">
                      <CheckCircle className="text-[#F4C430] w-6 h-6 shrink-0" />
                      <p className="text-gray-300 text-sm italic leading-relaxed" style={getFont()}>
                        {currentLanguage === 'hi' 
                          ? '"एकजुट होकर हम समाज में सकारात्मक बदलाव ला सकते हैं। आज ही हमारी संस्था से जुड़ें और बदलाव का हिस्सा बनें।"'
                          : '"Together we can bring positive change in society. Join our organization today and be a part of the change."'
                        }
                      </p>
                    </div>
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

export default Join;
