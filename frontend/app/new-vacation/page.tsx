'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPaperPlane } from 'react-icons/fa';
import { http } from '../lib/axios/axios';

export default function NewRequest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    employee_id: "", // سيتم تعبئته من الـ localStorage
    leave_type: "annual",
    start_date: "",
    end_date: "",
    manager_status: "Pending",
    hr_status: "Pending",
    hr_notes: "",
    final_status: "Pending"
  });

  useEffect(() => {
    // جلب بيانات الموظف المخزنة عند تسجيل الدخول
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      try {
        const employeeData = JSON.parse(storedEmployee);
        // التحديث هنا يضمن أن الـ ID سيُرسل مع الـ form
        setForm(prev => ({ ...prev, employee_id: employeeData.id }));
      } catch (e) {
        console.error("Error parsing employee data", e);
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // منع الإرسال إذا لم يتم تحميل الـ ID بعد
    if (!form.employee_id) {
      alert("Employee ID is missing. Please re-login.");
      return;
    }

    if (new Date(form.start_date) > new Date(form.end_date)) {
      alert("End date cannot be before start date!");
      return;
    }

    setLoading(true);
    try {
      // إرسال الـ form كاملاً بما فيه الـ employee_id
      // الـ Interceptor في ملف axios سيتكفل بإضافة الـ Bearer Token تلقائياً
      await http.post('/vacation-request', form);

      alert("Request sent successfully!");
      router.push('/dashboard');
      router.refresh(); 
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Submit Leave Request</h2>
        <p className="text-[10px] text-blue-500 font-mono mt-1">
          Logged in as ID: {form.employee_id || "Loading..."}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Start Date" 
            type="date" 
            value={form.start_date}
            onChange={v => setForm({...form, start_date: v})} 
          />
          <Input 
            label="End Date" 
            type="date" 
            value={form.end_date}
            onChange={v => setForm({...form, end_date: v})} 
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 ml-1">Leave Type</label>
          <select 
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
            value={form.leave_type}
            onChange={e => setForm({...form, leave_type: e.target.value})}
          >
            <option value="annual">🌴 Annual Leave</option>
            <option value="sick">🤒 Sick Leave</option>
            <option value="emergency">🚨 Emergency</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 ml-1">Notes</label>
          <textarea 
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            rows={3}
            placeholder="Reason for leave..."
            value={form.hr_notes}
            onChange={e => setForm({...form, hr_notes: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !form.employee_id}
          className={`w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg 
            ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
        >
          {loading ? 'Sending...' : <><FaPaperPlane /> Send Request</>}
        </button>
      </form>
    </div>
  );
}

const Input = ({ label, type, onChange, value }: any) => (
  <div>
    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 ml-1">{label}</label>
    <input 
      type={type} 
      required
      value={value}
      placeholder={label}
      className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

