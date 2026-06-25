"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getOpportunities } from '@/lib/actions/opportunity';
import { Briefcase, ArrowRight, Tag, PersonPlus } from '@gravity-ui/icons';
import { Spinner } from '@heroui/react';

const OpportunitiesPage = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [commitment, setCommitment] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const commitmentOptions = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
    const itemsPerPage = 9;

    const fetchOpportunities = useCallback(async () => {
        setLoading(true);
        const data = await getOpportunities({
            search: search.trim(),
            commitment: commitment,
            page: currentPage,
            limit: itemsPerPage
        });
        
        console.log('API Response:', data);
        
        if (data) {
            const opportunities = data.data || data || [];
            const total = data.total || (Array.isArray(data) ? data.length : 0);
            
            setOpportunities(Array.isArray(opportunities) ? opportunities : []);
            setTotalResults(total);
            setTotalPages(Math.ceil(total / itemsPerPage));
        } else {
            setOpportunities([]);
            setTotalResults(0);
            setTotalPages(0);
        }
        setLoading(false);
    }, [search, commitment, currentPage]);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    const handleClearFilters = () => {
        setSearch('');
        setCommitment('');
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Reset to page 1 when search or commitment changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search, commitment]);

    const hasActiveFilters = search || commitment;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Explore Opportunities
                    </h1>
                    <p className="text-zinc-400 text-base max-w-2xl">
                        Find projects looking for your skills. Collaborate with top founders and build the next big thing together.
                    </p>
                </div>

                {/* Search & Filter Section */}
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by title or skills..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    {/* Filter Toggle Button */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 border border-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all text-sm font-medium"
                        >
                            <Tag className="w-4 h-4" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-all text-sm font-medium"
                            >
                                ✕ Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl backdrop-blur-sm">
                            {/* Commitment Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">Commitment</label>
                                <select
                                    value={commitment}
                                    onChange={(e) => setCommitment(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                                >
                                    <option value="">All Commitments</option>
                                    {commitmentOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2">
                            {search && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/40 border border-indigo-800/50 rounded-full text-xs font-medium text-indigo-300">
                                    Search: {search}
                                </span>
                            )}
                            {commitment && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/40 border border-indigo-800/50 rounded-full text-xs font-medium text-indigo-300">
                                    Commitment: {commitment}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-60 bg-zinc-950">
                        <Spinner size="xl" />
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
                        <Briefcase className="w-12 h-12 text-zinc-600 mb-4" />
                        <h3 className="text-lg font-semibold text-zinc-300">
                            {hasActiveFilters ? 'No Opportunities Match Your Filters' : 'No Opportunities Available'}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">
                            {hasActiveFilters ? 'Try adjusting your search criteria.' : 'Check back later or check another section.'}
                        </p>
                    </div>
                ) : (
                    /* Grid Layout with Pagination */
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {opportunities.map((opportunity) => (
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
                                                    {opportunity.title}
                                                </h3>
                                                <p className="text-xs text-indigo-400 mt-0.5 font-medium">
                                                    {opportunity.startupName || "Startup Opportunity"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                                            {opportunity.description}
                                        </p>

                                        {/* Badges / Tags */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {opportunity.role && (
                                                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                                                    {opportunity.role}
                                                </span>
                                            )}
                                            {opportunity.location && (
                                                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                                                    {opportunity.location}
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
                                            href={`/opportunitie-details/${opportunity._id || opportunity.id}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                                <div className="text-sm text-zinc-400">
                                    Showing <span className="font-semibold text-zinc-300">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                    <span className="font-semibold text-zinc-300">{Math.min(currentPage * itemsPerPage, totalResults)}</span> of{' '}
                                    <span className="font-semibold text-zinc-300">{totalResults}</span> opportunities
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-zinc-900/40 border border-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                                    >
                                        ← Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                                    currentPage === page
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-zinc-900/40 border border-zinc-800 text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-700'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-zinc-900/40 border border-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpportunitiesPage;
