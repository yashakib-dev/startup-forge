"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createOpportunity = async (opportunityData) => {
    try {
        const res = await fetch(`${baseUrl}/api/opportunities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(opportunityData),
        });
        return res.json();
    } catch (error) {
        console.error("Error creating opportunity:", error);
        return { error: error.message };
    }
}

export const getOpportunities = async () => {
    try {
        const res = await fetch(`${baseUrl}/api/opportunities`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error fetching opportunities:", error);
        return [];
    }
}

export const updateOpportunity = async (id, opportunityData) => {
    try {
        const { _id, id: rawId, ...cleanData } = opportunityData;
        const res = await fetch(`${baseUrl}/api/opportunities/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cleanData),
        });
        return res.json();
    } catch (error) {
        console.error("Error updating opportunity:", error);
        return { error: error.message };
    }
}

export const deleteOpportunity = async (id) => {
    try {
        const res = await fetch(`${baseUrl}/api/opportunities/${id}`, {
            method: "DELETE",
        });
        return res.json();
    } catch (error) {
        console.error("Error deleting opportunity:", error);
        return { error: error.message };
    }
}

export const getOpportunityById = async (id) => {
    try {
        const res = await fetch(`${baseUrl}/api/opportunities/${id}`, { cache: 'no-store' });
        if (!res.ok) return { error: "Failed to fetch opportunity details" };
        return res.json();
    } catch (error) {
        console.error("Error fetching opportunity by ID:", error);
        return { error: error.message };
    }
}
