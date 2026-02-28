import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <Card className="shadow-none border-primary/20 w-full h-full flex flex-col justify-between bg-linear-to-b from-card to-primary/20 pointer-events-none">
      <CardHeader className="gap-3">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-5 w-4/5" />
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5">
        <Skeleton className="h-3.5 w-1/3" />
      </CardFooter>
    </Card>
  );
}

export function CourseCard({
  slug,
  title,
  description,
  createdAt,
}: {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
}) {
  return (
    <Link href={`/dashboard/${slug}`}>
      <Card className="@container/card shadow-none border-primary/20 w-full h-full flex flex-col justify-between hover:to-primary/50 transition-colors cursor-pointer bg-linear-to-b from-card to-primary/20 hover:border-primary/50">
        <CardHeader>
          <CardTitle className="font-serif text-lg font-semibold tabular-nums @[250px]/card:text-3xl">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">{createdAt}</div>
        </CardFooter>
      </Card>
    </Link>
  );
}
