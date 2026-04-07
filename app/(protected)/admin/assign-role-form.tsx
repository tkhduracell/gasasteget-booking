"use client";

import { useState } from "react";
import { assignRole } from "./actions";

interface Role {
  id: string;
  name: string;
}

export function AssignRoleForm({ roles }: { roles: Role[] }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);

    const result = await assignRole(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.message ?? "Roll tilldelad.");
    }
  }

  return (
    <form action={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700"
        >
          Användar-ID (UUID)
        </label>
        <input
          id="userId"
          name="userId"
          type="text"
          required
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="roleId"
          className="block text-sm font-medium text-gray-700"
        >
          Roll
        </label>
        <select
          id="roleId"
          name="roleId"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Välj roll...</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Tilldela roll
      </button>
    </form>
  );
}
