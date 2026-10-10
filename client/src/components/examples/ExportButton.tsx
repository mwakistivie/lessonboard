import ExportButton from '../ExportButton';
import type { TimetableDay } from '@shared/schema';

export default function ExportButtonExample() {
  // Sample timetable data for demonstration
  const sampleTimetable: TimetableDay[] = [
    {
      day: "Monday",
      entries: [
        { time: "08:00 - 08:40", grade: "PP1" },
        { time: "08:40 - 09:20", grade: "PP2" },
        { time: "09:30 - 10:10", grade: "PG" },
      ]
    }
  ];

  return (
    <div className="flex gap-4">
      <ExportButton timetable={sampleTimetable} />
      <ExportButton timetable={[]} disabled />
    </div>
  );
}