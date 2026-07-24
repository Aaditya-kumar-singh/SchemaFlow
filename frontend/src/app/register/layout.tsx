import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create Your SchemaFlow Account",
  description: "Join SchemaFlow today and start designing database diagrams for PostgreSQL, MongoDB, and MySQL visually for free.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
