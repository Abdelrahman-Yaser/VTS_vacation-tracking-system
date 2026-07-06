'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<Employee | null>(null);
  const router = useRouter();

  useEffect(() => {
    // جلب البيانات اللي خزناها في الـ Login
    const storedUser = localStorage.getItem('employee'); // يفضل تخزنه كـ JSON string
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login'); // لو مفيش توكن، يرجعه لصفحة الدخول
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl overflow-hidden">
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

          <div className="relative px-6 pb-6">
            {/* Avatar Placeholder */}
            <div className="absolute -top-12 left-6">
              <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg border-4 border-white dark:border-gray-900">
                {user.firstName[0].toUpperCase()}
              </div>
            </div>

            <div className="pt-16 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>

            <hr className="my-6 border-gray-100 dark:border-gray-800" />

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400 uppercase tracking-wider">Employee ID</p>
                <p className="text-gray-700 dark:text-gray-300 font-mono text-xs">{user.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400 uppercase tracking-wider">Account Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Optional) */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
            <p className="text-blue-600 font-bold">Request Vacation</p>
          </button>
          <button className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 font-bold">View History</p>
          </button>
        </div>
      </div>
    </div>
  );
}