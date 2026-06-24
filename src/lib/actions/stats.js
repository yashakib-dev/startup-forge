"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// --- Founder Stats (calls backend API) ---
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

        return { totalOpportunities, totalApplications, accepted, pending, rejected };
    } catch {
        return { totalOpportunities: 0, totalApplications: 0, accepted: 0, pending: 0, rejected: 0 };
    }
};

// --- Collaborator Stats (calls backend API) ---
export const getCollaboratorStats = async (collaboratorId) => {
    try {
        const appRes = await fetch(`${baseUrl}/api/applications?applicantId=${collaboratorId}`, { cache: 'no-store' });
        const applications = appRes.ok ? await appRes.json() : [];

        const totalApplications = Array.isArray(applications) ? applications.length : 0;
        const accepted = Array.isArray(applications) ? applications.filter(a => a.status === 'accepted' || a.status === 'Approved').length : 0;
        const pending = Array.isArray(applications) ? applications.filter(a => a.status === 'pending' || a.status === 'Pending').length : 0;
        const rejected = Array.isArray(applications) ? applications.filter(a => a.status === 'rejected' || a.status === 'Rejected').length : 0;

        return { totalApplications, accepted, pending, rejected };
    } catch {
        return { totalApplications: 0, accepted: 0, pending: 0, rejected: 0 };
    }
};

// --- Admin Stats (uses MongoDB directly — no /api/users or /api/payments backend endpoint) ---
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_DB_URI || "");
const dbName = process.env.AUTH_DB_NAME || "startupForge";

export const getAdminStats = async () => {
    try {
        const db = mongoClient.db(dbName);
        const colNames = (await db.listCollections().toArray()).map(c => c.name);

        const userCol = colNames.includes("user") ? "user" : "users";
        const paymentCol = colNames.includes("payments") ? "payments" : "payment";

        const [totalUsers, startupsRes, oppsRes, payments] = await Promise.all([
            db.collection(userCol).countDocuments(),
            fetch(`${baseUrl}/api/startups`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/opportunities`, { cache: 'no-store' }),
            db.collection(paymentCol).find({}).toArray(),
        ]);

        const startups = startupsRes.ok ? await startupsRes.json() : [];
        const opportunities = oppsRes.ok ? await oppsRes.json() : [];
        const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

        return {
            totalUsers,
            totalStartups: Array.isArray(startups) ? startups.length : 0,
            totalOpportunities: Array.isArray(opportunities) ? opportunities.length : 0,
            totalRevenue
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return { totalUsers: 0, totalStartups: 0, totalOpportunities: 0, totalRevenue: 0 };
    }
};
