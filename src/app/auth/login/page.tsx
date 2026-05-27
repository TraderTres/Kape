"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Coffee, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="rounded-3xl bg-white border border-espresso-100 shadow-card p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-espresso-900 text-gold-300 mb-3">
            <Coffee className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-heading font-bold text-espresso-900 text-2xl">
            Welcome back
          </h1>
          <p className="text-espresso-500 text-sm mt-1">
            Sign in to your Kape account
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mb-6 rounded-xl bg-gold-50 border border-gold-200 px-4 py-3 text-sm">
          <p className="font-medium text-gold-800 mb-1">Demo Accounts</p>
          <p className="text-gold-700">User: <code className="bg-gold-100 px-1 rounded">user@kape.ph</code> / <code className="bg-gold-100 px-1 rounded">password123</code></p>
          <p className="text-gold-700 mt-0.5">Admin: <code className="bg-gold-100 px-1 rounded">admin@kape.ph</code> / <code className="bg-gold-100 px-1 rounded">admin123</code></p>
        </div>

        {error && (
          <div
            className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-espresso-700 mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-espresso-200 bg-white px-4 py-3 text-sm text-espresso-900 placeholder-espresso-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-espresso-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-espresso-200 bg-white px-4 py-3 pr-12 text-sm text-espresso-900 placeholder-espresso-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            id="login-submit-btn"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-espresso-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-espresso-900 hover:text-gold-600 transition-colors cursor-pointer"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <Suspense fallback={<div className="text-espresso-500 font-medium animate-pulse">Loading login...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
