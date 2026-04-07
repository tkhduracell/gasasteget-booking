import { createClient } from "@/lib/supabase/server";
import { AssignRoleForm } from "./assign-role-form";

export const metadata = {
  title: "Admin - Gasasteget",
};

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch all users with their roles
  const { data: userRoles } = await supabase.from("user_roles").select(`
    user_id,
    roles:role_id (
      name
    )
  `);

  // Fetch available roles
  const { data: roles } = await supabase
    .from("roles")
    .select("id, name")
    .order("name");

  // Group roles by user_id
  const userRoleMap = new Map<string, string[]>();
  if (userRoles) {
    for (const ur of userRoles) {
      const roles = userRoleMap.get(ur.user_id) ?? [];
      const roleName = (ur.roles as unknown as { name: string })?.name;
      if (roleName) {
        roles.push(roleName);
      }
      userRoleMap.set(ur.user_id, roles);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
      <p className="mt-2 text-gray-600">Hantera användare och roller.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Tilldela roll till användare
        </h2>
        <AssignRoleForm roles={roles ?? []} />
      </div>

      {userRoleMap.size > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Användare med roller
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left font-medium text-gray-500">
                    Användar-ID
                  </th>
                  <th className="pb-2 text-left font-medium text-gray-500">
                    Roller
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(userRoleMap.entries()).map(([userId, roles]) => (
                  <tr key={userId} className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs text-gray-700">
                      {userId}
                    </td>
                    <td className="py-2">
                      <div className="flex gap-1">
                        {roles.map((role) => (
                          <span
                            key={role}
                            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
