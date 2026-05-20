"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      console.log(data);

      if (data?.data?.text) {
        setResponse(data.data.text);
      } else {
        setResponse("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setResponse("Failed to fetch from Gemini.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-4 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ask Gemini
        </h1>

        <div className="flex flex-col gap-4">
          <textarea
            className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50 dark:bg-zinc-800 resize-none transition-shadow"
            rows={4}
            placeholder="Ask your question here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={askGemini}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? "Thinking..." : "Ask Gemini"}
          </button>
        </div>

        {response && (
          <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-sm font-semibold mb-3 text-zinc-500 uppercase tracking-wider">Response</h2>
            <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-lg">{response}</p>
          </div>
        )}
      </main>
    </div>
  );
}
