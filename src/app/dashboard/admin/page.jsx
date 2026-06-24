"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaRocket, 
  FaBriefcase, 
  FaDollarSign, 
  FaSyncAlt,
  FaArrowUp,
  FaShieldAlt
} from 'react-icons/fa';
import { getAdminStats } from '@/lib/actions/stats';
import toast from 'react-hot-toast';

const AdminDashboardOverviewPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStartups: 0,
        totalOpportunities: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async (showToast = false) => {
        if (showToast) setRefreshing(true);
        try {
            const data = await getAdminStats();
            setStats(data);
            if (showToast) toast.success("Stats refreshed successfully");
        } catch (error) {
            console.error("Failed to fetch admin stats:", error);
            if (showToast) toast.error("Failed to refresh stats");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            description: "Registered platform users",
            icon: FaUsers,
            gradient: "from-blue-500 to-indigo-500",
            shadow: "shadow-blue-500/10"
        },
        {
            title: "Total Startups",
            value: stats.totalStartups,
            description: "Registered startup profiles",
            icon: FaRocket,
            gradient: "from-purple-500 to-pink-500",
            shadow: "shadow-purple-500/10"
        },
        {
            title: "Total Opportunities",
            value: stats.totalOpportunities,
            description: "Active roles & opportunities",
            icon: FaBriefcase,
            gradient: "from-indigo-500 to-violet-500",
            shadow: "shadow-indigo-500/10"
        },
        {
            title: "Total Revenue",
            value: `$${Number(stats.totalRevenue).toFixed(2)}`,
            description: "Stripe subscription earnings",
            icon: FaDollarSign,
            gradient: "from-emerald-500 to-teal-500",
            shadow: "shadow-emerald-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                            <FaShieldAlt className="size-3.5" /> Admin Control Panel
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-zinc-400 text-sm">Real-time overview of Startup Forge platform performance and metrics.</p>
                    </div>
                    <div>
                        <button
                            onClick={() => fetchStats(true)}
                            disabled={loading || refreshing}
                            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-300 hover:text-white rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
                        >
                            <FaSyncAlt className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Refresh Data</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl animate-pulse space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 bg-zinc-800 rounded w-24"></div>
                                    <div className="size-10 bg-zinc-800 rounded-xl"></div>
                                </div>
                                <div className="h-8 bg-zinc-800 rounded w-16"></div>
                                <div className="h-3 bg-zinc-800 rounded w-32"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((card, index) => {
                            const IconComponent = card.icon;
                            return (
                                <div 
                                    key={index} 
                                    className={`bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl backdrop-blur-md shadow-lg ${card.shadow} transition-all duration-300 hover:border-zinc-700/80 hover:-translate-y-1 group`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                            {card.title}
                                        </span>
                                        <div className={`size-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-md`}>
                                            <IconComponent className="size-5" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">
                                            {card.value}
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Additional Insight Banner */}
                <div className="bg-zinc-900/20 border border-zinc-800/60 p-6 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-zinc-200">System Activity Status</h4>
                        <p className="text-xs text-zinc-400">All data channels are operational. Real-time connections to MongoDB database cluster are secure.</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center bg-emerald-950/40 border border-emerald-850 px-3 py-1.5 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-400">Live Services Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverviewPage;
