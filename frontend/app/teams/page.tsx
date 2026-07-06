'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { http } from '../lib/axios/axios';

interface Team {
  team_id: string;
  team_name: string;
  description: string;
  department: { 
    id: string; // Ensure this matches your Entity
    name: string; 
  };
}

const TeamsPage: React.FC = () => {
  const searchParams = useSearchParams();
  // 1. Get the ID from the URL (?departmentId=...)
  const departmentIdFromUrl = searchParams.get('departmentId');

  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [displayTeams, setDisplayTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await http.get('/teams');
        console.log("Raw Teams Data:", response.data);
        setAllTeams(response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    if (departmentIdFromUrl && allTeams.length > 0) {
      console.log("Filtering for Dept ID:", departmentIdFromUrl);
      
      const filtered = allTeams.filter((team) => {
        // IMPORTANT: Check if your JSON uses team.department_id OR team.department.id
        const teamDeptId = team.department?.id; 
        return teamDeptId === departmentIdFromUrl;
      });

      console.log("Filtered Results:", filtered);
      setDisplayTeams(filtered);
    } else {
      setDisplayTeams(allTeams);
    }
  }, [departmentIdFromUrl, allTeams]);

  if (loading) return <div className="p-20 text-center">Loading Teams...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {departmentIdFromUrl ? `Filtered Teams` : `All Teams`} 
            <span className="ml-3 text-sm font-normal text-gray-500">({displayTeams.length})</span>
          </h1>
          
          {departmentIdFromUrl && (
            <button 
              onClick={() => window.location.href = '/teams'} // Simple reset
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTeams.map((team) => (
            <div key={team.team_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {team.department?.name}
              </span>
              <h2 className="text-xl font-bold mt-2">{team.team_name}</h2>
              <p className="text-gray-500 text-sm mt-2">{team.description}</p>
            </div>
          ))}
        </div>

        {displayTeams.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <p className="text-gray-400 text-lg">No teams found for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;