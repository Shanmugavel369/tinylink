CREATE TABLE "links" (
	"code" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"clicks" integer DEFAULT 0,
	"last_clicked" timestamp,
	"created_at" timestamp DEFAULT now()
);
