import { getCurrentUser } from "@/lib/auth/permissions";

export const metadata = {
  title: "Dashboard - Gasasteget",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Välkommen till Gasasteget bokningssystem.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Din profil</h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">E-post</dt>
            <dd className="text-sm text-gray-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Roller</dt>
            <dd className="text-sm text-gray-900">
              {user?.roles.length
                ? user.roles.join(", ")
                : "Inga roller tilldelade"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Behörigheter</dt>
            <dd className="text-sm text-gray-900">
              {user?.permissions.length
                ? user.permissions.join(", ")
                : "Inga behörigheter"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
