import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Log In to SchemaFlow",
  description: "Log in to your SchemaFlow account to start visualization, editing, and sharing of database schemas.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
