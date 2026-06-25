import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (!session.user.role) {
    redirect("/complete-profile");
  }

  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  if (session.user.role === "founder") {
    redirect("/dashboard/founder");
  }

  if (session.user.role === "collaborator") {
    redirect("/dashboard/collaborator");
  }

  return null;
}