import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { lessonApi, ApiError } from "@/lib/api";
import type { InsertLesson, TimetableLesson } from "@shared/schema";

const QUERY_KEYS = {
  lessons: ["lessons"] as const,
  lesson: (id: string) => ["lessons", id] as const,
};

export function useLessons() {
  return useQuery({
    queryKey: QUERY_KEYS.lessons,
    queryFn: lessonApi.getAll,
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.lesson(id),
    queryFn: () => lessonApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lessons });
    },
    onError: (error: ApiError) => {
      console.error("Failed to create lesson:", error.message);
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertLesson> }) =>
      lessonApi.update(id, data),
    onSuccess: (updatedLesson: TimetableLesson) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lessons });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lesson(updatedLesson.id) });
    },
    onError: (error: ApiError) => {
      console.error("Failed to update lesson:", error.message);
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lessons });
    },
    onError: (error: ApiError) => {
      console.error("Failed to delete lesson:", error.message);
    },
  });
}
