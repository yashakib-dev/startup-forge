"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStartups } from '@/lib/actions/startup';
import { Rocket, Tag, Layers, ArrowRight } from '@gravity-ui/icons';
import { Spinner } from '@heroui/react';

const STAGE_COLORS = {
    "Bootstrapped": "bg-zinc-800 text-zinc-300 border border-zinc-700/50",
    "Pre-Seed": "bg-blue-950/60 text-blue-300 border border-blue-800/50",
    "Seed": "bg-indigo-950/60 text-indigo-300 border border-indigo-800/50",
    "Series A": "bg-violet-950/60 text-violet-300 border border-violet-800/50",
    "Series B": "bg-purple-950/60 text-purple-300 border border-purple-800/50",
    "Series C+": "bg-pink-950/60 text-pink-300 border border-pink-800/50",
};

const FeaturedStartupsPage = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStartups().then((data) => {
            if (data && !data.error) {
                setStartups(Array.isArray(data) ? data : []);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <div className="mb-40 bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="space-y-3 text-center">
                    <h1 className="text-4xl  font-extrabold tracking-tight ">
                        Featured <span className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'>Startups</span>
                    </h1>
                    <p className="text-zinc-400 text-base max-w-2xl text-center mx-auto">
                        Discover next-generation projects, innovative ideas, and early-stage companies building the future.
                    </p>
                </div>

                {startups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
                        <Rocket className="w-12 h-12 text-zinc-600 mb-4" />
                        <h3 className="text-lg font-semibold text-zinc-300">No Startups Found</h3>
                        <p className="text-sm text-zinc-500 mt-1">Be the first to create an amazing startup!</p>
                    </div>
                ) : (
      
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {startups.slice(0,3).map((startup) => {
                            const stageBadge = STAGE_COLORS[startup.fundingStage] || "bg-zinc-850 text-zinc-400 border border-zinc-800";
                            return (
                                <div 
                                    key={startup._id || startup.id}
                                    className="group flex flex-col justify-between bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/60 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                                >
                                    <div className="space-y-4">
         
                                        <div className="flex items-center gap-4">
                                            {startup.logo ? (
                                                <img 
                                                    src={startup.logo} 
                                                    alt={startup.name} 
                                                    className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shadow-md"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                                                    <Rocket className="w-5 h-5 text-indigo-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white truncate">
                                                    {startup.name}
                                                </h3>
                                                <span className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${stageBadge}`}>
                                                    {startup.fundingStage}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                                            {startup.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1">
                                                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                                                {startup.industry}
                                            </span>
                                        </div>
                                        <Link 
                                            href={`/startup-details/${startup._id || startup.id}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Startup Details <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeaturedStartupsPage;
