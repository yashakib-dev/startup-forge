"use client";

import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaBriefcase, FaCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { updateApplication } from '@/lib/actions/application';
import toast from 'react-hot-toast';
import { Spinner } from '@heroui/react';

export function ApplicationsList({ applications, onUpdate }) {
  const [actioningId, setActioningId] = useState(null);

  const handleStatusChange = async (appId, newStatus) => {
    setActioningId(appId);
    try {
      const res = await updateApplication(appId, { status: newStatus });
      if (res && !res.error) {
        toast.success(`Application ${newStatus.toLowerCase()} successfully!`);
        if (onUpdate) onUpdate();
      } else {
        toast.error(res?.error || `Failed to update status to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    } finally {
      setActioningId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'accepted' || s === 'approved') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <FaCircle className="size-1.5 fill-current" />
          Accepted
        </span>
      );
    }
    if (s === 'rejected' || s === 'declined') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border-rose-500/20">
          <FaCircle className="size-1.5 fill-current" />
          Rejected
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border-amber-500/20">
        <FaCircle className="size-1.5 fill-current animate-pulse" />
        Pending
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-xl mb-6">
      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Applicant</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Message</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {applications.map((app) => {
              const appId = app._id || app.id;
              const isPending = !app.status || app.status.toLowerCase() === 'pending';
              const isUpdating = actioningId === appId;

              return (
                <tr key={appId} className="group hover:bg-zinc-800/10 transition-colors duration-200">
                  {/* Applicant */}
                  <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-300 text-xs font-bold uppercase">
                      {app.applicantName ? app.applicantName.charAt(0) : <FaUser className="size-3" />}
                    </div>
                    <span className="truncate max-w-[150px]" title={app.applicantName}>
                      {app.applicantName || 'Anonymous'}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6 text-zinc-300 text-sm">
                    <div className="flex items-center gap-1.5">
                      <FaBriefcase className="text-zinc-500 size-3 shrink-0" />
                      <span className="truncate max-w-[150px]" title={app.opportunityTitle || app.roleTitle || app.title}>
                        {app.opportunityTitle || app.roleTitle || app.title || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-zinc-400 text-sm">
                    <span className="truncate max-w-[180px] block" title={app.applicantEmail || app.email}>
                      {app.applicantEmail || app.email || 'N/A'}
                    </span>
                  </td>

                  {/* Message */}
                  <td className="py-4 px-6 text-zinc-400 text-sm max-w-[240px] truncate" title={app.motivationMessage || app.message || app.coverLetter}>
                    {app.motivationMessage || app.message || app.coverLetter || 'No cover letter provided.'}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      {getStatusBadge(app.status)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isUpdating ? (
                        <Spinner size="sm" />
                      ) : isPending ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(appId, 'Accepted')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 text-xs px-2.5 font-medium"
                            title="Accept Application"
                          >
                            <FaCheck className="size-3" /> Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(appId, 'Rejected')}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1 text-xs px-2.5 font-medium"
                            title="Reject Application"
                          >
                            <FaTimes className="size-3" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-zinc-550 text-xs italic">Reviewed</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet view */}
      <div className="grid grid-cols-1 gap-4 lg:hidden p-4">
        {applications.map((app) => {
          const appId = app._id || app.id;
          const isPending = !app.status || app.status.toLowerCase() === 'pending';
          const isUpdating = actioningId === appId;

          return (
            <div key={appId} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-300 text-xs font-bold uppercase">
                    {app.applicantName ? app.applicantName.charAt(0) : <FaUser className="size-3" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{app.applicantName || 'Anonymous'}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{app.applicantEmail || app.email || 'N/A'}</p>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>

              <div className="text-xs text-zinc-300 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/60 mt-1 space-y-2">
                <div className="flex items-center gap-1.5 font-medium text-white">
                  <FaBriefcase className="text-zinc-500 size-3 shrink-0" />
                  <span>{app.opportunityTitle || app.roleTitle || app.title || 'N/A'}</span>
                </div>
                <p className="text-zinc-400 leading-relaxed italic">
                  "{app.motivationMessage || app.message || app.coverLetter || 'No cover letter provided.'}"
                </p>
              </div>

              {/* Actions for Mobile */}
              {isPending && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-800/60">
                  {isUpdating ? (
                    <div className="w-full flex justify-center py-1">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStatusChange(appId, 'Accepted')}
                        className="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FaCheck className="size-3" /> Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(appId, 'Rejected')}
                        className="flex-1 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FaTimes className="size-3" /> Reject
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ApplicationsList;