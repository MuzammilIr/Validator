import { validateTransaction } from "../services/ethersService.js";

export const handleTransactionValidation = async (req, res) => {
    try {
        const { txHash } = req.params;

        if (!txHash) {
            return res.status(400).json({ success: false, error: "Transaction hash is required" });
        }

        const isValid = await validateTransaction(txHash);

        if (typeof isValid !== "boolean") {
            throw new Error("Invalid response from validateTransaction function.");
        }

        res.json({ success: true, confirmed: isValid });

    } catch (error) {
        console.error("❌ Error validating transaction:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
