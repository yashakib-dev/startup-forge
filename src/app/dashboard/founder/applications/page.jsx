"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {getApplications} from '@/lib/actions/application';
import {ApplicationsList} from '@/components/dashboard/founder-dashboard/ApplicationsList';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
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

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-white mb-4">My Applications</h2>
            {loading ? (
                <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div></div>
            ) : applications.length === 0 ? (
                <p className="text-zinc-400">No applications found</p>
            ) : (
                <ApplicationsList applications={applications} />
            )}
        </div>
    );
}