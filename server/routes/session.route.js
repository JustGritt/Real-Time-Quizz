import {
  createSession,
  disconnectSession,
  joinSession,
  getSessionConnectedUsers,
} from "../controllers/session.controller.js";
import { verifyToken } from "../middlewares/auth.guard.js";

export default (app) => {
  // Auth routes
  app.post("/api/session", verifyToken, createSession);
  app.post("/api/session/join/:roomKey", verifyToken, joinSession);
  app.post("/api/session/disconnect", verifyToken, disconnectSession);
  app.get(
    "/api/session/getusers/:roomkey",
    verifyToken,
    getSessionConnectedUsers
  );
};
