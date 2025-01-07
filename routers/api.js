import e from "express";
import AuthController from "../controllers/AuthControllers.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const router = e.Router();
//auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// refresh token
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

export default router;
