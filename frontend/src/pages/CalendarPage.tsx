import { CalendarView } from "@/components/CalendarView";
import { Header } from "@/components/Header";

export default function CalendarPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <CalendarView />
    </div>
  );
}
