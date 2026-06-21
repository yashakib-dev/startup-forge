"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createOpportunity = async (opportunityData) => {
    const res = await fetch(`${baseUrl}/api/opportunities`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(opportunityData),
    });
    return res.json();
}
export const getOpportunities = async () => {
    const res = await fetch(`${baseUrl}/api/opportunities`, { cache: 'no-store' });
    return res.json();
}

export const updateOpportunity = async (id, opportunityData) => {
    const { _id, id: rawId, ...cleanData } = opportunityData;
    const res = await fetch(`${baseUrl}/api/opportunities/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
    });
    return res.json();
}

export const deleteOpportunity = async (id) => {
    const res = await fetch(`${baseUrl}/api/opportunities/${id}`, {
        method: "DELETE",
    });
    return res.json();
}
