import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import api from "../lib/axiosInstance";

const useQuestionStore = create(
  persist(
    (set) => ({
      questions: [],
      currentQuestion: null,
      score: { correct: 0, total: 0 },
      loading: false,
      fetchQuestions: async () => {
        set({ loading: true });
        try {
          const response = await api.get("/quizzes");
          const data = response.data;
          if (data.success) {
            const questions = data.data.map((question) => ({
              ...question,
              id: question._id,
            }));
            set({ questions });
          } else {
            toast.error("Failed to fetch questions");
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Error fetching questions"
          );
        } finally {
          set({ loading: false });
        }
      },
      addQuestion: async (questionData) => {
        try {
          const response = await api.post("/quizzes", questionData);
          const data = response.data;
          if (data.success) {
            const newQuestion = { ...data.data, id: data.data._id };
            set((state) => ({
              questions: [newQuestion, ...state.questions],
            }));
            toast.success("Question added successfully");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Error adding question");
        }
      },
      generateQuestion: async ({ subject, type, difficulty }) => {
        try {
          const response = await api.post("/quizzes/generate", {
            subject,
            type,
            difficulty,
          });
          const data = response.data;
          if (data.success) {
            const newQuestion = {
              ...data.data,
              id: data.data._id || `generated-${Date.now()}`,
            };
            set((state) => ({
              questions: [newQuestion, ...state.questions],
              currentQuestion: newQuestion,
            }));
            toast.success("Question generated successfully");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Error generating question"
          );
        }
      },
      setCurrentQuestion: (question) => set({ currentQuestion: question }),
      checkAnswer: (userAnswer, currentQuestion, callback) => {
        const isCorrectAnswer =
          userAnswer.toLowerCase().trim() ===
          currentQuestion.answer.toLowerCase().trim();
        set((state) => ({
          score: {
            correct: state.score.correct + (isCorrectAnswer ? 1 : 0),
            total: state.score.total + 1,
          },
        }));
        callback(isCorrectAnswer);
      },
      resetScore: () => set({ score: { correct: 0, total: 0 } }),
    }),
    {
      name: "quiz-store",
      partialize: (state) => ({ score: state.score }),
    }
  )
);

export default useQuestionStore;
