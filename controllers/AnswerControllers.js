import mongoose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";
import answerDuplicate from "../lib/answerDuplicate.js";
import questionRequired from "../lib/questionRequired.js";

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "Form ID required" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "Invalid form id" };
      }

      const form = await Form.findById(req.params.formId);
      const isDuplicate = await answerDuplicate(req.body.answers);
      if (isDuplicate) {
        throw { code: 400, message: "Duplicate answers" };
      }

      const questionReq = await questionRequired(form, req.body.answers);
      if (questionReq) {
        throw { code: 400, message: "Question required but empty" };
      }

      let field = {};
      req.body.answers.forEach((ans) => {
        field[ans.questionId] = ans.value;
      });

      const answers = await Answer.create({
        formId: req.params.formId,
        userId: req.jwt.id,
        ...field,
      });
      if (!answers) {
        throw { code: 400, message: "Failed to create answers" };
      }

      return res.status(200).json({
        status: true,
        message: "Answers created successfully",
        data: answers,
      });
    } catch (error) {
      return res.status(error.code || 400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AnswerController();
