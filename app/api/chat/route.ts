export const runtime = "nodejs";
export const maxDuration = 30;

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "";

const systemPrompt = (mood: string) =>
  `You are Luna Sakha (meaning "Moonlit Companion of Wisdom"), a warm, deeply empathetic, safe, and non-judgmental AI mental wellness companion.
Your focus is to support individuals experiencing stress, emotional overwhelm, anxiety, fatigue, or mental clutter.

CONVERSATIONAL GUIDELINES:
1. Warm & Calm Persona: Speak with gentle, grounding warmth. Use calming language. Avoid clinical, robotic, or overly technical jargon.
2. Active Listening & Validation: Validate their feelings first before giving any suggestions. Let them feel heard.
3. Keep it Safe: You are a peer-level wellness guide, NOT a licensed doctor or clinical therapist.
4. Stress Reduction: Help users gently untangle their thoughts with gentle clarifying questions one at a time.
5. Crisis Protocols: If the user indicates self-harm or severe crisis, gently provide emergency details (e.g., crisis lifeline 988).

Active User Mood State: ${mood}. Tailor your tone to complement this mood.`;

export async function POST(req: Request) {
  let messages: { role: string; content: string }[] = [];
  let mood = "Not specified";

  try {
    const body = await req.json();
    mood = body.mood || "Not specified";
    messages = (body.messages || [])
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : "",
      }));

    // Ensure strict user/assistant alternation — drop leading assistant messages
    while (messages.length > 0 && messages[0].role === "assistant") {
      messages.shift();
    }

    // Append mood reminder to the last user message so the AI prioritizes it
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user") {
        lastMsg.content += `\n\n[System note: The user's current mood is ${mood}. Please ensure your tone reflects and supports this state.]`;
      }
    }
  } catch {
    return new Response("Invalid request body", { status: 400 });
  }

  const lastUserMessage = messages[messages.length - 1]?.content || "";

  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(OLLAMA_API_KEY ? { Authorization: `Bearer ${OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: "gemma3:4b",
        messages: [
          { role: "system", content: systemPrompt(mood) },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ollama API error ${res.status}: ${errText}`);
    }

    const json = await res.json();
    const text = json?.message?.content || "";

    if (!text) throw new Error("Empty response from Ollama");

    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error("Luna Sakha AI Route Error:", JSON.stringify(error, Object.getOwnPropertyNames(error as object)));
    return new Response(getFallbackText(lastUserMessage, mood), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

function getFallbackText(userMessage: string, mood: string): string {
  const query = userMessage.toLowerCase();

  if (query.includes("stressed") || query.includes("anxious") || query.includes("stuck") || query.includes("work")) {
    return "I hear you, and it makes complete sense that you're feeling stuck and overwhelmed right now. Taking a moment to acknowledge that heavy weight is a brave first step.\n\nLet's take a deep breath together. When things feel like a massive tangled knot, we don't have to untangle it all at once.\n\nIf it feels safe, could you share just one small thing that's contributing to this heavy feeling today? We can look at it together, step-by-step, at your own pace.";
  } else if (mood.toLowerCase().includes("stressed") || mood.toLowerCase().includes("sad") || mood.toLowerCase().includes("overwhelm")) {
    return "I'm so glad you reached out. It sounds like things have been incredibly intense and overwhelming for you lately. Please know that this is a safe, non-judgmental space for you to rest.\n\nYou don't have to have everything figured out right now. Let's start small. How does your body feel in this moment? Are your shoulders tense?";
  } else {
    return "Thank you for sharing that with me. I'm here as your companion, to listen, support, and help you organize your thoughts. It is completely safe to share whatever is on your mind.\n\nWhat is feeling like the most important thing for us to talk about or focus on today?";
  }
}
