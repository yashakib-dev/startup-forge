import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req) {
  const { role } = await req.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await db.collection("user").updateOne(
    {
      email: session.user.email,
    },
    {
      $set: { role },
    }
  );

  return Response.json({
    success: true,
  });
}