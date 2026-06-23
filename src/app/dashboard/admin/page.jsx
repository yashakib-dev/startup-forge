import React from 'react';

const AdminDashboardPage = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Admin Dashboard
            </h1>
            <p className="text-zinc-400 text-sm">Welcome to the administration panel.</p>
        </div>
    );
};

export default AdminDashboardPage;
