import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/app/components/auth/sign-out-button";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/logga-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="text-lg font-bold text-gray-900">
              Gasasteget
            </a>
            <nav className="flex gap-4 text-sm">
              <a
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </a>
              <a href="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
