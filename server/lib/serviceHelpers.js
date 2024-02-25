import db from "./database.js";
import * as schema from "./schema/realtime.js";

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
        const question = await db
            .select()
            .from(schema.questions)
            .where(eq(schema.questions.quizId, quizId))
            .get();

        for (const q of question) {
            const answers = await db
                .select()
                .from(schema.answers)
                .where(eq(schema.answers.questionId, q.id))
                .get();
            q.answers = answers;
        }
        if (!question) {
            return [];
        } else {
            return question;
        }
    } catch (error) {
        return [];
    }
}