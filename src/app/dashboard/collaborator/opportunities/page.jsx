import React, { Suspense } from 'react';
import OpportunitiesClient from './OpportunitiesClient';

const OpportunitiesPage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                </div>
            }
        >
            <OpportunitiesClient />
        </Suspense>
    );
};

export default OpportunitiesPage;
