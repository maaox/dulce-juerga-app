import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-background">{children}</div>
    </SessionProvider>
  );
}
