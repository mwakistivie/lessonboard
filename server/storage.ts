import { type User, type InsertUser, type TimetableLesson, type InsertLesson, type Timetable, type InsertTimetable, insertTimetableSchema, insertLessonSchema } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getLesson(id: string): Promise<TimetableLesson | undefined>;
  getAllLessons(): Promise<TimetableLesson[]>;
  createLesson(lesson: InsertLesson): Promise<TimetableLesson>;
  updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<TimetableLesson | undefined>;
  deleteLesson(id: string): Promise<boolean>;
  
  // Timetable methods
  getTimetable(id: string): Promise<Timetable | undefined>;
  getAllTimetables(): Promise<Timetable[]>;
  createTimetable(timetable: InsertTimetable): Promise<Timetable>;
  updateTimetable(id: string, timetable: Partial<InsertTimetable>): Promise<Timetable | undefined>;
  deleteTimetable(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private lessons: Map<string, TimetableLesson>;
  private timetables: Map<string, Timetable>;

  constructor() {
    this.users = new Map();
    this.lessons = new Map();
    this.timetables = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLesson(id: string): Promise<TimetableLesson | undefined> {
    return this.lessons.get(id);
  }

  async getAllLessons(): Promise<TimetableLesson[]> {
    return Array.from(this.lessons.values());
  }

  async createLesson(insertLesson: InsertLesson): Promise<TimetableLesson> {
    const id = randomUUID();
    const lesson: TimetableLesson = { id, ...insertLesson };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async updateLesson(id: string, updates: Partial<InsertLesson>): Promise<TimetableLesson | undefined> {
    const existing = this.lessons.get(id);
    if (!existing) {
      return undefined;
    }

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    const merged = { ...existing, ...cleanUpdates };
    const validation = insertLessonSchema.safeParse(merged);
    if (!validation.success) {
      throw new Error(`Invalid lesson data: ${validation.error.message}`);
    }

    this.lessons.set(id, merged);
    return merged;
  }

  async deleteLesson(id: string): Promise<boolean> {
    return this.lessons.delete(id);
  }

  async getTimetable(id: string): Promise<Timetable | undefined> {
    return this.timetables.get(id);
  }

  async getAllTimetables(): Promise<Timetable[]> {
    return Array.from(this.timetables.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async createTimetable(insertTimetable: InsertTimetable): Promise<Timetable> {
    const id = randomUUID();
    const now = new Date();
    const timetable: Timetable = {
      ...insertTimetable,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.timetables.set(id, timetable);
    return timetable;
  }

  async updateTimetable(id: string, updates: Partial<InsertTimetable>): Promise<Timetable | undefined> {
    const existing = this.timetables.get(id);
    if (!existing) {
      return undefined;
    }
    
    // Filter out undefined values to prevent accidental nulling
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    const merged = {
      ...existing,
      ...cleanUpdates,
      updatedAt: new Date(),
    };
    
    // Validate the merged object (excluding id, createdAt, updatedAt)
    const { id: _, createdAt: __, updatedAt: ___, ...validationData } = merged;
    const validation = insertTimetableSchema.safeParse(validationData);
    if (!validation.success) {
      throw new Error(`Invalid timetable data: ${validation.error.message}`);
    }
    
    this.timetables.set(id, merged);
    return merged;
  }

  async deleteTimetable(id: string): Promise<boolean> {
    return this.timetables.delete(id);
  }
}

export const storage = new MemStorage();
