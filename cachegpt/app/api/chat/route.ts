import { askGemini } from "@/lib/gemini";
import redis from "@/lib/redis";
import { rateLimiter } from "@/lib/rateLimiter";

function NormalizeQuestion(prompt: string) {
    return prompt.trim().toLowerCase();
}

export async function POST(req: Request) {
    const { prompt } = await req.json();
    const normalizeQuestion = NormalizeQuestion(prompt);

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "unknown";

    // RATE LIMIT CHECK
    const rateLimit = await rateLimiter(ip);

    if (!rateLimit.allowed) {
        return Response.json(
            {
                error: "Too many requests. Try again later.",
            },
            { status: 429 }
        );
    }

    if (!prompt) {
        return Response.json(
            { error: "Prompt is required" },
            { status: 400 }
        );
    }

    const cacheKey = `question:${normalizeQuestion}`

    // check redis

    const cachedAnswer = await redis.get(cacheKey)

    if (cachedAnswer) {
        return Response.json({
            source: 'cache',
            data: JSON.parse(cachedAnswer)
        });
    }

    // step2. ask gemini if not cached

    const answer = await askGemini(prompt)

    // step 3. store in redis for 5 min

    await redis.setEx(cacheKey, 60, JSON.stringify(answer))

    return Response.json({
        source: "gemini",
        data: answer
    });


}