"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getApplications } from '@/lib/actions/application';
import { ApplicationsList } from '@/components/dashboard/founder-dashboard/ApplicationsList';
import { useSession } from '@/lib/auth-client';
import { Spinner } from '@heroui/react';

export default function ApplicationsPage() {
    const { data: session, isPending } = useSession();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadApplications = async () => {
        if (!session?.user?.id) return;
        setLoading(true);
        try {
            const res = await getApplications(); 
            const data = Array.isArray(res) ? res : res.applications || [];
            setApplications(data);
        } catch (err) {
            toast.error("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isPending && session?.user?.id) {
            loadApplications();
        }
    }, [session, isPending]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-6 bg-zinc-950 min-h-screen text-white">
            <h2 className="text-3xl font-extrabold tracking-tight">
                Received{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Applications
                </span>
            </h2>
            <p className="text-zinc-400 text-sm">
                Manage applications submitted by collaborators for your startup opportunities.
            </p>
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Spinner size="md" />
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-12 border border-zinc-800 rounded-2xl bg-zinc-900/10">
                    <p className="text-zinc-400">No applications found</p>
                </div>
            ) : (
                <ApplicationsList applications={applications} onUpdate={loadApplications} />
            )}
        </div>
    );
}