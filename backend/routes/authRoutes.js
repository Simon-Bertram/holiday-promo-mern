import express from "express";
import {
  requestMagicCode,
  verifyMagicCode,
  passwordLogin,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/request-code", requestMagicCode);
router.post("/verify-code", verifyMagicCode);
router.post("/password", passwordLogin);

export default router;
