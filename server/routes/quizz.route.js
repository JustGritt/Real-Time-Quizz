// const { getQuizzes, handleNewQuestion, createQuestion, createAnswer } = require("../controllers/quizz.controller.js");
import { getQuizzes, handleNewQuestion, createQuestion, createAnswer } from "../controllers/quizz.controller.js";

export default (app) => {
    app.get("/api/quizzes", getQuizzes);

    app.post("/api/question/new", handleNewQuestion);
    app.post("/api/quizzes/:quizId/questions", createQuestion);
    app.post("/api/questions/:questionId/answers", createAnswer);
};
