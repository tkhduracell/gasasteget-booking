export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Gasasteget</h1>
          <p className="mt-1 text-sm text-gray-600">Bokningssystem</p>
        </div>
        {children}
      </div>
    </div>
  );
}
