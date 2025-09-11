// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Plus, Brain, CheckCircle, XCircle, RefreshCw } from "lucide-react";
// import { toast } from "sonner";
// import { DialogTrigger } from "@radix-ui/react-dialog";

// const Quiz = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [userAnswer, setUserAnswer] = useState("");
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [score, setScore] = useState({ correct: 0, total: 0 });
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const difficulties = ["easy", "medium", "hard"];

//   useEffect(() => {
//     setTimeout(() => {
//       setQuestions([
//         {
//           id: "1",
//           question: "What is 2 + 2?",
//           type: "short_answer",
//           difficulty: "easy",
//           answer: "4",
//           subject: "Math",
//         },
//       ]);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const questionData = {
//       id: Date.now().toString(),
//       question: formData.get("question"),
//       type: formData.get("type"),
//       difficulty: formData.get("difficulty"),
//       answer: formData.get("answer"),
//       subject: formData.get("subject"),
//     };

//     setQuestions((prev) => [questionData, ...prev]);
//     toast({ title: "Question Added", className: "bg-blue-500 text-white" });
//     setIsDialogOpen(false);
//   };

//   const startQuiz = () => {
//     if (questions.length === 0) {
//       toast({
//         title: "No Questions",
//         description: "Add questions to start",
//         className: "bg-blue-500 text-white",
//       });
//       return;
//     }
//     const randomQuestion =
//       questions[Math.floor(Math.random() * questions.length)];
//     setCurrentQuestion(randomQuestion);
//     setUserAnswer("");
//     setShowAnswer(false);
//     setIsCorrect(null);
//   };

//   const checkAnswer = () => {
//     if (!currentQuestion || !userAnswer) return;
//     const isCorrectAnswer =
//       userAnswer.toLowerCase().trim() ===
//       currentQuestion.answer.toLowerCase().trim();
//     setIsCorrect(isCorrectAnswer);
//     setShowAnswer(true);
//     setScore((prev) => ({
//       correct: prev.correct + (isCorrectAnswer ? 1 : 0),
//       total: prev.total + 1,
//     }));
//   };

//   const generateRandomQuestion = () => {
//     const subjects = [
//       {
//         subject: "Math",
//         question: "What is 5 + 3?",
//         answer: "8",
//         type: "short_answer",
//         difficulty: "easy",
//       },
//       {
//         subject: "Science",
//         question: "What is H2O?",
//         answer: "Water",
//         type: "short_answer",
//         difficulty: "easy",
//       },
//       {
//         subject: "English",
//         question: 'Past tense of "go"?',
//         answer: "Went",
//         type: "short_answer",
//         difficulty: "easy",
//       },
//     ];
//     const randomQuestion =
//       subjects[Math.floor(Math.random() * subjects.length)];
//     randomQuestion.id = "generated-" + Date.now();
//     setCurrentQuestion(randomQuestion);
//     setUserAnswer("");
//     setShowAnswer(false);
//     setIsCorrect(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-6 space-y-6 animate-in slide-in-from-top duration-300">
//       <div className="flex justify-between items-center lg:flex-row flex-col lg:text-left text-center gap-2">
//         <div>
//           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
//             Quiz
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400">
//             Test your knowledge
//           </p>
//         </div>
//         <div className="flex space-x-3">
//           <Button
//             onClick={generateRandomQuestion}
//             variant="outline"
//             className="border-gray-200 dark:border-gray-700"
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Random
//           </Button>
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Question
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
//               <DialogHeader>
//                 <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
//                   New Question
//                 </DialogTitle>
//               </DialogHeader>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="subject">Subject</Label>
//                   <Input
//                     id="subject"
//                     name="subject"
//                     placeholder="e.g., Math"
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="difficulty">Difficulty</Label>
//                   <Select name="difficulty" required>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select difficulty" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {difficulties.map((diff) => (
//                         <SelectItem key={diff} value={diff}>
//                           {diff.charAt(0).toUpperCase() + diff.slice(1)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="type">Type</Label>
//                   <Select name="type" defaultValue="short_answer" required>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="short_answer">Short Answer</SelectItem>
//                       <SelectItem value="true_false">True/False</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="question">Question</Label>
//                   <Textarea
//                     id="question"
//                     name="question"
//                     placeholder="Enter question"
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="answer">Answer</Label>
//                   <Input
//                     id="answer"
//                     name="answer"
//                     placeholder="Correct answer"
//                     required
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
//                 >
//                   Add
//                 </Button>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {score.total > 0 && (
//         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//           <CardContent className="p-6 text-center">
//             <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
//             <p className="text-2xl font-bold text-blue-500">
//               {score.correct}/{score.total}
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       {currentQuestion ? (
//         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
//               {currentQuestion.subject}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-lg">{currentQuestion.question}</p>
//             {currentQuestion.type === "true_false" && !showAnswer ? (
//               <div className="grid grid-cols-2 gap-3">
//                 <Button
//                   variant="outline"
//                   className={`p-4 ${
//                     userAnswer === "True"
//                       ? "border-blue-500 bg-blue-500/10"
//                       : "border-gray-200 dark:border-gray-700"
//                   }`}
//                   onClick={() => setUserAnswer("True")}
//                 >
//                   True
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className={`p-4 ${
//                     userAnswer === "False"
//                       ? "border-blue-500 bg-blue-500/10"
//                       : "border-gray-200 dark:border-gray-700"
//                   }`}
//                   onClick={() => setUserAnswer("False")}
//                 >
//                   False
//                 </Button>
//               </div>
//             ) : (
//               !showAnswer && (
//                 <Input
//                   placeholder="Your answer"
//                   value={userAnswer}
//                   onChange={(e) => setUserAnswer(e.target.value)}
//                   className="text-lg p-4"
//                 />
//               )
//             )}
//             {showAnswer && (
//               <div
//                 className={`p-4 rounded-lg border ${
//                   isCorrect ? "border-green-500/20" : "border-red-500/20"
//                 }`}
//               >
//                 <div className="flex items-center space-x-2">
//                   {isCorrect ? (
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                   ) : (
//                     <XCircle className="h-5 w-5 text-red-500" />
//                   )}
//                   <p className="font-medium">
//                     {isCorrect ? "Correct!" : "Incorrect"}
//                   </p>
//                 </div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Your answer: {userAnswer}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Correct answer: {currentQuestion.answer}
//                 </p>
//               </div>
//             )}
//             <Button
//               onClick={showAnswer ? startQuiz : checkAnswer}
//               disabled={!userAnswer && !showAnswer}
//               className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
//             >
//               {showAnswer ? (
//                 <RefreshCw className="h-4 w-4 mr-2" />
//               ) : (
//                 <Brain className="h-4 w-4 mr-2" />
//               )}
//               {showAnswer ? "Next Question" : "Check Answer"}
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 mb-5">
//           <CardContent className="p-12 text-center">
//             <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
//             <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
//               Start Practicing!
//             </p>
//             <Button
//               onClick={startQuiz}
//               className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
//             >
//               Begin Quiz
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default Quiz;

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Brain, CheckCircle, XCircle, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import useQuestionStore from "../hooks/useQuiz"

const Quiz = () => {
  const {
    questions,
    currentQuestion,
    score,
    loading,
    fetchQuestions,
    addQuestion,
    generateQuestion,
    setCurrentQuestion,
    checkAnswer,
    resetScore,
  } = useQuestionStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const difficulties = ["easy", "medium", "hard"];
  const types = ["short_answer", "true_false"];
  const subjects = ["Math", "Science", "English", "History", "Geography"];

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const questionData = {
      subject: formData.get("subject"),
      question: formData.get("question"),
      type: formData.get("type"),
      difficulty: formData.get("difficulty"),
      answer: formData.get("answer"),
    };

    await addQuestion(questionData);
    setIsAddDialogOpen(false);
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const generateData = {
      subject: formData.get("subject"),
      type: formData.get("type"),
      difficulty: formData.get("difficulty"),
    };

    await generateQuestion(generateData);
    setIsGenerateDialogOpen(false);
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      toast.error(
        "No questions available. Add or generate questions to start."
      );
      return;
    }
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion || !userAnswer) return;
    checkAnswer(userAnswer, currentQuestion, (isCorrectAnswer) => {
      setIsCorrect(isCorrectAnswer);
      setShowAnswer(true);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in slide-in-from-top duration-500">
      {/* Header + Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
            Quiz
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Test your knowledge
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button
            onClick={startQuiz}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-300"
          >
            <Brain className="h-5 w-5 mr-2" />
            Start Quiz
          </Button>
          <Button
            onClick={resetScore}
            variant="outline"
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-4 py-2"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Reset Score
          </Button>
          <Dialog
            open={isGenerateDialogOpen}
            onOpenChange={setIsGenerateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-300">
                <RefreshCw className="h-5 w-5 mr-2" />
                Generate Question
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 sm:p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Generate New Question
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Generate a question using AI
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleGenerateSubmit}
                className="space-y-4 sm:space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Select name="subject" required>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {subjects.map((subject) => (
                        <SelectItem
                          key={subject}
                          value={subject}
                          className="text-sm sm:text-base"
                        >
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Type
                  </Label>
                  <Select name="type" defaultValue="short_answer" required>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {types.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-sm sm:text-base"
                        >
                          {type === "short_answer"
                            ? "Short Answer"
                            : "True/False"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty
                  </Label>
                  <Select name="difficulty" required>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {difficulties.map((diff) => (
                        <SelectItem
                          key={diff}
                          value={diff}
                          className="text-sm sm:text-base"
                        >
                          {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2 transition-all duration-300"
                >
                  Generate
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 sm:p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Add New Question
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Create a new question manually
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleAddSubmit}
                className="space-y-4 sm:space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Select name="subject" required>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {subjects.map((subject) => (
                        <SelectItem
                          key={subject}
                          value={subject}
                          className="text-sm sm:text-base"
                        >
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Type
                  </Label>
                  <Select name="type" defaultValue="short_answer" required>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {types.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-sm sm:text-base"
                        >
                          {type === "short_answer"
                            ? "Short Answer"
                            : "True/False"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty
                  </Label>
                  <Select name="difficulty" required>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {difficulties.map((diff) => (
                        <SelectItem
                          key={diff}
                          value={diff}
                          className="text-sm sm:text-base"
                        >
                          {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question" className="text-sm font-medium">
                    Question
                  </Label>
                  <Textarea
                    id="question"
                    name="question"
                    placeholder="Enter question"
                    required
                    className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer" className="text-sm font-medium">
                    Answer
                  </Label>
                  <Input
                    id="answer"
                    name="answer"
                    placeholder="Correct answer"
                    required
                    className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2 transition-all duration-300"
                >
                  Add
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Score Card */}
      {score.total > 0 && (
        <Card className="shadow-xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {score.correct}/{score.total}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Current Question */}
      {currentQuestion ? (
        <Card className="shadow-xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {currentQuestion.subject}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              {currentQuestion.difficulty.charAt(0).toUpperCase() +
                currentQuestion.difficulty.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {currentQuestion.question}
            </p>
            {currentQuestion.type === "true_false" && !showAnswer ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className={`p-4 text-sm sm:text-base rounded-lg ${
                    userAnswer === "True"
                      ? "border-blue-600 bg-blue-600/10 text-blue-600"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={() => setUserAnswer("True")}
                >
                  True
                </Button>
                <Button
                  variant="outline"
                  className={`p-4 text-sm sm:text-base rounded-lg ${
                    userAnswer === "False"
                      ? "border-blue-600 bg-blue-600/10 text-blue-600"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
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
                  className="text-lg p-4 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-gray-100"
                />
              )
            )}
            {showAnswer && (
              <div
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? "border-green-500/20 bg-green-500/10"
                    : "border-red-500/20 bg-red-500/10"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your answer: {userAnswer}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Correct answer: {currentQuestion.answer}
                </p>
              </div>
            )}
            <Button
              onClick={showAnswer ? startQuiz : handleCheckAnswer}
              disabled={!userAnswer && !showAnswer}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2 transition-all duration-300"
            >
              {showAnswer ? (
                <RefreshCw className="h-5 w-5 mr-2" />
              ) : (
                <Brain className="h-5 w-5 mr-2" />
              )}
              {showAnswer ? "Next Question" : "Check Answer"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-5">
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Start Practicing!
            </p>
            <Button
              onClick={startQuiz}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2 transition-all duration-300"
            >
              Begin Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quiz;
