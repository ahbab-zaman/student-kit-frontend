import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { toast } from "sonner";

const Focus = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  const motivationalQuotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "Focus on progress, not perfection.",
    "Small steps daily lead to big changes yearly.",
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  ];

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);

    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(25 * 60);
      toast({
        title: "Break Complete!",
        description: "Ready for another focused session?",
      });
    } else {
      setSessions((prev) => prev + 1);
      setIsBreak(true);
      setTimeLeft(5 * 60);
      toast({
        title: "Session Complete!",
        description: "Time for a well-deserved break!",
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Focus Mode</h1>
        <p className="text-muted-foreground">
          Boost productivity with the Pomodoro Technique
        </p>
      </div>

      <div className="flex justify-center">
        <Card className="floating-card w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div
              className={`w-64 h-64 mx-auto rounded-full border-8 flex items-center justify-center relative ${
                isBreak
                  ? "border-[hsl(var(--color-science))]/20"
                  : "border-primary/20"
              }`}
              style={{
                background: `conic-gradient(${
                  isBreak ? "hsl(var(--color-science))" : "hsl(var(--primary))"
                } ${progress}%, transparent ${progress}%)`,
              }}
            >
              <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isBreak
                        ? "text-[hsl(var(--color-science))]"
                        : "text-primary"
                    }`}
                  >
                    {isBreak ? "Break Time" : "Focus Time"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleTimer}
                  className={`btn-gradient w-20 h-20 rounded-full ${
                    isActive ? "animate-pulse-glow" : ""
                  }`}
                >
                  {isActive ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="w-20 h-20 rounded-full border-border/40"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Sessions completed today
                </p>
                <p className="text-2xl font-bold text-primary">{sessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 gradient-text">
              <Brain className="h-5 w-5 text-primary" />
              <span>How Pomodoro Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                1
              </div>
              <div>
                <p className="font-medium">Focus for 25 minutes</p>
                <p className="text-sm text-muted-foreground">
                  Work on a single task without distractions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-[hsl(var(--color-science))]/10 flex items-center justify-center text-xs font-medium text-[hsl(var(--color-science))]">
                2
              </div>
              <div>
                <p className="font-medium">Take a 5-minute break</p>
                <p className="text-sm text-muted-foreground">
                  Relax, stretch, or grab a drink
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-[hsl(var(--color-english))]/10 flex items-center justify-center text-xs font-medium text-[hsl(var(--color-english))]">
                3
              </div>
              <div>
                <p className="font-medium">Repeat the cycle</p>
                <p className="text-sm text-muted-foreground">
                  After 4 sessions, take a longer break
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="floating-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 gradient-text">
              <Coffee className="h-5 w-5 text-primary" />
              <span>{isBreak ? "Break Time Tips" : "Daily Motivation"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isBreak ? (
              <div className="space-y-3">
                <p className="text-sm">Make the most of your break:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stand up and stretch</li>
                  <li>• Hydrate with water</li>
                  <li>• Look away from your screen</li>
                  <li>• Take deep breaths</li>
                  <li>• Avoid social media</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <blockquote className="text-lg font-medium italic">
                  "{randomQuote}"
                </blockquote>
                <p className="text-sm text-muted-foreground">
                  Keep pushing forward! You've got this! 🚀
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Focus;