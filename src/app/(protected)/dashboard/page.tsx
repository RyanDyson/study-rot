"use client";
import { api } from "@/trpc/react";
import { UploadDialog } from "@/components/global/upload-dialog";
import {
  CourseCard,
  CourseCardSkeleton,
} from "@/components/global/course-card";

export default function Dashboard() {
  const {
    data: courses,
    isLoading,
    refetch,
  } = api.knowledgeBase.getAll.useQuery();
  console.log(courses);

  return (
    <div className="relative flex h-full flex-col gap-8 p-6 lg:p-8">
      <UploadDialog refetch={refetch} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))
          : courses?.map((course) => (
              <CourseCard
                key={course.id}
                slug={course.id}
                title={course.title}
                description={course.description}
                createdAt={""}
              />
            ))}
      </div>
    </div>
  );
}
