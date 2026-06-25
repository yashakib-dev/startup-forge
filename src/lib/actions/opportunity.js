"use server"

import { headers } from "next/headers";
import { auth } from "../auth";

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

export const getOpportunities = async (filters = {}) => {
    try {
        const { search = '', commitment = '', page = 1, limit = 9 } = filters;
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (commitment) params.append('commitment', commitment);
        params.append('page', page);
        params.append('limit', limit);
        
        const queryString = params.toString();
        const url = `${baseUrl}/api/opportunities?${queryString}`;
        
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return { data: [], total: 0 };
        
        const response = await res.json();
        
        // Handle both paginated format { data, total } and array format
        if (Array.isArray(response)) {
            return { data: response, total: response.length };
        }
        
        return response;
    } catch (error) {
        console.error("Error fetching opportunities:", error);
        return { data: [], total: 0 };
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
        const {token} = await auth.api.getToken({
            headers: await headers()
        })
        console.log(token);
        
        const res = await fetch(`${baseUrl}/api/opportunities/${id}`, 
            {
                 cache: 'no-store', 
                 headers: {
                    "Authorization": `Bearer ${token}`
                 }
            });
        if (!res.ok) return { error: "Failed to fetch opportunity details" };
        return res.json();
    } catch (error) {
        console.error("Error fetching opportunity by ID:", error);
        return { error: error.message };
    }
}
