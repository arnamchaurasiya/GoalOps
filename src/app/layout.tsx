import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GoalOps — Goal Setting & Tracking Portal",
  description:
    "Enterprise goal management platform. Set goals, track progress, and drive performance with AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100`}>
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}
