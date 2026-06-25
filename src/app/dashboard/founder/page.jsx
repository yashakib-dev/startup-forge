"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/founder-dashboard/StatCard";
import { Rocket, FileText, Persons } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { getFounderStats } from "@/lib/actions/stats";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const BAR_COLORS = ["#6366f1", "#10b981", "#a78bfa"];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white shadow-lg">
                <p className="font-semibold">{label}</p>
                <p className="text-zinc-300">Count: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

const FounderDashboardPage = () => {
    const { data: session, isPending } = useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    

    useEffect(() => {
        const fetchStats = async () => {
            if (!session?.user?.id) return;
            setLoading(true);
            const data = await getFounderStats(session.user.id);
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
            title: "Total Opportunities",
            value: stats?.totalOpportunities ?? 0,
            icon: Rocket,
            description: "Active listings looking for talent",
            trend: "Live",
            trendColor: "text-blue-400",
        },
        {
            title: "Total Applications",
            value: stats?.totalApplications ?? 0,
            icon: FileText,
            description: "Applications submitted by collaborators",
            trend: "Live",
            trendColor: "text-emerald-400",
        },
        {
            title: "Accepted Members",
            value: stats?.accepted ?? 0,
            icon: Persons,
            description: "Team members successfully joined",
            trend: "Live",
            trendColor: "text-indigo-400",
        },
    ];

    const chartData = [
        { name: "Opportunities", value: stats?.totalOpportunities ?? 0 },
        { name: "Applications", value: stats?.totalApplications ?? 0 },
        { name: "Members", value: stats?.accepted ?? 0 },
    ];

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
                    Manage your startup projects, listings, and view application stats.
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

            {/* Overview Bar Chart */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-1">Overview</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Total opportunities, applications, and accepted members at a glance
                </p>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData} barSize={48}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#a1a1aa", fontSize: 13 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fill: "#a1a1aa", fontSize: 13 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={BAR_COLORS[index]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FounderDashboardPage;