'use client';
import { http } from '@/app/lib/axios/axios';
import { useEffect, useState } from 'react';
// تأكد من مسار ملف أكسيوس
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

export default function VacationHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // جلب بيانات المستخدم لمعرفة الـ ID
        const storedUser = JSON.parse(localStorage.getItem('employee') || '{}');
        const employeeId = storedUser.id;
console.log("Fetching history for employee ID:", employeeId);
        if (employeeId) {
          // مناداة الـ API (تأكد من المسار الصحيح في الباك-إند)
          const { data } = await http.get(`/vacation-request/employee/${employeeId}`);
          setRequests(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // دالة لتحديد لون الحالة
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return <div className="text-center mt-20 font-bold text-blue-600 animate-pulse">Loading Requests...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">My Vacations</h1>
          <p className="text-gray-500 text-sm">Track and manage your leave requests</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200">
           Total: {requests.length} Requests
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-20 rounded-3xl text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-gray-400">No vacation requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req: any) => (
            <div key={req.request_id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
              
              {/* Header: Leave Type & Final Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                    <FaCalendarAlt size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 capitalize">{req.leave_type} Leave</h3>
                    <p className="text-[10px] text-gray-400 font-mono">{req.request_id.split('-')[0]}...</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(req.final_status)}`}>
                  {req.final_status.toUpperCase()}
                </span>
              </div>

              {/* Body: Dates */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl mb-4">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">From</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{req.start_date}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">To</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{req.end_date}</p>
                </div>
              </div>

              {/* Approval Flow Status */}
              <div className="flex items-center justify-between text-[11px] font-medium border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Manager:</span>
                  <span className={req.manager_status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}>{req.manager_status}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">HR:</span>
                  <span className={req.hr_status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}>{req.hr_status}</span>
                </div>
              </div>

              {/* HR Notes */}
              {req.hr_notes && (
                <div className="mt-4 flex items-start gap-2 text-[11px] text-gray-500 bg-gray-50 dark:bg-gray-800/30 p-2 rounded-lg">
                  <FaInfoCircle className="mt-0.5 text-blue-400" />
                  <p><i>Note: {req.hr_notes}</i></p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}