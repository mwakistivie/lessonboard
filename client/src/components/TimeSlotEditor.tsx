import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TimeSlotEditorProps {
  startTime: string;
  endTime: string;
  lessonDuration: number;
  firstBreak: number;
  secondBreak: number;
  lunchBreak: number;
  onUpdate: (config: {
    startTime: string;
    endTime: string;
    lessonDuration: number;
    firstBreak: number;
    secondBreak: number;
    lunchBreak: number;
  }) => void;
}

export default function TimeSlotEditor({
  startTime,
  endTime,
  lessonDuration,
  firstBreak,
  secondBreak,
  lunchBreak,
  onUpdate,
}: TimeSlotEditorProps) {
  const handleChange = (field: string, value: string | number) => {
    console.log(`Updating ${field} to ${value}`);
    onUpdate({
      startTime,
      endTime,
      lessonDuration,
      firstBreak,
      secondBreak,
      lunchBreak,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Time Schedule Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time" data-testid="label-start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              data-testid="input-start-time"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time" data-testid="label-end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              data-testid="input-end-time"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lesson-duration" data-testid="label-lesson-duration">
            Lesson Duration (minutes)
          </Label>
          <Input
            id="lesson-duration"
            type="number"
            min="5"
            max="120"
            value={lessonDuration}
            onChange={(e) => handleChange("lessonDuration", parseInt(e.target.value))}
            data-testid="input-lesson-duration"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Break Durations (minutes)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-break" data-testid="label-first-break">First Break</Label>
              <Input
                id="first-break"
                type="number"
                min="0"
                max="60"
                value={firstBreak}
                onChange={(e) => handleChange("firstBreak", parseInt(e.target.value))}
                data-testid="input-first-break"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="second-break" data-testid="label-second-break">Second Break</Label>
              <Input
                id="second-break"
                type="number"
                min="0"
                max="60"
                value={secondBreak}
                onChange={(e) => handleChange("secondBreak", parseInt(e.target.value))}
                data-testid="input-second-break"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lunch-break" data-testid="label-lunch-break">Lunch Break</Label>
              <Input
                id="lunch-break"
                type="number"
                min="0"
                max="120"
                value={lunchBreak}
                onChange={(e) => handleChange("lunchBreak", parseInt(e.target.value))}
                data-testid="input-lunch-break"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}