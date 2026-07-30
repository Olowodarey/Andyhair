import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  // Keep the management page out of search engines.
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
