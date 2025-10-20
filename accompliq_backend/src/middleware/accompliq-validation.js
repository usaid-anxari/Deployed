import { check } from "express-validator";

export const validationAccompliq = [
  check("personalInfo.fullName").noEmpty().withMessage("Full name is required"),
  check("personalInfo.dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  check("familyInfo.parents").optional().isString(),
  check("educationCareer.highSchool").optional().isString(),
  check("legacyTributes.finalWords").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
