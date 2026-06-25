import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({

  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "founder",
        required: false,
      },
    },
  },
  plan: {
    default: "founder_free"
  },
      session: {
      cookieCache: {
        enabled: true,
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, 
      },
    },
   plugins: [
        jwt(), 
    ],

  database: mongodbAdapter(db, {
    client,
  }),
  
});