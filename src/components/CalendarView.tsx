import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookAppointment } from "./BookAppointment";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  practitioner: string;
  patient?: string;
  type: "appointment" | "consultation" | "therapy";
  status: "scheduled" | "completed" | "cancelled";
}

interface CalendarViewProps {
  userRole: "patient" | "practitioner" | "admin";
}

export function CalendarView({ userRole }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  // Mock calendar events
  const mockEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Abhyanga Session",
      time: "10:00 AM",
      duration: "90 min",
      practitioner: "Dr. Priya Sharma",
      patient: userRole !== "patient" ? "John Doe" : undefined,
      type: "therapy",
      status: "scheduled"
    },
    {
      id: "2",
      title: "Shirodhara Therapy",
      time: "2:00 PM",
      duration: "60 min",
      practitioner: "Dr. Raj Patel",
      patient: userRole !== "patient" ? "Jane Smith" : undefined,
      type: "therapy",
      status: "scheduled"
    },
    {
      id: "3",
      title: "Initial Consultation",
      time: "11:30 AM",
      duration: "45 min",
      practitioner: "Dr. Anita Kumar",
      patient: userRole !== "patient" ? "Mike Johnson" : undefined,
      type: "consultation",
      status: "completed"
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isFuture = date > today;
    
    if (isToday || isFuture) {
      return mockEvents.slice(0, Math.floor(Math.random() * 3) + 1);
    }
    return [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="wellness-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Calendar View
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("month")}
                className="h-8"
              >
                Month
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("week")}
                className="h-8"
              >
                Week
              </Button>
              <Button
                variant={view === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("day")}
                className="h-8"
              >
                Day
              </Button>
            </div>
            
            <BookAppointment 
              userRole={userRole}
              trigger={
                <Button size="sm" className="healing-gradient text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Book
                </Button>
              }
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {view === "month" && (
          <div className="space-y-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const events = getEventsForDate(day);
                const isToday = day && day.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border rounded-lg ${
                      day 
                        ? "bg-background hover:bg-accent/50 cursor-pointer" 
                        : "bg-muted/30"
                    } ${isToday ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          isToday ? "text-primary" : "text-foreground"
                        }`}>
                          {day.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {events.map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="text-xs p-1 rounded bg-primary/10 text-primary border border-primary/20 truncate"
                            >
                              <div className="font-medium">{event.time}</div>
                              <div className="truncate">{event.title}</div>
                              {userRole !== "patient" && event.patient && (
                                <div className="text-muted-foreground truncate">{event.patient}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {view === "day" && (
          <div className="space-y-4">
            <div className="text-center py-4 border-b">
              <h3 className="text-lg font-semibold">
                {currentDate.toDateString()}
              </h3>
            </div>
            
            <div className="space-y-3">
              {mockEvents.map((event) => (
                <div key={event.id} className="wellness-card border-l-4 border-l-primary">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-primary">{event.title}</h4>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time} ({event.duration})
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {event.practitioner}
                        </span>
                        {userRole !== "patient" && event.patient && (
                          <span>Patient: {event.patient}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {userRole !== "patient" && (
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {mockEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments scheduled for this day</p>
                  <BookAppointment 
                    userRole={userRole}
                    trigger={
                      <Button variant="outline" size="sm" className="mt-3">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}