"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getApplications = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const url = `${baseUrl}/api/applications${query ? `?${query}` : ''}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
}

export const createApplication = async (applicationData) => {
    try {
        const res = await fetch(`${baseUrl}/api/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(applicationData),
        });
        return res.json();
    } catch (error) {
        console.error("Error creating application:", error);
        return { error: error.message };
    }
}

export const updateApplication = async (id, applicationData) => {
    try {
        const { _id, id: rawId, ...cleanData } = applicationData;
        const res = await fetch(`${baseUrl}/api/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cleanData),
        });
        return res.json();
    } catch (error) {
        console.error("Error updating application:", error);
        return { error: error.message };
    }
}
