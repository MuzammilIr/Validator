document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connectWallet");
    const walletAddressDisplay = document.getElementById("walletAddress");
    const validateTxBtn = document.getElementById("validateTx");
    const txHashInput = document.getElementById("txHashInput");
    const resultDisplay = document.getElementById("result");

    let userAddress = null;

    // Connect MetaMask
    connectWalletBtn.addEventListener("click", async () => {
        if (window.ethereum) {
            try {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                userAddress = accounts[0];
                walletAddressDisplay.innerText = `Connected: ${userAddress}`;
            } catch (error) {
                console.error("User denied account access", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to continue.");
        }
    });

    // Validate Transaction
    validateTxBtn.addEventListener("click", async () => {
        const txHash = txHashInput.value.trim();
        if (!txHash) {
            alert("Please enter a valid transaction hash.");
            return;
        }

        if (!userAddress) {
            alert("Please connect your MetaMask wallet first.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/transactions/validate/${txHash}`);
            const data = await response.json();

            if (data.success) {
                resultDisplay.innerHTML = `
                    <p>✅ Transaction Verified!</p>
                    <p>Confirmed: ${data.confirmed ? "Yes" : "No"}</p>
                `;
            } else {
                resultDisplay.innerHTML = `<p>❌ Transaction validation failed: ${data.error}</p>`;
            }
        } catch (error) {
            console.error("Error validating transaction:", error);
            resultDisplay.innerHTML = `<p>❌ Error validating transaction.</p>`;
        }
    });
});
