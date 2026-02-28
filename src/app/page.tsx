import { Navbar } from "@/components/global/navbar";
import { getSession } from "@/server/better-auth/server";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="bg-linear-to-b h-screen w-screen from-background to-secondary text-white">
        <Navbar />
      </main>
    </HydrateClient>
  );
}
