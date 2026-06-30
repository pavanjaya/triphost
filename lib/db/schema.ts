import { pgTable, text, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trips = pgTable("trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),       // e.g. "kashmir-2026"
  name: text("name").notNull(),                // e.g. "Kashmir & Katra"
  destination: text("destination").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tripMembers = pgTable("trip_members", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tripId: uuid("trip_id").notNull().references(() => trips.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("traveller"), // "traveller" | "operator"
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.tripId] })]);
