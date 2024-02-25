import { verifyToken } from "../middlewares/auth.guard.js";
import { getQuestions, createQuestion } from "../controllers/question.controller.js";

export default (app) => {
  // Auth routes
  app.get("/api/questions/:quizId", verifyToken, getQuestions);
  app.post("/api/questions", verifyToken, createQuestion);
};
