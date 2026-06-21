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