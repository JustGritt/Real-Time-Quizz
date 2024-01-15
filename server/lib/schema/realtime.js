import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: int("int").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    display_name: text("display_name").notNull(),
    socketId: text("socket_id"),
    password: text("password_hash").notNull(),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (users) => ({
    emailIdx: uniqueIndex("email_idx").on(users.email),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  quizzes: many(quizzes),
}));

export const quizzes = sqliteTable(
  "quizzes",
  {
    id: int("int").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    authorId: int("author_id")
      .notNull()
      .references(() => users.id),
    description: text("description"),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (quizzes) => ({
    nameIdx: uniqueIndex("name_idx").on(quizzes.name),
  })
);

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  author: one(users, {
    fields: [quizzes.authorId],
    references: [users.id],
  }),
  questions: many(questions),
}));

export const questions = sqliteTable(
  "questions",
  {
    id: int("int").primaryKey({ autoIncrement: true }),
    quizId: int("quiz_id")
      .notNull()
      .references(() => quizzes.id),
    question: text("question").notNull(),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (questions) => ({
    quizIdIdx: index("quiz_id_idx").on(questions.quizId),
  })
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
  answers: many(answers),
}));

export const answers = sqliteTable(
  "answers",
  {
    id: int("int").primaryKey({ autoIncrement: true }),
    questionId: int("question_id")
      .notNull()
      .references(() => questions.id),
    answer: text("answer").notNull(),
    timer: integer("timer").notNull(),
    isCorrect: integer("is_correct").notNull(),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (answers) => ({
    questionIdIdx: index("question_id_idx").on(answers.questionId),
  })
);

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const sessions = sqliteTable(
  "sessions",
  {
    id: int("int").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    host: int("host")
      .notNull()
      .references(() => users.id),
    roomKey: text("roomKey").notNull(),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (sessions) => ({
    roomKeyIdx: index("roomKey_idx").on(sessions.roomKey),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  host: one(users, {
    fields: [sessions.host],
    references: [users.id],
  }),
}));

export const connectedUsers = sqliteTable(
  "connected_users",
  {
    id: int("int").primaryKey({ autoIncrement: true }),
    userId: int("user_id")
      .notNull()
      .references(() => users.id),
    sessionId: int("session_id")
      .notNull()
      .references(() => sessions.id),
    isHost: integer("is_host").notNull(),
    display_name: text("display_name").notNull(),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (connectedUsers) => ({
    userIdIdx: index("user_id_idx").on(connectedUsers.userId),
    sessionIdIdx: index("session_id_idx").on(connectedUsers.sessionId),
  })
);

export const connectedUsersRelations = relations(connectedUsers, ({ one }) => ({
  user: one(users, {
    fields: [connectedUsers.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [connectedUsers.sessionId],
    references: [sessions.id],
  }),
}));
