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
router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);

export default router;
