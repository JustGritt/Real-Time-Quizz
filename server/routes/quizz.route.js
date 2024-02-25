import { verifyToken } from "../middlewares/auth.guard.js";
import { createQuizz } from "../controllers/quizz.controller.js";

export default (app) => {
  app.post("/api/quiz/new", createQuiz);
  // Auth route
  app.post("/api/quizzes", verifyToken, createQuizz);
  app.get("/api/quizzes", getQuizzes);
};
