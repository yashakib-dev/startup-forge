"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/founder-dashboard/StatCard";
import { FileText, CircleCheck, Clock, CircleXmark } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { getCollaboratorStats } from "@/lib/actions/stats";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white shadow-lg">
                <p className="font-semibold">{payload[0].name}</p>
                <p className="text-zinc-300">Count: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

const CollaboratorHomePage = () => {
    const { data: session, isPending } = useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!session?.user?.id) return;
            setLoading(true);
            const data = await getCollaboratorStats(session.user.id);
            setStats(data);
            setLoading(false);
        };
        if (!isPending) fetchStats();
    }, [session, isPending]);

    if (isPending || loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-zinc-950">
                <Spinner size="xl" />
            </div>
        );
    }

    const user = session?.user;

    const statCards = [
        {
            title: "Total Applications",
            value: stats?.totalApplications,
            icon: FileText,
            description: "Total opportunities you have applied for",
            trend: "Live",
            trendColor: "text-blue-400",
        },
        {
            title: "Accepted Applications",
            value: stats?.accepted,
            icon: CircleCheck,
            description: "Applications approved by founders",
            trend: "Approved",
            trendColor: "text-emerald-400",
        },
        {
            title: "Pending Reviews",
            value: stats?.pending,
            icon: Clock,
            description: "Applications currently awaiting review",
            trend: "Pending",
            trendColor: "text-amber-400",
        },
    ];

    const chartData = [
        { name: "Accepted", value: stats?.accepted ?? 0 },
        { name: "Pending", value: stats?.pending ?? 0 },
        { name: "Rejected", value: stats?.rejected ?? 0 },
    ].filter(item => item.value > 0);

    return (
        <div className="p-6 md:p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                    Welcome Back,{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {user?.name}
                    </span>
                </h1>
                <p className="text-zinc-400 text-sm mt-2">
                    Track your applications, stats, and search for new collaborative opportunities.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        title={stat.title}
                        value={String(stat.value)}
                        icon={stat.icon}
                        description={stat.description}
                        trend={stat.trend}
                        trendColor={stat.trendColor}
                    />
                ))}
            </div>

            {/* Overview Pie Chart */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-1">Application Status Breakdown</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Distribution of your application decisions at a glance
                </p>
                {chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                        <Clock className="w-10 h-10 mb-2 opacity-30" />
                        <p className="text-sm">No applications submitted yet to show breakdown data.</p>
                    </div>
                ) : (
                    <div className="h-[260px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={
                                                entry.name === "Accepted" ? COLORS[0] : 
                                                entry.name === "Pending" ? COLORS[1] : COLORS[2]
                                            } 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value) => <span className="text-zinc-350 text-xs font-semibold">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollaboratorHomePage;
