"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { signOut } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
