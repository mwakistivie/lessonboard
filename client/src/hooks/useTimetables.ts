import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timetableApi, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Timetable, InsertTimetable, TimetableConfig } from "@shared/schema";

const QUERY_KEYS = {
  timetables: ["timetables"] as const,
  timetable: (id: string) => ["timetables", id] as const,
};

export function useTimetables() {
  return useQuery({
    queryKey: QUERY_KEYS.timetables,
    queryFn: timetableApi.getAll,
  });
}

export function useTimetable(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.timetable(id),
    queryFn: () => timetableApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTimetable() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: timetableApi.create,
    onSuccess: (newTimetable) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timetables });
      toast({
        title: "Success",
        description: `Timetable "${newTimetable.name}" created successfully!`,
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create timetable",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTimetable() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertTimetable> }) =>
      timetableApi.update(id, data),
    onSuccess: (updatedTimetable) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timetables });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timetable(updatedTimetable.id) });
      toast({
        title: "Success",
        description: `Timetable "${updatedTimetable.name}" updated successfully!`,
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update timetable",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTimetable() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: timetableApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timetables });
      toast({
        title: "Success",
        description: "Timetable deleted successfully!",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete timetable",
        variant: "destructive",
      });
    },
  });
}

export function useGenerateTimetable() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: timetableApi.generate,
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate timetable",
        variant: "destructive",
      });
    },
  });
}