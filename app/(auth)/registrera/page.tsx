import { SignUpForm } from "@/app/components/auth/sign-up-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Registrera - Gasasteget",
};

export default function RegisterPage() {
  return <SignUpForm />;
}
