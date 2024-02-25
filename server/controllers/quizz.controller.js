import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq } from "drizzle-orm";
import { quizzes, questions, answers } from "../lib/schema/realtime.js";

const sendResponse = (res, status, message) => {
    res.status(status).json({ message });
};

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

export async function getQuizById(req, res) {
    try {
        const quiz = await db
            .select()
            .from(schema.quizzes)
            .where(eq(schema.quizzes.id, req.params.id))
            .get();
        if (!quiz) {
            console.log("Quiz not found.")
            return sendResponse(res, 404, "Not Found: Quiz not found.");
        } else {
            console.log("Quiz found.", quiz)
            return sendResponse(res, 200, "Quiz retrieved successfully.");
        }
    } catch (error) {
        sendResponse(res, 400, "Bad Request: Unable to retrieve the quiz.");
    }
}

export const createQuiz = async (req, res) => {
    try {
        const quiz = {
            title: req.body.quizName,
            description: req.body.description
        };
        console.log(quiz)
        // await db.insert(schema.quizzes).values({ ...quiz });
        sendResponse(res, 201, "Quiz created successfully.");
    }
    catch (error) {
        sendResponse(res, 400, "Bad Request: Unable to create the quiz.");
    }
}