"use client";

import { useState, useEffect } from "react";
import { getApplications } from "@/lib/actions/application";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { 
    Briefcase, 
    Clock, 
    CircleCheck, 
    CircleXmark, 
    Calendar,
    ArrowUpRight,
    Magnifier
} from "@gravity-ui/icons";
import Link from "next/link";
import toast from "react-hot-toast";

const MyApplicationsPage = () => {
    const { data: session, isPending } = useSession();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const loadApplications = async () => {
            if (!session?.user?.id) return;
            setLoading(true);
            try {
                const res = await getApplications({ applicantId: session.user.id });
                const data = Array.isArray(res) ? res : res.applications || [];
                setApplications(data);
            } catch (err) {
                console.error("Failed to load applications:", err);
                toast.error("Failed to load applications.");
            } finally {
                setLoading(false);
            }
        };

        if (!isPending) {
            loadApplications();
        }
    }, [session, isPending]);

    if (isPending || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-zinc-950">
                <Spinner size="lg" color="primary" label="Loading applications..." />
            </div>
        );
    }

    const filteredApplications = applications.filter((app) => {
        const matchesSearch = 
            app.opportunityTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.startupName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const appStatus = app.status?.toLowerCase() || "";
        const matchesStatus = 
            statusFilter === "all" ||
            (statusFilter === "pending" && (appStatus === "pending" || appStatus === "")) ||
            (statusFilter === "accepted" && (appStatus === "accepted" || appStatus === "approved")) ||
            (statusFilter === "rejected" && (appStatus === "rejected" || appStatus === "declined"));

        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === "accepted" || s === "approved") {
            return {
                bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                icon: <CircleCheck className="w-4 h-4 text-emerald-400" />,
                label: "Accepted"
            };
        }
        if (s === "rejected" || s === "declined") {
            return {
                bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                icon: <CircleXmark className="w-4 h-4 text-rose-400" />,
                label: "Rejected"
            };
        }
        return {
            bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            icon: <Clock className="w-4 h-4 text-amber-400" />,
            label: "Pending"
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                    My{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Applications
                    </span>
                </h1>
                <p className="text-zinc-400 text-sm mt-2">
                    Track the status, applied dates, and details of all positions you have applied for.
                </p>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/80">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                        <Magnifier className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by opportunity or startup..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-850 gap-1 overflow-x-auto self-start sm:self-auto">
                    {["all", "pending", "accepted", "rejected"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                                statusFilter === tab
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table / Grid Section */}
            {filteredApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl text-center space-y-4">
                    <Briefcase className="w-12 h-12 text-zinc-600 opacity-40 animate-pulse" />
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-300">No applications found</h3>
                        <p className="text-zinc-500 text-sm mt-1 max-w-sm">
                            {searchTerm || statusFilter !== "all" 
                                ? "Try adjusting your search terms or filters to find what you're looking for."
                                : "You haven't applied to any opportunities yet."}
                        </p>
                    </div>
                    {(!searchTerm && statusFilter === "all") && (
                        <Link
                            href="/opportunities"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:opacity-95 transition-all"
                        >
                            Explore Opportunities <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                        <th className="py-4.5 px-6">Opportunity Details</th>
                                        <th className="py-4.5 px-6">Startup</th>
                                        <th className="py-4.5 px-6">Applied Date</th>
                                        <th className="py-4.5 px-6 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/60">
                                    {filteredApplications.map((app) => {
                                        const statusStyle = getStatusStyle(app.status);
                                        return (
                                            <tr key={app._id || app.id} className="group hover:bg-zinc-900/40 transition-colors duration-250">
                                                <td className="py-4.5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-300">
                                                            <Briefcase className="w-5 h-5 text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                                {app.opportunityTitle || "N/A"}
                                                            </h4>
                                                            {app.opportunityId && (
                                                                <Link 
                                                                    href={`/opportunitie-details/${app.opportunityId}`}
                                                                    className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-350 transition-colors mt-0.5"
                                                                >
                                                                    View Details <ArrowUpRight className="w-3 h-3" />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4.5 px-6">
                                                    <span className="text-zinc-300 font-medium text-sm">
                                                        {app.startupName || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="py-4.5 px-6">
                                                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                        <Calendar className="w-4 h-4 text-zinc-550" />
                                                        <span>{formatDate(app.appliedAt || app.appliedDate)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4.5 px-6">
                                                    <div className="flex items-center justify-center">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusStyle.bg}`}>
                                                            {statusStyle.icon}
                                                            {statusStyle.label}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredApplications.map((app) => {
                            const statusStyle = getStatusStyle(app.status);
                            return (
                                <div key={app._id || app.id} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-xl flex flex-col gap-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center text-zinc-300">
                                                <Briefcase className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-base leading-tight">
                                                    {app.opportunityTitle || "N/A"}
                                                </h4>
                                                <p className="text-zinc-400 text-xs mt-1">
                                                    by <span className="font-medium text-zinc-300">{app.startupName || "N/A"}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 uppercase tracking-wider shrink-0 ${statusStyle.bg}`}>
                                            {statusStyle.label}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs border-t border-zinc-800/80 pt-3 mt-1">
                                        <div className="flex items-center gap-1.5 text-zinc-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatDate(app.appliedAt || app.appliedDate)}</span>
                                        </div>
                                        
                                        {app.opportunityId && (
                                            <Link 
                                                href={`/opportunitie-details/${app.opportunityId}`}
                                                className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
                                            >
                                                Details <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyApplicationsPage;