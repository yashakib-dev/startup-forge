"use client";

import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaSearch, FaSyncAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { getAllTransactions } from '@/lib/actions/transactions-admin';
import toast from 'react-hot-toast';

const statusConfig = {
    succeeded: { label: "Succeeded", icon: FaCheckCircle, class: "bg-emerald-950/60 text-emerald-400 border-emerald-800/40" },
    failed: { label: "Failed", icon: FaTimesCircle, class: "bg-red-950/60 text-red-400 border-red-800/40" },
    pending: { label: "Pending", icon: FaClock, class: "bg-amber-950/60 text-amber-400 border-amber-800/40" }
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig.succeeded;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.class}`}>
            <Icon className="size-2.5" /> {cfg.label}
        </span>
    );
};

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await getAllTransactions();
            setTransactions(data);
        } catch {
            toast.error("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    const filtered = transactions.filter(t =>
        t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = filtered.reduce((acc, t) => t.status === "succeeded" ? acc + t.amount : acc, 0);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-600/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                            <FaMoneyBillWave className="size-3.5" /> Administration
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Transactions
                        </h1>
                        <p className="text-zinc-400 text-sm">View all Stripe payment transactions from premium subscriptions.</p>
                    </div>
                    <div className="flex items-center gap-3 self-start md:self-center">
                        {!loading && (
                            <div className="text-right hidden sm:block">
                                <div className="text-xs text-zinc-500">Total Revenue</div>
                                <div className="text-lg font-bold text-emerald-400">${totalRevenue.toFixed(2)}</div>
                            </div>
                        )}
                        <button
                            onClick={fetchTransactions}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
                        >
                            <FaSyncAlt className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/30 border border-zinc-800/60 p-4 rounded-2xl backdrop-blur-md">
                    <div className="relative w-full sm:max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                            <FaSearch className="size-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, email, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800/80 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <div className="text-xs text-zinc-500 font-medium">
                        {filtered.length} of {transactions.length} records
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl animate-pulse flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-zinc-800 rounded w-1/4" />
                                    <div className="h-3 bg-zinc-800 rounded w-1/3" />
                                </div>
                                <div className="h-5 bg-zinc-800 rounded w-16" />
                                <div className="h-5 bg-zinc-800 rounded w-24" />
                                <div className="h-5 bg-zinc-800 rounded w-20" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900/20 border border-zinc-850/60 rounded-3xl space-y-3">
                        <FaMoneyBillWave className="size-10 text-zinc-700 mx-auto" />
                        <h3 className="text-base font-semibold text-zinc-300">No transactions found</h3>
                        <p className="text-zinc-500 text-xs max-w-xs mx-auto">Stripe payments will appear here once users complete checkout.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-md shadow-xl">
                            <table className="min-w-full divide-y divide-zinc-800/60 text-left">
                                <thead className="bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Payment Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-850/40 text-sm">
                                    {filtered.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-zinc-850/25 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-zinc-300 text-xs uppercase">
                                                        {txn.userName.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-zinc-100 group-hover:text-white transition-colors">{txn.userName}</div>
                                                        <div className="text-xs text-zinc-400">{txn.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-emerald-400">
                                                ${Number(txn.amount).toFixed(2)} <span className="text-zinc-500 font-normal text-xs">{txn.currency}</span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400 text-xs">
                                                {new Date(txn.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                                <div className="text-zinc-600">{new Date(txn.date).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={txn.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filtered.map((txn) => (
                                <div key={txn.id} className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl space-y-3 backdrop-blur-md">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-zinc-300 text-xs uppercase">
                                                {txn.userName.slice(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-zinc-100 text-sm">{txn.userName}</h4>
                                                <p className="text-xs text-zinc-400">{txn.email}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={txn.status} />
                                    </div>
                                    <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
                                        <span className="text-emerald-400 font-bold">
                                            ${Number(txn.amount).toFixed(2)} <span className="text-zinc-500 font-normal text-xs">{txn.currency}</span>
                                        </span>
                                        <span className="text-xs text-zinc-500">
                                            {new Date(txn.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;
