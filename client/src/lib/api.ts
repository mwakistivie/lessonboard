import type { Timetable, InsertTimetable, TimetableConfig, TimetableDay, TimetableLesson, InsertLesson } from "@shared/schema";

const API_BASE = "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `HTTP ${response.status}`,
      response.status,
      errorData.details
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const lessonApi = {
  getAll: (): Promise<TimetableLesson[]> =>
    apiRequest("/lessons"),

  getById: (id: string): Promise<TimetableLesson> =>
    apiRequest(`/lessons/${id}`),

  create: (data: InsertLesson): Promise<TimetableLesson> =>
    apiRequest("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<InsertLesson>): Promise<TimetableLesson> =>
    apiRequest(`/lessons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    apiRequest(`/lessons/${id}`, {
      method: "DELETE",
    }),
};

export const timetableApi = {
  // List all timetables
  getAll: (): Promise<Timetable[]> =>
    apiRequest("/timetables"),

  // Get specific timetable by ID
  getById: (id: string): Promise<Timetable> =>
    apiRequest(`/timetables/${id}`),

  // Create new timetable
  create: (data: InsertTimetable): Promise<Timetable> =>
    apiRequest("/timetables", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update existing timetable
  update: (id: string, data: Partial<InsertTimetable>): Promise<Timetable> =>
    apiRequest(`/timetables/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Delete timetable
  delete: (id: string): Promise<void> =>
    apiRequest(`/timetables/${id}`, {
      method: "DELETE",
    }),

  // Generate timetable from config
  generate: (config: TimetableConfig): Promise<{ config: TimetableConfig; schedule: TimetableDay[] }> =>
    apiRequest("/timetables/generate", {
      method: "POST",
      body: JSON.stringify(config),
    }),
};