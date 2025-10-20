import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Modals/user-model.js";
import sendEmail from "../utils/emailSender.js";
import FamilyInvite from "../Modals/family-invite-model.js";
import Subscription from "../Modals/subscription-model.js";
import {CORS_ORIGINS} from "../index.js"


// User Registration
const authController = {
  // Register user
  registerUser: async (req, res) => {
    const { email, role } = req.body;

    try {
      if (role === "admin") {
        const adminExists = await User.findOne({ where: { role: "admin" } });
        if (adminExists) {
          return res.status(400).json({
            success: false,
            message: "Admin already exists",
          });
        }
      }

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        if (existingUser.isVerified) {
          return res.status(400).json({
            message: "Email already registered and verified",
            success: false,
          });
        }

        const verificationToken = jwt.sign(
          { email, role: role || "user" },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        const verificationLink = `${CORS_ORIGINS}/signup?token=${verificationToken}`;

        await sendEmail(
          email,
          "Verify Your Email",
          `Click here to verify: ${verificationLink}`
        );

        return res.json({
          message: "New verification email sent",
          success: true,
        });
      }

      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const verificationLink = `${CORS_ORIGINS}/signup?token=${verificationToken}`;

      await sendEmail(
        email,
        "Verify Your Email",
        `Click here to verify: ${verificationLink}`
      );

      await User.create({
        email: email,
        isVerified: false,
        profileCompleted: "email",
        role: role || "user",
      });

      res.json({
        message: "Verification email sent. Check your inbox.",
        success: true,
      });
    } catch (error) {
      console.error(" [REGISTER] Error:", {
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
        email: email,
      });

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          message:
            "Registration in progress. Please check your email for verification link.",
          success: false,
        });
      }

      res.status(500).json({
        message: "Server Error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        success: false,
      });
    }
  },

  // Verify email
  verifyEmail: async (req, res) => {
    const { token } = req.params;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Security check - prevent role elevation
      if (decoded.role === "admin") {
        const adminExists = await User.findOne({ where: { role: "admin" } });
        if (adminExists && adminExists.email !== decoded.email) {
          return res.status(403).json({
            success: false,
            message: "Admin account already exists",
          });
        }
      }

      // Find existing user
      let user = await User.findOne({ where: { email: decoded.email } });

      if (!user) {
        // Create new user with role from token (or default to "user")
        user = await User.create({
          email: decoded.email,
          isVerified: true,
          password: null,
          profileCompleted: "password",
          role: decoded.role || "user", // Preserve role from registration
        });
      } else {
        // Update existing user - preserve their original role unless it's a new admin
        await user.update({
          isVerified: true,
          profileCompleted: "password",
          role: user.role === "admin" ? "admin" : decoded.role || "user",
        });
      }

      return res.json({
        success: true,
        message: "Email verified. Proceed to set password",
        userId: user.id,
        email: user.email,
        isVerified: true,
        role: user.role, // Include role in response
        nextSetup: "set-password",
      });
    } catch (error) {
      console.error("Verification error:", error);

      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Verification link has expired",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(400).json({
          success: false,
          message: "Invalid verification token",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Verification failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Set password
  // setPassword: async (req, res) => {
  //   const { userId, password, confirmPassword } = req.body;

  //   try {
  //     const user = await User.findByPk(userId);
  //     if (!user) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "User not found",
  //       });
  //     }

  //     if (!user.isVerified) {
  //       return res.status(403).json({
  //         success: false,
  //         message: "Email not verified",
  //       });
  //     }

  //     if (password !== confirmPassword) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Passwords do not match",
  //       });
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     await user.update({
  //       password: hashedPassword,
  //       profileCompleted: "profile",
  //     });

  //     res.json({
  //       success: true,
  //       message: "Password set successfully",
  //       userId: user.id,
  //       profileCompleted: "profile",
  //       role: user.role,
  //       isVerified: user.isVerified,
  //     });
  //   } catch (error) {
  //     console.error("[BACKEND] /auth/set-password - Error:", error);
  //     res.status(400).json({
  //       success: false,
  //       message: "Please check your password and try again",
  //     });
  //   }
  // },

//   setPassword: async (req, res) => {
//   const { userId, password, confirmPassword } = req.body;

//   try {
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (!user.isVerified) {
//       return res.status(403).json({
//         success: false,
//         message: "Email not verified",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords do not match",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await user.update({
//       password: hashedPassword,
//       profileCompleted: "profile",
//     });

//     // ✅ ADD THIS: Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" }
//     );

//     res.json({
//       success: true,
//       message: "Password set successfully",
//       token: token,  // ✅ Include token in response
//       userId: user.id,
//       profileCompleted: "profile",
//       role: user.role,
//       isVerified: user.isVerified,
//     });
//   } catch (error) {
//     console.error("[BACKEND] /auth/set-password - Error:", error);
//     res.status(400).json({
//       success: false,
//       message: "Please check your password and try again",
//     });
//   }
// },

setPassword: async (req, res) => {
  const { userId, password, confirmPassword } = req.body;

  try {
    console.log("🔄 [BACKEND] setPassword called with userId:", userId);
    
    const user = await User.findByPk(userId);
    if (!user) {
      console.log("❌ [BACKEND] User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      console.log("❌ [BACKEND] User not verified:", userId);
      return res.status(403).json({
        success: false,
        message: "Email not verified",
      });
    }

    if (password !== confirmPassword) {
      console.log("❌ [BACKEND] Passwords don't match");
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    console.log("🔒 [BACKEND] Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log("💾 [BACKEND] Updating user...");
    await user.update({
      password: hashedPassword,
      profileCompleted: "profile",
    });

    // ✅ ADD DEBUG: Generate JWT token
    console.log("🔑 [BACKEND] Generating JWT token...");
    console.log("🔑 [BACKEND] JWT_SECRET exists:", !!process.env.JWT_SECRET);
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    console.log("✅ [BACKEND] Token generated:", token.substring(0, 20) + "...");

    const responseData = {
      success: true,
      message: "Password set successfully",
      token: token,  // ✅ Include token in response
      userId: user.id,
      profileCompleted: "profile",
      role: user.role,
      isVerified: user.isVerified,
    };

    console.log("📤 [BACKEND] Sending response with keys:", Object.keys(responseData));
    console.log("📤 [BACKEND] Token in response:", !!responseData.token);
    
    res.json(responseData);
  } catch (error) {
    console.error("[BACKEND] /auth/set-password - Error:", error);
    res.status(400).json({
      success: false,
      message: "Please check your password and try again",
    });
  }
},

  // Update profile
  updateProfile: async (req, res) => {
    const { userId } = req.params;
    const { fullName, phoneNumber, gender, dateOfBirth } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (!fullName) {
        return res
          .status(400)
          .json({ success: false, message: "Full name is required" });
      }

      let profileCompleted = "subscription";
      let nextStep = "subscription";

      if (user.familyPlanSubscriptionId) {
        profileCompleted = "completed";
        nextStep = "completed";
      }

      // ✅ Always update the database
      const updatedUser = await user.update({
        fullName,
        phoneNumber,
        gender,
        dateOfBirth,
        profileCompleted, // <- this line matters!
      });

      const authToken = jwt.sign(
        { id: updatedUser.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          phoneNumber: updatedUser.phoneNumber,
          gender: updatedUser.gender,
          dateOfBirth: updatedUser.dateOfBirth,
          profileCompleted: updatedUser.profileCompleted,
          role: updatedUser.role,
          isVerified: updatedUser.isVerified,
        },
        authToken,
        nextStep,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating profile",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // User Login
  loginUser: async (req, res) => {
    const { email, password, loginMethod = "email" } = req.body;
    const startTime = new Date();

    try {
      const user = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        console.warn(`[Auth] Login failed - User not found`, {
          email: email.toLowerCase(),
          status: 400,
          responseTime: `${new Date() - startTime}ms`,
        });
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      // Step-by-step signup flow checks:
      if (!user.isVerified || user.profileCompleted === "email") {
        console.warn(`[Auth] Login blocked - Email not verified`, {
          userId: user.id,
          status: 403,
          actionRequired: "email-verification",
        });
        return res.status(403).json({
          success: false,
          message: "Please verify your email first",
          nextStep: "verify-email",
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            profileCompleted: user.profileCompleted,
            isVerified: user.isVerified,
          },
        });
      }

      if (user.profileCompleted === "password") {
        console.warn(`[Auth] Login blocked - Password not set`, {
          userId: user.id,
          status: 403,
          actionRequired: "set-password",
        });
        return res.status(403).json({
          success: false,
          message: "Please set your password",
          nextStep: "set-password",
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            profileCompleted: user.profileCompleted,
            isVerified: user.isVerified,
          },
        });
      }

      if (user.profileCompleted === "profile") {
        return res.status(403).json({
          success: false,
          message: "Please complete your profile details",
          nextStep: "complete-profile",
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            profileCompleted: user.profileCompleted,
            isVerified: user.isVerified,
          },
        });
      }

      // Enforce subscription step before login is allowed
      if (user.profileCompleted === "subscription") {
        const token = jwt.sign(
          {
            id: user.id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );

        return res.status(403).json({
          success: false,
          message: "Please purchase a subscription to complete signup.",
          nextStep: "subscription",
          token, // <-- ADD THIS!
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            profileCompleted: user.profileCompleted,
            isVerified: user.isVerified,
          },
        });
      }

      // Password validation
      if (loginMethod === "email") {
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          console.warn(`[Auth] Login failed - Password mismatch`, {
            userId: user.id,
            status: 400,
            failedAttempt: true,
          });
          return res.status(400).json({
            success: false,
            message: "Invalid Credentials",
          });
        }
      }

      // Token generation
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role, // Include role in JWT payload if needed
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      await user.update({
        lastLogin: new Date(),
        lastLoginMethod: loginMethod,
      });

      // Determine next step for the frontend
      let nextStep = "dashboard";
      if (user.profileCompleted !== "completed") {
        nextStep = user.profileCompleted; // this will be 'subscription' if payment is pending
      }

      // Response with user role included
      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          lastLoginMethod: user.lastLoginMethod,
          profileCompleted: user.profileCompleted,
          isVerified: user.isVerified,
        },
        nextStep,
      });
    } catch (error) {
      console.error(`[Auth] Login error occurred`, {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        responseTime: `${new Date() - startTime}ms`,
        systemError: true,
      });

      return res.status(500).json({
        success: false,
        message: "Server Error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
        referenceId: `ERR-${Date.now()}`,
      });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Logout user
  logoutUser: async (_req, res) => {
    try {
      res.json({
        success: true, // ✅ Add this line
        message: "User logged out successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false, // ✅ Also add this for consistency
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Get all users
  getUsers: async (_req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });

      res.json({ message: "Users retrieved successfully", users });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  //Request password reset
  requestPasswordReset: async (req, res) => {
    const { email } = req.body;
    const startTime = new Date();

    try {
      // Validate email exists
      if (!email) {
        console.warn(`[Auth] Password reset attempt with no email`, {
          timestamp: startTime.toISOString(),
          ip: req.ip,
          status: 400,
        });
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const user = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        console.warn(
          `[Auth] Password reset attempt for unknown email: ${email}`,
          {
            responseTime: `${new Date() - startTime}ms`,
            status: 200,
          }
        );
        return res.json({
          success: true,
          message:
            "if an account exists with this email, reset instructions have been sent",
        });
      }

      const resetToken = jwt.sign(
        { id: user.id, action: "password_reset" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      await user.update({ resetToken });

      const resetLink = `${CORS_ORIGINS}/reset-password?token=${resetToken}`;

      await sendEmail(
        email,
        "Password Reset Instructions",
        `Click this link to reset your password: ${resetLink}\n\nThis link will expire in 1 hour.`
      );

      res.json({
        success: true,
        message: "Password reset instructions have been sent to your email",
      });
    } catch (error) {
      console.error(`[AUTH] Password reset error:`, {
        error: error.message,
        stack: error.stack,
        timeStamp: new Date().toISOString(),
        responseTime: `${new Date() - startTime}ms`,
      });

      res.status(500).json({
        success: false,
        message: "Failed to process password reset request",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  //Reset password with token
  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;
    const startTime = new Date();

    try {
      if (!token) {
        console.warn(`[AUTH] Password reset failed - No token provided`, {
          status: 400,
          responseTime: `${new Date() - startTime}ms`,
        });
        return res.status(400).json({
          success: false,
          message: "Reset token is required",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.action !== "password_reset") {
        console.warn(`[AUTH] Invalid token purpose`, {
          tokenAction: decoded.action,
          expectedAction: "password_reset",
          status: 400,
        });
        throw new error("Invalid token purpose");
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        console.warn(`[AUTH] Password reset failed - User not found`, {
          userId: decoded.id,
          status: 404,
          responseTime: `${new Date() - startTime}`,
        });
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      //Verify token matches stored token
      if (user.resetToken !== token) {
        console.warn(`[AUTH] Password reset failed - token mismatch`, {
          userId: user.id,
          status: 401,
          responseTime: `${new Date() - startTime}ms`,
        });
        return res.status(401).json({
          success: false,
          message: "Invalid or explained reset token",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({
        password: hashedPassword,
        resetToken: null,
      });

      res.json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.warn(`[AUTH] Password reset failed - Invalid token`, {
          error: error.message,
          status: 401,
          responseTime: `${new Date() - startTime}ms`,
        });
        return res.status(401).json({
          success: false,
          message: "Reset link has expired",
        });
      }

      if (error.name === "JsonWebTokenError") {
        console.warn(`[Auth] Password reset failed - Invalid token`, {
          error: error.message,
          status: 401,
          responseTime: `${new Date() - startTime}ms`,
        });
        return res.status(401).json({
          success: false,
          message: "Invalid reset token",
        });
      }

      console.error(`[Auth] Password reset error:`, {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        responseTime: `${new Date() - startTime}ms`,
      });

      res.status(500).json({
        success: false,
        message: "Failed to reset password",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  //fetch User Data
  fetchUserData: async (req, res) => {
    try {
      // Use the same extraction method as middleware
      const token = req.header("Authorization")?.replace("Bearer ", "").trim();

      if (!token) {
        console.error("No token in fetchUserData");
        return res.status(401).json({
          success: false,
          message: "Authorization token missing",
        });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Sequelize syntax
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          phoneNumber: user.phoneNumber,
          profileCompleted: user.profileCompleted,
          profilePicture: user.profilePicture,
          stripeCustomerId: user.stripeCustomerId,
          stripeSubscriptionId: user.stripeSubscriptionId,
          stripeDefaultPaymentMethodId: user.stripeDefaultPaymentMethodId,
        },
      });
    } catch (error) {
      console.error("FetchUserData Error:", {
        error: error.message,
        token: req.header("Authorization"),
        decoded:
          error.name === "JsonWebTokenError"
            ? null
            : jwt.decode(req.header("Authorization")?.replace("Bearer ", "")),
      });

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
          debug:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  verifyInvite: async (req, res) => {
    try {
      const { inviteToken } = req.body;

      // 1. Look up the invite
      const invite = await FamilyInvite.findOne({
        where: { token: inviteToken, status: "pending" },
      });

      if (!invite) {
        // Additional debug: log all invites with this token, regardless of status
        const anyInvite = await FamilyInvite.findOne({
          where: { token: inviteToken },
        });
        return res.status(400).json({ message: "Invalid or expired invite." });
      }

      // 2. Try to find the user first
      let user = await User.findOne({ where: { email: invite.email } });

      if (user) {
        // Update user details for invite flow (idempotent)
        await user.update({
          isVerified: true,
          profileCompleted: "password",
          invitedBy: invite.inviterId,
          familyPlanSubscriptionId: invite.subscriptionId,
          status: "Active",
        });
      } else {
        // If user doesn't exist, create
        try {
          user = await User.create({
            email: invite.email,
            isVerified: true,
            profileCompleted: "password",
            invitedBy: invite.inviterId,
            familyPlanSubscriptionId: invite.subscriptionId,
            status: "Active",
            role: "user",
          });
        } catch (err) {
          // If create fails due to unique constraint, find the user and continue
          if (err.name === "SequelizeUniqueConstraintError") {
            user = await User.findOne({ where: { email: invite.email } });
            if (!user) throw err; // Something else is wrong
          } else {
            console.error("[ERROR] Failed to create user:", err);
            throw err;
          }
        }
      }

      // 3. Update invite status to accepted (only if still pending)
      if (invite.status !== "accepted") {
        await invite.update({ status: "accepted" });
      }

      // 4. Issue JWT for the user (FIX)
      const jwtToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      // 5. Return safe user info **AND JWT!**
      return res.json({
        success: true,
        token: jwtToken, // THIS IS REQUIRED FOR YOUR FLOW TO WORK
        email: invite.email,
        inviterId: invite.inviterId,
        subscriptionId: invite.subscriptionId,
        userId: user.id,
        isVerified: true,
        profileCompleted: user.profileCompleted,
      });
    } catch (err) {
      console.error("[BACKEND] /auth/verify-invite - Error:", err);
      return res.status(400).json({
        message: "Failed to process invite",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },

  // CLAIM INVITE - ONLY here update invite status to 'accepted'
  claimInvite: async (req, res) => {
    try {
      const { inviteToken, userId } = req.body;

      const invite = await FamilyInvite.findOne({
        where: { token: inviteToken, status: "pending" },
      });

      if (!invite) {
        return res.status(400).json({ message: "Invalid or expired invite." });
      }

      // Update user to connect with family plan
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user profile and subscription info
      await user.update({
        familyPlanSubscriptionId: invite.subscriptionId,
        invitedBy: invite.inviterId,
        profileCompleted: "completed", // Set profile as completed for family plan users
      });

      // Mark the invite as accepted
      await invite.update({ status: "accepted" });

      res.json({
        message:
          "Invite claimed successfully, you have joined the family plan!",
        nextStep: "completed", // Skip the subscription page
      });
    } catch (err) {
      console.error("[BACKEND] /auth/claim-invite - Error:", err);
      res.status(400).json({ message: "Failed to claim invite." });
    }
  },

  // Change password (for logged-in users)
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Extract user ID from token (assuming you're using auth middleware or manually decoding the token)
      const token = req.header("Authorization")?.replace("Bearer ", "").trim();
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authorization token missing",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Validate current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Prevent reusing same password
      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res.status(400).json({
          success: false,
          message: "New password cannot be the same as the current password",
        });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedNewPassword });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("[Auth] Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to change password",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Delete user api
  deleteAccount: async (req, res) => {
    try {
      const { userId } = req.params;
      const { password } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (!user.password) {
        return res
          .status(400)
          .json({ success: false, message: "Password not set" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(200)
          .json({ success: false, message: "Incorrect password" });
      }

      // Cancel Stripe subscription
      if (user.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
        } catch (err) {
          console.warn("Stripe cancel error:", err.message);
        }
      }

      // Soft-delete email
      const [localPart, domain] = user.email.split("@");
      const safeDeletedEmail = `${localPart}+deleted_${Date.now()}@${domain}`;

      await user.update(
        {
          email: safeDeletedEmail,
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          stripeDefaultPaymentMethodId: null,
          status: "Deleted",
        },
        { validate: false }
      );

      // Delete family invites
      const invitedUsers = await User.findAll({
        where: { invitedBy: user.id },
      });

      await Promise.all(
        invitedUsers.map(async (member) => {
          const [invLocal, invDomain] = member.email.split("@");
          const deletedInvitedEmail = `${invLocal}+deleted_${Date.now()}@${invDomain}`;

          await member.update(
            {
              email: deletedInvitedEmail,
              stripeSubscriptionId: null,
              stripeCustomerId: null,
              stripeDefaultPaymentMethodId: null,
              status: "Deleted",
            },
            { validate: false }
          );
        })
      );

      await FamilyInvite.destroy({ where: { inviterId: user.id } });
      await Subscription.destroy({ where: { userId: user.id } });

      return res.json({
        success: true,
        message: "Account and associated data deleted successfully.",
      });
    } catch (error) {
      console.error("[Delete Account Error]:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while deleting account.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

export default authController;
