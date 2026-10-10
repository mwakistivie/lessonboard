import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const timetables = pgTable("timetables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  config: jsonb("config").$type<TimetableConfig>().notNull(),
  schedule: jsonb("schedule").$type<TimetableDay[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const lessonSchema = z.object({
  id: z.string(),
  day: z.string().min(1),
  time: z.string().min(1),
  subject: z.string().min(1),
  className: z.string().min(1),
  teacher: z.string().min(1),
  room: z.string().min(1),
  tone: z.string().min(1),
});

export const insertLessonSchema = lessonSchema.omit({ id: true });

// Define timetable config schema first
export const timetableConfigSchema = z.object({
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  lessonDuration: z.number().min(5).max(120),
  firstBreak: z.number().min(0).max(60),
  secondBreak: z.number().min(0).max(60),
  lunchBreak: z.number().min(0).max(120),
  grades: z.array(z.string()).min(1, "At least one grade is required"),
});

// Timetable entry and day schemas for validation
export const timetableEntrySchema = z.object({
  time: z.string(),
  grade: z.string(),
});

export const timetableDaySchema = z.object({
  day: z.string(),
  entries: z.array(timetableEntrySchema),
});

export const insertTimetableSchema = createInsertSchema(timetables).pick({
  name: true,
}).extend({
  config: timetableConfigSchema,
  schedule: z.array(timetableDaySchema),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TimetableLesson = z.infer<typeof lessonSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Timetable = typeof timetables.$inferSelect;
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;

// Timetable types
export interface TimeSlot {
  start: string;
  end: string;
}

export interface TimetableEntry {
  time: string;
  grade: string;
}

export interface TimetableDay {
  day: string;
  entries: TimetableEntry[];
}

export interface TimetableConfig {
  startTime: string;
  endTime: string;
  lessonDuration: number;
  firstBreak: number;
  secondBreak: number;
  lunchBreak: number;
  grades: string[];
}

export type TimetableConfigInput = z.infer<typeof timetableConfigSchema>;

