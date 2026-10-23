CREATE TYPE "offering_type" AS ENUM('OFFLINE_COURSE', 'ONLINE_CLASS', 'IN_PERSON_CLASS');--> statement-breakpoint
CREATE TYPE "registration_status" AS ENUM('PENDING', 'CONTACTED', 'ACCEPTED');--> statement-breakpoint
CREATE TYPE "testimonial_status" AS ENUM('APPROVED', 'PENDING', 'REJECTED');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"youtube_video_id" text NOT NULL UNIQUE,
	"slug" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"thumbnail_url" text,
	"youtube_published_at" timestamp with time zone,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offerings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"type" "offering_type" NOT NULL,
	"short_description" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"duration_text" text,
	"registration_info" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registration_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"offering_id" uuid NOT NULL,
	"message" text,
	"status" "registration_status" DEFAULT 'PENDING'::"registration_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "testimonial_status" DEFAULT 'PENDING'::"testimonial_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"clerk_user_id" text NOT NULL UNIQUE,
	"username" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'USER'::"user_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL UNIQUE,
	CONSTRAINT "users_username_format_check" CHECK ("username" ~ '^[a-zA-Z][a-zA-Z0-9_]*$')
);
--> statement-breakpoint
ALTER TABLE "registration_requests" ADD CONSTRAINT "registration_requests_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "registration_requests" ADD CONSTRAINT "registration_requests_offering_id_offerings_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "offerings"("id");--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");