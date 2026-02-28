import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Course",
  description: "Manage your course knowledge base and generate study threads.",
};

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
