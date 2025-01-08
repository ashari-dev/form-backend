import e from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import AuthController from "../controllers/AuthControllers.js";
import FormController from "../controllers/FormControllers.js";

const router = e.Router();
//auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// refresh toke
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

// form
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);

export default router;
