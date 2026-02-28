import Link from "next/link";
import { mockCourses } from "@/lib/mock-data";
import { Upload, MessageSquare, BookOpen, Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Course dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload a syllabus or open an existing thread to learn.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 text-sm font-medium text-foreground transition hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          New course
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-5 backdrop-blur transition hover:border-border hover:bg-accent/50"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-primary/20 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="mb-1 font-semibold text-foreground">
              {course.title}
            </h2>
            <p className="mb-4 text-xs text-muted-foreground line-clamp-2">
              {course.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              {course.threadId ? (
                <Link
                  href={`/dashboard/threads/${course.threadId}`}
                  className="inline-flex h-7 items-center gap-1.5 rounded-full bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  View threads
                </Link>
              ) : (
                <Link
                  href={`/dashboard/upload?courseId=${course.id}`}
                  className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 text-[0.8rem] font-medium text-foreground transition hover:bg-accent"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload & generate
                </Link>
              )}
              <Link
                href={`/dashboard/upload?courseId=${course.id}`}
                className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[0.8rem] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <Upload className="h-3.5 w-3.5" />
                {course.threadId ? "Add More Files" : "Upload"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
