import Redis from "ioredis";

const globalForRedis = globalThis as { redis?: Redis };

const redis = new Redis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
});

if (!globalForRedis.redis) {
    redis.on("error", (err) => {
        console.error("Redis Error:", err);
    });

    redis.connect();
    globalForRedis.redis = redis;
}

export default redis;