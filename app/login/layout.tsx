// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Toaster from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://insanone.app"),
  title: {
    default: "insanONE",
    template: "%s | insanONE",
  },
  description: "One Platform. One Workforce. One Future.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "insanONE",
    description:
      "The next generation HR & Payroll platform — built for clarity, speed, and trust.",
    url: "https://insanone.app",
    siteName: "insanONE",
    type: "website",
  },
  themeColor: "#335784",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-[#0a1a3a]`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
