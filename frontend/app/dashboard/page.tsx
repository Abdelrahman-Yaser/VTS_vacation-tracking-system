'use client';
import { useState, useEffect } from 'react';
import { 
  HiOutlinePlusCircle, 
  HiOutlineClock, 
  HiOutlineCalendarDays, 
  HiOutlineArrowPath, 
  HiOutlineUserPlus, 
  HiOutlineShieldCheck 
} from "react-icons/hi2";
import Link from "next/link";
import { http } from '../lib/axios/axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface EmployeeInfo {
  id: string;
  firstName: string;
  email: string;
  role: 'employee' | 'manager' | 'hr' | 'admin';
  vacationDaysAvailable: number;
  vacationDaysUsed: number;
}

const EMPLOYEE_ROLE_DATA = [
  { role: "Employee", count: 52 },
  { role: "Manager", count: 10 },
  { role: "HR", count: 5 },
  { role: "Admin", count: 3 },
];

export default function VacationDashboard() {
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [stats, setStats] = useState({ pending: 0, totalRequests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const storedEmployee = typeof window !== 'undefined' ? localStorage.getItem('employee') : null;
        
        if (!token || !storedEmployee) {
          setLoading(false);
          return;
        }

        const parsedEmployee = JSON.parse(storedEmployee);
        setEmployeeInfo(parsedEmployee);

        let endpoint = '';
        if (parsedEmployee.role === 'manager') {
          endpoint = `/vacation-request/manager/pending/${parsedEmployee.id}`;
        } else if (parsedEmployee.role === 'hr' || parsedEmployee.role === 'admin') {
          endpoint = '/vacation-request';
        } else {
          endpoint = '/employees/me';
        }

        const { data } = await http.get(endpoint);

        if (parsedEmployee.role === 'employee') {
          setStats({
            pending: data.vacationRequests?.filter(r => r.final_status === 'Pending').length || 0,
            totalRequests: data.vacationRequests?.length || 0
          });
        } else {
          setStats({
            pending: data.filter(r => (parsedEmployee.role === 'manager' ? r.manager_status === 'Pending' : r.final_status === 'Pending')).length,
            totalRequests: data.length
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!employeeInfo) return <div className="p-10 text-center">Please login first</div>;

  const isAdmin = employeeInfo.role === 'admin';
  const isHR = employeeInfo.role === 'hr';
  const isManager = employeeInfo.role === 'manager';
  const isStaff = isAdmin || isHR || isManager;

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Hello, <span className="text-blue-600">{employeeInfo.firstName}</span> 👋
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                {employeeInfo.role}
              </span>
              <span className="text-gray-400 text-xs font-medium">{employeeInfo.email}</span>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {(isAdmin || isHR) && (
              <Link href="/login" className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow transition-all active:scale-95 text-sm">
                <HiOutlineUserPlus size={20}/> Add Staff
              </Link>
            )}
            <Link href="/new-vacation" className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow transition-all active:scale-95 text-sm">
              <HiOutlinePlusCircle size={20}/> New Request
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Available Balance" 
            value={`${employeeInfo.vacationDaysAvailable || 0} Days`} 
            icon={<HiOutlineCalendarDays />} 
            color="text-blue-600" 
            bgColor="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard 
            title={isStaff ? "Action Required" : "Pending Requests"} 
            value={stats.pending} 
            icon={<HiOutlineClock />} 
            color="text-amber-600" 
            bgColor="bg-amber-50 dark:bg-amber-900/20"
          />
          <StatCard 
            title="Days Taken" 
            value={`${employeeInfo.vacationDaysUsed || 0} Days`} 
            icon={<HiOutlineArrowPath />} 
            color="text-purple-600" 
            bgColor="bg-purple-50 dark:bg-purple-900/20"
          />
        </div>

        {/* Management Center */}
        {isStaff && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
              <HiOutlineShieldCheck className="text-blue-600" size={28}/> 
              Management Center
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/Review_vacation" className="group p-6 border-2 border-gray-50 dark:border-gray-800 rounded-3xl hover:border-emerald-500 transition-all">
                <p className="font-black text-lg group-hover:text-emerald-600">Review Vacation</p>
                <p className="text-sm text-gray-500 mt-1">Check pending approvals for your team.</p>
              </Link>
              {(isAdmin || isHR) && (
                <>
                  <Link href="/employees-list" className="group p-6 border-2 border-gray-50 dark:border-gray-800 rounded-3xl hover:border-emerald-500 transition-all">
                    <p className="font-black text-lg group-hover:text-emerald-600">Staff Directory</p>
                    <p className="text-sm text-gray-500 mt-1">Manage users and roles.</p>
                  </Link>
                  <Link href="/departments" className="group p-6 border-2 border-gray-50 dark:border-gray-800 rounded-3xl hover:border-emerald-500 transition-all">
                    <p className="font-black text-lg group-hover:text-emerald-600">Department</p>
                    <p className="text-sm text-gray-500 mt-1">Manage and view departments.</p>
                  </Link>
                  <Link href="/teams" className="group p-6 border-2 border-gray-50 dark:border-gray-800 rounded-3xl hover:border-emerald-500 transition-all">
                    <p className="font-black text-lg group-hover:text-emerald-600">Teams</p>
                    <p className="text-sm text-gray-500 mt-1">Manage and view teams.</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Employee Chart */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-gray-100">
            Employees Distribution
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={EMPLOYEE_ROLE_DATA}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="role" tick={{ fill: "#555", fontSize: 13 }} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
      <div className={`p-4 rounded-2xl ${bgColor} ${color} text-3xl`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
