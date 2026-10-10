import { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  Bell,
  BellRing,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Edit3,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Menu,
  MoreHorizontal,
  Plus,
  Radio,
  Settings2,
  ShieldCheck,
  Sparkles,
  Timer,
  UserRound,
  UsersRound,
  Volume2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useCreateLesson, useDeleteLesson, useLessons, useUpdateLesson } from "@/hooks/useLessons";
import { useToast } from "@/hooks/use-toast";

type Role = "admin" | "teacher";
type NavItem = "Dashboard" | "Timetable" | "Events" | "Teachers" | "My day" | "My timetable" | "Lesson log";

type Lesson = {
  id: number;
  time: string;
  subject: string;
  className: string;
  teacher: string;
  room: string;
  accent: string;
  status: "upcoming" | "in-progress" | "complete";
};

type SchoolEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  kind: "meeting" | "activity" | "holiday" | "assembly";
  note: string;
};

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["08:00", "08:45", "09:30", "10:45", "11:30", "12:15", "14:00"];

const baseLessons: Lesson[] = [
  { id: 1, time: "08:00 – 08:45", subject: "Mathematics", className: "Grade 7A", teacher: "Sarah Wanjiku", room: "Room 12", accent: "blue", status: "complete" },
  { id: 2, time: "08:45 – 09:30", subject: "English", className: "Grade 8B", teacher: "Sarah Wanjiku", room: "Room 12", accent: "violet", status: "upcoming" },
  { id: 3, time: "09:30 – 10:15", subject: "Science", className: "Grade 6A", teacher: "Sarah Wanjiku", room: "Lab 2", accent: "emerald", status: "upcoming" },
  { id: 4, time: "10:45 – 11:30", subject: "ICT", className: "Grade 7B", teacher: "Sarah Wanjiku", room: "Computer Lab", accent: "amber", status: "upcoming" },
  { id: 5, time: "11:30 – 12:15", subject: "Mathematics", className: "Grade 8A", teacher: "Sarah Wanjiku", room: "Room 8", accent: "blue", status: "upcoming" },
  { id: 6, time: "14:00 – 14:45", subject: "Life Skills", className: "Grade 6B", teacher: "Sarah Wanjiku", room: "Room 4", accent: "rose", status: "upcoming" },
];

const initialEvents: SchoolEvent[] = [
  { id: 1, title: "Term 2 begins", date: "Mon, 28 Sep", time: "All day", kind: "activity", note: "First day of the new term" },
  { id: 2, title: "Staff briefing", date: "Tue, 29 Sep", time: "07:30 – 08:00", kind: "meeting", note: "Library meeting room" },
  { id: 3, title: "Mid-term assessment week", date: "Mon, 26 Oct", time: "All week", kind: "assembly", note: "Assessment timetable applies" },
];

const weekGrid: Record<string, Array<{ subject: string; className: string; teacher: string; tone: string }>> = {
  Monday: [
    { subject: "Mathematics", className: "7A", teacher: "S. Wanjiku", tone: "blue" },
    { subject: "English", className: "8B", teacher: "S. Wanjiku", tone: "violet" },
    { subject: "Science", className: "6A", teacher: "S. Wanjiku", tone: "emerald" },
    { subject: "ICT", className: "7B", teacher: "S. Wanjiku", tone: "amber" },
  ],
  Tuesday: [
    { subject: "English", className: "7A", teacher: "S. Wanjiku", tone: "violet" },
    { subject: "Mathematics", className: "8A", teacher: "S. Wanjiku", tone: "blue" },
    { subject: "Social studies", className: "6B", teacher: "J. Otieno", tone: "rose" },
    { subject: "ICT", className: "8B", teacher: "S. Wanjiku", tone: "amber" },
  ],
  Wednesday: [
    { subject: "Science", className: "7B", teacher: "S. Wanjiku", tone: "emerald" },
    { subject: "English", className: "6A", teacher: "S. Wanjiku", tone: "violet" },
    { subject: "Mathematics", className: "8B", teacher: "S. Wanjiku", tone: "blue" },
    { subject: "Life skills", className: "7A", teacher: "M. Akinyi", tone: "rose" },
  ],
  Thursday: [
    { subject: "ICT", className: "8A", teacher: "S. Wanjiku", tone: "amber" },
    { subject: "Science", className: "6B", teacher: "S. Wanjiku", tone: "emerald" },
    { subject: "Mathematics", className: "7A", teacher: "S. Wanjiku", tone: "blue" },
    { subject: "English", className: "7B", teacher: "S. Wanjiku", tone: "violet" },
  ],
  Friday: [
    { subject: "Mathematics", className: "6A", teacher: "S. Wanjiku", tone: "blue" },
    { subject: "Science", className: "8B", teacher: "S. Wanjiku", tone: "emerald" },
    { subject: "English", className: "8A", teacher: "S. Wanjiku", tone: "violet" },
    { subject: "Clubs", className: "All classes", teacher: "Various", tone: "rose" },
  ],
};

const toneClasses: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200",
  violet: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-200",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200",
  amber: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200",
  rose: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200",
};

type TimetableCell = {
  id: string;
  day: string;
  time: string;
  subject: string;
  className: string;
  teacher: string;
  room: string;
  tone: string;
};

const buildInitialTimetable = (): TimetableCell[] =>
  Object.entries(weekGrid).flatMap(([day, slots]) =>
    slots.map((slot, index) => ({
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      day,
      time: times[index],
      subject: slot.subject,
      className: slot.className,
      teacher: slot.teacher,
      room: `${slot.className} room`,
      tone: slot.tone,
    })),
  );

const mapPersistedLessonToCell = (lesson: { id: string; day: string; time: string; subject: string; className: string; teacher: string; room: string; tone: string }): TimetableCell => ({
  id: lesson.id,
  day: lesson.day,
  time: lesson.time,
  subject: lesson.subject,
  className: lesson.className,
  teacher: lesson.teacher,
  room: lesson.room,
  tone: lesson.tone,
});

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{children}</p>;
}

function StatCard({ icon: Icon, label, value, detail, tone }: { icon: typeof CalendarDays; label: string; value: string; detail: string; tone: string }) {
  return (
    <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", tone)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function BellStatus({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
      <CardContent className={cn("p-5", compact && "p-4")}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <Radio className="h-5 w-5" />
              <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Digital ringer</p>
              <p className="text-xs text-emerald-600">Connected and online</p>
            </div>
          </div>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Online</Badge>
        </div>
        {!compact && (
          <>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Next bell</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">08:45</p>
                </div>
                <p className="text-sm font-semibold text-blue-600">in 18 min</p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-[62%] rounded-full bg-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-500"><Volume2 className="h-3.5 w-3.5" /> Sound level</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">78%</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ScheduleList({ lessons, onStart }: { lessons: Lesson[]; onStart: (lesson: Lesson) => void }) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson) => (
        <div key={lesson.id} className={cn("flex items-center gap-3 rounded-xl border p-3 transition", lesson.status === "in-progress" ? "border-blue-300 bg-blue-50/70 dark:border-blue-800 dark:bg-blue-950/30" : "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950")}>
          <div className="w-[76px] shrink-0 text-xs font-semibold text-slate-500">{lesson.time.split(" – ")[0]}<span className="block font-normal text-slate-400">{lesson.time.split(" – ")[1]}</span></div>
          <div className={cn("h-9 w-1 rounded-full", `bg-${lesson.accent}-500`)} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{lesson.subject}</p>
            <p className="mt-0.5 text-xs text-slate-500">{lesson.className} · {lesson.room}</p>
          </div>
          {lesson.status === "complete" && <Check className="h-4 w-4 text-emerald-500" />}
          {lesson.status === "in-progress" && <Badge className="bg-blue-600 text-[10px]">Live</Badge>}
          {lesson.status === "upcoming" && (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-blue-600 hover:text-blue-700" onClick={() => onStart(lesson)}>Start <ChevronRight className="ml-1 h-3.5 w-3.5" /></Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [role, setRole] = useState<Role>("admin");
  const [activeNav, setActiveNav] = useState<NavItem>("Dashboard");
  const [lessons, setLessons] = useState<Lesson[]>(baseLessons);
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("Wed, 30 Sep");
  const [eventTime, setEventTime] = useState("08:00 – 09:00");
  const [eventNote, setEventNote] = useState("");
  const [isTermOpen, setIsTermOpen] = useState(false);
  const [termLessonLength, setTermLessonLength] = useState("45 minutes");
  const [termSaved, setTermSaved] = useState(false);
  const [timerLessonId, setTimerLessonId] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [lessonLogs, setLessonLogs] = useState<Array<{ lesson: string; time: string; duration: string; status: string }>>([
    { lesson: "Mathematics · Grade 7A", time: "08:02 – 08:43", duration: "41 min", status: "On time" },
  ]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTimetableEditing, setIsTimetableEditing] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<TimetableCell[]>(() => buildInitialTimetable());
  const { data: persistedLessons = [], isLoading: isLessonsLoading } = useLessons();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const [editingLesson, setEditingLesson] = useState<TimetableCell | null>(null);
  const [lessonTarget, setLessonTarget] = useState<{ day: string; time: string } | null>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [lessonDraft, setLessonDraft] = useState({
    subject: "",
    className: "",
    teacher: "",
    room: "",
    tone: "blue",
  });

  useEffect(() => {
    if (timerLessonId === null) return;
    const interval = window.setInterval(() => setElapsed((current) => current + 1), 1000);
    return () => window.clearInterval(interval);
  }, [timerLessonId]);

  useEffect(() => {
    if (isLessonsLoading) return;
    if (persistedLessons.length > 0) {
      setScheduleItems(persistedLessons.map(mapPersistedLessonToCell));
    }
  }, [persistedLessons, isLessonsLoading]);

  const timerLesson = lessons.find((lesson) => lesson.id === timerLessonId);
  const roleNav: NavItem[] = role === "admin" ? ["Dashboard", "Timetable", "Events", "Teachers"] : ["My day", "My timetable", "Lesson log"];
  const pageTitle = activeNav === "Dashboard" ? "Good morning, Admin" : activeNav === "My day" ? "Good morning, Sarah" : activeNav;
  const pageDescription = activeNav === "Dashboard" ? "Here’s what’s happening across the school today." : activeNav === "My day" ? "Your teaching day at a glance." : activeNav === "Timetable" ? "Plan and manage the timetable for the full term." : activeNav === "Events" ? "Keep scheduled school events and bell changes in sync." : activeNav === "Teachers" ? "See teaching coverage and time management across the school." : activeNav === "Lesson log" ? "Record when lessons actually start and finish." : "Your weekly teaching schedule.";

  const changeRole = (nextRole: Role) => {
    setRole(nextRole);
    setActiveNav(nextRole === "admin" ? "Dashboard" : "My day");
    setMobileMenuOpen(false);
  };

  const startLesson = (lesson: Lesson) => {
    setTimerLessonId(lesson.id);
    setElapsed(0);
    setLessons((current) => current.map((item) => item.id === lesson.id ? { ...item, status: "in-progress" } : item));
    setActiveNav("Lesson log");
  };

  const finishLesson = () => {
    if (!timerLesson) return;
    const minutes = Math.max(1, Math.round(elapsed / 60));
    setLessonLogs((logs) => [{ lesson: `${timerLesson.subject} · ${timerLesson.className}`, time: `08:45 – 09:${String(45 + minutes).padStart(2, "0")}`, duration: `${minutes} min`, status: minutes <= 45 ? "On time" : "Over time" }, ...logs]);
    setLessons((current) => current.map((item) => item.id === timerLesson.id ? { ...item, status: "complete" } : item));
    setTimerLessonId(null);
    setElapsed(0);
  };

  const saveEvent = () => {
    if (!eventTitle.trim()) return;
    if (editingEventId !== null) {
      setEvents((current) => current.map((event) => event.id === editingEventId ? { ...event, title: eventTitle.trim(), date: eventDate, time: eventTime, note: eventNote || "Updated by school admin" } : event));
    } else {
      setEvents((current) => [...current, { id: Date.now(), title: eventTitle.trim(), date: eventDate, time: eventTime, kind: "activity", note: eventNote || "Added by school admin" }]);
    }
    setEventTitle("");
    setEventNote("");
    setEditingEventId(null);
    setIsEventOpen(false);
  };

  const openEventEditor = (event?: SchoolEvent) => {
    if (event) {
      setEditingEventId(event.id);
      setEventTitle(event.title);
      setEventDate(event.date);
      setEventTime(event.time);
      setEventNote(event.note);
    } else {
      setEditingEventId(null);
      setEventTitle("");
      setEventDate("Wed, 30 Sep");
      setEventTime("08:00 – 09:00");
      setEventNote("");
    }
    setIsEventOpen(true);
  };

  const navigate = (item: NavItem) => {
    setActiveNav(item);
    setMobileMenuOpen(false);
  };

  const openLessonEditor = (slot?: TimetableCell, day?: string, time?: string) => {
    if (!slot) {
      setEditingLesson(null);
      setLessonTarget(day && time ? { day, time } : { day: weekdays[0], time: times[0] });
      setIsLessonDialogOpen(true);
      setLessonDraft({
        subject: "",
        className: "",
        teacher: "",
        room: "",
        tone: "blue",
      });
      return;
    }

    setEditingLesson(slot);
    setLessonTarget({ day: slot.day, time: slot.time });
    setIsLessonDialogOpen(true);
    setLessonDraft({
      subject: slot.subject,
      className: slot.className,
      teacher: slot.teacher,
      room: slot.room,
      tone: slot.tone,
    });
  };

  const saveLesson = async () => {
    if (!lessonDraft.subject.trim()) return;

    const payload = {
      day: editingLesson?.day ?? lessonTarget?.day ?? weekdays[0],
      time: editingLesson?.time ?? lessonTarget?.time ?? times[0],
      subject: lessonDraft.subject.trim() || "New lesson",
      className: lessonDraft.className.trim() || "Grade 7A",
      teacher: lessonDraft.teacher.trim() || "Staff",
      room: lessonDraft.room.trim() || "Room 1",
      tone: lessonDraft.tone,
    };

    try {
      if (editingLesson) {
        const updatedLesson = await updateLesson.mutateAsync({
          id: editingLesson.id,
          data: payload,
        });

        setScheduleItems((current) => current.map((item) => (item.id === updatedLesson.id ? mapPersistedLessonToCell(updatedLesson) : item)));
      } else {
        const createdLesson = await createLesson.mutateAsync(payload);
        setScheduleItems((current) => [...current, mapPersistedLessonToCell(createdLesson)]);
      }
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }

    setEditingLesson(null);
    setLessonTarget(null);
    setIsLessonDialogOpen(false);
    setLessonDraft({
      subject: "",
      className: "",
      teacher: "",
      room: "",
      tone: "blue",
    });
  };

  const duplicateLesson = async (slot: TimetableCell) => {
    try {
      const createdLesson = await createLesson.mutateAsync({
        day: slot.day,
        time: slot.time,
        subject: slot.subject,
        className: slot.className,
        teacher: slot.teacher,
        room: slot.room,
        tone: slot.tone,
      });
      setScheduleItems((current) => [...current, mapPersistedLessonToCell(createdLesson)]);
    } catch (error) {
      console.error("Failed to duplicate lesson:", error);
    }
  };

  const deleteLesson = async (slot: TimetableCell) => {
    try {
      await deleteLessonMutation.mutateAsync(slot.id);
      setScheduleItems((current) => current.filter((item) => item.id !== slot.id));
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    }
  };

  const downloadTextFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportScheduleCsv = () => {
    if (scheduleItems.length === 0) {
      toast({ title: "No lessons to export", description: "Add a lesson to the timetable before exporting.", variant: "destructive" });
      return;
    }

    const rows = [
      ["day", "time", "subject", "class", "teacher", "room", "tone"],
      ...scheduleItems.map((item) => [item.day, item.time, item.subject, item.className, item.teacher, item.room, item.tone]),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadTextFile("school-timetable.csv", csv, "text/csv;charset=utf-8;");
    toast({ title: "Export complete", description: "The timetable CSV has been downloaded." });
  };

  const exportTeacherTimetableCsv = () => {
    const rows = [
      ["day", "time", "subject", "class", "teacher", "room", "tone"],
      ...weekdays.flatMap((day) =>
        times.map((time) => {
          const item = scheduleItems.find((slot) => slot.day === day && slot.time === time);
          return item ? [day, time, item.subject, item.className, item.teacher, item.room, item.tone] : [day, time, "", "", "", "", ""];
        }),
      ),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadTextFile("teacher-timetable.csv", csv, "text/csv;charset=utf-8;");
    toast({ title: "Download ready", description: "Your timetable export has been downloaded." });
  };

  const exportTeacherReportCsv = () => {
    const rows = [
      ["lesson", "time", "duration", "status"],
      ...lessonLogs.map((log) => [log.lesson, log.time, log.duration, log.status]),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadTextFile("teacher-report.csv", csv, "text/csv;charset=utf-8;");
    toast({ title: "Report exported", description: "The lesson activity report has been downloaded." });
  };

  const openBellSystem = () => {
    setActiveNav("Events");
    toast({ title: "Bell system", description: "Showing the bell and event controls for the school schedule." });
  };

  const openSettings = () => {
    setIsTermOpen(true);
    toast({ title: "Settings", description: "Opening the term setup panel." });
  };

  const isTeacher = role === "teacher";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f7f9fc] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px]">
        <aside className={cn("fixed inset-y-0 left-0 z-40 mt-16 w-[250px] border-r border-slate-200 bg-white px-4 py-5 transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:mt-0 lg:translate-x-0", mobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="hidden items-center gap-3 px-3 pb-7 lg:flex">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><CalendarDays className="h-5 w-5" /></span>
            <div><p className="text-sm font-bold tracking-tight">Bellboard</p><p className="text-[11px] text-slate-500">School operations</p></div>
          </div>

          <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex gap-1">
              {(["admin", "teacher"] as Role[]).map((item) => (
                <button key={item} onClick={() => changeRole(item)} className={cn("flex-1 rounded-xl px-2 py-2 text-xs font-semibold capitalize transition", role === item ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200")}>{item}</button>
              ))}
            </div>
          </div>

          <nav className="space-y-6">
            <div>
              <SectionLabel>{isTeacher ? "Teaching" : "Workspace"}</SectionLabel>
              <div className="space-y-1">
                {roleNav.map((item) => {
                  const icons: Record<string, typeof LayoutDashboard> = { Dashboard: LayoutDashboard, Timetable: CalendarDays, Events: Bell, Teachers: UsersRound, "My day": LayoutDashboard, "My timetable": CalendarDays, "Lesson log": ListChecks };
                  const Icon = icons[item];
                  return <button key={item} onClick={() => navigate(item)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", activeNav === item ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-200")}><Icon className="h-4 w-4" />{item}{item === "Events" && <span className="ml-auto rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">3</span>}</button>;
                })}
              </div>
            </div>
            <div>
              <SectionLabel>Monitor</SectionLabel>
              <button type="button" onClick={openBellSystem} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-200"><BellRing className="h-4 w-4" /> Bell system <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" /></button>
              <button type="button" onClick={openSettings} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-200"><Settings2 className="h-4 w-4" /> Settings</button>
            </div>
          </nav>

          <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-slate-900 p-4 text-white dark:bg-blue-950">
            <div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Term 2 is active</div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">15 weeks · 28 Sep – 18 Dec 2026</p>
            <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full w-[8%] rounded-full bg-blue-400" /></div>
          </div>
        </aside>

        {mobileMenuOpen && <button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" />}

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="mt-0.5 lg:hidden"><Menu className="h-5 w-5" /></Button>
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><span>Monday, 28 September 2026</span><span className="h-1 w-1 rounded-full bg-slate-300" /><span className="text-emerald-600">School day</span></div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{pageTitle}</h1>
                  <p className="mt-1 text-sm text-slate-500">{pageDescription}</p>
                </div>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <button type="button" onClick={openBellSystem} className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-white"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" /></button>
                <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3 dark:border-slate-800"><div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{isTeacher ? "SW" : "AK"}</div><div><p className="text-xs font-semibold">{isTeacher ? "Sarah Wanjiku" : "Amina Kariuki"}</p><p className="text-[11px] text-slate-400">{isTeacher ? "Teacher" : "School admin"}</p></div></div>
              </div>
            </div>

            {activeNav === "Dashboard" && !isTeacher && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard icon={CalendarDays} label="Lessons today" value="24" detail="Across 8 classes" tone="bg-blue-50 text-blue-600 dark:bg-blue-950/40" />
                  <StatCard icon={UsersRound} label="Teachers active" value="18/20" detail="2 on leave today" tone="bg-violet-50 text-violet-600 dark:bg-violet-950/40" />
                  <StatCard icon={Clock3} label="On-time lessons" value="92%" detail="+4% from last week" tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" />
                  <StatCard icon={BellRing} label="Next bell" value="08:45" detail="English · Grade 8B" tone="bg-amber-50 text-amber-600 dark:bg-amber-950/40" />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                  <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div><CardTitle className="text-base">Today’s timetable</CardTitle><p className="mt-1 text-xs text-slate-500">Monday · 28 September</p></div>
                      <Button variant="outline" size="sm" onClick={() => navigate("Timetable")} className="gap-2 text-xs">View full timetable <ChevronRight className="h-3.5 w-3.5" /></Button>
                    </CardHeader>
                    <CardContent><ScheduleList lessons={lessons.slice(0, 5)} onStart={startLesson} /></CardContent>
                  </Card>
                  <div className="space-y-6"><BellStatus /><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3"><CardTitle className="text-base">Upcoming events</CardTitle><button onClick={() => navigate("Events")} className="text-xs font-semibold text-blue-600">View all</button></CardHeader><CardContent className="space-y-3">{events.slice(0, 3).map((event) => <div key={event.id} className="flex gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-900"><CalendarDays className="h-4 w-4" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{event.title}</p><p className="mt-0.5 text-xs text-slate-500">{event.date} · {event.time}</p></div></div>)}</CardContent></Card></div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                  <Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base">Teacher time management</CardTitle><p className="mt-1 text-xs text-slate-500">Lesson start and finish records</p></div><button onClick={() => navigate("Teachers")} className="text-xs font-semibold text-blue-600">Details</button></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div className="flex -space-x-2">{["AK", "JO", "MW", "SN"].map((initials) => <span key={initials} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-300">{initials}</span>)}<span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-blue-100 text-[10px] font-bold text-blue-700 dark:border-slate-900 dark:bg-blue-950">+14</span></div><span className="text-sm font-bold text-emerald-600">92% on time</span></div><Progress value={92} className="h-2" /><div className="flex justify-between text-xs text-slate-500"><span>18 teachers reporting</span><span>Target 90%</span></div></CardContent></Card>
                  <Card className="border-slate-200/80 bg-blue-600 text-white shadow-sm"><CardContent className="flex h-full items-center justify-between gap-4 p-5"><div><Badge className="mb-3 border-0 bg-white/15 text-blue-50 hover:bg-white/15"><Sparkles className="mr-1 h-3 w-3" /> Ready for the term</Badge><h3 className="text-lg font-semibold">Your timetable is ready to share</h3><p className="mt-1 max-w-sm text-sm leading-relaxed text-blue-100">All lesson slots are filled for Term 2. Teachers will receive notifications automatically.</p><Button onClick={() => navigate("Timetable")} className="mt-4 bg-white text-blue-700 hover:bg-blue-50">Review timetable <ChevronRight className="ml-1 h-4 w-4" /></Button></div><GraduationCap className="hidden h-20 w-20 text-blue-300/50 sm:block" /></CardContent></Card>
                </div>
              </div>
            )}

            {activeNav === "Timetable" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current term</p>
                      <p className="mt-1 text-sm font-semibold">Term 2, 2026</p>
                    </div>
                    <Badge variant="outline" className={cn(termSaved ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-blue-200 bg-blue-50 text-blue-700")}>{termSaved ? "Saved just now" : "Published"}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={exportScheduleCsv}><Download className="h-4 w-4" /> Export</Button>
                    <Button size="sm" className="gap-2" onClick={() => setIsTimetableEditing((value) => !value)}>
                      <Edit3 className="h-4 w-4" /> {isTimetableEditing ? "Done editing" : "Edit timetable"}
                    </Button>
                  </div>
                </div>

                <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
                  <CardContent className="overflow-x-auto p-0">
                    <div className="min-w-[900px]">
                      <div className="grid grid-cols-[110px_repeat(5,minmax(150px,1fr))] border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Time</div>
                        {weekdays.map((day, index) => (
                          <div key={day} className="border-l border-slate-200 p-4 dark:border-slate-800">
                            <p className="text-sm font-bold">{day}</p>
                            <p className="mt-1 text-[11px] text-slate-400">{index === 0 ? "Today" : `29 Sep – ${index + 28} Sep`}</p>
                          </div>
                        ))}
                      </div>

                      {times.map((time, rowIndex) => (
                        <div key={time} className="grid min-h-[108px] grid-cols-[110px_repeat(5,minmax(150px,1fr))] border-b border-slate-100 last:border-0 dark:border-slate-900">
                          <div className="p-4 text-xs font-semibold text-slate-500">
                            {time}
                            <span className="mt-1 block text-[10px] font-normal text-slate-400">{rowIndex === 3 ? "Break" : "45 min"}</span>
                          </div>

                          {weekdays.map((day) => {
                            const item = scheduleItems.find((slot) => slot.day === day && slot.time === time);

                            if (rowIndex === 3) {
                              return (
                                <div key={`${day}-${time}`} className="border-l border-slate-100 p-2 dark:border-slate-900">
                                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-[10px] font-medium text-slate-400 dark:border-slate-800">
                                    First break
                                  </div>
                                </div>
                              );
                            }

                            if (!item) {
                              return (
                                <div key={`${day}-${time}`} className="border-l border-slate-100 p-2 dark:border-slate-900">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingLesson(null);
                                      setLessonTarget({ day, time });
                                      setLessonDraft({ subject: "", className: "", teacher: "", room: "", tone: "blue" });
                                      setIsLessonDialogOpen(true);
                                    }}
                                    className={cn(
                                      "flex h-full w-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-[10px] font-medium text-slate-400 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-800",
                                      isTimetableEditing ? "opacity-100" : "opacity-0",
                                    )}
                                  >
                                    {isTimetableEditing ? "Add lesson" : "—"}
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div key={`${day}-${time}`} className="border-l border-slate-100 p-2 dark:border-slate-900">
                                <div className={cn("h-full rounded-lg border p-3", toneClasses[item.tone])}>
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-bold">{item.subject}</p>
                                    {isTimetableEditing ? (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <button
                                            type="button"
                                            aria-label={`Lesson actions for ${item.subject}`}
                                            className="rounded-md p-1 text-current opacity-70 transition hover:bg-black/5 hover:opacity-100"
                                          >
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                          </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onSelect={() => openLessonEditor(item)}>Edit lesson</DropdownMenuItem>
                                          <DropdownMenuItem onSelect={() => duplicateLesson(item)}>Duplicate lesson</DropdownMenuItem>
                                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={() => deleteLesson(item)}>
                                            Delete lesson
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    ) : (
                                      <MoreHorizontal className="h-3.5 w-3.5 opacity-50" />
                                    )}
                                  </div>
                                  <p className="mt-2 text-[11px] font-medium opacity-80">Grade {item.className}</p>
                                  <p className="mt-1 text-[10px] opacity-60">{item.teacher}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                  <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-base">Term setup</CardTitle>
                      <p className="text-xs text-slate-500">Changes apply to all teachers and ringers</p>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label className="text-xs text-slate-500">Term starts</Label>
                        <Input className="mt-2" value="28 Sep 2026" readOnly />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Term ends</Label>
                        <Input className="mt-2" value="18 Dec 2026" readOnly />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Lesson length</Label>
                        <Input className="mt-2" value={termLessonLength} readOnly />
                      </div>
                    </CardContent>
                  </Card>
                  <BellStatus compact />
                </div>
              </div>
            )}

            {activeNav === "Events" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Term 2 calendar</p><p className="mt-1 text-xs text-slate-400">Events can also change the school bell schedule.</p></div><Button onClick={() => openEventEditor()} size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add event</Button></div>
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]"><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader><CardTitle className="text-base">Scheduled events</CardTitle></CardHeader><CardContent className="space-y-3">{events.map((event) => <div key={event.id} className="flex items-center gap-4 rounded-xl border border-slate-200/80 p-4 dark:border-slate-800"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40"><CalendarDays className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{event.title}</p><Badge variant="outline" className="text-[10px]">{event.kind}</Badge></div><p className="mt-1 text-xs text-slate-500">{event.date} · {event.time}</p><p className="mt-1 text-xs text-slate-400">{event.note}</p></div><Button variant="ghost" size="icon" className="text-slate-400" onClick={() => openEventEditor(event)}><Edit3 className="h-4 w-4" /></Button></div>)}</CardContent></Card><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader><CardTitle className="text-base">Bell rules</CardTitle><p className="text-xs text-slate-500">Connected to the main hall ringer</p></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Automatic lesson bells</p><p className="text-xs text-slate-500">Based on timetable slots</p></div><Switch defaultChecked /></div><Separator /><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Break bells</p><p className="text-xs text-slate-500">Play for scheduled breaks</p></div><Switch defaultChecked /></div><Separator /><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Event reminders</p><p className="text-xs text-slate-500">Notify affected teachers</p></div><Switch defaultChecked /></div><Button variant="outline" className="mt-2 w-full gap-2"><BellRing className="h-4 w-4" /> Test ringer</Button></CardContent></Card></div>
              </div>
            )}

            {activeNav === "Teachers" && (
              <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-3"><StatCard icon={UsersRound} label="Teaching staff" value="20" detail="18 reporting today" tone="bg-blue-50 text-blue-600 dark:bg-blue-950/40" /><StatCard icon={Timer} label="Average lesson" value="43 min" detail="2 minutes under target" tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" /><StatCard icon={CircleHelp} label="Needs attention" value="2" detail="Missing end times" tone="bg-amber-50 text-amber-600 dark:bg-amber-950/40" /></div><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base">Today’s teacher activity</CardTitle><p className="mt-1 text-xs text-slate-500">Live view of lesson time records</p></div><Button variant="outline" size="sm" onClick={exportTeacherReportCsv}>Export report</Button></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400 dark:border-slate-800"><th className="pb-3 font-semibold">Teacher</th><th className="pb-3 font-semibold">Lessons</th><th className="pb-3 font-semibold">On time</th><th className="pb-3 font-semibold">Last activity</th><th className="pb-3 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-900">{[["Sarah Wanjiku", "6 / 6", "100%", "08:43", "On track"], ["John Otieno", "4 / 5", "80%", "08:41", "Teaching"], ["Mary Akinyi", "5 / 5", "96%", "08:44", "On track"], ["Samuel Njoroge", "3 / 4", "75%", "08:12", "Needs review"]].map(([teacher, count, percent, last, status]) => <tr key={teacher}><td className="py-4"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{teacher.split(" ").map((name) => name[0]).join("")}</span><span className="text-sm font-semibold">{teacher}</span></div></td><td className="py-4 text-sm text-slate-500">{count}</td><td className="py-4 text-sm font-semibold text-emerald-600">{percent}</td><td className="py-4 text-sm text-slate-500">{last}</td><td className="py-4"><Badge variant="outline" className={status === "Needs review" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>{status}</Badge></td></tr>)}</tbody></table></CardContent></Card></div>
            )}

            {isTeacher && activeNav === "My day" && (
              <div className="space-y-6"><div className="grid gap-6 xl:grid-cols-[1fr_340px]"><Card className="overflow-hidden border-0 bg-blue-600 text-white shadow-sm"><CardContent className="p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-6"><div><Badge className="border-0 bg-white/15 text-blue-50 hover:bg-white/15">Next lesson · in 18 min</Badge><h2 className="mt-4 text-3xl font-bold tracking-tight">English</h2><p className="mt-1 text-blue-100">Grade 8B · Room 12</p><p className="mt-5 flex items-center gap-2 text-sm text-blue-100"><Clock3 className="h-4 w-4" /> 08:45 – 09:30</p></div><div className="rounded-2xl bg-white/10 p-4 text-right"><p className="text-xs text-blue-100">Today’s progress</p><p className="mt-1 text-2xl font-bold">1 <span className="text-sm font-normal text-blue-200">of 6</span></p><Progress value={17} className="mt-3 h-1.5 bg-white/20 [&>div]:bg-white" /></div></div><Button onClick={() => startLesson(lessons[1])} className="mt-7 bg-white text-blue-700 hover:bg-blue-50">Start when bell rings <ChevronRight className="ml-1 h-4 w-4" /></Button></CardContent></Card><BellStatus /></div><div className="grid gap-6 xl:grid-cols-[1fr_340px]"><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader><CardTitle className="text-base">Your teaching schedule</CardTitle><p className="mt-1 text-xs text-slate-500">Tap start when you begin a lesson</p></CardHeader><CardContent><ScheduleList lessons={lessons} onStart={startLesson} /></CardContent></Card><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40"><Bell className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Lesson in 18 minutes</p><p className="mt-1 text-xs leading-relaxed text-slate-500">English with Grade 8B starts at 08:45 in Room 12.</p></div></div><Separator /><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40"><CalendarDays className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Staff briefing tomorrow</p><p className="mt-1 text-xs leading-relaxed text-slate-500">07:30 in the library meeting room.</p></div></div></CardContent></Card></div></div>
            )}

            {isTeacher && activeNav === "My timetable" && (
              <div className="space-y-6"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Sarah Wanjiku’s timetable</p><p className="mt-1 text-xs text-slate-500">Term 2 · 28 September – 18 December 2026</p></div><Button variant="outline" size="sm" className="gap-2" onClick={exportTeacherTimetableCsv}><Download className="h-4 w-4" /> Download</Button></div><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardContent className="overflow-x-auto p-0"><div className="min-w-[700px]"><div className="grid grid-cols-[100px_repeat(5,minmax(120px,1fr))] border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"><div className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Time</div>{weekdays.map((day) => <div key={day} className="border-l border-slate-200 p-4 text-sm font-bold dark:border-slate-800">{day.slice(0, 3)}</div>)}</div>{["08:00", "08:45", "09:30", "10:45", "11:30", "14:00"].map((time, index) => <div key={time} className="grid min-h-[105px] grid-cols-[100px_repeat(5,minmax(120px,1fr))] border-b border-slate-100 last:border-0 dark:border-slate-900"><div className="p-4 text-xs font-semibold text-slate-500">{time}</div>{weekdays.map((day) => { const item = weekGrid[day][index % 4]; const mine = item.teacher === "S. Wanjiku"; return <div key={`${day}-${time}`} className="border-l border-slate-100 p-2 dark:border-slate-900">{mine ? <div className={cn("rounded-lg border p-3", toneClasses[item.tone])}><p className="text-xs font-bold">{item.subject}</p><p className="mt-2 text-[11px]">{item.className}</p><p className="mt-1 text-[10px] opacity-60">{item.teacher}</p></div> : <div className="flex h-full items-center justify-center text-[10px] text-slate-300">—</div>}</div>})}</div>)}</div></CardContent></Card></div>
            )}

            {isTeacher && activeNav === "Lesson log" && (
              <div className="space-y-6"><Card className={cn("border-slate-200/80 shadow-sm dark:border-slate-800", timerLesson && "border-blue-300 dark:border-blue-800")}><CardContent className="flex flex-wrap items-center justify-between gap-5 p-5"><div className="flex items-center gap-4"><span className={cn("grid h-12 w-12 place-items-center rounded-2xl", timerLesson ? "bg-blue-100 text-blue-600 dark:bg-blue-950/50" : "bg-slate-100 text-slate-500 dark:bg-slate-900")}><Timer className="h-6 w-6" /></span><div><p className="text-sm font-bold">{timerLesson ? `${timerLesson.subject} · ${timerLesson.className}` : "No lesson in progress"}</p><p className="mt-1 text-xs text-slate-500">{timerLesson ? `${timerLesson.room} · recording live lesson time` : "Start a lesson from your schedule to begin recording."}</p></div></div><div className="flex items-center gap-4">{timerLesson && <span className="font-mono text-2xl font-bold text-blue-600">{formatElapsed(elapsed)}</span>}{timerLesson ? <Button onClick={finishLesson} className="gap-2 bg-rose-600 hover:bg-rose-700"><SquareIcon /> Finish lesson</Button> : <Button onClick={() => startLesson(lessons.find((lesson) => lesson.status === "upcoming") || lessons[0])} className="gap-2"><Timer className="h-4 w-4" /> Start next lesson</Button>}</div></CardContent></Card><div className="grid gap-6 xl:grid-cols-[1fr_340px]"><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base">Today’s lesson records</CardTitle><p className="mt-1 text-xs text-slate-500">Your start and finish times are shared with the admin.</p></div><Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">1 recorded</Badge></CardHeader><CardContent className="space-y-3">{lessonLogs.map((log, index) => <div key={`${log.lesson}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200/80 p-4 dark:border-slate-800"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"><Check className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{log.lesson}</p><p className="mt-1 text-xs text-slate-500">{log.time} · {log.duration}</p></div><Badge variant="outline" className="border-emerald-200 text-emerald-700">{log.status}</Badge></div>)}</CardContent></Card><Card className="border-slate-200/80 shadow-sm dark:border-slate-800"><CardHeader><CardTitle className="text-base">How it works</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-slate-500"><div className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span><p>Start the timer when you begin teaching.</p></div><div className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span><p>Finish it when the lesson ends and the bell rings.</p></div><div className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span><p>Admins can review time management without interrupting your teaching.</p></div></CardContent></Card></div></div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isLessonDialogOpen} onOpenChange={(open) => { setIsLessonDialogOpen(open); if (!open) { setEditingLesson(null); setLessonDraft({ subject: "", className: "", teacher: "", room: "", tone: "blue" }); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLesson ? "Edit lesson" : "Add lesson"}</DialogTitle>
            <DialogDescription>Update the timetable slot details and save the change.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="lesson-subject">Subject</Label>
              <Input id="lesson-subject" value={lessonDraft.subject} onChange={(event) => setLessonDraft((current) => ({ ...current, subject: event.target.value }))} placeholder="Mathematics" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lesson-class">Class / Grade</Label>
                <Input id="lesson-class" value={lessonDraft.className} onChange={(event) => setLessonDraft((current) => ({ ...current, className: event.target.value }))} placeholder="Grade 7A" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lesson-teacher">Teacher</Label>
                <Input id="lesson-teacher" value={lessonDraft.teacher} onChange={(event) => setLessonDraft((current) => ({ ...current, teacher: event.target.value }))} placeholder="Sarah Wanjiku" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lesson-room">Room</Label>
                <Input id="lesson-room" value={lessonDraft.room} onChange={(event) => setLessonDraft((current) => ({ ...current, room: event.target.value }))} placeholder="Room 12" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lesson-tone">Colour</Label>
                <select
                  id="lesson-tone"
                  value={lessonDraft.tone}
                  onChange={(event) => setLessonDraft((current) => ({ ...current, tone: event.target.value }))}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="blue">Blue</option>
                  <option value="violet">Violet</option>
                  <option value="emerald">Emerald</option>
                  <option value="amber">Amber</option>
                  <option value="rose">Rose</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLessonDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveLesson} disabled={!lessonDraft.subject.trim()}>Save lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTermOpen} onOpenChange={setIsTermOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Prefill term timetable</DialogTitle><DialogDescription>Set the shared lesson length before publishing the term template to teachers and the digital ringer.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-2"><div className="grid gap-2"><Label htmlFor="term-length">Lesson length</Label><Input id="term-length" value={termLessonLength} onChange={(event) => setTermLessonLength(event.target.value)} placeholder="45 minutes" /></div><div className="rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-800 dark:bg-blue-950/30 dark:text-blue-200">This template covers Monday to Friday for all 15 weeks of Term 2. Teachers will receive the updated schedule and bell times when you save.</div></div>
          <DialogFooter><Button variant="outline" onClick={() => setIsTermOpen(false)}>Cancel</Button><Button onClick={() => { setTermSaved(true); setIsTermOpen(false); }}>Save and publish</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingEventId === null ? "Add school event" : "Update school event"}</DialogTitle><DialogDescription>Add an event to the term calendar. Affected teachers will see it in their notifications.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-2"><div className="grid gap-2"><Label htmlFor="event-title">Event name</Label><Input id="event-title" value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} placeholder="e.g. Parents’ meeting" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="grid gap-2"><Label htmlFor="event-date">Date</Label><Input id="event-date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></div><div className="grid gap-2"><Label htmlFor="event-time">Time</Label><Input id="event-time" value={eventTime} onChange={(event) => setEventTime(event.target.value)} /></div></div><div className="grid gap-2"><Label htmlFor="event-note">Notes <span className="font-normal text-slate-400">(optional)</span></Label><Input id="event-note" value={eventNote} onChange={(event) => setEventNote(event.target.value)} placeholder="Location or instructions" /></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setIsEventOpen(false)}>Cancel</Button><Button onClick={saveEvent} disabled={!eventTitle.trim()}>Save event</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SquareIcon() {
  return <span className="h-3.5 w-3.5 rounded-[3px] border-2 border-current" />;
}