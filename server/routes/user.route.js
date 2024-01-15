import { findUser, setUserSocketId } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.guard.js";

export default (app) => {
  // Auth routes
  app.get("/api/users/:id", verifyToken, findUser);
  app.post("/api/users/usersocketid", verifyToken, setUserSocketId);
};
