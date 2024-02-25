import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq } from "drizzle-orm";

const sendResponse = (res, status, message) => {
  res.status(status).json({ message });
};

export const getQuestions = async (req, res) => {
  try {
    if (!req.params.quizId) {
      return sendResponse(res, 400, "Bad Request: Missing parameters.");
    }

    const questions = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.quizId, req.body.quizId))
      .get();

    if (!questions) {
      return sendResponse(res, 404, "Not Found: Questions not found.");
    }

    res.status(200).json(questions);
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to retrieve the questions.");
  }
};

export const createQuestion = async (req, res) => {
  try {
    const {
      quizId,
    } = req.body

    if (!quizId) {
      return sendResponse(res, 400, "Bad Request: Missing parameters.");
    }

    await db.insert(schema.questions).values({ ...req.body });
    sendResponse(res, 201, "User created successfully.");

    res.status(200).json(updatedUser);
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to update the user.");
  }
};
