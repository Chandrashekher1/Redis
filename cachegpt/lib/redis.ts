import { createClient } from "redis";

const globalForRedis = globalThis as any;

const redis: any =
    globalForRedis.redis ||
    createClient({
        url: process.env.REDIS_URL,
    });

if (!globalForRedis.redis) {
    redis.on("error", (err: any) => {
        console.error("Redis Error:", err);
    });

    redis.connect();
    globalForRedis.redis = redis;
}

export default redis;