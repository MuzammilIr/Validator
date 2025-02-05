import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Initialize Redis client
const redisClient = createClient({
    socket: {
        host: "127.0.0.1",
        port: 6379,
    },
});

redisClient.on("error", (err) => console.error("❌ Redis error:", err));

(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis");
    } catch (error) {
        console.error("❌ Redis connection error:", error);
    }
})();

export default redisClient;
