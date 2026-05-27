"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        setIsLoading(false);
        return;
      }

      // Auto sign in after registration
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white border border-espresso-100 shadow-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-espresso-900 text-gold-300 mb-3">
              <Coffee className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="font-heading font-bold text-espresso-900 text-2xl">
              Join Kape
            </h1>
            <p className="text-espresso-500 text-sm mt-1">
              Create your account and start earning points
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {[
              { id: "name", label: "Full Name", type: "text", placeholder: "Juan dela Cruz", autocomplete: "name" },
              { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com", autocomplete: "email" },
              { id: "password", label: "Password", type: "password", placeholder: "At least 8 characters", autocomplete: "new-password" },
            ].map(({ id, label, type, placeholder, autocomplete }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-espresso-700 mb-1.5">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  autoComplete={autocomplete}
                  required
                  minLength={id === "password" ? 8 : undefined}
                  value={form[id as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [id]: e.target.value }))}
                  className="w-full rounded-xl border border-espresso-200 bg-white px-4 py-3 text-sm text-espresso-900 placeholder-espresso-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-colors"
                  placeholder={placeholder}
                />
              </div>
            ))}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              id="register-submit-btn"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-espresso-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-espresso-900 hover:text-gold-600 transition-colors cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
