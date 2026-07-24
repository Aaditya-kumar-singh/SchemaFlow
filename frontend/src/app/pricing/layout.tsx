import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Upgrade to Pro - SchemaFlow",
  description: "Unlock the full potential of SchemaFlow. Get real-time collaboration, team workspaces, version history, and priority support.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
