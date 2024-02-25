import { createQuiz, getQuizzes} from "../controllers/quizz.controller.js";

export default (app) => {
    app.get("/api/quizzes", getQuizzes);

    app.post("/api/quiz/new", createQuiz);
};
