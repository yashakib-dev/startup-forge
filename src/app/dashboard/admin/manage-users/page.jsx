"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaUserShield, 
  FaSearch, 
  FaBan, 
  FaCheckCircle, 
  FaSyncAlt, 
  FaUserCog,
  FaCrown
} from 'react-icons/fa';
import { getAllUsers, toggleUserBlock } from '@/lib/actions/users';
import toast from 'react-hot-toast';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    const fetchUsers = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = async (userId, currentStatus) => {
        setActionId(userId);
        try {
            const res = await toggleUserBlock(userId, currentStatus);
            if (res.success) {
                toast.success(`User ${currentStatus === 'blocked' ? 'unblocked' : 'blocked'} successfully`);
                // Update local state directly to be instant and dynamic
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: res.newStatus } : u));
            } else {
                toast.error(res.message || "Failed to update user status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setActionId(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
                            <FaUserShield className="size-3.5" /> Administration
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Manage Users
                        </h1>
                        <p className="text-zinc-400 text-sm">View all registered members, manage user roles, and control platform access.</p>
                    </div>
                    <button
                        onClick={() => fetchUsers(false)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-300 hover:text-white rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50 self-start md:self-center"
                    >
                        <FaSyncAlt className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh Users</span>
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/30 border border-zinc-800/60 p-4 rounded-2xl backdrop-blur-md">
                    <div className="relative w-full sm:max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                            <FaSearch className="size-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, email, or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800/80 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-650"
                        />
                    </div>
                    <div className="text-xs text-zinc-550 font-medium">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                                    <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                                </div>
                                <div className="h-6 bg-zinc-800 rounded w-20"></div>
                                <div className="h-10 bg-zinc-800 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900/20 border border-zinc-850/60 rounded-3xl backdrop-blur-sm space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 border border-zinc-805 flex items-center justify-center text-zinc-500">
                            <FaUserCog className="size-6" />
                        </div>
                        <h3 className="text-base font-semibold text-zinc-300">No users found</h3>
                        <p className="text-zinc-500 text-xs max-w-xs mx-auto">We couldn't find any users matching your criteria. Try adjusting your search term.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-md shadow-xl">
                            <table className="min-w-full divide-y divide-zinc-800/60 text-left">
                                <thead className="bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">User Details</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-850/40 text-sm">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-850/25 transition-colors group">
                                            <td className="px-6 py-4.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-zinc-300 text-sm uppercase">
                                                        {user.name.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-zinc-100 group-hover:text-white transition-colors flex items-center gap-1.5">
                                                            {user.name}
                                                            {user.isPremium && (
                                                                <span className="text-amber-400" title="Premium Member">
                                                                    <FaCrown className="size-3" />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-zinc-400">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                    user.role === 'admin' 
                                                        ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40' 
                                                        : user.role === 'founder'
                                                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                                                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    user.status === 'blocked'
                                                        ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                                                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                                }`}>
                                                    {user.status === 'blocked' ? (
                                                        <>
                                                            <FaBan className="size-2.5" /> Blocked
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCheckCircle className="size-2.5" /> Active
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4.5 text-right">
                                                <button
                                                    onClick={() => handleToggleBlock(user.id, user.status)}
                                                    disabled={actionId !== null}
                                                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                                                        user.status === 'blocked'
                                                            ? 'bg-emerald-950/30 border-emerald-850 hover:border-emerald-700 text-emerald-400 hover:bg-emerald-900/30'
                                                            : 'bg-red-950/30 border-red-850 hover:border-red-700 text-red-400 hover:bg-red-900/30'
                                                    }`}
                                                >
                                                    {actionId === user.id ? (
                                                        <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : user.status === 'blocked' ? (
                                                        <>
                                                            <FaCheckCircle className="size-3" /> Unblock
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaBan className="size-3" /> Block
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Responsive Cards View */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filteredUsers.map((user) => (
                                <div 
                                    key={user.id} 
                                    className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl space-y-4 backdrop-blur-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-zinc-300 text-xs uppercase">
                                                {user.name.slice(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-zinc-100 flex items-center gap-1">
                                                    {user.name}
                                                    {user.isPremium && <FaCrown className="size-3 text-amber-400" />}
                                                </h4>
                                                <p className="text-xs text-zinc-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                            user.role === 'admin' 
                                                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40' 
                                                : user.role === 'founder'
                                                ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                                                : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            user.status === 'blocked'
                                                ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                                                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                        }`}>
                                            {user.status === 'blocked' ? (
                                                <>
                                                    <FaBan className="size-2.5" /> Blocked
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle className="size-2.5" /> Active
                                                </>
                                            )}
                                        </span>

                                        <button
                                            onClick={() => handleToggleBlock(user.id, user.status)}
                                            disabled={actionId !== null}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                                                user.status === 'blocked'
                                                    ? 'bg-emerald-950/30 border-emerald-850 hover:border-emerald-700 text-emerald-400'
                                                    : 'bg-red-950/30 border-red-850 hover:border-red-700 text-red-400'
                                            }`}
                                        >
                                            {actionId === user.id ? (
                                                <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : user.status === 'blocked' ? (
                                                <>
                                                    <FaCheckCircle className="size-3" /> Unblock
                                                </>
                                            ) : (
                                                <>
                                                    <FaBan className="size-3" /> Block
                                                </>
                                            )}
                                        </button>
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

export default ManageUsersPage;
