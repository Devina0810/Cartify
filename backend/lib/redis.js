import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

await redis.set("test_key", "test_value");
