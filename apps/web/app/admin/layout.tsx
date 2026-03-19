import { RequireGuard } from "@/components/admin/AdminGuard";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin | Lil-Burn",
  description: "Admin panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RequireGuard>{children}</RequireGuard>;
}
