import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq } from "drizzle-orm";
import { quizzes, questions, answers } from "../lib/schema/realtime.js";

export async function getQuizzes()
{
    try {
    const quizz = await db
        .select()
        .from(schema.quizzes)
        .get();
    if (!quizz) {
        return sendResponse(res, 404, "Not Found: Quiz not found.");
    } else {
        return quizz;
    }

    } catch (error) {
        sendResponse(res, 400, "Bad Request: Unable to retrieve the quiz.");
    }
}

export async function createQuestion(quizId, questionText) {
    const newQuestion = {
        quizId: quizId,
        question: questionText,
        createdAt: Math.floor(Date.now() / 1000), // unix timestamp
        updatedAt: Math.floor(Date.now() / 1000), // unix timestamp
    };

    await questions.insert(newQuestion);
}

export async function createAnswer(questionId, answerText, timer, isCorrect) {
    const newAnswer = {
        questionId: questionId,
        answer: answerText,
        timer: timer,
        isCorrect: isCorrect,
        createdAt: Math.floor(Date.now() / 1000), // unix timestamp
        updatedAt: Math.floor(Date.now() / 1000), // unix timestamp
    };

    await answers.insert(newAnswer);
}

// Create a new question to the quiz, will create both the question and the answers
export async function handleNewQuestion(questionText, answers) {
    console.log(questionText, answers)

    // const newQuestion = {
    //     quizId: quizId,
    //     question: questionText,
    //     createdAt: Math.floor(Date.now() / 1000), // unix timestamp
    //     updatedAt: Math.floor(Date.now() / 1000), // unix timestamp
    // };

    // const question = await questions.insert(newQuestion);

    // for (const answer of answers) {
    //     const newAnswer = {
    //         questionId: question.id,
    //         answer: answer.answer,
    //         timer: answer.timer,
    //         isCorrect: answer.isCorrect,
    //         createdAt: Math.floor(Date.now() / 1000), // unix timestamp
    //         updatedAt: Math.floor(Date.now() / 1000), // unix timestamp
    //     };

    //     await answers.insert(newAnswer);
    // }
}