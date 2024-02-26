import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq } from "drizzle-orm";

const sendResponse = (res, status, message) => {
  res.status(status).json({ message });
};


export const createQuizz = async (req, res) => {
  try {

    if (!req.body.name || !req.body.user || !req.body.questions) {
      return sendResponse(res, 400, "Bad Request: Missing parameters.");
    }

    const quizz = {
      authorId: req.body.user.id,
      name: req.body.name,
      description: ""
    }

    const createdQuizz = await db.insert(schema.quizzes).values(quizz).returning();

    const bodyQuestions = req.body.questions ?? [];

    let savedQuestions = [];

    bodyQuestions.forEach(async element => {
      if (!element.question || !element.answers) {
        return sendResponse(res, 400, "Bad Request: Missing parameters.");
      }
      const createdQuestion = await db
        .insert(schema.questions)
        .values({
          quizId: createdQuizz[0].id,
          question: element.question,
        })
        .returning();

      element.answers.forEach(async answer => {
        const createdAnswer = await db
          .insert(schema.answers)
          .values({
            questionId: createdQuestion[0].id,
            answer: answer.content,
            isCorrect: answer.isCorrect,
          })
          .returning();
        savedQuestions.push(createdAnswer[0]);
      });
    });

    sendResponse(res, 201, "Quizz created successfully.");
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to create the quizz.");
  }
};


export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await db
      .select()
      .from(schema.quizzes)

    if (!quizzes) {
      return sendResponse(res, 404, "Not Found: No quizzes found.");
    }

    res.status(200).json(quizzes);
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to retrieve any quizzes.");
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
