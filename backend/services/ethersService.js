import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const INFURA_WS_URL = process.env.INFURA_WS_URL;

if (!INFURA_WS_URL) {
    throw new Error("❌ INFURA_WS_URL is missing in .env file");
}

let provider;
const processedTxs = new Set(); // ✅ Cache to track processed transactions
const txQueue = []; // ✅ Queue to process transactions at a controlled rate

// Function to create a new WebSocket connection
const connectWebSocket = async () => {
    console.log("🔄 Connecting to Ethereum WebSocket...");
    try {
        provider = new ethers.WebSocketProvider(INFURA_WS_URL);
        console.log("✅ Connected to Ethereum WebSocket!");

        // // Handle WebSocket disconnection
        // provider._websocket.on("close", async () => {
        //     console.warn("⚠️ WebSocket disconnected. Reconnecting...");
        //     setTimeout(connectWebSocket, 5000); // Retry after 5 seconds
        // });
    } catch (error) {
        console.error("❌ WebSocket connection error:", error);
        setTimeout(connectWebSocket, 5000); // Retry after 5 seconds
    }
};

// Initialize WebSocket connection
connectWebSocket();

// ✅ Function to validate transaction
const validateTransaction = async (txHash) => {
    try {
        if (!provider) throw new Error("❌ Provider not connected");
        const tx = await provider.getTransaction(txHash);
        return tx && tx.confirmations > 0; // ✅ Check if transaction is confirmed
    } catch (error) {
        console.error("❌ Error validating transaction:", error);
        return false;
    }
};

// ✅ Function to process transactions at a controlled rate
const processTransactionQueue = async () => {
    if (txQueue.length === 0) return; // No transactions in queue

    const txHash = txQueue.shift(); // Get next transaction
    if (processedTxs.has(txHash)) return; // Skip already processed transactions

    try {
        const tx = await provider.getTransaction(txHash);
        if (!tx) return;

        processedTxs.add(txHash); // ✅ Mark as processed

        console.log(`✅ Processing transaction: ${txHash}`);
    } catch (error) {
        console.error(`❌ Error processing transaction ${txHash}:`, error);
    }

    setTimeout(processTransactionQueue, 5000); // ✅ Process next transaction after 5 sec
};

// ✅ Function to listen for transactions involving the specified address
const listenForTransactions = (address) => {
    if (!provider) {
        console.error("❌ Provider not initialized");
        return;
    }

    console.log(`👀 Listening for transactions involving: ${address}`);

    provider.on("pending", async (txHash) => {
        if (processedTxs.has(txHash)) return; // Skip if already processed

        // ✅ Add transaction to queue instead of fetching immediately
        txQueue.push(txHash);
    });

    // ✅ Start processing queue
    setInterval(processTransactionQueue, 5000); // Process every 5 seconds
};

// ✅ Ensure this is correctly exported
export { provider, validateTransaction, listenForTransactions };
