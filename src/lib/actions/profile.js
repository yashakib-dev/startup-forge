"use server"

import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const dbName = process.env.AUTH_DB_NAME || "startupForge";

async function getDb() {
  return client.db(dbName);
}

export async function getUserProfile(userId) {
  try {
    const db = await getDb();
    
    // Search user by string id, _id as string, or _id as ObjectId
    let query = { id: userId };
    
    let user = await db.collection("user").findOne(query);
    
    if (!user && ObjectId.isValid(userId)) {
      user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
    }
    
    if (!user) {
      user = await db.collection("user").findOne({ _id: userId });
    }

    if (!user) {
      return { success: false, message: "User not found" };
    }
    
    return {
      success: true,
      user: {
        id: user.id || user._id.toString(),
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        role: user.role || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        bio: user.bio || "",
      }
    };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return { success: false, message: error.message };
  }
}

export async function updateUserProfile(userId, { name, image, skills, bio }) {
  try {
    const db = await getDb();
    
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (image !== undefined) updateFields.image = image;
    if (skills !== undefined) updateFields.skills = skills;
    if (bio !== undefined) updateFields.bio = bio;

    // We search by string id, or by ObjectId/string _id
    let user = await db.collection("user").findOne({ id: userId });
    let filter = { id: userId };
    
    if (!user && ObjectId.isValid(userId)) {
      user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
      if (user) {
        filter = { _id: new ObjectId(userId) };
      }
    }
    
    if (!user) {
      user = await db.collection("user").findOne({ _id: userId });
      if (user) {
        filter = { _id: userId };
      }
    }

    if (!user) {
      return { success: false, message: "User not found to update" };
    }

    const result = await db.collection("user").updateOne(filter, { $set: updateFields });

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return { success: false, message: error.message };
  }
}
