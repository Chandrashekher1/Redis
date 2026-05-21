import redis from "./redis"

const LIMIT = 5
const window = 60 // second

export async function rateLimiter(ip: any) {
    const key = await `rate:${ip}`

    const request = await redis.incr(key)

    if (request === 1) {
        await redis.expire(key, window)
    }

    return {
        allowed: request <= LIMIT,
        remaining: Math.max(0, LIMIT - request)
    }
}