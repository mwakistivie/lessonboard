import TimetablePreview from '../TimetablePreview';
import type { TimetableDay } from '@shared/schema';

export default function TimetablePreviewExample() {
  // Sample timetable data for demonstration
  const sampleTimetable: TimetableDay[] = [
    {
      day: "Monday",
      entries: [
        { time: "08:00 - 08:40", grade: "PP1" },
        { time: "08:40 - 09:20", grade: "PP2" },
        { time: "09:30 - 10:10", grade: "PG" },
        { time: "10:10 - 10:50", grade: "1W" },
        { time: "11:10 - 11:50", grade: "1C" },
        { time: "11:50 - 12:30", grade: "2C" },
        { time: "13:10 - 13:50", grade: "2W" },
        { time: "13:50 - 14:30", grade: "3W" },
      ]
    },
    {
      day: "Tuesday", 
      entries: [
        { time: "08:00 - 08:40", grade: "3C" },
        { time: "08:40 - 09:20", grade: "4W" },
        { time: "09:30 - 10:10", grade: "4C" },
        { time: "10:10 - 10:50", grade: "5W" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl">
      <TimetablePreview timetable={sampleTimetable} />
    </div>
  );
}