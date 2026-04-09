# Login Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a login screen with magic link and Google OAuth using Supabase.

**Architecture:** Supabase JS client (`@supabase/ssr`) handles auth directly — no Auth.js layer. Browser and server client utilities wrap `createBrowserClient`/`createServerClient`. Middleware refreshes sessions. Login page is a client component with two auth methods.

**Tech Stack:** Next.js 15, React 19, Supabase SSR, Tailwind CSS 4, Vitest + RTL

---

## File Structure

| File | Responsibility |
|------|---------------|
| `lib/supabase/client.ts` | Browser Supabase client factory |
| `lib/supabase/server.ts` | Server Supabase client factory (cookies) |
| `middleware.ts` | Session refresh on every request |
| `app/login/page.tsx` | Login UI (client component) |
| `app/login/page.test.tsx` | Login page tests |
| `app/api/auth/callback/route.ts` | OAuth code exchange |
| `app/api/auth/confirm/route.ts` | Magic link token exchange |
| `.env.example` | Updated with Supabase vars |

---

### Task 1: Install Supabase dependencies

- [ ] **Step 1: Install packages**

Run:
```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Update `.env.example`**

Replace contents of `.env.example` with:
```
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example
git commit -m "feat(auth): add supabase dependencies"
```

---

### Task 2: Supabase client utilities

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create browser client**

Create `lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 2: Create server client**

Create `lib/supabase/server.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    },
  );
}
```

- [ ] **Step 3: Verify types compile**

Run:
```bash
pnpm typecheck
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/client.ts lib/supabase/server.ts
git commit -m "feat(auth): add supabase client utilities"
```

---

### Task 3: Middleware for session refresh

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create middleware**

Create `middleware.ts` in project root:
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Refresh the session — do not remove this line
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
pnpm typecheck
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(auth): add middleware for session refresh"
```

---

### Task 4: Auth callback route handlers

**Files:**
- Create: `app/api/auth/callback/route.ts`
- Create: `app/api/auth/confirm/route.ts`

- [ ] **Step 1: Create OAuth callback handler**

Create `app/api/auth/callback/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
```

- [ ] **Step 2: Create magic link confirm handler**

Create `app/api/auth/confirm/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email",
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
```

- [ ] **Step 3: Verify types compile**

Run:
```bash
pnpm typecheck
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/auth/callback/route.ts app/api/auth/confirm/route.ts
git commit -m "feat(auth): add auth callback route handlers"
```

---

### Task 5: Login page — tests first

**Files:**
- Create: `app/login/page.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `app/login/page.test.tsx`:
```typescript
import { expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

const mockSignInWithOtp = vi.fn();
const mockSignInWithOAuth = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOtp: mockSignInWithOtp,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("renders email input and both sign-in buttons", () => {
  render(<LoginPage />);
  expect(screen.getByPlaceholderText("din@email.se")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /skicka magisk länk/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /fortsätt med google/i }),
  ).toBeInTheDocument();
});

test("renders heading", () => {
  render(<LoginPage />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Gåsasteget",
  );
});

test("shows success message after magic link submit", async () => {
  mockSignInWithOtp.mockResolvedValue({ error: null });
  const user = userEvent.setup();

  render(<LoginPage />);
  await user.type(screen.getByPlaceholderText("din@email.se"), "test@test.se");
  await user.click(
    screen.getByRole("button", { name: /skicka magisk länk/i }),
  );

  expect(mockSignInWithOtp).toHaveBeenCalledWith({
    email: "test@test.se",
    options: { emailRedirectTo: expect.stringContaining("/api/auth/confirm") },
  });
  expect(
    await screen.findByText(/kolla din e-post/i),
  ).toBeInTheDocument();
});

test("shows error message on magic link failure", async () => {
  mockSignInWithOtp.mockResolvedValue({
    error: { message: "Rate limit exceeded" },
  });
  const user = userEvent.setup();

  render(<LoginPage />);
  await user.type(screen.getByPlaceholderText("din@email.se"), "test@test.se");
  await user.click(
    screen.getByRole("button", { name: /skicka magisk länk/i }),
  );

  expect(
    await screen.findByText(/rate limit exceeded/i),
  ).toBeInTheDocument();
});

test("calls signInWithOAuth when Google button clicked", async () => {
  mockSignInWithOAuth.mockResolvedValue({ error: null });
  const user = userEvent.setup();

  render(<LoginPage />);
  await user.click(
    screen.getByRole("button", { name: /fortsätt med google/i }),
  );

  expect(mockSignInWithOAuth).toHaveBeenCalledWith({
    provider: "google",
    options: {
      redirectTo: expect.stringContaining("/api/auth/callback"),
    },
  });
});
```

- [ ] **Step 2: Install @testing-library/user-event**

Run:
```bash
pnpm add -D @testing-library/user-event
```

- [ ] **Step 3: Run tests to verify they fail**

Run:
```bash
pnpm vitest run app/login/page.test.tsx
```
Expected: FAIL — module `./page` not found

- [ ] **Step 4: Commit**

```bash
git add app/login/page.test.tsx package.json pnpm-lock.yaml
git commit -m "test(auth): add login page tests"
```

---

### Task 6: Login page — implementation

**Files:**
- Create: `app/login/page.tsx`

- [ ] **Step 1: Implement login page**

Create `app/login/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
      },
    });

    if (error) {
      setError(error.message);
      setStatus("idle");
    } else {
      setStatus("success");
    }
  }

  async function handleGoogle() {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  }

  if (status === "success") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-12 text-center shadow-lg">
          <h1 className="text-2xl font-bold">Gåsasteget</h1>
          <p className="mt-4 text-gray-600">
            Kolla din e-post för en inloggningslänk
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-12 text-center shadow-lg">
        <h1 className="text-2xl font-bold">Gåsasteget</h1>
        <p className="mt-1 text-sm text-gray-500">Boka ditt besök</p>

        <form onSubmit={handleMagicLink} className="mt-8">
          <input
            type="email"
            placeholder="din@email.se"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Skicka magisk länk
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-4 text-xs text-gray-400">eller</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium hover:bg-gray-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Fortsätt med Google
        </button>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Run tests**

Run:
```bash
pnpm vitest run app/login/page.test.tsx
```
Expected: all 5 tests PASS

- [ ] **Step 3: Run full test suite**

Run:
```bash
pnpm vitest run
```
Expected: all tests pass (login + home page)

- [ ] **Step 4: Run typecheck and lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat(auth): add login page with magic link and google sign-in"
```

---

### Task 7: Verification — manual smoke test

- [ ] **Step 1: Create `.env.local`**

Create `.env.local` with actual Supabase credentials:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://hauvpzjxzohowpmpsexx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from Supabase dashboard: Settings > API > anon/public key>
```

- [ ] **Step 2: Start dev server and verify**

Run:
```bash
pnpm dev
```

Open `http://localhost:3000/login` and verify:
1. Page renders with email input, magic link button, and Google button
2. Enter email, click "Skicka magisk länk" — success message shows
3. Click "Fortsätt med Google" — redirects to Google consent screen

- [ ] **Step 3: Stop dev server**
