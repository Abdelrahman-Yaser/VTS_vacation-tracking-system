'use client';
import Link from "next/link";
import {  FaClock, FaCalendarCheck, FaHistory, } from "react-icons/fa";

// المكون الرئيسي
const Homepage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <TopAnnouncementBar />

      <HeroSection />

      {/* قسم إحصائيات سريعة (Quick Stats) */}
      <section className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard title="Annual Balance" value="21 Days" icon={<FaCalendarCheck className="text-blue-500"/>} />
            <StatCard title="Pending Requests" value="3 Requests" icon={<FaClock className="text-yellow-500"/>} />
            <StatCard title="Used This Year" value="9 Days" icon={<FaHistory className="text-purple-500"/>} />
        </div>
      </section>
    </div>
  );
};

// مكون البطاقة الإحصائية
const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-6 hover:shadow-md transition-all">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

// 1. شريط الإعلانات العلوي
const TopAnnouncementBar = () => {
  return (
    <div className="bg-blue-600 text-white text-[11px] py-2 px-6 text-center font-medium tracking-widest uppercase">
      Important: Please submit your end-of-year vacation requests before Dec 25th.
    </div>
  );
};


// 3. قسم البطل (Hero Section)
const HeroSection = () => {
  return (
    <div 
      className="relative h-[70vh] flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070")', // صورة مكتب احترافية
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/60"></div>
      
      <div className="relative z-10 text-white px-4 max-w-3xl">
        <p className="text-sm tracking-[0.3em] uppercase mb-4 text-blue-300 font-bold">Smart Vacation Management</p>
        <h1 className="text-5xl md:text-7xl font-light leading-tight mb-8">
          Manage your <span className="font-bold">Time Off</span> with Ease.
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/vacations/new" 
              className="px-10 py-4 bg-blue-600 text-white text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition duration-300 rounded-sm"
            >
              Request Vacation
            </Link>
            <Link 
              href="/about" 
              className="px-10 py-4 border border-white text-white text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-gray-900 transition duration-300 rounded-sm"
            >
              View Policy
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;