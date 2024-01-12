import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq } from "drizzle-orm";

const sendResponse = (res, status, message) => {
  res.status(status).json({ message });
};

export const register = async (req, res) => {
  try {
    const user = {
      display_name: req.body.display_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    };

    await db.insert(schema.users).values({ ...user });
    sendResponse(res, 201, "User created successfully.");
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to create the user.");
  }
};

export const login = async (req, res) => {
  try {
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, req.body.email))
      .get();

    if (!user) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return sendResponse(res, 401, "Unauthorized: Invalid password.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).json({ auth: true, accessToken: token });
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to log in.");
  }
};

export const me = async (req, res) => {
  try {
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, req.user.id))
      .get();

    if (!user) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }

    const safeUser = {
      id: user.id,
      display_name: user.display_name,
      email: user.email,
    };

    res.status(200).json(safeUser);
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to retrieve the user.");
  }
};
