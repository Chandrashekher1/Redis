import { createClient } from "redis";

const globalForRedis = globalThis;

const redis: any =
    globalForRedis.redis ||
    createClient({
        url: process.env.REDIS_URL,
    });

if (!globalForRedis.redis) {
    redis.on("error", (err) => {
        console.error("Redis Error:", err);
    });

    redis.connect();
    globalForRedis.redis = redis;
}

export default redis;