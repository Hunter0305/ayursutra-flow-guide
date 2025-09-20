import { useState } from "react";
import { Calendar, Clock, User, Stethoscope, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface BookAppointmentProps {
  userRole: "patient" | "practitioner" | "admin";
  trigger?: React.ReactNode;
}

interface TimeSlot {
  time: string;
  available: boolean;
  practitioner: string;
}

interface TreatmentType {
  id: string;
  name: string;
  duration: string;
  description: string;
}

const treatmentTypes: TreatmentType[] = [
  {
    id: "abhyanga",
    name: "Abhyanga (Full Body Oil Massage)",
    duration: "90 min",
    description: "Traditional Ayurvedic warm oil massage for deep relaxation and detoxification"
  },
  {
    id: "shirodhara",
    name: "Shirodhara",
    duration: "60 min",
    description: "Continuous pouring of medicated oil on forehead for mental clarity"
  },
  {
    id: "udvartana",
    name: "Udvartana (Herbal Powder Massage)",
    duration: "75 min",
    description: "Dry powder massage for weight management and skin enhancement"
  },
  {
    id: "nasya",
    name: "Nasya Therapy",
    duration: "45 min",
    description: "Nasal administration of medicated oils for respiratory health"
  },
  {
    id: "consultation",
    name: "Panchakarma Consultation",
    duration: "30 min",
    description: "Initial assessment and treatment planning session"
  }
];

const practitioners = [
  { id: "dr-sharma", name: "Dr. Priya Sharma", specialization: "Panchakarma Specialist" },
  { id: "dr-patel", name: "Dr. Raj Patel", specialization: "Ayurvedic Physician" },
  { id: "dr-kumar", name: "Dr. Anita Kumar", specialization: "Wellness Consultant" },
  { id: "dr-singh", name: "Dr. Vikram Singh", specialization: "Traditional Therapist" }
];

const generateTimeSlots = (date: Date | undefined): TimeSlot[] => {
  if (!date) return [];
  
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const practitioner = practitioners[Math.floor(Math.random() * practitioners.length)].name;
      const available = Math.random() > 0.3; // 70% availability rate
      
      slots.push({ time, available, practitioner });
    }
  }
  
  return slots;
};

export function BookAppointment({ userRole, trigger }: BookAppointmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [selectedPractitioner, setSelectedPractitioner] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);

  const timeSlots = generateTimeSlots(selectedDate);
  const availableSlots = timeSlots.filter(slot => slot.available);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedTreatment || !selectedPractitioner) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to book your appointment.",
        variant: "destructive"
      });
      return;
    }

    // Simulate booking
    toast({
      title: "Appointment Booked Successfully! 🌿",
      description: `Your ${treatmentTypes.find(t => t.id === selectedTreatment)?.name} session is scheduled for ${selectedDate.toDateString()} at ${selectedTime}`,
    });

    // Reset form
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedTreatment("");
    setSelectedPractitioner("");
    setNotes("");
    setStep(1);
    setIsOpen(false);
  };

  const nextStep = () => {
    if (step === 1 && !selectedDate) {
      toast({
        title: "Please select a date",
        description: "Choose your preferred appointment date to continue.",
        variant: "destructive"
      });
      return;
    }
    if (step === 2 && !selectedTime) {
      toast({
        title: "Please select a time",
        description: "Choose an available time slot to continue.",
        variant: "destructive"
      });
      return;
    }
    if (step === 3 && !selectedTreatment) {
      toast({
        title: "Please select a treatment",
        description: "Choose the type of therapy you'd like to book.",
        variant: "destructive"
      });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const defaultTrigger = (
    <Button className="healing-gradient text-white">
      <Calendar className="h-4 w-4 mr-2" />
      Book Appointment
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Book New Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule your personalized Panchakarma therapy session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {stepNumber < step ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    stepNumber < step ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Date Selection */}
          {step === 1 && (
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
                <CardDescription>Choose your preferred appointment date</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="text-lg">Select Time</CardTitle>
                <CardDescription>
                  Available slots for {selectedDate?.toDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        size="sm"
                        className="h-auto p-2"
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        <div className="text-center">
                          <div className="font-medium">{slot.time}</div>
                          <div className="text-xs text-muted-foreground">{slot.practitioner.split(' ')[1]}</div>
                        </div>
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No available slots for this date</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Treatment Selection */}
          {step === 3 && (
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="text-lg">Select Treatment</CardTitle>
                <CardDescription>Choose the therapy that best suits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {treatmentTypes.map((treatment) => (
                  <div
                    key={treatment.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTreatment === treatment.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTreatment(treatment.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{treatment.name}</h4>
                        <p className="text-sm text-muted-foreground">{treatment.description}</p>
                      </div>
                      <Badge variant="secondary">{treatment.duration}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Practitioner & Confirmation */}
          {step === 4 && (
            <div className="space-y-4">
              <Card className="wellness-card">
                <CardHeader>
                  <CardTitle className="text-lg">Select Practitioner</CardTitle>
                  <CardDescription>Choose your preferred Ayurvedic practitioner</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedPractitioner} onValueChange={setSelectedPractitioner}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a practitioner" />
                    </SelectTrigger>
                    <SelectContent>
                      {practitioners.map((practitioner) => (
                        <SelectItem key={practitioner.id} value={practitioner.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{practitioner.name}</div>
                              <div className="text-xs text-muted-foreground">{practitioner.specialization}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="wellness-card">
                <CardHeader>
                  <CardTitle className="text-lg">Additional Notes</CardTitle>
                  <CardDescription>Any specific requirements or health concerns?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Please share any health conditions, allergies, or specific preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              {/* Appointment Summary */}
              <Card className="wellness-card border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{selectedDate?.toDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Treatment:</span>
                    <span className="font-medium">
                      {treatmentTypes.find(t => t.id === selectedTreatment)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {treatmentTypes.find(t => t.id === selectedTreatment)?.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Practitioner:</span>
                    <span className="font-medium">
                      {practitioners.find(p => p.id === selectedPractitioner)?.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={step === 1}
            >
              Previous
            </Button>

            {step < 4 ? (
              <Button onClick={nextStep} className="healing-gradient text-white">
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleBookAppointment}
                className="healing-gradient text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}