"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaRocket, 
  FaSearch, 
  FaCheck, 
  FaTrashAlt, 
  FaSyncAlt, 
  FaClock, 
  FaBuilding
} from 'react-icons/fa';
import { getAllStartupsAdmin, approveStartup, removeStartup } from '@/lib/actions/startups-admin';
import toast from 'react-hot-toast';

const ManageStartupsPage = () => {
    const [startups, setStartups] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    const fetchStartups = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await getAllStartupsAdmin();
            setStartups(data);
        } catch (error) {
            console.error("Error fetching startups:", error);
            toast.error("Failed to load startups");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStartups();
    }, []);

    const handleApprove = async (startupId) => {
        setActionId(startupId);
        try {
            const res = await approveStartup(startupId);
            if (res.success) {
                toast.success("Startup approved successfully");
                setStartups(prev => prev.map(s => s.id === startupId ? { ...s, status: "approved" } : s));
            } else {
                toast.error(res.message || "Failed to approve startup");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setActionId(null);
        }
    };

    const handleRemove = async (startupId) => {
        if (!confirm("Are you sure you want to remove this startup? This action is permanent.")) return;
        setActionId(startupId);
        try {
            const res = await removeStartup(startupId);
            if (res.success) {
                toast.success("Startup removed successfully");
                setStartups(prev => prev.filter(s => s.id !== startupId));
            } else {
                toast.error(res.message || "Failed to remove startup");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setActionId(null);
        }
    };

    const filteredStartups = startups.filter(startup => 
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-purple-400 uppercase">
                            <FaRocket className="size-3.5" /> Administration
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Manage Startups
                        </h1>
                        <p className="text-zinc-400 text-sm">Review startup profiles, approve newly registered companies, and manage listings.</p>
                    </div>
                    <button
                        onClick={() => fetchStartups(false)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-300 hover:text-white rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50 self-start md:self-center"
                    >
                        <FaSyncAlt className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh Startups</span>
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/30 border border-zinc-800/60 p-4 rounded-2xl backdrop-blur-md">
                    <div className="relative w-full sm:max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                            <FaSearch className="size-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, email, or industry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800/80 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-650"
                        />
                    </div>
                    <div className="text-xs text-zinc-550 font-medium">
                        Showing {filteredStartups.length} of {startups.length} startups
                    </div>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                                    <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                                </div>
                                <div className="h-6 bg-zinc-800 rounded w-20"></div>
                                <div className="h-10 bg-zinc-800 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredStartups.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900/20 border border-zinc-850/60 rounded-3xl backdrop-blur-sm space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 border border-zinc-805 flex items-center justify-center text-zinc-500">
                            <FaBuilding className="size-6" />
                        </div>
                        <h3 className="text-base font-semibold text-zinc-300">No startups found</h3>
                        <p className="text-zinc-500 text-xs max-w-xs mx-auto">We couldn't find any startups matching your criteria. Try adjusting your search term.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-md shadow-xl">
                            <table className="min-w-full divide-y divide-zinc-800/60 text-left">
                                <thead className="bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Startup Details</th>
                                        <th className="px-6 py-4">Industry</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-850/40 text-sm">
                                    {filteredStartups.map((startup) => (
                                        <tr key={startup.id} className="hover:bg-zinc-850/25 transition-colors group">
                                            <td className="px-6 py-4.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-zinc-300 text-sm uppercase">
                                                        {startup.name.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                                                            {startup.name}
                                                        </div>
                                                        <div className="text-xs text-zinc-400">{startup.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <span className="text-zinc-300 bg-zinc-800/60 px-2.5 py-1 rounded-xl border border-zinc-700/40 text-xs">
                                                    {startup.industry}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    startup.status === 'approved'
                                                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                                        : 'bg-amber-950/60 text-amber-450 border border-amber-800/40'
                                                }`}>
                                                    {startup.status === 'approved' ? (
                                                        <>
                                                            <FaCheck className="size-2.5" /> Approved
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaClock className="size-2.5" /> Pending
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4.5 text-right space-x-2">
                                                {startup.status !== 'approved' && (
                                                    <button
                                                        onClick={() => handleApprove(startup.id)}
                                                        disabled={actionId !== null}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-emerald-950/30 border-emerald-850 hover:border-emerald-700 text-emerald-400 hover:bg-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
                                                    >
                                                        {actionId === startup.id ? (
                                                            <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                <FaCheck className="size-3" /> Approve
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemove(startup.id)}
                                                    disabled={actionId !== null}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-red-950/30 border-red-850 hover:border-red-700 text-red-400 hover:bg-red-900/30 transition-all cursor-pointer disabled:opacity-50"
                                                >
                                                    {actionId === startup.id ? (
                                                        <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            <FaTrashAlt className="size-3" /> Remove
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Responsive Cards View */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filteredStartups.map((startup) => (
                                <div 
                                    key={startup.id} 
                                    className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl space-y-4 backdrop-blur-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-zinc-300 text-xs uppercase">
                                                {startup.name.slice(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-zinc-100">{startup.name}</h4>
                                                <p className="text-xs text-zinc-400">{startup.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-zinc-350 bg-zinc-800/60 px-2 py-0.5 rounded-xl border border-zinc-700/40 text-[10px]">
                                            {startup.industry}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            startup.status === 'approved'
                                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                                : 'bg-amber-950/60 text-amber-450 border border-amber-800/40'
                                        }`}>
                                            {startup.status === 'approved' ? (
                                                <>
                                                    <FaCheck className="size-2.5" /> Approved
                                                </>
                                            ) : (
                                                <>
                                                    <FaClock className="size-2.5" /> Pending
                                                </>
                                            )}
                                        </span>

                                        <div className="flex gap-2">
                                            {startup.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleApprove(startup.id)}
                                                    disabled={actionId !== null}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border bg-emerald-950/30 border-emerald-850 hover:border-emerald-700 text-emerald-400 transition-all cursor-pointer"
                                                >
                                                    <FaCheck className="size-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemove(startup.id)}
                                                disabled={actionId !== null}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border bg-red-950/30 border-red-850 hover:border-red-700 text-red-400 transition-all cursor-pointer"
                                            >
                                                <FaTrashAlt className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageStartupsPage;
