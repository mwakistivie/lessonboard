import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import TimeSlotEditor from "./TimeSlotEditor";
import GradeManager from "./GradeManager";
import TimetablePreview from "./TimetablePreview";
import ExportButton from "./ExportButton";
import SaveTimetableDialog from "./SaveTimetableDialog";
import TimetableListSidebar from "./TimetableListSidebar";
import { useGenerateTimetable } from "@/hooks/useTimetables";
import type { TimetableConfig, TimetableDay, TimetableEntry } from "@shared/schema";

// Default grades from the original Python script
const DEFAULT_GRADES = [
  "PP1", "PP2", "PG", "1W", "1C", "2C", "2W", "3W", "3C",
  "4W", "4C", "5W", "5C", "6C", "6W", "7W", "7C", "8W", "8C", "9W", "9C"
];

export default function TimetableGenerator() {
  const { toast } = useToast();
  const generateTimetable = useGenerateTimetable();
  
  const [config, setConfig] = useState<TimetableConfig>({
    startTime: "08:00",
    endTime: "15:20",
    lessonDuration: 40,
    firstBreak: 10,
    secondBreak: 20,
    lunchBreak: 40,
    grades: DEFAULT_GRADES,
  });
  
  const [timetable, setTimetable] = useState<TimetableDay[]>([]);

  const updateTimeConfig = (timeConfig: Partial<TimetableConfig>) => {
    setConfig(prev => ({ ...prev, ...timeConfig }));
  };

  const updateGrades = (grades: string[]) => {
    setConfig(prev => ({ ...prev, grades }));
  };

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

  const handleGenerate = async () => {
    console.log("Generating timetable with config:", config);
    
    if (config.grades.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one grade before generating the timetable.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await generateTimetable.mutateAsync(config);
      setTimetable(result.schedule);
      
      toast({
        title: "Success",
        description: "Timetable generated successfully!",
      });
      
      console.log("Generated timetable:", result.schedule);
    } catch (error) {
      console.error("Error generating timetable:", error);
      // Error toast is handled by the hook
    }
  };
  
  const handleLoadTimetable = (loadedConfig: TimetableConfig, loadedSchedule: TimetableDay[]) => {
    setConfig(loadedConfig);
    setTimetable(loadedSchedule);
    
    toast({
      title: "Success",
      description: "Timetable loaded successfully!",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <TimetableListSidebar onLoadTimetable={handleLoadTimetable} />
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Timetable Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TimeSlotEditor
              startTime={config.startTime}
              endTime={config.endTime}
              lessonDuration={config.lessonDuration}
              firstBreak={config.firstBreak}
              secondBreak={config.secondBreak}
              lunchBreak={config.lunchBreak}
              onUpdate={updateTimeConfig}
            />
            
            <Separator />
            
            <GradeManager
              grades={config.grades}
              onUpdate={updateGrades}
            />
            
            <Separator />
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Ready to generate timetable for {config.grades.length} grades
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={generateTimetable.isPending || config.grades.length === 0}
                  data-testid="button-generate-timetable"
                >
                  {generateTimetable.isPending ? "Generating..." : "Generate Timetable"}
                </Button>
                <SaveTimetableDialog 
                  config={config}
                  schedule={timetable}
                  disabled={generateTimetable.isPending}
                />
                <ExportButton 
                  timetable={timetable}
                  disabled={generateTimetable.isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <TimetablePreview 
          timetable={timetable}
          isLoading={generateTimetable.isPending}
        />
      </div>
    </div>
  );
}