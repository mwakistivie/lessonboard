import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateTimetable } from "@/hooks/useTimetables";
import type { TimetableConfig, TimetableDay } from "@shared/schema";

interface SaveTimetableDialogProps {
  config: TimetableConfig;
  schedule: TimetableDay[];
  disabled?: boolean;
}

export default function SaveTimetableDialog({ 
  config, 
  schedule, 
  disabled = false 
}: SaveTimetableDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const createTimetable = useCreateTimetable();

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      await createTimetable.mutateAsync({
        name: name.trim(),
        config,
        schedule,
      });
      
      setOpen(false);
      setName("");
    } catch (error) {
      // Error handling is done in the hook
      console.error("Save failed:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || schedule.length === 0}
          data-testid="button-save-timetable"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Timetable
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Timetable</DialogTitle>
          <DialogDescription>
            Give your timetable a name to save it for future use.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timetable-name">Timetable Name</Label>
            <Input
              id="timetable-name"
              placeholder="e.g., 'Fall 2024 ICT Schedule'"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              data-testid="input-timetable-name"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="button-cancel-save"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || createTimetable.isPending}
              data-testid="button-confirm-save"
            >
              {createTimetable.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}