import React from 'react';
import { FaUser, FaEnvelope, FaFileAlt, FaBriefcase, FaCircle } from 'react-icons/fa';

export function ApplicationsList({ applications }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-xl mb-6">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Applicant</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Message</th>
              <th className="py-4 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {applications.map((app) => (
              <tr key={app._id || app.id} className="group hover:bg-zinc-800/10 transition-colors duration-200">
                <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-300 text-xs font-bold uppercase">
                    {app.applicantName ? app.applicantName.charAt(0) : <FaUser className="size-3" />}
                  </div>
                  <span>{app.applicantName || 'Anonymous'}</span>
                </td>
                <td className="py-4 px-6 text-zinc-300 text-sm">
                  <div className="flex items-center gap-1.5">
                    <FaBriefcase className="text-zinc-500 size-3" />
                    <span>{app.roleTitle || app.title || 'N/A'}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-zinc-400 text-sm">{app.email || 'N/A'}</td>
                <td className="py-4 px-6 text-zinc-400 text-sm max-w-[200px] truncate" title={app.message || app.coverLetter}>
                  {app.message || app.coverLetter || 'No cover letter provided.'}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border flex items-center gap-1.5 ${
                      app.status === 'Accepted' || app.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : app.status === 'Rejected' || app.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      <FaCircle className="size-1.5 fill-current animate-pulse" />
                      {app.status || 'Pending'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden p-4">
        {applications.map((app) => (
          <div key={app._id || app.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-300 text-xs font-bold uppercase">
                  {app.applicantName ? app.applicantName.charAt(0) : <FaUser className="size-3" />}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{app.applicantName || 'Anonymous'}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{app.email}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase border ${
                app.status === 'Accepted' || app.status === 'approved'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : app.status === 'Rejected' || app.status === 'rejected'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {app.status || 'Pending'}
              </span>
            </div>
            <div className="text-xs text-zinc-300 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/60 mt-1">
              <div className="flex items-center gap-1.5 font-medium text-white mb-1.5">
                <FaBriefcase className="text-zinc-500 size-3" />
                <span>{app.roleTitle || app.title || 'N/A'}</span>
              </div>
              <p className="text-zinc-400 leading-relaxed italic">
                "{app.message || app.coverLetter || 'No cover letter provided.'}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicationsList;