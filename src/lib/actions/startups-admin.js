"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// getAllStartupsAdmin → calls backend GET /api/startups
export async function getAllStartupsAdmin() {
    try {
        const res = await fetch(`${baseUrl}/api/startups`, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        return list.map(startup => ({
            id: startup._id || startup.id,
            name: startup.name || "Unnamed Startup",
            email: startup.email || startup.founderEmail || "No Email",
            status: startup.status || "pending",
            industry: startup.industry || "General"
        }));
    } catch (error) {
        console.error("Error in getAllStartupsAdmin:", error);
        return [];
    }
}

// approveStartup → calls backend PATCH /api/startups/:id
export async function approveStartup(startupId) {
    try {
        const res = await fetch(`${baseUrl}/api/startups/${startupId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "approved" }),
        });
        if (!res.ok) return { success: false, message: "Failed to approve startup" };
        return { success: true };
    } catch (error) {
        console.error("Error in approveStartup:", error);
        return { success: false, message: error.message };
    }
}

// removeStartup → calls backend DELETE /api/startups/:id
export async function removeStartup(startupId) {
    try {
        const res = await fetch(`${baseUrl}/api/startups/${startupId}`, {
            method: "DELETE",
        });
        if (!res.ok) return { success: false, message: "Failed to remove startup" };
        return { success: true };
    } catch (error) {
        console.error("Error in removeStartup:", error);
        return { success: false, message: error.message };
    }
}
