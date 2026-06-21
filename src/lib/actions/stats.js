"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getFounderStats = async (founderId) => {
    try {
        const [opRes, appRes] = await Promise.all([
            fetch(`${baseUrl}/api/opportunities?founderId=${founderId}`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/applications?founderId=${founderId}`, { cache: 'no-store' }),
        ]);

        const opportunities = opRes.ok ? await opRes.json() : [];
        const applications = appRes.ok ? await appRes.json() : [];

        const totalOpportunities = Array.isArray(opportunities) ? opportunities.length : 0;
        const totalApplications = Array.isArray(applications) ? applications.length : 0;
        const accepted = Array.isArray(applications) ? applications.filter(a => a.status === 'accepted').length : 0;
        const pending = Array.isArray(applications) ? applications.filter(a => a.status === 'pending').length : 0;
        const rejected = Array.isArray(applications) ? applications.filter(a => a.status === 'rejected').length : 0;

        return {
            totalOpportunities,
            totalApplications,
            accepted,
            pending,
            rejected,
        };
    } catch {
        return { totalOpportunities: 0, totalApplications: 0, accepted: 0, pending: 0, rejected: 0 };
    }
};
