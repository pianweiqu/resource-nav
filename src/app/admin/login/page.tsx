import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSiteConfig } from "@/lib/site";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  return <LoginForm site={getSiteConfig()} />;
}
