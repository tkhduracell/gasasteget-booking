"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestAccess(
  formData: FormData
): Promise<{ error?: string; message?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Du måste vara inloggad." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const communityRole = formData.get("communityRole") as string;

  if (!name || !email || !communityRole) {
    return { error: "Alla fält krävs." };
  }

  // Check for existing pending request
  const { data: existing } = await supabase
    .from("access_requests")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .limit(1)
    .single();

  if (existing) {
    return { error: "Du har redan en väntande förfrågan." };
  }

  const { error } = await supabase.from("access_requests").insert({
    user_id: user.id,
    name,
    email,
    community_role: communityRole,
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "Förfrågan skickad." };
}
