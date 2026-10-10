import { Table2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TimetableDay } from "@shared/schema";

interface TimetablePreviewProps {
  timetable: TimetableDay[];
  isLoading?: boolean;
}

export default function TimetablePreview({ timetable, isLoading = false }: TimetablePreviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5 text-primary" />
            Weekly ICT Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (timetable.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5 text-primary" />
            Weekly ICT Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Table2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Configure your schedule and grades to generate a timetable
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table2 className="h-5 w-5 text-primary" />
          Weekly ICT Timetable
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timetable.map((dayData) => (
            <div key={dayData.day}>
              <h3 className="font-semibold text-lg mb-3 text-foreground" data-testid={`heading-${dayData.day.toLowerCase()}`}>
                {dayData.day}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Time</TableHead>
                    <TableHead className="font-semibold">Grade/Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dayData.entries.map((entry, index) => (
                    <TableRow key={index} data-testid={`row-${dayData.day.toLowerCase()}-${index}`}>
                      <TableCell className="font-mono text-sm">{entry.time}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className="font-medium"
                          data-testid={`badge-grade-${entry.grade}`}
                        >
                          {entry.grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Import Badge for the preview
import { Badge } from "@/components/ui/badge";