import mongoose from "mongoose";
import Form from "../models/Form.js";
import Users from "../models/Users.js";

class FormController {
  async index(req, res) {
    try {
      const limit = req.query.limit || 5;
      const page = req.query.page || 1;

      const form = await Form.paginate(
        {
          userId: req.jwt.id,
        },
        { limit: limit, page: page }
      );
      if (!form) {
        throw { code: 404, message: "Forms not found" };
      }

      return res.status(200).json({
        status: true,
        message: "Form retrieved successfully",
        totalData: form.length,
        data: { form },
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

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "Form ID required" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid form ID" };
      }

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        req.body,
        { new: true }
      );
      if (!form) {
        throw { code: 404, message: "Form not found" };
      }

      return res.status(200).json({
        status: true,
        message: "Form updated successfully",
        data: { form },
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
        throw { code: 400, message: "Form ID required" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid form ID" };
      }

      const form = await Form.findOneAndDelete({
        _id: req.params.id,
        userId: req.jwt.id,
      });

      if (!form) {
        throw { code: 404, message: "Form not found" };
      }

      return res.status(200).json({
        status: true,
        message: "Form deleted successfully",
        data: form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async showToUser(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "Form ID required" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "Invalid form ID" };
      }

      const form = await Form.findOne({ _id: req.params.id });

      if (!form) {
        throw { code: 404, message: "Form not found" };
      }

      if (req.jwt.id != form.userId && form.public === false) {
        const user = await Users.findOne({ _id: req.jwt.id });

        if (!form.invites.includes(user.email)) {
          throw { code: 401, message: "You are not invited" };
        }
      }

      form.invites = [];
      return res.status(200).json({
        status: true,
        message: "Form found",
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
