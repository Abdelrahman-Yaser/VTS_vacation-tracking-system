'use client';
import React, { useEffect, useState } from 'react';
import { http } from '../lib/axios/axios';
import Link from 'next/link';

// --- Interfaces ---
interface Employee {
  id: string;
  name: string;
  role: string;
}

interface Team {
  id: string;
  team_name: string;
  description?: string;
  team_manager?: Employee;
  members?: Employee[];
}

interface Department {
  id: string;
  name: string;
  manager?: Employee;
  hr?: Employee;
  teams?: Team[];
}

const DepartmentComponent: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await http.get('/departments'); 
        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          setDepartments([response.data]);
        }
      } catch (err: any) {
        setError("Failed to load organizational data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) return <div className="flex justify-center p-20 animate-spin">🌀</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Organization Structure</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
            {/* Header Section */}
            <div className="bg-indigo-600 p-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{dept.name}</h2>
                  <p className="text-indigo-100 text-sm mt-1 italic">
                    {dept.teams?.length || 0} Teams Active
                  </p>
                </div>
                
                {/* --- The Button inside EACH department --- */}
                <Link 
                  href={`/teams?departmentId=${dept.id}`} 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-2 px-4 rounded-lg border border-white/40 transition-all flex items-center gap-2"
                >
                  Go to Teams
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <div className="flex gap-4 mt-4 pt-3 border-t border-indigo-500/50 text-indigo-100 text-xs">
                <span>👑 Manager: {dept.manager?.name || 'N/A'}</span>
                <span>👤 HR: {dept.hr?.name || 'N/A'}</span>
              </div>
            </div>

            {/* Teams Content Section */}
            <div className="p-6 flex-grow">
              <h3 className="text-sm font-bold mb-4 text-gray-400 uppercase tracking-widest">Team Preview</h3>
              
              <div className="space-y-4">
                {dept.teams && dept.teams.length > 0 ? (
                  dept.teams.slice(0, 3).map((team) => ( // Showing first 3 for preview
                    <div key={team.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-800">{team.team_name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{team.description}</p>
                      </div>
                      <div className="text-[10px] bg-white px-2 py-1 rounded border text-gray-400">
                        {team.members?.length || 0} Members
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">No teams registered yet.</p>
                )}
                
                {dept.teams && dept.teams.length > 3 && (
                  <p className="text-center text-xs text-indigo-500 font-medium">
                    + {dept.teams.length - 3} more teams...
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentComponent;

