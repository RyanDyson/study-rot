"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pattern as TableUpload } from "@/components/patterns/p-file-upload-6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { FileMetadata, FileWithPreview } from "@/hooks/use-file-upload";
import { api } from "@/trpc/react";

async function uploadFile(fileWithPreview: FileWithPreview, id: string) {
  const file = fileWithPreview.file;
  if (!(file instanceof File)) return;
  const formData = new FormData();
  formData.append("id", id);
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Upload failed");
  }
  return res.json();
}

export default function DashboardUploadPage() {
  const filesRef = useRef<FileWithPreview[]>([]);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
  const { mutateAsync } = api.knowledgeBase.create.useMutation();

  const handleFilesChange = (files: FileWithPreview[]) => {
    filesRef.current = files;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await mutateAsync({
      title: courseName,
      description: courseDescription,
    });
    setKnowledgeBaseId(result.id);
    for (const fileWithPreview of filesRef.current) {
      if (fileWithPreview.file instanceof File) {
        await uploadFile(fileWithPreview, result.id);
      }
    }
  };

  return (
    <div className="flex flex-1 w-full flex-col items-center gap-6 p-6">
      <section className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a new course</CardTitle>
            <CardDescription>
              Enter course details and upload your files to generate threads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  type="text"
                  placeholder="e.g. Intro to Machine Learning"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseDescription">Course Description</Label>
                <Input
                  id="courseDescription"
                  type="text"
                  placeholder="e.g. Overfitting, regularization, and validation"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Files</Label>
                <div className="rounded-lg border bg-card p-6">
                  <TableUpload
                    maxFiles={10}
                    maxSize={50 * 1024 * 1024}
                    accept="*"
                    multiple
                    onFilesChange={handleFilesChange}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button type="submit" variant="outline">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
