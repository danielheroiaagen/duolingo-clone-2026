import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  supabaseId: text("supabase_id").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  xp: integer("xp").default(0),
  streak: integer("streak").default(0),
  hearts: integer("hearts").default(5),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  completed: boolean("completed").default(false),
  lastAccessed: timestamp("last_accessed").defaultNow(),
});
