import express from "express";
import { handleTransactionValidation } from "../controllers/transactionController.js";

const router = express.Router();

// ✅ Correct route definition
router.get("/validate/:txHash", handleTransactionValidation);

export default router;
