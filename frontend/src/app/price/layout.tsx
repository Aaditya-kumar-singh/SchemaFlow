import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pricing Plans - SchemaFlow",
  description: "Check out SchemaFlow pricing tiers. Design, collaborate on, and export database schemas visually with support for MongoDB, PostgreSQL, and MySQL.",
  alternates: {
    canonical: "/price",
  },
  openGraph: {
    title: "Pricing Plans - SchemaFlow",
    description: "Choose the plan that fits your database modeling needs. From free hobby projects to team collaboration workspaces.",
    url: "https://schemaflow.pages.dev/price",
  },
};

export default function PriceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
