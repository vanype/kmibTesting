const QuestionModel = require("../models/questionModel");

exports.getQuestions = (req, res) => {
    const group = req.query.group;
    if (!group) return res.status(400).json({ error: "Группа не указана" });

    QuestionModel.getQuestionsByGroup(group, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(row => ({
            id: row.id,
            question: row.question,
            answers: [row.answer_1, row.answer_2, row.answer_3]
        })));
    });
};

exports.createQuestion = (req, res) => {
    const { question, answer_1, answer_2, answer_3, correct_answer, group_name } = req.body;
    if (!question || !answer_1 || !answer_2 || !answer_3 || !correct_answer || !group_name)
        return res.status(400).json({ error: "Все поля обязательны!" });

    QuestionModel.addQuestion(req.body, (err, id) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, message: "Вопрос успешно добавлен!" });
    });
};

exports.deleteQuestion = (req, res) => {
    const { id } = req.params;
    QuestionModel.deleteQuestion(id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Вопрос удалён!" });
    });
};

exports.submitAnswers = (req, res) => {
    const { group, answers } = req.body;
    if (!group || !Array.isArray(answers) || answers.length === 0)
        return res.status(400).json({ error: "Некорректные данные" });

    QuestionModel.checkAnswers(group, answers, (err, result) => {
        if (err) return res.status(500).json({ error: "Ошибка обработки данных" });
        res.json({
            message: `Вы ответили правильно на ${result.correctCount} из ${result.totalQuestions} вопросов.`,
            correct: result.correctCount,
            total: result.totalQuestions
        });
    });
};
