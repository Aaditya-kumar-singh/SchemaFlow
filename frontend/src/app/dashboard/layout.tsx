import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - SchemaFlow",
  description: "View and manage your visual database models, projects, and collaborative workspaces.",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
