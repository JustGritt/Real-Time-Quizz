import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import sessionRoute from "./routes/session.route.js";
import cors from "cors";
import { initializeSocket } from "./lib/socket.js";
import bodyParser from "body-parser";
import http from "http";
import * as Sentry from "@sentry/node";

const jsonParser = bodyParser.json();
const app = express();
const server = http.createServer(app);
/*
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      // to trace all requests to the default router
      app,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
*/

app.use(jsonParser);
app.use(cors());
initializeSocket(server);
//createSocket(server);
authRoutes(app);
userRoutes(app);
sessionRoute(app);

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to the API" });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
  console.log(`http://localhost:${process.env.SERVER_PORT}\n`);
});

export default server;
