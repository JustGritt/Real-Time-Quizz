import { createQuiz, getQuizzes, getQuizById} from "../controllers/quizz.controller.js";

export default (app) => {
    app.get("/api/quizzes", getQuizzes);
    app.get("/api/quiz/:id", getQuizById);

    app.post("/api/quiz/new", createQuiz);
};
