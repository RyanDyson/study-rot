"use client";

import Link from "next/link";
import { mockCourses } from "@/lib/mock-data";
import { Upload } from "lucide-react";
import { UploadDialog } from "@/components/global/upload-dialog";
import { CourseCard } from "@/components/global/course-card";

export default function Dashboard() {
  return (
    <div className="relative flex h-full flex-col gap-8 p-6 lg:p-8">
      <UploadDialog />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <CourseCard
            key={course.id}
            slug={course.id}
            title={course.title}
            description={course.description}
            createdAt={course.uploadedAt ?? ""}
          />
        ))}
      </div>
    </div>
  );
}
