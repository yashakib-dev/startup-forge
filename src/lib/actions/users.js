"use server";

import { MongoClient, ObjectId } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_DB_URI || "");
const dbName = process.env.AUTH_DB_NAME || "startupForge";

// Helper to get collection name safely
async function getUserCollection(db) {
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);
    return names.includes("user") ? "user" : (names.includes("users") ? "users" : "user");
}

export async function getAllUsers() {
    try {
        const db = mongoClient.db(dbName);
        const colName = await getUserCollection(db);
        const users = await db.collection(colName).find({}).toArray();

        // Map users to clean objects and ensure they have a status
        return users.map(user => ({
            id: user.id || user._id.toString(),
            _id: user._id.toString(),
            name: user.name || "Unnamed User",
            email: user.email || "No Email",
            role: user.role || "collaborator",
            status: user.status || "active",
            isPremium: !!user.isPremium
        }));
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return [];
    }
}

export async function toggleUserBlock(userId, currentStatus) {
    try {
        const db = mongoClient.db(dbName);
        const colName = await getUserCollection(db);

        const newStatus = currentStatus === "blocked" ? "active" : "blocked";

        let filter = { id: userId };
        let user = await db.collection(colName).findOne({ id: userId });

        if (!user && ObjectId.isValid(userId)) {
            user = await db.collection(colName).findOne({ _id: new ObjectId(userId) });
            if (user) filter = { _id: new ObjectId(userId) };
        }

        if (!user) {
            user = await db.collection(colName).findOne({ _id: userId });
            if (user) filter = { _id: userId };
        }

        if (!user) {
            return { success: false, message: "User not found" };
        }

        await db.collection(colName).updateOne(filter, {
            $set: { status: newStatus }
        });

        return { success: true, newStatus };
    } catch (error) {
        console.error("Error in toggleUserBlock:", error);
        return { success: false, message: error.message };
    }
}
