import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq } from "drizzle-orm";

const sendResponse = (res, status, message) => {
  res.status(status).json({ message });
};


export const createQuizz = async (req, res) => {
  try {
    const quizz = {
      name: req.body.name,
      authorId: req.body.user
    }

    if (!quizz.name || !quizz.authorId) {
      return sendResponse(res, 400, "Bad Request: Missing parameters.");
    }

    await db.insert(schema.questions).values({ ...req.body });
    sendResponse(res, 201, "User created successfully.");

    res.status(200).json(updatedUser);
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to update the user.");
  }
};


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
