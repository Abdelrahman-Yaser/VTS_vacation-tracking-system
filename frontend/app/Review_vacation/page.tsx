'use client';
import { useState, useEffect } from 'react';
import { http } from '../lib/axios/axios';
import { 
  HiOutlineCheckCircle, 
  HiOutlineXCircle, 
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentList,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle
} from "react-icons/hi2";

type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

interface User {
  id: string;
  role: 'manager' | 'hr' | 'employee' | 'admin';
}

interface VacationRequest {
  request_id: string;
  employee?: {
    firstName: string;
    lastName: string;
  };
  days_requested: number;
  start_date: string;
  end_date: string;
  manager_status?: RequestStatus;
  hr_status?: RequestStatus;
  final_status?: RequestStatus;
}

export default function ManagementCenter() {
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<{id: string, action: RequestStatus} | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // جلب بيانات الـ user من backend باستخدام JWT
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await http.get<User>('/auth/me'); // endpoint مؤمن
        setUser(data);
        fetchRelevantRequests(data);
      } catch (err) {
        setToast({ message: 'Failed to fetch user', type: 'error' });
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchRelevantRequests = async (userData: User) => {
    try {
      setLoading(true);
      let endpoint = '/vacation-request';

      if (userData.role === 'manager') {
        endpoint = '/vacation-request/manager/pending';
      } else if (userData.role === 'hr' || userData.role === 'admin') {
        endpoint = '/vacation-request/pending';
      } else {
        // الموظف العادي: جلب طلباته فقط
        endpoint = `/vacation-request/employee/${userData.id}`;
      }

      const { data } = await http.get<VacationRequest[]>(endpoint);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setToast({ message: "Failed to load requests", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async () => {
    if (!selectedReq || !user) return;
    
    setProcessingId(selectedReq.id);
    setShowModal(false);

    try {
      const payload: any = user.role === 'manager' 
        ? { manager_status: selectedReq.action }
        : { hr_status: selectedReq.action, final_status: selectedReq.action };

      await http.patch(`/vacation-request/${selectedReq.id}`, payload);
      setRequests(prev => prev.filter(r => r.request_id !== selectedReq.id));
      setToast({ message: `Request ${selectedReq.action} successfully!`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || "Process failed", type: 'error' });
    } finally {
      setProcessingId(null);
      setSelectedReq(null);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse">Loading Center...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-bounce 
          ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <HiOutlineCheckCircle size={24}/> : <HiOutlineInformationCircle size={24}/>}
          <span className="font-bold">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3 text-gray-900 dark:text-white">
          <HiOutlineClipboardDocumentList className="text-blue-600" /> Management Center
        </h1>

        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-2xl font-bold flex items-center gap-2">
          <HiOutlineUserGroup /> {requests.length} Pending
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-8 shadow-2xl scale-in-center">
            <HiOutlineExclamationTriangle className="text-amber-500 mx-auto mb-4" size={50} />
            <h2 className="text-2xl font-black text-center mb-2 dark:text-white">Confirm Action</h2>
            <p className="text-gray-500 text-center mb-8">
              Are you sure you want to <span className="font-bold text-gray-900 dark:text-gray-100">{selectedReq?.action}</span> this request?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors">Cancel</button>
              <button onClick={executeAction} className={`flex-1 py-4 font-bold text-white rounded-2xl shadow-lg 
                ${selectedReq?.action === 'Approved' ? 'bg-emerald-600' : 'bg-red-600'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {requests.map((req) => (
          <div key={req.request_id} className={`bg-white dark:bg-gray-900 rounded-3xl p-6 border dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm transition-all 
            ${processingId === req.request_id ? 'opacity-50 pointer-events-none scale-95' : 'hover:shadow-md'}`}>
            
            <div>
              <h3 className="font-black text-xl text-gray-800 dark:text-gray-100">{req.employee?.firstName} {req.employee?.lastName}</h3>
              <p className="text-gray-500 font-medium">{req.days_requested} Days • <span className="text-blue-600">{req.start_date}</span> to <span className="text-blue-600">{req.end_date}</span></p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => { setSelectedReq({id: req.request_id, action: 'Approved'}); setShowModal(true); }}
                className="flex-1 md:flex-none bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-8 py-3 rounded-2xl font-black hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <HiOutlineCheckCircle size={22} /> Approve
              </button>

              <button 
                onClick={() => { setSelectedReq({id: req.request_id, action: 'Rejected'}); setShowModal(true); }}
                className="flex-1 md:flex-none bg-red-50 dark:bg-red-900/20 text-red-600 px-8 py-3 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <HiOutlineXCircle size={22} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
