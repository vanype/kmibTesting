const db = require("../config/db");

function getQuestionsByGroup(group, callback) {
    db.all(
        "SELECT id, question, answer_1, answer_2, answer_3 FROM questions WHERE group_name = ?",
        [group],
        (err, rows) => callback(err, rows)
    );
}

function addQuestion(questionData, callback) {
    const { question, answer_1, answer_2, answer_3, correct_answer, group_name } = questionData;
    db.run(
        "INSERT INTO questions (question, answer_1, answer_2, answer_3, correct_answer, group_name) VALUES (?, ?, ?, ?, ?, ?)",
        [question, answer_1, answer_2, answer_3, correct_answer, group_name],
        function (err) {
            callback(err, this?.lastID);
        }
    );
}

function deleteQuestion(id, callback) {
    db.run("DELETE FROM questions WHERE id = ?", [id], (err) => callback(err));
}

function checkAnswers(group, answers, callback) {
    let correctCount = 0;
    let totalQuestions = answers.length;
    
    const promises = answers.map(({ question, answer }) => {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT correct_answer FROM questions WHERE question = ? AND group_name = ?",
                [question, group],
                (err, row) => {
                    if (err) reject(err);
                    if (row?.correct_answer === answer) correctCount++;
                    resolve();
                }
            );
        });
    });

    Promise.all(promises)
        .then(() => callback(null, { correctCount, totalQuestions }))
        .catch(callback);
}

module.exports = { getQuestionsByGroup, addQuestion, deleteQuestion, checkAnswers };
