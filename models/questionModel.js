const db = require("../config/db");

function getQuestionsByGroup(group, user_group, callback) {
    let sql = "SELECT id, question, answer_1, answer_2, answer_3 FROM questions WHERE group_name = ?";
    let params = [group];

    if (user_group && user_group.trim() !== "") {
        sql += " AND user_group = ?";
        params.push(user_group);
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


function addQuestion(questionData, callback) {
    const { question, answer_1, answer_2, answer_3, correct_answer, group_name, user_group = "POB-32" } = questionData;
    db.run(
        "INSERT INTO questions (question, answer_1, answer_2, answer_3, correct_answer, group_name, user_group) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [question, answer_1, answer_2, answer_3, correct_answer, group_name, user_group],
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
                    if (err) return reject(err);
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


function saveTestResult({ user_id, test_name, score, total }, callback) {
    const percentage = (score / total) * 100;
    db.run(
        "INSERT INTO test_results (user_id, test_name, score, total, percentage) VALUES (?, ?, ?, ?, ?)",
        [user_id, test_name, score, total, percentage],
        function (err) {
            callback(err, this?.lastID);
        }
    );
}

function getLatestTestResult(user_id, test_name, callback) {
    db.get(
        `SELECT score, total, percentage
         FROM test_results
         WHERE user_id = ? AND test_name = ?
         ORDER BY id DESC
         LIMIT 1`,
        [user_id, test_name],
        (err, row) => callback(err, row)
    );
}


module.exports = {
    getQuestionsByGroup,
    addQuestion,
    deleteQuestion,
    checkAnswers,
    saveTestResult,
	getLatestTestResult
};

