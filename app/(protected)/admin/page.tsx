import { createClient } from "@/lib/supabase/server";
import { PendingRequestsList } from "./pending-requests-list";
import type { AccessRequest } from "@/lib/auth/types";

export const metadata = {
  title: "Admin - Gasasteget",
};

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch pending access requests
  const { data: pendingRequests } = await supabase
    .from("access_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  // Fetch all users with their roles
  const { data: userRoles } = await supabase.from("user_roles").select(`
    user_id,
    roles:role_id (
      name
    )
  `);

  // Group roles by user_id
  const userRoleMap = new Map<string, string[]>();
  if (userRoles) {
    for (const ur of userRoles) {
      const existing = userRoleMap.get(ur.user_id) ?? [];
      const roleName = (ur.roles as unknown as { name: string })?.name;
      if (roleName) {
        existing.push(roleName);
      }
      userRoleMap.set(ur.user_id, existing);
    }
  }

  // Fetch recently reviewed requests for context
  const { data: recentReviewed } = await supabase
    .from("access_requests")
    .select("*")
    .neq("status", "pending")
    .order("reviewed_at", { ascending: false })
    .limit(10);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
      <p className="mt-2 text-gray-600">
        Hantera åtkomstförfrågningar och användare.
      </p>

      {/* Pending access requests */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Väntande förfrågningar
          {(pendingRequests?.length ?? 0) > 0 && (
            <span className="ml-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
              {pendingRequests?.length}
            </span>
          )}
        </h2>
        {pendingRequests && pendingRequests.length > 0 ? (
          <PendingRequestsList
            requests={pendingRequests as AccessRequest[]}
          />
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            Inga väntande förfrågningar.
          </p>
        )}
      </div>

      {/* Active users with roles */}
      {userRoleMap.size > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Aktiva användare
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left font-medium text-gray-500">
                    Användar-ID
                  </th>
                  <th className="pb-2 text-left font-medium text-gray-500">
                    Roll
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
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
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

      {/* Recently reviewed requests */}
      {recentReviewed && recentReviewed.length > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Senaste beslut
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left font-medium text-gray-500">
                    Namn
                  </th>
                  <th className="pb-2 text-left font-medium text-gray-500">
                    E-post
                  </th>
                  <th className="pb-2 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th className="pb-2 text-left font-medium text-gray-500">
                    Datum
                  </th>
                </tr>
              </thead>
              <tbody>
                {(recentReviewed as AccessRequest[]).map((req) => (
                  <tr key={req.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{req.name}</td>
                    <td className="py-2 text-gray-700">{req.email}</td>
                    <td className="py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {req.status === "approved" ? "Godkänd" : "Nekad"}
                      </span>
                    </td>
                    <td className="py-2 text-xs text-gray-500">
                      {req.reviewed_at
                        ? new Date(req.reviewed_at).toLocaleDateString("sv-SE")
                        : "-"}
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
