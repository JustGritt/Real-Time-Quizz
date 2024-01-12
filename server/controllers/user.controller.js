import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq } from "drizzle-orm";

const sendResponse = (res, status, message) => {
  res.status(status).json({ message });
};

export const findUser = async (req, res) => {
  try {
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, req.user.id))
      .get();

    if (!user) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }

    res.status(200).json(user);
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to retrieve the user.");
  }
};
