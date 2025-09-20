import { TrendingUp, Calendar, Heart, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressData {
  symptomReduction: number;
  wellnessScore: number;
  treatmentCompletion: number;
  nextMilestone: string;
}

interface ProgressTrackerProps {
  data: ProgressData;
  userRole: "patient" | "practitioner" | "admin";
}

export function ProgressTracker({ data, userRole }: ProgressTrackerProps) {
  const progressItems = [
    {
      icon: Heart,
      label: "Symptom Reduction",
      value: data.symptomReduction,
      color: "text-success",
      description: "Overall improvement in reported symptoms"
    },
    {
      icon: Activity,
      label: "Wellness Score",
      value: data.wellnessScore,
      color: "text-accent",
      description: "Comprehensive health and vitality rating"
    },
    {
      icon: Calendar,
      label: "Treatment Progress",
      value: data.treatmentCompletion,
      color: "text-primary",
      description: "Completion of prescribed therapy sessions"
    }
  ];

  return (
    <Card className="wellness-card animate-healing-pulse">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success" />
          {userRole === "patient" ? "Your Healing Journey" : "Patient Progress"}
        </CardTitle>
        <CardDescription>
          {userRole === "patient" 
            ? "Track your progress through personalized Panchakarma therapy"
            : "Monitor patient wellness and treatment effectiveness"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {progressItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              <Badge variant="secondary">{item.value}%</Badge>
            </div>
            
            <Progress 
              value={item.value} 
              className="therapy-progress"
            />
            
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="font-medium">Next Milestone</span>
          </div>
          <p className="text-sm text-muted-foreground">{data.nextMilestone}</p>
        </div>
        
        {userRole === "patient" && (
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Your dedication to healing is showing excellent results
            </p>
            <div className="animate-wellness-glow inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium">
              Keep up the amazing progress! 🌿
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}