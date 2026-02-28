ALTER TABLE "collections" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_name_unique" UNIQUE("name");