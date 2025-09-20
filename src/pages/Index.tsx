import { useState } from "react";
import { Leaf, Users, Calendar, TrendingUp, Bell, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { ProgressTracker } from "@/components/ProgressTracker";
import { TherapyScheduler } from "@/components/TherapyScheduler";
import { FeedbackSystem } from "@/components/FeedbackSystem";
import heroImage from "@/assets/ayursutra-hero.jpg";

type UserRole = "patient" | "practitioner" | "admin";

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>("patient");

  // Mock data
  const mockProgressData = {
    symptomReduction: 78,
    wellnessScore: 85,
    treatmentCompletion: 65,
    nextMilestone: "Complete next 3 Abhyanga sessions to reach 75% treatment completion"
  };

  const mockSessions = [
    {
      id: "1",
      type: "Abhyanga (Oil Massage)",
      practitioner: "Dr. Priya Sharma",
      date: new Date().toISOString(),
      time: "10:00 AM",
      duration: "90 min",
      location: "Therapy Room A",
      status: "scheduled" as const
    },
    {
      id: "2",
      type: "Shirodhara",
      practitioner: "Dr. Raj Patel",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "2:00 PM",
      duration: "60 min",
      location: "Treatment Room 2",
      status: "scheduled" as const
    },
    {
      id: "3",
      type: "Panchakarma Consultation",
      practitioner: "Dr. Anita Kumar",
      date: new Date(Date.now() + 172800000).toISOString(),
      time: "11:30 AM",
      duration: "45 min",
      location: "Consultation Room",
      status: "scheduled" as const
    }
  ];

  const mockFeedback = [
    {
      id: "1",
      date: new Date(Date.now() - 86400000).toISOString(),
      wellnessLevel: 8,
      energyLevel: 7,
      symptoms: "Mild fatigue after treatment, but overall feeling more balanced",
      notes: "The Abhyanga session was very relaxing. Sleeping better since treatment started.",
      sessionType: "Abhyanga"
    },
    {
      id: "2",
      date: new Date(Date.now() - 172800000).toISOString(),
      wellnessLevel: 9,
      energyLevel: 8,
      symptoms: "No adverse symptoms, feeling very peaceful",
      notes: "Shirodhara was amazing - felt deeply relaxed and centered afterward",
      sessionType: "Shirodhara"
    }
  ];

  const getDashboardStats = () => {
    switch (userRole) {
      case "patient":
        return [
          { label: "Sessions Completed", value: "12", icon: Calendar, color: "text-primary" },
          { label: "Wellness Score", value: "85%", icon: TrendingUp, color: "text-success" },
          { label: "Next Appointment", value: "Today", icon: Bell, color: "text-accent" },
        ];
      case "practitioner":
        return [
          { label: "Active Patients", value: "24", icon: Users, color: "text-primary" },
          { label: "Today's Sessions", value: "8", icon: Calendar, color: "text-accent" },
          { label: "Patient Satisfaction", value: "4.8", icon: Star, color: "text-success" },
        ];
      case "admin":
        return [
          { label: "Total Patients", value: "156", icon: Users, color: "text-primary" },
          { label: "Active Practitioners", value: "12", icon: Users, color: "text-accent" },
          { label: "Monthly Sessions", value: "1,247", icon: Calendar, color: "text-success" },
        ];
      default:
        return [];
    }
  };

  const getDashboardTitle = () => {
    switch (userRole) {
      case "patient":
        return {
          title: "Welcome to Your Healing Journey",
          description: "Track your progress through personalized Panchakarma therapy"
        };
      case "practitioner":
        return {
          title: "Practitioner Dashboard",
          description: "Manage your patients and monitor therapy effectiveness"
        };
      case "admin":
        return {
          title: "Administrative Overview",
          description: "System-wide analytics and operational insights"
        };
      default:
        return { title: "AyurSutra Dashboard", description: "Welcome" };
    }
  };

  const stats = getDashboardStats();
  const { title, description } = getDashboardTitle();

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <Navigation userRole={userRole} onRoleChange={setUserRole} />
      
      {/* Hero Section */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <div 
          className="h-64 md:h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center">
            <div className="max-w-2xl p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-8 w-8" />
                <span className="text-lg font-medium">Ancient Wisdom, Modern Care</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-lg md:text-xl text-white/90">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="wellness-card hover:animate-wellness-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <ProgressTracker data={mockProgressData} userRole={userRole} />
          
          {userRole === "patient" && (
            <FeedbackSystem userRole={userRole} />
          )}
          
          {userRole !== "patient" && (
            <FeedbackSystem userRole={userRole} recentFeedback={mockFeedback} />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <TherapyScheduler sessions={mockSessions} userRole={userRole} />
          
          {/* Quick Actions */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                {userRole === "patient" 
                  ? "Manage your therapy journey" 
                  : "Common administrative tasks"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userRole === "patient" ? (
                <>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Reminders
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* System Status/Health Tips */}
          <Card className="wellness-card border-success/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-success" />
                {userRole === "patient" ? "Daily Wellness Tip" : "System Status"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userRole === "patient" ? (
                <div className="space-y-2">
                  <p className="text-sm">
                    🌿 <strong>Ayurvedic Wisdom:</strong> Start your day with warm water and lemon to support your digestive fire (Agni) and enhance the benefits of your Panchakarma treatments.
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Tip of the day
                  </Badge>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Health</span>
                    <Badge className="bg-success/10 text-success">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Status</span>
                    <Badge className="bg-success/10 text-success">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notification Service</span>
                    <Badge className="bg-success/10 text-success">Active</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;