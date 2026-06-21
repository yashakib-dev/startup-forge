const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const getStartupIdea = async () => {
    const res = await fetch(`${baseUrl}/api/startups`);
    return res.json();
}       