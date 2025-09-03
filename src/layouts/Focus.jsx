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
    <div className="py-6 space-y-8 animate-in slide-in-from-top duration-300">
      <div className="lg:text-left text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Focus Mode
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Boost productivity with the Pomodoro Technique
        </p>
      </div>

      <Card>
        <div
          className={`w-full max-w-[16rem] aspect-square mx-auto rounded-full border-8 flex items-center justify-center relative ${
            isBreak ? "border-green-500/20" : "border-blue-500/20"
          }`}
          style={{
            background: `conic-gradient(${
              isBreak ? "#10b981" : "#3b82f6"
            } ${progress}%, transparent ${progress}%)`,
          }}
        >
          <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {formatTime(timeLeft)}
              </div>
              <div
                className={`text-sm font-medium ${
                  isBreak ? "text-green-500" : "text-blue-500"
                }`}
              >
                {isBreak ? "Break Time" : "Focus Time"}
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              <Brain className="h-5 w-5 text-blue-500" />
              <span>How Pomodoro Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-medium text-blue-500">
                1
              </div>
              <div>
                <p className="font-medium">Focus for 25 minutes</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Work on a single task without distractions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-xs font-medium text-green-500">
                2
              </div>
              <div>
                <p className="font-medium">Take a 5-minute break</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Relax, stretch, or grab a drink
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-medium text-blue-500">
                3
              </div>
              <div>
                <p className="font-medium">Repeat the cycle</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  After 4 sessions, take a longer break
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              <Coffee className="h-5 w-5 text-blue-500" />
              <span>{isBreak ? "Break Time Tips" : "Daily Motivation"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isBreak ? (
              <div className="space-y-3">
                <p className="text-sm">Make the most of your break:</p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
