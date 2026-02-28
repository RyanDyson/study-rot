ALTER TABLE "collections" DROP CONSTRAINT "collections_name_unique";--> statement-breakpoint
ALTER TABLE "collections" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "collections" ADD PRIMARY KEY ("name");--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "uuid" SET NOT NULL;