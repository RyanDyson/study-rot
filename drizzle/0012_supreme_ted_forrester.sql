ALTER TABLE "vectors" DROP CONSTRAINT "vectors_collection_id_collections_uuid_fk";
--> statement-breakpoint
ALTER TABLE "vectors" DROP COLUMN "collection_id";