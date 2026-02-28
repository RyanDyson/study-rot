/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'collections'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "collections" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "uuid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vectors" ADD COLUMN "collection_id" uuid;--> statement-breakpoint
ALTER TABLE "vectors" ADD CONSTRAINT "vectors_collection_id_collections_uuid_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("uuid") ON DELETE cascade ON UPDATE no action;