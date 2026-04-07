"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/permissions";

export async function assignRole(
  formData: FormData
): Promise<{ error?: string; message?: string }> {
  await requireRole("admin");

  const userId = formData.get("userId") as string;
  const roleId = formData.get("roleId") as string;

  if (!userId || !roleId) {
    return { error: "Användar-ID och roll krävs." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("user_roles").upsert(
    {
      user_id: userId,
      role_id: roleId,
      assigned_by: user?.id,
    },
    {
      onConflict: "user_id,role_id",
    }
  );

  if (error) {
    return { error: error.message };
  }

  return { message: "Roll tilldelad." };
}
