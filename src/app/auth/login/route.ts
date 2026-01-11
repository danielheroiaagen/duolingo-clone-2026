import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// ============================================
// AUTH LOGIN ROUTE - Handles OAuth redirect
// ============================================

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const provider = formData.get("provider") as string;
  const redirectTo = formData.get("redirect") as string || "/learn";

  const supabase = await createClient();

  if (provider === "google") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      console.error("[Auth] OAuth error:", error.message);
      redirect("/login?error=oauth_failed");
    }

    if (data.url) {
      redirect(data.url);
    }
  }

  redirect("/login?error=invalid_provider");
}
