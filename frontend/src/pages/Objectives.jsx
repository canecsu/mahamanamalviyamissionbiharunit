import React from 'react';
import { Shield, Star, Users, Lightbulb } from 'lucide-react';

const Team = () => {
  // Added icons to your groups to make the section headers look premium
  const teamGroups = [
    {
      id: 'group5',
      headline: "Board of Patrons", 
      icon: Shield,
      gridClass: 'lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-7xl mx-auto', 
      members: [
        { id: 24, image: "/ru.jpeg", designation: "IAS officer (1984)", name: "Shri R. U. Singh" },
        { id: 25, image: "/images/team25.jpg", designation: "Patron, Bihar", name: "Shri O. P. Srivastava" },
        { id: 26, image: "/images/team26.jpg", designation: "MLC (JDU)", name: "Prof. (Dr.) Virendra Narayan Yadav" },
        { id: 27, image: "/images/team27.jpg", designation: "Patron", name: "Shri Uday Singh" },
        { id: 28, image: "/tnsingh.jpeg", designation: "Director, IIT Patna", name: "Prof. T. N. Singh" }
      ]
    },
    {
      id: 'group1',
      headline: "Core Leadership", 
      icon: Star,
      gridClass: 'lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-7xl mx-auto', 
      members: [
        { id: 1, image: "/bipin.jpeg", designation: "President", name: "Bipin Kumar Singh" },
        { id: 4, image: "/alok.jpeg", designation: "General Secretary", name: "Alok Singh" },
        { id: 5, image: "/manit.jpeg", designation: "Treasurer", name: "Manit Kumar" },
        { id: 2, image: "/satya.jpeg", designation: "Vice President", name: "Satya Srivastava" },
        { id: 3, image: "/sonali.jpeg", designation: "Vice President", name: "Dr. Sonali Gupta" }
      ]
    },
    {
      id: 'group4',
      headline: "Working Committee", 
      icon: Users,
      gridClass: 'lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-7xl mx-auto', 
      members: [
        { id: 14, image: "/suman.jpeg", designation: "Secretary", name: "Suman Kumar Singh" },
        { id: 15, image: "/images/team15.jpg", designation: "Secretary", name: "Rajneesh Upadhyay" },
        { id: 16, image: "/images/team16.jpg", designation: "Secretary", name: "Amarendra Pandey" },
        { id: 17, image: "/ravi.jpeg", designation: "Secretary", name: "Rajeev Kumar" },
        { id: 18, image: "/tomer.jpeg", designation: "Secretary", name: "Shailendra Tomar" },
        { id: 19, image: "/pankhuri.jpeg", designation: "Secretary", name: "Dr. Pankhuri Mishra" },
        { id: 20, image: "/sumit.jpeg", designation: "Secretary", name: "Sumit Singh" },
        { id: 21, image: "/images/team21.jpg", designation: "Secretary", name: "Ankit Kumar" },
        { id: 22, image: "/images/team22.jpg", designation: "Secretary", name: "Naveen Lakshman" },
        { id: 23, image: "/images/team23.jpg", designation: "Secretary", name: "Amar Prakash Singh" }
      ]
    },
    {
      id: 'group6',
      headline: "Advisory Committee", 
      icon: Lightbulb,
      gridClass: 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-6xl mx-auto', 
      members: [
        { id: 29, image: "/images/team29.jpg", designation: "Advisor", name: "Shri Mithilesh Mishra, IAS" },
        { id: 30, image: "/images/team30.jpg", designation: "Advisor", name: "Shri Baidyanath Yadav" },
        { id: 31, image: "/sanjay.jpeg", designation: "Advisor", name: "Shri Sanjay Kumar Singh, IPS" },
        { id: 32, image: "/images/team32.jpg", designation: "Advisor", name: "Shri Rakesh Malhotra" },
        { id: 33, image: "/images/team33.jpg", designation: "Advisor", name: "Shri Rajeshwar Dubey" },
        { id: 34, image: "/images/team34.jpg", designation: "Advisor", name: "Shri Ashwani Kumar Singh" },
        { id: 35, image: "/pandayji.jpeg", designation: "Advisor", name: "Shri Mrityunjay Pandey" },
        { id: 36, image: "/images/team36.jpg", designation: "Advisor", name: "Dr. Arvind Gupta" },
        { id: 37, image: "/images/team37.jpg", designation: "Advisor", name: "Shri Ravindra Upadhyay" },
        { id: 38, image: "/images/team38.jpg", designation: "Advisor", name: "Shri Rajnikant" },
        { id: 39, image: "/images/team39.jpg", designation: "Advisor", name: "Dr. Anand Rai" },
        { id: 41, image: "/images/team41.jpg", designation: "Advisor", name: "Dr. Shivendra Jaiswal" },
        { id: 40, image: "/images/team40.jpg", designation: "Advisor", name: "Dr. Vimlendu Singh" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-[#F4C430] selection:text-[#111111] pb-24">
      
      {/* Hero Header Section */}
      <section className="pt-24 pb-16 bg-white relative overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-[#F4C430]/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[#F4C430] font-bold tracking-widest uppercase mb-4 block text-sm">
              The People Behind The Mission
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111111] mb-6 tracking-tight">
              Our Dedicated Team
            </h1>
            <div className="w-24 h-1.5 bg-[#F4C430] mx-auto rounded-full"></div>
            <p className="mt-8 text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Meet the visionary leaders, dedicated secretaries, and esteemed advisors who guide our organization towards its goals.
            </p>
          </div>
        </div>
      </section>

      {/* Team Groups Rendering */}
      <section className="pt-16">
        <div className="container mx-auto px-4 max-w-[90rem]">
          <div className="flex flex-col gap-24">
            
            {teamGroups.map((group) => (
              <div key={group.id} className="flex flex-col items-center">
                
                {/* Enhanced Group Headline */}
                {group.headline && (
                  <div className="mb-12 text-center w-full flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                      <group.icon className="w-8 h-8 text-[#F4C430]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-4">
                      {group.headline}
                    </h2>
                    <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
                  </div>
                )}

                {/* Team Grid */}
                <div className={`grid gap-6 md:gap-8 w-full ${group.gridClass}`}>
                  {group.members.map((member) => (
                    <div 
                      key={member.id} 
                      className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-[#F4C430]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                    >
                      {/* Top Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F4C430] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Image - Responsive Aspect Ratio */}
                      <div className="w-full aspect-square mb-5 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                        <div className="absolute inset-0 bg-[#F4C430]/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                          onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=F4C430&color=111111&size=256&font-size=0.33`;
                          }} 
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow justify-center w-full">
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#111111] leading-tight group-hover:text-gray-900 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-[#111111] text-xs sm:text-sm uppercase tracking-widest mb-2 line-clamp-1">
                          {member.designation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
