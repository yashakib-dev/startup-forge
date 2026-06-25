"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, ArrowRight, PersonPlus, ChevronLeft, ChevronRight } from '@gravity-ui/icons';
import { Spinner } from '@heroui/react';
import { getOpportunitiesPaginated } from '@/lib/actions/opportunity';

const PAGE_SIZE = 9;

const Pagination = ({ page, totalPages, onChange }) => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="size-4" /> Prev
            </button>
            <div className="flex gap-1 flex-wrap justify-center">
                {pages.map(p => (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={`size-9 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                            p === page
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Next <ChevronRight className="size-4" />
            </button>
        </div>
    );
};

const OpportunitiesClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    const [opportunities, setOpportunities] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchPage = useCallback(async (page) => {
        setLoading(true);
        try {
            const result = await getOpportunitiesPaginated(page, PAGE_SIZE);
            setOpportunities(result.data || []);
            setTotal(result.total || 0);
            setTotalPages(result.totalPages || 1);
        } catch {
            setOpportunities([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPage(currentPage);
    }, [currentPage, fetchPage]);

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page);
        router.push(`?${params.toString()}`, { scroll: true });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Explore Opportunities
                    </h1>
                    <p className="text-zinc-400 text-base max-w-2xl">
                        Find projects looking for your skills. Collaborate with top founders and build the next big thing together.
                    </p>
                    {!loading && total > 0 && (
                        <p className="text-xs text-zinc-500">
                            Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total} opportunities
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Spinner size="xl" />
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
                        <Briefcase className="w-12 h-12 text-zinc-600 mb-4" />
                        <h3 className="text-lg font-semibold text-zinc-300">No Opportunities Available</h3>
                        <p className="text-sm text-zinc-500 mt-1">Check back later or check another section.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {opportunities.map((opportunity) => (
                                <div
                                    key={opportunity._id || opportunity.id}
                                    className="group flex flex-col justify-between bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/60 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-zinc-800 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white truncate">
                                                    {opportunity.title}
                                                </h3>
                                                <p className="text-xs text-indigo-400 mt-0.5 font-medium">
                                                    {opportunity.startupName || 'Startup Opportunity'}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                                            {opportunity.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {opportunity.workType && (
                                                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                                                    {opportunity.workType}
                                                </span>
                                            )}
                                            {opportunity.commitment && (
                                                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                                                    {opportunity.commitment}
                                                </span>
                                            )}
                                            {(opportunity.skills || []).slice(0, 2).map((skill, i) => (
                                                <span key={i} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

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

                        <Pagination page={currentPage} totalPages={totalPages} onChange={handlePageChange} />
                    </>
                )}
            </div>
        </div>
    );
};

export default OpportunitiesClient;
