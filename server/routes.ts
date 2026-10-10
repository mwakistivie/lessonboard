import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLessonSchema, insertTimetableSchema, timetableConfigSchema, timetableDaySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Lesson routes
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getAllLessons();
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const lesson = await storage.getLesson(id);

      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const validation = insertLessonSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid lesson data",
          details: validation.error.issues,
        });
      }

      const lesson = await storage.createLesson(validation.data);
      res.status(201).json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ error: "Failed to create lesson" });
    }
  });

  app.patch("/api/lessons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const cleanBody = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== undefined)
      );

      const validation = insertLessonSchema.partial().safeParse(cleanBody);
      if (!validation.success) {
        return res.status(422).json({
          error: "Invalid lesson data",
          details: validation.error.issues,
        });
      }

      const updatedLesson = await storage.updateLesson(id, validation.data);
      if (!updatedLesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      res.json(updatedLesson);
    } catch (error) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ error: "Failed to update lesson" });
    }
  });

  app.delete("/api/lessons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteLesson(id);

      if (!deleted) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ error: "Failed to delete lesson" });
    }
  });

  // Timetable routes
  
  // GET /api/timetables - List all timetables
  app.get("/api/timetables", async (req, res) => {
    try {
      const timetables = await storage.getAllTimetables();
      res.json(timetables);
    } catch (error) {
      console.error("Error fetching timetables:", error);
      res.status(500).json({ error: "Failed to fetch timetables" });
    }
  });

  // GET /api/timetables/:id - Get specific timetable
  app.get("/api/timetables/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const timetable = await storage.getTimetable(id);
      
      if (!timetable) {
        return res.status(404).json({ error: "Timetable not found" });
      }
      
      res.json(timetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      res.status(500).json({ error: "Failed to fetch timetable" });
    }
  });

  // POST /api/timetables - Create new timetable
  app.post("/api/timetables", async (req, res) => {
    try {
      const validation = insertTimetableSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid timetable data", 
          details: validation.error.issues 
        });
      }
      
      const timetable = await storage.createTimetable(validation.data);
      res.status(201).json(timetable);
    } catch (error) {
      console.error("Error creating timetable:", error);
      res.status(500).json({ error: "Failed to create timetable" });
    }
  });

  // PATCH /api/timetables/:id - Update timetable
  app.patch("/api/timetables/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate the update data - filter out undefined values
      const cleanBody = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== undefined)
      );
      
      const validation = insertTimetableSchema.partial().safeParse(cleanBody);
      
      if (!validation.success) {
        return res.status(422).json({ 
          error: "Invalid timetable data", 
          details: validation.error.issues 
        });
      }
      
      const updatedTimetable = await storage.updateTimetable(id, validation.data);
      
      if (!updatedTimetable) {
        return res.status(404).json({ error: "Timetable not found" });
      }
      
      res.json(updatedTimetable);
    } catch (error) {
      console.error("Error updating timetable:", error);
      res.status(500).json({ error: "Failed to update timetable" });
    }
  });

  // DELETE /api/timetables/:id - Delete timetable
  app.delete("/api/timetables/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTimetable(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Timetable not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting timetable:", error);
      res.status(500).json({ error: "Failed to delete timetable" });
    }
  });

  // POST /api/timetables/generate - Generate timetable from config
  app.post("/api/timetables/generate", async (req, res) => {
    try {
      const validation = timetableConfigSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid configuration", 
          details: validation.error.issues 
        });
      }
      
      const config = validation.data;
      
      // Generate timetable logic (same as frontend but on server)
      const parseTime = (timeStr: string): Date => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      };

      const formatTimeSlot = (start: Date, end: Date): string => {
        const formatTime = (date: Date) => 
          date.toTimeString().slice(0, 5);
        return `${formatTime(start)} - ${formatTime(end)}`;
      };

      const startTime = parseTime(config.startTime);
      const endTime = parseTime(config.endTime);
      const lessonDuration = config.lessonDuration * 60 * 1000;

      // Generate time slots with breaks
      const slots: { start: Date; end: Date }[] = [];
      let currentTime = new Date(startTime);
      let lessonCounter = 0;
      let breaksInserted = 0;

      while (currentTime.getTime() + lessonDuration <= endTime.getTime()) {
        const slotEnd = new Date(currentTime.getTime() + lessonDuration);
        slots.push({ start: new Date(currentTime), end: slotEnd });
        currentTime = slotEnd;
        lessonCounter++;

        // Insert breaks
        if (lessonCounter === 2 && breaksInserted === 0) {
          currentTime = new Date(currentTime.getTime() + config.firstBreak * 60 * 1000);
          breaksInserted++;
        } else if (lessonCounter === 4 && breaksInserted === 1) {
          currentTime = new Date(currentTime.getTime() + config.secondBreak * 60 * 1000);
          breaksInserted++;
        } else if (lessonCounter === 6 && breaksInserted === 2) {
          currentTime = new Date(currentTime.getTime() + config.lunchBreak * 60 * 1000);
          breaksInserted++;
        }
      }

      // Create timetable for each day
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const schedule = [];
      let gradeIndex = 0;

      for (const day of days) {
        const entries = [];
        
        for (const slot of slots) {
          entries.push({
            time: formatTimeSlot(slot.start, slot.end),
            grade: config.grades[gradeIndex % config.grades.length],
          });
          gradeIndex++;
        }

        schedule.push({ day, entries });
      }

      res.json({ config, schedule });
    } catch (error) {
      console.error("Error generating timetable:", error);
      res.status(500).json({ error: "Failed to generate timetable" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
