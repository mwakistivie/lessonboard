import { GraduationCap, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface GradeManagerProps {
  grades: string[];
  onUpdate: (grades: string[]) => void;
}

export default function GradeManager({ grades, onUpdate }: GradeManagerProps) {
  const [newGrade, setNewGrade] = useState("");

  const addGrade = () => {
    if (newGrade.trim() && !grades.includes(newGrade.trim())) {
      console.log(`Adding grade: ${newGrade.trim()}`);
      onUpdate([...grades, newGrade.trim()]);
      setNewGrade("");
    }
  };

  const removeGrade = (gradeToRemove: string) => {
    console.log(`Removing grade: ${gradeToRemove}`);
    onUpdate(grades.filter(grade => grade !== gradeToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addGrade();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Grade/Class Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter grade name (e.g., PP1, 1W, 2C)"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            onKeyPress={handleKeyPress}
            data-testid="input-new-grade"
          />
          <Button 
            onClick={addGrade}
            disabled={!newGrade.trim() || grades.includes(newGrade.trim())}
            data-testid="button-add-grade"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Current grades ({grades.length}):
          </p>
          <div className="flex flex-wrap gap-2" data-testid="grades-list">
            {grades.map((grade) => (
              <Badge
                key={grade}
                variant="secondary"
                className="flex items-center gap-1"
                data-testid={`badge-grade-${grade}`}
              >
                {grade}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeGrade(grade)}
                  data-testid={`button-remove-grade-${grade}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          {grades.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No grades added yet. Add some grades to generate a timetable.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}