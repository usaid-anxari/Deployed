import { check, validationResult } from "express-validator";

export const validateBucket = [
  check("title", "Title is required").not().isEmpty().trim(),
  check("description", "Description should be at least 10 characters")
    .optional()
    .isLength({ min: 10 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
