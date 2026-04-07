"use client";

import { useState } from "react";
import { requestAccess } from "@/app/(protected)/actions";

export function AccessRequestForm({ userEmail }: { userEmail: string }) {
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await requestAccess(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h2 className="text-lg font-semibold text-green-800">
          Förfrågan skickad!
        </h2>
        <p className="mt-2 text-sm text-green-700">
          Din begäran om åtkomst har skickats. En administratör kommer att
          granska den.
        </p>
      </div>
    );
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
            Namn
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Ditt namn"
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
            defaultValue={userEmail}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="communityRole"
            className="block text-sm font-medium text-gray-700"
          >
            Roll i föreningen
          </label>
          <input
            id="communityRole"
            name="communityRole"
            type="text"
            required
            placeholder="T.ex. styrelsemedlem, tränare, förälder..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

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
