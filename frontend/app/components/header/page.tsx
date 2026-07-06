'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  HiOutlineHome, 
  HiOutlinePlusCircle, 
  HiOutlineClipboard, 
  HiOutlineUserCircle,
  HiOutlineArrowLeftOnRectangle, 
  HiBars3,                       
  HiXMark                        
} from "react-icons/hi2"; 
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mounted, setMounted] = useState(false); // للتأكد أننا في المتصفح
  const router = useRouter();
  const pathname = usePathname();

  // 1. عند فتح الصفحة لأول مرة، نتأكد أن المكون تم تحميله في المتصفح
  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [pathname]);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedEmployee = localStorage.getItem('employee');
      
      if (token && storedEmployee) {
        try {
          setUserData(JSON.parse(storedEmployee));
          setIsLoggedIn(true);
        } catch (e) {
          console.error("Error parsing user data", e);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employee');
    setIsLoggedIn(false);
    setUserData(null);
    router.push('/login');
  };

  // حماية من خطأ الـ Hydration: لا ترندر المحتوى الذي يعتمد على localStorage إلا بعد الـ Mount
  if (!mounted) return <header className="h-16 bg-white" />; 

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-950 transition-all border-b dark:border-gray-800 font-sans">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">
          MANNOVA
        </Link>

        {/* Desktop Nav */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink href="/dashboard" icon={<HiOutlineHome />} label="Dashboard" color="hover:text-blue-500" />
            <NavLink href="/new-vacation" icon={<HiOutlinePlusCircle />} label="New Request" color="hover:text-emerald-500" />
            <NavLink href="/vacations/history" icon={<HiOutlineClipboard />} label="History" color="hover:text-amber-500" />
            <NavLink href="/profile" icon={<HiOutlineUserCircle />} label="Profile" color="hover:text-indigo-500" />
            {/* تأكد من مسار الديبارتمنتس الصحيح */}
            <NavLink href="/departments" icon={<HiOutlineArrowLeftOnRectangle />} label="Depts" color="hover:text-red-500" />
          </nav>
        )}

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center bg-gray-50 dark:bg-gray-900 pl-4 pr-2 py-1.5 rounded-full border border-gray-200 dark:border-gray-800">
              <Link href="/profile" className="flex items-center group">
                <div className="flex flex-col items-end mr-3">
                  <span className="text-[9px] font-black text-blue-600 uppercase leading-none mb-0.5">
                    {userData?.role || 'User'}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
                    {userData?.firstName || 'Account'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <HiOutlineUserCircle className="text-xl" />
                </div>
              </Link>

              <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700 mx-3"></div>

              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 p-1.5 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                title="Logout"
              >
                <HiOutlineArrowLeftOnRectangle className="text-xl" />
              </button>
            </div>
          ) : (
            pathname !== '/login' && (
              <Link href="/login" className="bg-blue-600 text-white px-8 py-2.5 rounded-full hover:bg-blue-700 transition-all font-black text-xs tracking-widest shadow-lg shadow-blue-200">
                SIGN IN
              </Link>
            )
          )}

          {isLoggedIn && (
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 dark:text-gray-300 p-2">
              {menuOpen ? <HiXMark size={28} /> : <HiBars3 size={28} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && isLoggedIn && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 grid grid-cols-4 py-6 shadow-xl animate-in slide-in-from-top duration-300">
          <MobileNavLink onClick={() => setMenuOpen(false)} href="/dashboard" icon={<HiOutlineHome />} label="Home" color="text-blue-500" />
          <MobileNavLink onClick={() => setMenuOpen(false)} href="/new-vacation" icon={<HiOutlinePlusCircle />} label="Request" color="text-emerald-500" />
          <MobileNavLink onClick={() => setMenuOpen(false)} href="/vacations/history" icon={<HiOutlineClipboard />} label="History" color="text-amber-500" />
          <MobileNavLink onClick={() => setMenuOpen(false)} href="/profile" icon={<HiOutlineUserCircle />} label="Profile" color="text-indigo-500" />
        </div>
      )}
    </header>
  );
};

// تم تعديل المكونات الفرعية لتسهيل القراءة
const NavLink = ({ href, icon, label, color, badge = null }) => (
  <Link href={href} className={`group flex flex-col items-center text-gray-400 dark:text-gray-500 ${color} transition-all`}>
    <div className="relative mb-1">
      <span className="text-2xl group-hover:scale-110 transition-transform duration-200 inline-block">{icon}</span>
      {badge && <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-950">{badge}</span>}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
  </Link>
);

const MobileNavLink = ({ href, icon, label, color, onClick }) => (
  <Link href={href} onClick={onClick} className={`flex flex-col items-center ${color} space-y-1`}>
    <span className="text-2xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-600 dark:text-gray-400">{label}</span>
  </Link>
);

export default Header;