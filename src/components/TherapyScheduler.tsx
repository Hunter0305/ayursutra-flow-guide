import { useState } from "react";
import { Calendar, Clock, User, MapPin, Plus, Edit2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TherapySession {
  id: string;
  type: string;
  practitioner: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: "scheduled" | "completed" | "cancelled" | "in-progress";
}

interface TherapySchedulerProps {
  sessions: TherapySession[];
  userRole: "patient" | "practitioner" | "admin";
}

export function TherapyScheduler({ sessions, userRole }: TherapySchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "in-progress":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === "scheduled").slice(0, 3);
  const todaySessions = sessions.filter(s => 
    new Date(s.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      {/* Today's Sessions */}
      {todaySessions.length > 0 && (
        <Card className="wellness-card border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Today's Sessions
            </CardTitle>
            <CardDescription>
              {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} scheduled for today
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {todaySessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{session.type}</h4>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.time} ({session.duration})
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {session.practitioner}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </span>
                  </div>
                </div>
                
                {userRole !== "patient" && (
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Sessions */}
      <Card className="wellness-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {userRole === "patient" ? "Your Upcoming Sessions" : "Scheduled Appointments"}
              </CardTitle>
              <CardDescription>
                Next {upcomingSessions.length} sessions in your treatment plan
              </CardDescription>
            </div>
            
            {userRole !== "patient" && (
              <Button size="sm" className="healing-gradient text-white">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="wellness-card border-l-4 border-l-primary">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-primary">{session.type}</h4>
                    <Badge variant="outline">{session.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.time} ({session.duration})
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {session.practitioner}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {session.location}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {userRole === "patient" && (
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                  )}
                  {userRole !== "patient" && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {upcomingSessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming sessions scheduled</p>
              {userRole !== "patient" && (
                <Button variant="outline" size="sm" className="mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Session
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}