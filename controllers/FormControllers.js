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
}

export default new FormController();
