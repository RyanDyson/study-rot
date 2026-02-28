ALTER TABLE "collections" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vectors" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "collections" CASCADE;--> statement-breakpoint
DROP TABLE "vectors" CASCADE;--> statement-breakpoint
ALTER TABLE "knowledge_base" DROP CONSTRAINT "knowledge_base_collection_id_collections_name_fk";
--> statement-breakpoint
ALTER TABLE "knowledge_base" DROP COLUMN "collection_id";