"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getApplications = async () => {
    const res = await fetch(`${baseUrl}/api/applications`, {
        cache: 'no-store'
    });
    return res.json();
}
