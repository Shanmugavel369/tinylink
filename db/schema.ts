import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  code: text("code").primaryKey(),
  url: text("url").notNull(),
  clicks: integer("clicks").default(0),
  lastClicked: timestamp("last_clicked"),
  createdAt: timestamp("created_at").defaultNow(),
});
