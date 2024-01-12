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
    id: int('int').primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    display_name: text("display_name").notNull(),
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
    id: int('int').primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    authorId: int("author_id").notNull().references(() => users.id),
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
    id: int('int').primaryKey({ autoIncrement: true }),
    quizId: int("quiz_id").notNull().references(() => quizzes.id),
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
    id: int('int').primaryKey({ autoIncrement: true }),
    questionId: int("question_id").notNull().references(() => questions.id),
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