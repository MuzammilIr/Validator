import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes.js";
import { listenForTransactions } from "./services/ethersService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transactions", transactionRoutes);

// Start listening for transactions (Replace with actual MetaMask wallet address)
const senderWallet = "0xYourMetaMaskAddress"; // Change this to your MetaMask address
listenForTransactions(senderWallet);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
