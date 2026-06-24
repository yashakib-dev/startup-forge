export const getPlanById = async (plan_id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plans?plan_id=${plan_id}`);
        if (!response.ok) return null;
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error("Error fetching plan:", error);
        return null;
    }
}