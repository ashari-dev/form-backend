import e from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import AuthController from "../controllers/AuthControllers.js";
import FormController from "../controllers/FormControllers.js";
import QuestionsController from "../controllers/QuestionsControllers.js";
import OptionControllers from "../controllers/OptionControllers.js";
import AnswerControllers from "../controllers/AnswerControllers.js";

const router = e.Router();
//auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// refresh toke
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

// form
router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);
router.get("/forms/:id/user", jwtAuth(), FormController.showToUser);

// question
router.get("/forms/:id/question", jwtAuth(), QuestionsController.index);
router.post("/forms/:id/question", jwtAuth(), QuestionsController.store);
router.put(
  "/forms/:id/question/:questionId",
  jwtAuth(),
  QuestionsController.update
);
router.delete(
  "/forms/:id/question/:questionId",
  jwtAuth(),
  QuestionsController.destroy
);

// option
router.post(
  "/forms/:id/question/:questionId/option",
  jwtAuth(),
  OptionControllers.store
);
router.put(
  "/forms/:id/question/:questionId/option/:optionId",
  jwtAuth(),
  OptionControllers.update
);
router.delete(
  "/forms/:id/question/:questionId/option/:optionId",
  jwtAuth(),
  OptionControllers.destroy
);

// answer
router.post("/answer/:formId", jwtAuth(), AnswerControllers.store);

export default router;
