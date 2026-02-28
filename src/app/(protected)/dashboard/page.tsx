import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome to your dashboard.
        </p>
      </div>

      <div>
        <Link href="/dashboard/upload">
          <Button>Go to Upload</Button>
        </Link>
      </div>
    </div>
  );
}
