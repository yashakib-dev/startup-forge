"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FaEdit, 
  FaTrash, 
  FaSpinner, 
  FaTimes, 
  FaBriefcase, 
  FaCode, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCalendarAlt, 
  FaCheck 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getOpportunities, updateOpportunity, deleteOpportunity } from '@/lib/actions/opportunity';

const OpportunityPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getOpportunities();
      setOpportunities(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    if (selectedOpp) {
      reset({
        title: selectedOpp.title || '',
        skills: Array.isArray(selectedOpp.skills) ? selectedOpp.skills.join(', ') : selectedOpp.skills || '',
        workType: selectedOpp.workType || '',
        commitment: selectedOpp.commitment || '',
        deadline: selectedOpp.deadline || '',
      });
    }
  }, [selectedOpp, reset]);

  const handleUpdate = async (data) => {
    setActionLoading(true);
    try {
      const skillsArray = typeof data.skills === 'string' 
        ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
        : data.skills;

      const res = await updateOpportunity(selectedOpp._id || selectedOpp.id, {
        ...data,
        skills: skillsArray
      });

      if (res && (res.modifiedCount > 0 || res.success)) {
        toast.success("Opportunity updated!");
        fetchOpportunities();
        setIsUpdateOpen(false);
        setSelectedOpp(null);
      } else {
        toast.error("Failed to update opportunity.");
      }
    } catch (err) {
      toast.error("Failed to update opportunity.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res = await deleteOpportunity(selectedOpp._id || selectedOpp.id);
      if (res && (res.deletedCount > 0 || res.success)) {
        toast.success("Opportunity deleted!");
        fetchOpportunities();
        setIsDeleteOpen(false);
        setSelectedOpp(null);
      } else {
        toast.error("Failed to delete opportunity.");
      }
    } catch (err) {
      toast.error("Failed to delete opportunity.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Manage Opportunities</h1>
        <p className="text-sm text-zinc-400">Track, update, and remove opportunities you have posted.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl transition-all duration-300">
        {/* Table view for md and up */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Role Title</th>
                <th className="py-4 px-6">Required Skills</th>
                <th className="py-4 px-6">Work Type</th>
                <th className="py-4 px-6">Commitment</th>
                <th className="py-4 px-6">Deadline</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-zinc-500 text-sm">
                    <span className="inline-block w-5 h-5 border-2 border-zinc-500/30 border-t-zinc-400 rounded-full animate-spin mr-2 align-middle" />
                    Loading opportunities...
                  </td>
                </tr>
              ) : opportunities && opportunities.length > 0 ? (
                opportunities.map((opp) => (
                  <tr key={opp._id || opp.id} className="group hover:bg-zinc-800/10 transition-colors duration-200">
                    <td className="py-4 px-6 font-medium text-white group-hover:text-blue-400 transition-colors">
                      {opp.title}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                        {Array.isArray(opp.skills) ? opp.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                            {s}
                          </span>
                        )) : <span className="text-zinc-500 text-xs">None</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 text-sm">{opp.workType || 'N/A'}</td>
                    <td className="py-4 px-6 text-zinc-300 text-sm">{opp.commitment || 'N/A'}</td>
                    <td className="py-4 px-6 text-zinc-300 text-sm">{opp.deadline || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => { setSelectedOpp(opp); setIsUpdateOpen(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
                        >
                          <FaEdit className="size-3" />
                          Update
                        </button>
                        <button 
                          onClick={() => { setSelectedOpp(opp); setIsDeleteOpen(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        >
                          <FaTrash className="size-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-zinc-500 text-sm">
                    No opportunities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-4 md:hidden p-4">
          {loading ? (
            <div className="py-8 text-center text-zinc-500 text-sm">
              <span className="inline-block w-5 h-5 border-2 border-zinc-500/30 border-t-zinc-400 rounded-full animate-spin mr-2 align-middle" />
              Loading opportunities...
            </div>
          ) : opportunities && opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <div key={opp._id || opp.id} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 flex flex-col gap-3">
                <div>
                  <h3 className="font-semibold text-white text-base truncate">{opp.title}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                    <FaCalendarAlt /> Deadline: {opp.deadline || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(opp.skills) ? opp.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                      {s}
                    </span>
                  )) : null}
                </div>
                <div className="flex gap-4 text-xs text-zinc-400 mt-1">
                  <span>Type: {opp.workType}</span>
                  <span>Commitment: {opp.commitment}</span>
                </div>
                <div className="flex gap-2 mt-2 pt-3 border-t border-zinc-800/50">
                  <button 
                    onClick={() => { setSelectedOpp(opp); setIsUpdateOpen(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
                  >
                    <FaEdit className="size-3" />
                    Update
                  </button>
                  <button 
                    onClick={() => { setSelectedOpp(opp); setIsDeleteOpen(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    <FaTrash className="size-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-zinc-500 text-sm">
              No opportunities found.
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteOpen && selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <FaTrash className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Opportunity</h3>
                <p className="text-sm text-zinc-400 mt-2">
                  Are you sure you want to delete the opportunity <span className="font-semibold text-white">"{selectedOpp.title}"</span>?
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setIsDeleteOpen(false)} 
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl hover:text-white transition-all cursor-pointer disabled:opacity-50 text-sm font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-all cursor-pointer disabled:opacity-50 text-sm font-semibold"
              >
                {actionLoading ? <FaSpinner className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateOpen && selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsUpdateOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaEdit className="text-blue-500" /> Update Opportunity
              </h3>
              <button onClick={() => setIsUpdateOpen(false)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><FaTimes /></button>
            </div>
            
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Role Title</label>
                <input 
                  {...register("title", { required: "Role title is required" })} 
                  type="text" 
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Required Skills (comma separated)</label>
                <input 
                  {...register("skills", { required: "Required skills are required" })} 
                  type="text" 
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Work Type</label>
                  <select 
                    {...register("workType", { required: "Work type is required" })} 
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                  >
                    {["Remote", "Hybrid", "On-site"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Commitment</label>
                  <select 
                    {...register("commitment", { required: "Commitment is required" })} 
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                  >
                    {["Full-time", "Part-time", "Contract", "Internship"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Deadline</label>
                <input 
                  {...register("deadline", { required: "Deadline is required" })} 
                  type="date" 
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all" 
                />
              </div>

              <button 
                type="submit" 
                disabled={actionLoading} 
                className="w-full text-white font-semibold py-2.5 rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {actionLoading ? <FaSpinner className="animate-spin" /> : <><FaCheck /> <span>Save Changes</span></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityPage;