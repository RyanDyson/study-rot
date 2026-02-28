ALTER TABLE "knowledge_base" DROP CONSTRAINT "knowledge_base_collection_id_collections_uuid_fk";
--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_collection_id_collections_name_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("name") ON DELETE cascade ON UPDATE no action;