"use server";

import { MongoClient, ObjectId } from "mongodb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const client = new MongoClient(process.env.MONGO_DB_URI || "");
const dbName = process.env.AUTH_DB_NAME || "startupForge";

export async function getPremiumStatus(userId) {
  try {
    const db = client.db(dbName);
    let user = await db.collection("user").findOne({ id: userId });
    
    if (!user && ObjectId.isValid(userId)) {
      user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
    }
    
    if (!user) {
      user = await db.collection("user").findOne({ _id: userId });
    }

    return { isPremium: !!user?.isPremium };
  } catch (error) {
    console.error("Error in getPremiumStatus:", error);
    return { isPremium: false };
  }
}

export async function verifyStripeSubscription(sessionId, userId) {
  try {
    if (!sessionId) return { success: false, message: "No session ID" };
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid" || session.status === "complete") {
      const db = client.db(dbName);
      
      let filter = { id: userId };
      let user = await db.collection("user").findOne({ id: userId });
      
      if (!user && ObjectId.isValid(userId)) {
        user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
        if (user) filter = { _id: new ObjectId(userId) };
      }
      
      if (!user) {
        user = await db.collection("user").findOne({ _id: userId });
        if (user) filter = { _id: userId };
      }

      if (user) {
        await db.collection("user").updateOne(filter, { 
          $set: { 
            isPremium: true,
            plan: "founder_premium"
          } 
        });
      }

      // Record transaction
      const existing = await db.collection("payments").findOne({ sessionId });
      if (!existing) {
        await db.collection("payments").insertOne({
          userId,
          sessionId,
          amount: session.amount_total ? session.amount_total / 100 : 49.99,
          currency: session.currency || "usd",
          status: "succeeded",
          createdAt: new Date(),
          paymentIntentId: session.payment_intent || session.subscription,
          email: session.customer_details?.email,
        });
      }
      return { success: true };
    }
    return { success: false, message: "Payment not completed" };
  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, message: error.message };
  }
}
