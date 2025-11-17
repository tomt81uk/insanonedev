// app/login/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import InsanOneWordmark from "@/components/InsanOneWordmark";

export default function LoginPage() {
  const [showEmail, setShowEmail] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showEmail) emailRef.current?.focus();
  }, [showEmail]);

  return (
    <main
      id="main"
      className="min-h-screen flex items-center justify-center bg-[#335784] px-4"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 text-center space-y-8">
        {/* Brand */}
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-[#0a1a3a]">
            <InsanOneWordmark />
          </h1>
          <p className="text-gray-600 text-sm">
            One Platform. One Workforce. One Future.
          </p>
        </div>

        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0a1a3a]">Welcome</h2>
          <p className="text-gray-600 text-sm mt-1">
            Sign in with your company account.
          </p>
        </div>

        {/* SSO first */}
        <div className="space-y-4">
          <a
            href="/landing"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium bg-[#2f6fed] text-white hover:opacity-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2f6fed]/30"
          >
            {/* simple Microsoft-style 4-squares */}
            <svg
              aria-hidden
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11 3H3v8h8V3zm10 0h-8v8h8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            Continue with Microsoft
          </a>

          {/* Or divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-500">or</span>
            </div>
          </div>

          {/* Email toggle */}
          <button
            type="button"
            onClick={() => setShowEmail((v) => !v)}
            aria-expanded={showEmail}
            className="w-full rounded-xl px-4 py-3 font-medium border border-gray-300 text-[#0a1a3a] hover:bg-gray-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2f6fed]/20"
          >
            {showEmail ? "Hide email sign-in" : "Sign in with email"}
          </button>
        </div>

        {/* Collapsible email/password */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            showEmail
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!showEmail}
        >
          <div className="overflow-hidden">
            <form
              action="/landing"
              method="POST"
              className="mt-4 space-y-4 text-left"
            >
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </span>
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3
                             bg-white text-gray-900 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-[#2f6fed]"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3
                             bg-white text-gray-900 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-[#2f6fed]"
                />
              </label>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="remember"
                    className="rounded border-gray-300"
                  />
                  Remember me
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-[#2f6fed] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl px-4 py-3 font-semibold bg-[#0a1a3a] text-white hover:opacity-95
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0a1a3a]/30"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>

        {/* Fine print */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} insanONE. No unauthorised access.
        </p>
      </div>
    </main>
  );
}
