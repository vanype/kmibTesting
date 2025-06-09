const express = require("express");
const QuestionController = require("../controllers/questionController");

const router = express.Router();

router.get("/", QuestionController.getQuestions);
router.post("/", QuestionController.createQuestion);
router.delete("/:id", QuestionController.deleteQuestion);
router.post("/submit-answers", QuestionController.submitAnswers);
router.post("/results", QuestionController.saveTestResult);
router.post("/getresults", QuestionController.getTestResults);


module.exports = router;
