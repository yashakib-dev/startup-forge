"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStartupById } from "@/lib/actions/startup";
import { ArrowLeft, Rocket, Envelope, Tag, Layers } from "@gravity-ui/icons";
import { Spinner } from "@heroui/react";

const STAGE_COLORS = {
    "Bootstrapped": "bg-zinc-800 text-zinc-300",
    "Pre-Seed": "bg-blue-950/60 text-blue-300 border border-blue-800/50",
    "Seed": "bg-indigo-950/60 text-indigo-300 border border-indigo-800/50",
    "Series A": "bg-violet-950/60 text-violet-300 border border-violet-800/50",
    "Series B": "bg-purple-950/60 text-purple-300 border border-purple-800/50",
    "Series C+": "bg-pink-950/60 text-pink-300 border border-pink-800/50",
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-800/60 last:border-0">
        <div className="p-2 rounded-lg bg-zinc-800/60 text-indigo-400 mt-0.5">
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-zinc-100">{value}</p>
        </div>
    </div>
);

const StartupDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        getStartupById(id).then((data) => {
            if (!data || data.error) setNotFound(true);
            else setStartup(data);
            setLoading(false);
        });
    }, [id]);
    console.log(startup, "startup");


    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
            <Spinner size="xl" />
        </div>
    );

    if (notFound) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-400 gap-4">
            <Rocket className="w-12 h-12 opacity-30" />
            <p className="text-lg font-semibold">Startup not found</p>
            <button onClick={() => router.back()} className="text-sm text-indigo-400 hover:underline cursor-pointer">Go back</button>
        </div>
    );

    const stageBadge = STAGE_COLORS[startup.fundingStage] || "bg-zinc-800 text-zinc-300";

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Back */}
                <button onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Hero Card */}
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">

                    {/* Logo + Name + Badge */}
                    <div className="flex items-center gap-5">
                        {startup.logo ? (
                            <img src={startup.logo} alt={startup.name}
                                className="w-16 h-16 rounded-2xl object-cover border border-zinc-700 shadow-lg" />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
                                <Rocket className="w-7 h-7 text-indigo-400" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent truncate">
                                {startup.name}
                            </h1>
                            <span className={`mt-1 inline-block text-xs font-semibold px-3 py-1 rounded-full ${stageBadge}`}>
                                {startup.fundingStage}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-zinc-800/40 rounded-2xl p-4 border border-zinc-700/40">
                        <p className="text-xs text-zinc-500 mb-1">Description</p>
                        <p className="text-sm text-zinc-200 leading-relaxed">{startup.description}</p>
                    </div>

                    {/* Info Rows */}
                    <div className="bg-zinc-800/20 rounded-2xl px-4 border border-zinc-800/40">
                        <InfoRow icon={Envelope} label="Founder Email" value={startup.email} />
                        <InfoRow icon={Tag} label="Industry" value={startup.industry} />
                        <InfoRow icon={Layers} label="Funding Stage" value={startup.fundingStage} />
                    </div>

                    {/* Action */}
                    <button onClick={() => router.push("/dashboard/founder/startup")}
                        className="w-full text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:opacity-95 transition-all">
                        <Rocket className="w-4 h-4" /> Go to My Startups
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartupDetailsPage;
