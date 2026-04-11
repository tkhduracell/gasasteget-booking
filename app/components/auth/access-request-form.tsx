"use client";

import { useState } from "react";
import { requestAccess } from "@/app/(protected)/actions";

const ROLE_OPTIONS = ["Funktionär", "Tävlingsdansare", "Annat"] as const;
type RoleChoice = (typeof ROLE_OPTIONS)[number] | "";

export function AccessRequestForm({ userEmail }: { userEmail: string }) {
  const [error, setError] = useState<string | null>(null);
  const [roleChoice, setRoleChoice] = useState<RoleChoice>("");

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await requestAccess(formData);
    // On success the server action redirects; we only reach here on error.
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Begär åtkomst</h2>
      <p className="mt-1 text-sm text-gray-600">
        Fyll i dina uppgifter för att begära åtkomst till bokningssystemet.
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Fullständigt namn
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Ditt fullständiga namn"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            E-post
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            readOnly
            aria-readonly="true"
            defaultValue={userEmail}
            className="mt-1 block w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="communityRole"
            className="block text-sm font-medium text-gray-700"
          >
            Roll i föreningen
          </label>
          <select
            id="communityRole"
            name="communityRole"
            required
            value={roleChoice}
            onChange={(e) => setRoleChoice(e.target.value as RoleChoice)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled>
              Välj en roll...
            </option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {roleChoice === "Annat" && (
          <div>
            <label
              htmlFor="communityRoleOther"
              className="block text-sm font-medium text-gray-700"
            >
              Beskriv din roll
            </label>
            <input
              id="communityRoleOther"
              name="communityRoleOther"
              type="text"
              required
              placeholder="Skriv din roll här..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skicka förfrågan
        </button>
      </form>
    </div>
  );
}
