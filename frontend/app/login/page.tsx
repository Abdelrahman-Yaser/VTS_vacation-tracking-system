'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { http } from '../lib/axios/axios';
import {

  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlinePlusCircle
} from 'react-icons/hi2';


export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // التحقق من وجود التوكن عند تحميل الصفحة
  useEffect(() => {
    const token = localStorage.getItem('token');
    const employee = JSON.parse(localStorage.getItem('employee') || '{}');
    
    if (token && employee.role === 'admin') {
      setIsAdminLoggedIn(true);
    } else {
      setIsAdminLoggedIn(false);
      setMode('signin'); // إجبار المستخدم على تسجيل الدخول إذا لم يكن أدمن
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee',
    managerId: '',
    subordinateIds: [] as string[],
    vacationDaysAvailable: 21,
    vacationDaysUsed: 0,
    isActive: true,
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'signin' ? '/auth/sign-in' : '/auth/sign-up';
      const payload = mode === 'signin' 
        ? { email: formData.email, password: formData.password } 
        : formData;

      const { data } = await http.post(endpoint, payload);

      if (mode === 'signin') {
        // تسجيل دخول الآدمن
        if (data?.access_token) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('employee', JSON.stringify(data.employee));
          setIsAdminLoggedIn(data.employee.role === 'admin');
          router.push('/dashboard');
        }
      } else {
        // إنشاء موظف جديد بواسطة الآدمن
        alert(`تم إنشاء حساب الموظف ${formData.firstName} بنجاح!`);
        // تصفير الفورم لإضافة موظف آخر
        setFormData({
            firstName: '', lastName: '', email: '', password: '', role: 'employee',
            managerId: '', subordinateIds: [], vacationDaysAvailable: 21,
            vacationDaysUsed: 0, isActive: true
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشلت العملية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* شارة توضح حالة الآدمن */}
        {isAdminLoggedIn && (
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-500/20 uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Admin Verified
          </div>
        )}

        <div className="mb-10 text-center">
          <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20">
            {mode === 'signin' ? <HiOutlineShieldCheck className="text-blue-500 text-3xl" /> : <HiOutlinePlusCircle className="text-blue-500 text-3xl" />}
          </div>
          <h1 className="text-3xl font-black text-white">{mode === 'signin' ? 'Sign In' : 'Register Employee'}</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {mode === 'signin' ? 'Enter credentials to access portal' : 'Add a new member to the organization'}
          </p>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {/* حقول الاسم والرول كما في الكود السابق */}
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                <input type="text" placeholder="Last Name" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
      

              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Avail Days" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white" onChange={(e) => setFormData({...formData, vacationDaysAvailable: Number(e.target.value)})} />
                <input type="number" placeholder="Used Days" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white" onChange={(e) => setFormData({...formData, vacationDaysUsed: Number(e.target.value)})} />
              </div>
            </div>
          )}

          {/* الإيميل والباسورد يظهران دائماً */}
          <div className="relative">
            <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input type="email" placeholder="Email Address" required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input type="password" placeholder="Password" required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 mt-4">
            {loading ? 'PROCESSING...' : mode === 'signin' ? 'LOGIN TO SYSTEM' : 'CREATE EMPLOYEE'}
          </button>
        </form>

        {/* زر التبديل يظهر فقط إذا كان المستخدم مسجل كـ Admin */}
        {isAdminLoggedIn && (
          <div 
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="mt-8 text-center text-gray-500 text-xs cursor-pointer hover:text-blue-500 transition-colors font-bold uppercase tracking-widest"
          >
            {mode === 'signin' ? '+ Register New Employee' : '← Back to Login Interface'}
          </div>
        )}
      </div>
    </div>
  );
}