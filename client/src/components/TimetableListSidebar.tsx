import { Calendar, Trash2, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTimetables, useDeleteTimetable } from "@/hooks/useTimetables";
import type { Timetable, TimetableConfig, TimetableDay } from "@shared/schema";

interface TimetableListSidebarProps {
  onLoadTimetable: (config: TimetableConfig, schedule: TimetableDay[]) => void;
}

export default function TimetableListSidebar({ onLoadTimetable }: TimetableListSidebarProps) {
  const { data: timetables = [], isLoading, error } = useTimetables();
  const deleteTimetable = useDeleteTimetable();

  const handleLoad = (timetable: Timetable) => {
    console.log("Loading timetable:", timetable.name);
    onLoadTimetable(timetable.config, timetable.schedule);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTimetable.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the hook
      console.error("Delete failed:", error);
    }
  };

  const formatDate = (dateStr: string | Date) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return "Unknown";
      }
      return date.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Saved Timetables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-destructive text-sm">Failed to load timetables</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Saved Timetables
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : timetables.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              No saved timetables yet. Generate and save your first timetable to see it here.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {timetables.map((timetable) => (
                <div
                  key={timetable.id}
                  className="border rounded-md p-3 hover-elevate"
                  data-testid={`timetable-item-${timetable.id}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm truncate" title={timetable.name}>
                      {timetable.name}
                    </h4>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleLoad(timetable)}
                        data-testid={`button-load-${timetable.id}`}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                            data-testid={`button-delete-${timetable.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Timetable</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{timetable.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(timetable.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    <span>{timetable.config.startTime} - {timetable.config.endTime}</span>
                    <Badge variant="secondary" className="text-xs">
                      {timetable.config.grades.length} grades
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(timetable.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}