import mongoose from "mongoose";
import Form from "../models/Form.js";

class OptionController {
  async store(req, res) {
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
      if (!req.body.option) {
        throw { code: 400, message: "Option is required" };
      }

      const option = {
        id: new mongoose.Types.ObjectId(),
        value: req.body.option,
      };
      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $push: { "question.$[indexQuestion].options": option } },
        {
          arrayFilters: [
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
          ],
        }
      );
      if (!form) {
        throw { code: 404, message: "Option not found" };
      }

      return res.status(200).json({
        status: true,
        message: "Option added successfully",
        data: { option },
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 400).json({
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
      if (!req.params.optionId) {
        throw { code: 400, message: "Required option id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "Invalid id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
        throw { code: 400, message: "Invalid id" };
      }
      if (!req.body.option) {
        throw { code: 400, message: "Option is required" };
      }

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        {
          $set: {
            "question.$[indexQuestion].options.$[indexOption].value":
              req.body.option,
          },
        },
        {
          arrayFilters: [
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
            {
              "indexOption.id": new mongoose.Types.ObjectId(
                req.params.optionId
              ),
            },
          ],
          new: true,
        }
      );

      if (!form) {
        throw { code: 404, message: "Option not found" };
      }

      return res.status(200).json({
        status: true,
        message: "Option added successfully",
        data: {
          option: {
            id: req.params.optionId,
            value: req.body.option,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 400).json({
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
      if (!req.params.optionId) {
        throw { code: 400, message: "Required option id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "Invalid id" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
        throw { code: 400, message: "Invalid id" };
      }

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        {
          $pull: {
            "question.$[indexQuestion].options": {
              id: new mongoose.Types.ObjectId(req.params.optionId),
            },
          },
        },
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
      if (!form) {
        throw { code: 404, message: "Option not found" };
      }
      return res.status(200).json({
        status: true,
        message: "Option delete successfully",
      });
    } catch (error) {
      return res.status(error.code || 400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new OptionController();
