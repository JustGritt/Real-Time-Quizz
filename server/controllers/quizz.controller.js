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
