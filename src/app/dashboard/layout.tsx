import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard | Kape",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
