import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { BookOpen, Clock, MessageSquare, Upload } from "lucide-react";

export function CourseCardSkeleton() {
  return (
    <Card className="shadow-none border-border/60 w-full h-full flex flex-col justify-between bg-linear-to-br from-card to-primary/10 pointer-events-none">
      <CardHeader className="gap-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-3 w-1/3" />
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
    <Card className="group shadow-none border-border/60 w-full h-full flex flex-col justify-between transition-all duration-200 bg-linear-to-br from-card to-primary/10 hover:border-primary/40 hover:to-primary/20 hover:shadow-sm">
      <Link href={`/dashboard/courses/${slug}`}>
        <CardHeader className="gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-serif text-base font-semibold leading-snug text-foreground">
              {title}
            </CardTitle>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </CardHeader>
      </Link>

      <CardFooter className="flex flex-col items-start gap-3 pt-0">
        {createdAt && (
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {createdAt}
          </span>
        )}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/threads/${slug}`}
            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-primary px-2.5 text-[0.75rem] font-medium text-primary-foreground transition hover:opacity-90"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            View threads
          </Link>
          <Link
            href={`/dashboard/courses/${slug}`}
            className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 text-[0.75rem] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            Add files
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
