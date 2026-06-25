"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOpportunities } from '@/lib/actions/opportunity';
import { Briefcase, ArrowRight, Tag, Calendar, PersonPlus } from '@gravity-ui/icons';
import { Spinner } from '@heroui/react';

const FeaturedOpportunitiesPage = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOpportunities().then((data) => {
            if (data && !data.error) {
                setOpportunities(Array.isArray(data) ? data : data?.data || []);
            }
            setLoading(false);
        });
    }, []);
        console.log("Opportunities data:", opportunities);
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <div className="mb-20 bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="space-y-3 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Featured <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Opportunities</span>
                    </h1>
                    <p className="text-zinc-400 text-base max-w-2xl text-center mx-auto">
                        Find projects looking for your skills. Collaborate with top founders and build the next big thing together.
                    </p>
                </div>

                {opportunities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
                        <Briefcase className="w-12 h-12 text-zinc-600 mb-4" />
                        <h3 className="text-lg font-semibold text-zinc-300">No Opportunities Available</h3>
                        <p className="text-sm text-zinc-500 mt-1">Check back later or check another section.</p>
                    </div>
                ) : (
                    /* Grid Layout */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.slice(0, 3).map((opportunity) => (
                            <div
                                key={opportunity._id || opportunity.id}
                                className="group flex flex-col justify-between bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/60 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                            >
                                <div className="space-y-4">
                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-zinc-800 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white truncate">
                                                {opportunity?.title}
                                            </h3>
                                            <p className="text-xs text-indigo-400 mt-0.5 font-medium">
                                                {opportunity.startupName || "Startup Opportunity"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                                        {opportunity?.description}
                                    </p>

                                    {/* Badges / Tags */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {opportunity?.role && (
                                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                                                {opportunity.role}
                                            </span>
                                        )}
                                        {opportunity?.location && (
                                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                                                {opportunity?.location}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer & Action */}
                                <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <PersonPlus className="w-3.5 h-3.5 text-zinc-400" />
                                        <span>Apply Now</span>
                                    </div>
                                    <Link
                                        href={`/opportunity-details/${opportunity._id || opportunity.id}`}
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeaturedOpportunitiesPage;