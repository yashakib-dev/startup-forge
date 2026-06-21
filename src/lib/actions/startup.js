"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createStartup = async (startupData) => {
    const res = await fetch(`${baseUrl}/api/startups`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(startupData),
    });
    return res.json();
}

export const updateStartup = async (id, startupData) => {
    const { _id, id: rawId, ...cleanData } = startupData;
    const res = await fetch(`${baseUrl}/api/startups/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
    });
    return res.json();
}

export const deleteStartup = async (id) => {
    const res = await fetch(`${baseUrl}/api/startups/${id}`, {
        method: "DELETE",
    });
    return res.json();
}

export const getStartupById = async (id) => {
    try {
        const res = await fetch(`${baseUrl}/api/startups/${id}`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            return { error: "Failed to fetch startup details" };
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching startup by ID:", error);
        return { error: error.message };
    }
}

export const getStartups = async () => {
    try {
        const res = await fetch(`${baseUrl}/api/startups`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            return { error: "Failed to fetch startups" };
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching startups:", error);
        return { error: error.message };
    }
}

