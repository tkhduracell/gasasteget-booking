"use client";

import { useState } from "react";
import { approveRequest, denyRequest } from "./actions";
import type { AccessRequest } from "@/lib/auth/types";

export function PendingRequestsList({
  requests,
}: {
  requests: AccessRequest[];
}) {
  return (
    <div className="mt-4 space-y-4">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}

function RequestCard({ request }: { request: AccessRequest }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleApprove() {
    setLoading(true);
    setResult(null);
    const res = await approveRequest(request.id, request.user_id);
    if (res.error) {
      setResult({ type: "error", message: res.error });
    } else {
      setResult({ type: "success", message: "Godkänd!" });
    }
    setLoading(false);
  }

  async function handleDeny() {
    setLoading(true);
    setResult(null);
    const res = await denyRequest(request.id);
    if (res.error) {
      setResult({ type: "error", message: res.error });
    } else {
      setResult({ type: "success", message: "Nekad." });
    }
    setLoading(false);
  }

  if (result?.type === "success") {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        {result.message}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 p-4">
      {result?.type === "error" && (
        <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-700">
          {result.message}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-900">{request.name}</p>
          <p className="text-sm text-gray-600">{request.email}</p>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-medium">Roll i föreningen:</span>{" "}
            {request.community_role}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Skickad{" "}
            {new Date(request.created_at).toLocaleDateString("sv-SE")}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Godkänn
          </button>
          <button
            onClick={handleDeny}
            disabled={loading}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            Neka
          </button>
        </div>
      </div>
    </div>
  );
}
