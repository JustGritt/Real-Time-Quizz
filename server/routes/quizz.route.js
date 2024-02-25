import { verifyToken } from "../middlewares/auth.guard.js";
import { createQuizz, } from "../controllers/quizz.controller.js";

export default (app) => {
  app.post("/api/quiz/new", createQuizz);
  // Auth route
  // app.get("/api/quizzes", getQuizzes);
};
