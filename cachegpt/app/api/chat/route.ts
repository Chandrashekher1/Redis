import { askGemini } from "@/lib/gemini";
import redis from "@/lib/redis";

function NormalizeQuestion(prompt: string) {
    return prompt.trim().toLowerCase();
}

export async function POST(req: Request) {
    const { prompt } = await req.json();
    const normalizeQuestion = NormalizeQuestion(prompt);

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

    await redis.setex(cacheKey, 60, JSON.stringify(answer))

    return Response.json({
        source: "gemini",
        data: answer
    });


}