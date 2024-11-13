import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchBlogs, type BlogPost } from "@/services/blogService";
import { useNavigate } from "react-router-dom";
import { EventInput } from "@fullcalendar/core/index.js";

interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  url?: string;
}

export function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const transformBlogsToEvents = (blogs: BlogPost[]): CalendarEvent[] => {
    return blogs.map((blog) => ({
      id: blog.id.toString(),
      title: blog.title,
      start: blog.created_at,
      url: `/blogs/${blog.id}`,
    }));
  };

  useEffect(() => {
    const loadBlogEvents = async () => {
      try {
        const response = await fetchBlogs(1, 100); // Get more posts for calendar
        const calendarEvents = transformBlogsToEvents(response.blog_posts);
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error loading blog events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogEvents();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-[1200px] mx-auto">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (info.event.url) {
            navigate(info.event.url);
          }
        }}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
      />
    </div>
  );
}
