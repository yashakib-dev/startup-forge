import { getStartupIdea } from '@/lib/api/ideas';
import Link from 'next/link';
import React from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const StartupPage = async () => {
  const startups = await getStartupIdea();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Manage Your Startups</h1>
          <p className="text-sm text-zinc-400">Manage and track your registered startup ideas</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl transition-all duration-300">
        {/* Table view for medium and larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Logo</th>
                <th className="py-4 px-6">Startup Name</th>
                <th className="py-4 px-6">Industry</th>
                <th className="py-4 px-6">Funding Stage</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {startups && startups.length > 0 ? (
                startups.map((startup) => (
                  <tr key={startup._id || startup.id} className="group hover:bg-zinc-800/10 transition-colors duration-200">
                    <td className="py-4 px-6">
                      {startup.logo ? (
                        <img 
                          src={startup.logo} 
                          alt={startup.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-800/80 group-hover:border-zinc-700/80 transition-colors"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center text-zinc-400 font-bold text-sm">
                          {startup.name ? startup.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-medium text-white group-hover:text-blue-400 transition-colors">
                      {startup.name}
                    </td>
                    <td className="py-4 px-6 text-zinc-300 text-sm">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800/60 text-zinc-300 border border-zinc-700/50">
                        {startup.industry || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 text-sm">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {startup.fundingStage || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                          <FaEdit className="size-3" />
                          Update
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                          <FaTrash className="size-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-zinc-500 text-sm">
                    No startups found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card view for mobile screens */}
        <div className="grid grid-cols-1 gap-4 md:hidden p-4">
          {startups && startups.length > 0 ? (
            startups.map((startup) => (
              <div key={startup._id || startup.id} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {startup.logo ? (
                    <img 
                      src={startup.logo} 
                      alt={startup.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center text-zinc-400 font-bold text-base">
                      {startup.name ? startup.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base truncate">{startup.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                        {startup.industry || 'N/A'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {startup.fundingStage || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 pt-3 border-t border-zinc-800/50">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                    <FaEdit className="size-3" />
                    Update
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                    <FaTrash className="size-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-zinc-500 text-sm">
              No startups found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartupPage;