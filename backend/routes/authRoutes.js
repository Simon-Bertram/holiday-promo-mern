import express from "express";
import {
  requestLoginCode,
  verifyLoginCode,
  passwordLogin,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/request-code", requestLoginCode);
router.post("/verify-code", verifyLoginCode);
router.post("/password", passwordLogin);

export default router;
