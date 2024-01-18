import db from "../lib/database.js";
import * as schema from "../lib/schema/realtime.js";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createOrJoinRoom, leaveRoom } from "../lib/socket.js";
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

export const leaveSession = async (req, res) => {
  try {
    
    const isLeave = leaveRoom(req.body.user, req.body.roomKey);
    if (!isLeave) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }
    //find the sessions id
    const session = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.roomKey, req.body.roomKey))
      .get();
    console.log("session", session);

    //remove user from connectedUsers
    const connectedUser = await db
      .select()
      .from(schema.connectedUsers)
      .where(
        and(
          eq(schema.connectedUsers.sessionId, session.id),
          eq(schema.connectedUsers.userId, req.body.user.id)
        )
      )
      .get();

    if (!connectedUser) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }

    const removeConnectedUser = await db
      .delete(schema.connectedUsers)
      .where(
        and(
          eq(schema.connectedUsers.sessionId, connectedUser.sessionId),
          eq(schema.connectedUsers.userId, connectedUser.userId)
        )
      )
      .returning();
    if (!removeConnectedUser) {
      return sendResponse(res, 404, "Not Found: User not found.");
    }

    //check if the session has any connectedUsers
    const connectedUsers = await db
      .select()
      .from(schema.connectedUsers)
      .where(eq(schema.connectedUsers.sessionId, session.id))
      .get();
    console.log("connectedUsers FROM leavesession", connectedUsers);
    if (!connectedUsers) {
      //remove session
      const removeSession = await db
        .delete(schema.sessions)
        .where(eq(schema.sessions.id, session.id))
        .returning();
      console.log("removeSession", removeSession);
      if (!removeSession) {
        return sendResponse(res, 404, "Not Found: User not found.");
      }
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    sendResponse(res, 400, "Bad Request: Unable to disconnect a session.");
  }
};

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
    console.log("user", user);
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

    if (isUserAlreadyConnected) {
      return res.status(200).json({session: session});
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

    return res.status(200).json({session: session[0]});
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
