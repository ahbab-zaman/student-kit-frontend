import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Brain, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { DialogTrigger } from "@radix-ui/react-dialog";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const difficulties = ["easy", "medium", "hard"];

  useEffect(() => {
    setTimeout(() => {
      setQuestions([
        {
          id: "1",
          question: "What is 2 + 2?",
          type: "short_answer",
          difficulty: "easy",
          answer: "4",
          subject: "Math",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const questionData = {
      id: Date.now().toString(),
      question: formData.get("question"),
      type: formData.get("type"),
      difficulty: formData.get("difficulty"),
      answer: formData.get("answer"),
      subject: formData.get("subject"),
    };

    setQuestions((prev) => [questionData, ...prev]);
    toast({ title: "Question Added", className: "btn-gradient text-white" });
    setIsDialogOpen(false);
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      toast({
        title: "No Questions",
        description: "Add questions to start",
        className: "btn-gradient text-white",
      });
      return;
    }
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (!currentQuestion || !userAnswer) return;
    const isCorrectAnswer =
      userAnswer.toLowerCase().trim() ===
      currentQuestion.answer.toLowerCase().trim();
    setIsCorrect(isCorrectAnswer);
    setShowAnswer(true);
    setScore((prev) => ({
      correct: prev.correct + (isCorrectAnswer ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const generateRandomQuestion = () => {
    const subjects = [
      {
        subject: "Math",
        question: "What is 5 + 3?",
        answer: "8",
        type: "short_answer",
        difficulty: "easy",
      },
      {
        subject: "Science",
        question: "What is H2O?",
        answer: "Water",
        type: "short_answer",
        difficulty: "easy",
      },
      {
        subject: "English",
        question: 'Past tense of "go"?',
        answer: "Went",
        type: "short_answer",
        difficulty: "easy",
      },
    ];
    const randomQuestion =
      subjects[Math.floor(Math.random() * subjects.length)];
    randomQuestion.id = "generated-" + Date.now();
    setCurrentQuestion(randomQuestion);
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Quiz</h1>
          <p className="text-muted-foreground">Test your knowledge</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={generateRandomQuestion}
            variant="outline"
            className="border-border/40"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Random
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glass-card">
              <DialogHeader>
                <DialogTitle className="gradient-text">
                  New Question
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., Math"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select name="difficulty" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="short_answer" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    name="question"
                    placeholder="Enter question"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Input
                    id="answer"
                    name="answer"
                    placeholder="Correct answer"
                    required
                  />
                </div>
                <Button type="submit" className="w-full btn-gradient">
                  Add
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {score.total > 0 && (
        <Card className="floating-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-primary">
              {score.correct}/{score.total}
            </p>
          </CardContent>
        </Card>
      )}

      {currentQuestion ? (
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="gradient-text">
              {currentQuestion.subject}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{currentQuestion.question}</p>
            {currentQuestion.type === "true_false" && !showAnswer ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className={`p-4 ${
                    userAnswer === "True"
                      ? "border-primary bg-primary/10"
                      : "border-border/40"
                  }`}
                  onClick={() => setUserAnswer("True")}
                >
                  True
                </Button>
                <Button
                  variant="outline"
                  className={`p-4 ${
                    userAnswer === "False"
                      ? "border-primary bg-primary/10"
                      : "border-border/40"
                  }`}
                  onClick={() => setUserAnswer("False")}
                >
                  False
                </Button>
              </div>
            ) : (
              !showAnswer && (
                <Input
                  placeholder="Your answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-lg p-4"
                />
              )
            )}
            {showAnswer && (
              <div
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? "border-[hsl(var(--color-science))]/20"
                    : "border-[hsl(var(--color-math))]/20"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--color-science))]" />
                  ) : (
                    <XCircle className="h-5 w-5 text-[hsl(var(--color-math))]" />
                  )}
                  <p className="font-medium">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your answer: {userAnswer}
                </p>
                <p className="text-sm text-muted-foreground">
                  Correct answer: {currentQuestion.answer}
                </p>
              </div>
            )}
            <Button
              onClick={showAnswer ? startQuiz : checkAnswer}
              disabled={!userAnswer && !showAnswer}
              className="w-full btn-gradient"
            >
              {showAnswer ? (
                <RefreshCw className="h-4 w-4 mr-2" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              {showAnswer ? "Next Question" : "Check Answer"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="floating-card">
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg gradient-text">Start Practicing!</p>
            <Button onClick={startQuiz} className="mt-4 btn-gradient">
              Begin Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quiz;
