
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Calendar, ClipboardList } from "lucide-react";

const Index = () => {
  const [hoursStudied, setHoursStudied] = useState("");
  const [attendance, setAttendance] = useState("");
  const [assignmentsCompleted, setAssignmentsCompleted] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate prediction logic (in a real app, this would call an API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const hours = parseFloat(hoursStudied);
    const attendanceRate = parseFloat(attendance);
    const assignments = parseInt(assignmentsCompleted);
    
    // Simple prediction logic based on thresholds
    const willPass = hours >= 5 && attendanceRate >= 75 && assignments >= 2;
    setPrediction(willPass ? "Pass" : "Fail");
    setIsLoading(false);
  };

  const resetForm = () => {
    setHoursStudied("");
    setAttendance("");
    setAssignmentsCompleted("");
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Performance</h1>
          <p className="text-muted-foreground">Predict academic success with AI</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Predict Student Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hours" className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Hours Studied
                </Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 7.5"
                  value={hoursStudied}
                  onChange={(e) => setHoursStudied(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendance" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Attendance (%)
                </Label>
                <Input
                  id="attendance"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 85"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignments" className="text-sm font-medium flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Assignments Completed
                </Label>
                <Select value={assignmentsCompleted} onValueChange={setAssignmentsCompleted} required>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select number of assignments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 assignments</SelectItem>
                    <SelectItem value="1">1 assignment</SelectItem>
                    <SelectItem value="2">2 assignments</SelectItem>
                    <SelectItem value="3">3 assignments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Predicting..." : "Predict"}
                </Button>
                {prediction && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="px-6"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>

            {prediction && (
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-semibold mb-2">Prediction Result</h3>
                <Badge 
                  variant={prediction === "Pass" ? "default" : "destructive"}
                  className="text-base px-4 py-2 font-medium"
                >
                  {prediction}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on the provided academic metrics
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Enter your academic data to get an instant performance prediction
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
