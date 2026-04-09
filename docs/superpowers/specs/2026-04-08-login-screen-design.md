# Login Screen Design

## Context

Gåsasteget Booking is a Next.js 15 booking app with Supabase backend and Google OAuth already configured in GCP (project `gasasteget-booking`). The Supabase Google provider is enabled with Client ID/Secret and redirect URIs configured. The app needs a login UI to let users authenticate via Google or magic link (passwordless email).

## Approach

Use Supabase JS client directly (`@supabase/supabase-js` + `@supabase/ssr`) — no Auth.js layer. This matches the existing Supabase infrastructure setup.

## Dependencies

- `@supabase/supabase-js`
- `@supabase/ssr`

## Environment Variables

Add to `.env.example` and `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://hauvpzjxzohowpmpsexx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Files to Create

### `lib/supabase/client.ts`
Browser Supabase client using `createBrowserClient` from `@supabase/ssr`.

### `lib/supabase/server.ts`
Server Supabase client using `createServerClient` from `@supabase/ssr` with Next.js cookies.

### `middleware.ts`
Refreshes Supabase auth session on every request using server client. No route protection for now.

### `app/login/page.tsx`
Login page — centered card layout:

1. **Header:** "Gåsasteget" (h1, bold) + "Boka ditt besök" (subtitle, gray)
2. **Magic link section:** Email input (`din@email.se` placeholder) + "Skicka magisk länk" button (dark/primary)
3. **Divider:** "eller" text between horizontal lines
4. **Google button:** "Fortsätt med Google" with Google icon (outlined style)
5. **Success state:** After magic link sent, show "Kolla din e-post för en inloggningslänk"
6. **Error state:** Inline error message below buttons

Styling: Tailwind CSS, centered on light gray background (`bg-gray-50`), white card with rounded corners and subtle shadow.

### `app/api/auth/callback/route.ts`
Handles OAuth code exchange. Receives `?code=...` from Supabase after Google auth, exchanges for session, redirects to `/`.

### `app/api/auth/confirm/route.ts`
Handles magic link token exchange. Receives `?token_hash=...&type=email`, verifies OTP, redirects to `/`.

### `app/login/page.test.tsx`
Tests using Vitest + React Testing Library:
- Renders email input and both buttons
- Shows success message after magic link submit
- Shows error message on failure
- Mocks `@supabase/supabase-js`

## Auth Flows

### Magic Link
1. User enters email, clicks "Skicka magisk länk"
2. Call `supabase.auth.signInWithOtp({ email })`
3. Show success message
4. User clicks link in email → `/api/auth/confirm?token_hash=...&type=email`
5. Route handler exchanges token → redirect to `/`

### Google OAuth
1. User clicks "Fortsätt med Google"
2. Call `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '<app-url>/api/auth/callback' } })`
3. User completes Google consent
4. Supabase redirects to `/api/auth/callback?code=...`
5. Route handler exchanges code → redirect to `/`

## Verification

1. Run `pnpm dev`, navigate to `/login`
2. Verify page renders with email input, magic link button, and Google button
3. Enter test email, click magic link — should show success message
4. Click Google button — should redirect to Google consent
5. Run `pnpm test` — all login tests pass
