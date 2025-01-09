import mongoose from "mongoose";
import Form from "../models/Form.js";

const allowedTypes = ["Text", "Radio", "Checkbox", "Dropdown", "Email"];
class QuestionsController {
  async index(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "Required form id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid id" };
      }

      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
      });

      if (!form) {
        throw { code: 404, message: "Form not found" };
      }

      return res.status(200).json({
        status: true,
        message: "Questions retrieved successfully",
        data: form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "Required form id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid id" };
      }

      const newQuestion = {
        id: new mongoose.Types.ObjectId(),
        question: null,
        type: "text",
        required: false,
        options: [],
      };

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $push: { question: newQuestion } },
        { new: true }
      );
      if (!form) {
        throw { code: 404, message: "Question not found" };
      }
      return res.status(200).json({
        status: true,
        message: "Question added successfully",
        data: { question: newQuestion },
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "Required form id" };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: "Required question id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "Invalid question id" };
      }

      let field = {};

      if (req.body.hasOwnProperty("question")) {
        field["question.$[indexQuestion].question"] = req.body.question;
      } else if (req.body.hasOwnProperty("required")) {
        field["question.$[indexQuestion].required"] = req.body.required;
      } else if (req.body.hasOwnProperty("type")) {
        if (!allowedTypes.includes(req.body.type)) {
          throw { code: 400, message: "Invalid question type" };
        }
        field["question.$[indexQuestion].type"] = req.body.type;
      }

      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $set: field },
        {
          arrayFilters: [
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
          ],
          new: true,
        }
      );
      if (!question) {
        throw { code: 404, message: "Question not found" };
      }

      return res.status(200).json({
        status: true,
        message: "Question updated successfully",
        data: { question },
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async destroy(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "Required form id" };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: "Required question id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "Invalid question id" };
      }

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        {
          $pull: {
            question: {
              id: new mongoose.Types.ObjectId(req.params.questionId),
            },
          },
        },
        { new: true }
      );
      if (!form) {
        throw { code: 404, message: "Question not found" };
      }
      return res.status(200).json({
        status: true,
        message: "Delete question successfully",
        data: { form },
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new QuestionsController();
