import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ClipboardList, LogOut, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [hoursStudied, setHoursStudied] = useState("");
  const [attendance, setAttendance] = useState("");
  const [assignmentsCompleted, setAssignmentsCompleted] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPredictions();
    }
  }, [user]);

  const fetchPredictions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('student_predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching predictions:', error);
    } else {
      setPredictions(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    
    // Simulate prediction logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const hours = parseFloat(hoursStudied);
    const attendanceRate = parseFloat(attendance);
    const assignments = parseInt(assignmentsCompleted);
    
    // Simple prediction logic based on thresholds
    const willPass = hours >= 5 && attendanceRate >= 75 && assignments >= 2;
    const result = willPass ? "Pass" : "Fail";
    setPrediction(result);

    // Save prediction to database
    const { error } = await supabase
      .from('student_predictions')
      .insert({
        user_id: user.id,
        hours_studied: hours,
        attendance: attendanceRate,
        assignments_completed: assignments,
        prediction_result: result
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save prediction. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Prediction Saved",
        description: "Your prediction has been saved successfully.",
      });
      fetchPredictions(); // Refresh predictions list
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setHoursStudied("");
    setAttendance("");
    setAssignmentsCompleted("");
    setPrediction(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-sm rounded-lg p-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div>
            <div className="text-center mb-6">
              <Logo size="lg" className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Student Performance</h2>
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
          </div>

          {/* Recent Predictions */}
          <div>
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No predictions yet. Make your first prediction!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {predictions.map((pred) => (
                      <div key={pred.id} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex justify-between items-start mb-2">
                          <Badge 
                            variant={pred.prediction_result === "Pass" ? "default" : "destructive"}
                            className="font-medium"
                          >
                            {pred.prediction_result}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(pred.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Hours:</span> {pred.hours_studied}</p>
                          <p><span className="font-medium">Attendance:</span> {pred.attendance}%</p>
                          <p><span className="font-medium">Assignments:</span> {pred.assignments_completed}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
