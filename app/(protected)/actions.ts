"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["Funktionär", "Tävlingsdansare", "Annat"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function requestAccess(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Du måste vara inloggad." };
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const roleRaw =
    (formData.get("communityRole") as string | null)?.trim() ?? "";
  const roleOther =
    (formData.get("communityRoleOther") as string | null)?.trim() ?? "";

  if (!name) {
    return { error: "Namn krävs." };
  }

  if (!ALLOWED_ROLES.includes(roleRaw as AllowedRole)) {
    return { error: "Välj en giltig roll." };
  }
  const roleChoice = roleRaw as AllowedRole;

  let communityRole: string;
  if (roleChoice === "Annat") {
    if (!roleOther) {
      return { error: "Vänligen beskriv din roll." };
    }
    communityRole = roleOther;
  } else {
    communityRole = roleChoice;
  }

  // Trust the server-side session email rather than whatever came over the
  // wire — the client field is only `readOnly`, not actually locked.
  const safeEmail = user.email ?? "";

  // Check for existing pending request
  const { data: existing } = await supabase
    .from("access_requests")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    return { error: "Du har redan en väntande förfrågan." };
  }

  const { error: insertError } = await supabase.from("access_requests").insert({
    user_id: user.id,
    name,
    email: safeEmail,
    community_role: communityRole,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
