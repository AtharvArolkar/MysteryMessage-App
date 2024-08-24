"use client";
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
      <Button onClick={async () => await signOut({ callbackUrl: "/sign-in" })}>
        Logout
      </Button>
      {children}
    </div>
  );
}
