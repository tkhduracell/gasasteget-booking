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
