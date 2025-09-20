import { useState } from "react";
import { MessageSquare, Heart, Thermometer, Activity, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface FeedbackEntry {
  id: string;
  date: string;
  wellnessLevel: number;
  energyLevel: number;
  symptoms: string;
  notes: string;
  sessionType: string;
}

interface FeedbackSystemProps {
  userRole: "patient" | "practitioner" | "admin";
  recentFeedback?: FeedbackEntry[];
}

export function FeedbackSystem({ userRole, recentFeedback = [] }: FeedbackSystemProps) {
  const [wellnessLevel, setWellnessLevel] = useState([7]);
  const [energyLevel, setEnergyLevel] = useState([6]);
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmitFeedback = () => {
    // Handle feedback submission
    console.log({
      wellnessLevel: wellnessLevel[0],
      energyLevel: energyLevel[0],
      symptoms,
      notes
    });
    
    // Reset form
    setWellnessLevel([7]);
    setEnergyLevel([6]);
    setSymptoms("");
    setNotes("");
  };

  if (userRole !== "patient") {
    // Practitioner/Admin view - show recent feedback from patients
    return (
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Patient Feedback
          </CardTitle>
          <CardDescription>
            Recent post-session feedback from your patients
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {recentFeedback.length > 0 ? (
            recentFeedback.map((feedback) => (
              <div key={feedback.id} className="wellness-card border-l-4 border-l-accent">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{feedback.sessionType}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(feedback.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-success" />
                      <span>Wellness: {feedback.wellnessLevel}/10</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-accent" />
                      <span>Energy: {feedback.energyLevel}/10</span>
                    </div>
                  </div>
                </div>
                
                {feedback.symptoms && (
                  <div className="mb-2">
                    <p className="text-sm font-medium mb-1">Symptoms reported:</p>
                    <p className="text-sm text-muted-foreground">{feedback.symptoms}</p>
                  </div>
                )}
                
                {feedback.notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Additional notes:</p>
                    <p className="text-sm text-muted-foreground">{feedback.notes}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent feedback available</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Patient view - feedback form
  return (
    <Card className="wellness-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Post-Session Feedback
        </CardTitle>
        <CardDescription>
          Help us understand how you're feeling after your therapy session
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-success" />
              Overall Wellness Level: {wellnessLevel[0]}/10
            </Label>
            <Slider
              value={wellnessLevel}
              onValueChange={setWellnessLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              Energy Level: {energyLevel[0]}/10
            </Label>
            <Slider
              value={energyLevel}
              onValueChange={setEnergyLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-warning" />
            Any symptoms or concerns?
          </Label>
          <Textarea
            placeholder="Describe any symptoms, discomfort, or changes you've noticed..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Additional notes or observations</Label>
          <Textarea
            placeholder="Share any other thoughts about today's session..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <Button 
          onClick={handleSubmitFeedback} 
          className="w-full healing-gradient text-white"
        >
          <Send className="h-4 w-4 mr-2" />
          Submit Feedback
        </Button>
        
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Your feedback helps us personalize your healing journey
          </p>
        </div>
      </CardContent>
    </Card>
  );
}