import mongoose from "mongoose";
import Form from "../models/Form.js";

class FormController {
  async store(req, res) {
    try {
      const form = await Form.create({
        userId: req.jwt.id,
        title: "Untitled form",
        description: null,
        public: true,
      });
      if (!form) {
        throw { code: 400, message: "Failed to create form" };
      }

      return res.status(200).json({
        status: true,
        message: "Form created successfully",
        data: { form },
      });
    } catch (error) {
      return res.status(error.code || 400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async show(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "Form ID required" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid form ID" };
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
        message: "Form retrieved successfully",
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

export default new FormController();
