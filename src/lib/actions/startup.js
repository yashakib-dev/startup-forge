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