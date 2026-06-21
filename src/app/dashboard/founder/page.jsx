"use client";

import StatCard from "@/components/dashboard/founder-dashboard/StatCard";
import { Rocket, FileText, Persons } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
const FounderDashboardPage = () => {
    const stats = [
        {
            title: "Total Opportunities",
            value: "12",
            icon: Rocket,
            description: "Active listings looking for talent",
            trend: "+2 new",
            trendColor: "text-blue-400",
        },
        {
            title: "Total Applications",
            value: "48",
            icon: FileText,
            description: "Applications submitted by collaborators",
            trend: "+15% weekly",
            trendColor: "text-emerald-400",
        },
        {
            title: "Accepted Members",
            value: "8",
            icon: Persons,
            description: "Team members successfully joined",
            trend: "+1 new",
            trendColor: "text-indigo-400",
        },
    ];

    const { data: session, isPending } = useSession();
    if (isPending) {
        return <div className="flex flex-col items-center gap-2">
            <Spinner className="flex items-center justify-center h-screen" size="xl" />
        </div>;
    }

    const user = session?.user;
    // console.log(user);



    return (
        <div className="p-6 md:p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                    Welcome Back,{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {user.name}
                    </span>
                </h1>
                <p className="text-zinc-400 text-sm mt-2">
                    Manage your startup projects, listings, and view application stats.
                </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        description={stat.description}
                        trend={stat.trend}
                        trendColor={stat.trendColor}
                    />
                ))}
            </div>
        </div>
    );
};

export default FounderDashboardPage;