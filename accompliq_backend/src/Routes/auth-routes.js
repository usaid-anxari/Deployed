import express from "express";
import jwt from "jsonwebtoken";
import authController from "../Controllers/auth-controller.js";
import { validateLogin } from "../middleware/auth-validation.js";
import authMiddleware from "../middleware/auth-middleware.js";
const authRouter = express.Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/verify-email/:token", authController.verifyEmail);
authRouter.post("/set-password", authController.setPassword);
// authRouter.put("/update-profile/:userId", authController.updateProfile);
authRouter.put("/update-profile/:userId", authMiddleware, authController.updateProfile);
authRouter.post("/login", validateLogin, authController.loginUser);
authRouter.post("/login/google", authController.loginUser);
authRouter.post("/login/facebook", authController.loginUser);
authRouter.post("/logout", authController.logoutUser);
authRouter.get("/users", authController.getUsers);
authRouter.delete("/delete-user/:userId", authController.deleteUser);
authRouter.post("/forgot-password", authController.requestPasswordReset);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post(
  "/change-password",
  authMiddleware,
  authController.changePassword
);
authRouter.delete("/delete-account/:userId", authController.deleteAccount);
authRouter.get("/me", authMiddleware, authController.fetchUserData);
authRouter.post("/verify-invite", authController.verifyInvite);
authRouter.post("/claim-invite", authController.claimInvite);
authRouter.post("/verify-token", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (err) {
    res.json({ valid: false, error: err.message });
  }
});
export default authRouter;
