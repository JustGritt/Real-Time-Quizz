import db from "./database.js";
import * as schema from "./schema/realtime.js";
import { eq } from "drizzle-orm";
export async function getQuizzes() {
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

export async function getQuestionAndAnswers(quizId) {
    try {
        const questions_db = await db
            .select()
            .from(schema.questions)
            .where(eq(schema.questions.id, quizId))
            .all();

        console.log({ questions_db });


        for (const q of questions_db) {
            const answers = await db
                .select()
                .from(schema.answers)
                .where(eq(schema.answers.questionId, q.id))
                .all();
            q.answers = answers;
        }
        if (!questions_db) {
            return [];
        } else {
            return questions_db;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}