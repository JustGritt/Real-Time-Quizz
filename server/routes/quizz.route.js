import { verifyToken } from "../middlewares/auth.guard.js";
import { createQuizz } from "../controllers/quizz.controller.js";

export default (app) => {
  // Auth route
  app.post("/api/quizzes", verifyToken, createQuizz);
};
