import { getQuestionAndAnswers } from "./servicehelpers.js";


let currentQuestion
export async function gameStartQuiz(res, io, socket) {
    const quizId = Number(res.quizId)
    const questions = await getQuestionAndAnswers(quizId)
    socket.join(quizId);
    for (const q of questions) {
        io.to(quizId).emit("game-start", q);
        await sleep(q.timer * 12000);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
