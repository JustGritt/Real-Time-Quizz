import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createOrJoinRoom, disconnectSocket } from "../lib/socket.js";
const sendResponse = (res, status, message) => {
  res.status(status).json({ message });
};

export const createSession = async (req, res) => {
  try {
    const sessionData = {
      host: req.body.host,
      title: req.body.title,
      roomKey: uuidv4().slice(0, 8).toUpperCase(),
    };

    const user = req.body.user;
    try {
      createOrJoinRoom(user, sessionData.roomKey);
    } catch (error) {
      console.log(error);
    }
    console.log("Session created");
    const session = await db
      .insert(schema.sessions)
      .values({ ...sessionData })
      .returning();

    const connectedUsersData = {
      userId: user.id,
      sessionId: session[0].id,
      isHost: 1,
      display_name: user.display_name,
    };
    const connectedUsers = await db
      .insert(schema.connectedUsers)
      .values({
        ...connectedUsersData,
      })
      .returning();
    if (!connectedUsers) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }
    const response = {
      session: session[0],
      connectedUsers: [connectedUsers[0]],
    };
    res.status(200).json(response);
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to create a session.");
  }
};

export const disconnectSession = async (req, res) => {
  try {
    disconnectSocket(req.body.socketId);
    res.status(200).json({ message: "success" });
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to disconnect a session.");
  }
};

/*
export const joinSession = async (req, res) => {
  try {
    const session = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.roomKey, req.params.roomKey))
      .get();
    const user = req.body.user;
    try {
      createOrJoinRoom(user, session.roomKey);
    } catch (error) {
      console.log(error);
    }
    //get the connected users
    const connectedUsers = await db
      .select()
      .from(schema.connectedUsers)
      .where(eq(schema.connectedUsers.sessionId, session.id));

    connectedUsers.forEach((element) => {
      if (element.userId === user.id) {
        return res.status(200).json({ message: "success" });
      }
    });

    const connectedUsersData = {
      userId: user.id,
      sessionId: session.id,
      isHost: 0,
      display_name: user.display_name,
    };
    const addconnectedUsers = await db
      .insert(schema.connectedUsers)
      .values({
        ...connectedUsersData,
      })
      .returning();
    console.log("Connected users created", addconnectedUsers);
    if (!connectedUsers) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to join a session.");
  }
};
*/
export const joinSession = async (req, res) => {
  try {
    // Retrieve the session using the roomKey from the request params
    const session = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.roomKey, req.params.roomKey))
      .get();

    if (!session) {
      return sendResponse(res, 404, "Not Found: Session not found.");
    }

    const user = req.body.user;
    try {
      createOrJoinRoom(user, session.roomKey);
    } catch (error) {
      console.log(error);
    }

    // Check if the user is already in the connectedUsers
    const isUserAlreadyConnected = await db
      .select()
      .from(schema.connectedUsers)
      .where(
        and(
          eq(schema.connectedUsers.sessionId, session.id),
          eq(schema.connectedUsers.userId, user.id)
        )
      )
      .get();

    if (isUserAlreadyConnected !== undefined) {
      return sendResponse(res, 200, { message: "success" });
    }
    // If not connected, add the user to connectedUsers
    const connectedUsersData = {
      userId: user.id,
      sessionId: session.id,
      isHost: 0,
      display_name: user.display_name,
    };

    const addConnectedUser = await db
      .insert(schema.connectedUsers)
      .values(connectedUsersData)
      .returning();
    if (!addConnectedUser) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }

    sendResponse(res, 200, { message: "success" });
  } catch (error) {
    console.log(error);
    sendResponse(res, 400, "Bad Request: Unable to join a session.");
  }
};

export const getSessionConnectedUsers = async (req, res) => {
  try {
    const roomKey = Object.values(req.params)[0];
    if (!roomKey) {
      return sendResponse(res, 400, "Bad Request: Room key is required.");
    }
    const session = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.roomKey, roomKey))
      .get();
    const connectedUsers = await db
      .select()
      .from(schema.connectedUsers)
      .where(eq(schema.connectedUsers.sessionId, session.id));

    if (!connectedUsers) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }

    const response = {
      session: session,
      connectedUsers: [connectedUsers],
    };
    console.log("Response getuser", response);
    res.status(200).json(response);
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to join a session.");
  }
};
