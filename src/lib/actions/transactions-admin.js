"use server";

import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_DB_URI || "");
const dbName = process.env.AUTH_DB_NAME || "startupForge";

export async function getAllTransactions() {
    try {
        const db = mongoClient.db(dbName);

        const collections = await db.listCollections().toArray();
        const names = collections.map(c => c.name);
        const paymentCol = names.includes("payments") ? "payments" : (names.includes("payment") ? "payment" : "payments");
        const userCol = names.includes("user") ? "user" : (names.includes("users") ? "users" : "user");

        const payments = await db.collection(paymentCol).find({}).sort({ createdAt: -1 }).toArray();
        const users = await db.collection(userCol).find({}).toArray();

        const userMap = new Map();
        users.forEach(u => {
            const idKey = u.id || u._id.toString();
            userMap.set(idKey, u.name || "Unnamed User");
        });

        return payments.map(p => ({
            id: p._id.toString(),
            email: p.email || "No Email",
            userName: userMap.get(p.userId) || "Platform Member",
            amount: p.amount || 0,
            currency: p.currency ? p.currency.toUpperCase() : "USD",
            status: p.status || "succeeded",
            date: p.createdAt instanceof Date ? p.createdAt.toISOString() : (p.createdAt || new Date().toISOString())
        }));
    } catch (error) {
        console.error("Error in getAllTransactions:", error);
        return [];
    }
}
