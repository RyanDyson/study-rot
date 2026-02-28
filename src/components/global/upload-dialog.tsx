"use client";

import { useRef, useState } from "react";

import { Pattern as TableUpload } from "@/components/patterns/p-file-upload-6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Plus } from "lucide-react";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export function UploadDialog() {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="absolute bottom-4 right-4 gap-1.5">
          <Plus className="h-4 w-4" />
          New course
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="font-serif text-3xl font-normal tracking-tight text-white">
            Create a new course
          </DialogTitle>
          <DialogDescription>
            Enter course details and upload your files to generate threads.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] space-y-5 overflow-y-auto px-6 py-5">
            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
              <Label>Files</Label>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <TableUpload
                  maxFiles={10}
                  maxSize={50 * 1024 * 1024}
                  accept="*"
                  multiple
                  onFilesChange={handleFilesChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button type="submit" className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              Create Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
