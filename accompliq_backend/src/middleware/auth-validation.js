import { check, validationResult } from "express-validator";

export const validateLogin = [
  check("email", "Please include a valid email")
    .isEmail()
    .trim()
    .normalizeEmail(),

  check("password", "Password must be 6-15 characters long ")
    .if((value, { req }) => req.body.loginMethod === "email")
    .isLength({
      min: 6,
      max: 15,
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
