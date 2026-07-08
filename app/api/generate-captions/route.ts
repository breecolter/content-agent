import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VOICE_PROMPT = `You are a ghostwriter for Bree Colter — a fashion and beauty model, visual artist, and creative based in the US. Your job is to write social media captions in her exact voice.

Her voice is:
- Warm, personal, and conversational — like she's talking to a friend, not performing for an audience
- Poetic but never pretentious — she reaches for beautiful language that feels effortless, not try-hard
- Emotionally honest — she names the real feeling behind a moment, not just the aesthetic
- Grounded in specificity — real places, real feelings, real details (never generic)
- Inspired by "Year of Yes" energy — open, growing, living deliberately
- She uses lowercase naturally and doesn't overuse hashtags
- She invites her audience in rather than broadcasting at them

Examples of her style:
- "sat in front of this painting in paris and felt something shift. can't explain it. just knew i was exactly where i was supposed to be."
- "being in front of the camera is the one place i've always felt most like myself. still figuring out everything else."
- "some days the art is the work. some days the work is just showing up."

Write captions that sound like Bree wrote them herself — specific, real, and quietly confident.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { synopsis, emotionalTruth, category, platform } = body;

  if (!synopsis || synopsis.trim().length < 10) {
    return NextResponse.json({ error: "Please write a bit more about this moment." }, { status: 400 });
  }

  const platforms: string[] = platform?.length ? platform : ["instagram", "tiktok", "youtube"];

  const userPrompt = `Write social media captions for Bree based on:

WHAT HAPPENED / THE MOMENT: ${synopsis}
${emotionalTruth ? `THE EMOTIONAL TRUTH: ${emotionalTruth}` : ""}
CONTENT CATEGORY: ${category || "general"}
PLATFORMS NEEDED: ${platforms.join(", ")}

Write exactly three captions, one for each platform, even if the platform list differs — always output Instagram, TikTok, and Pinterest. Each should feel native to that platform:

- Instagram: 3-5 sentences, poetic and personal, ends with a small invitation or reflection. 3-5 relevant hashtags at the end.
- TikTok: Punchy, hook-first, more conversational. 1-3 sentences max. 2-4 trending-style hashtags.
- YouTube: Written as a video description. Opens with a hook sentence, then 2-3 sentences of context about the video/moment. Warm and personal tone. 3-5 relevant hashtags at the end.

Return ONLY a JSON object with this exact shape, no markdown, no explanation:
{"instagram":"...","tiktok":"...","youtube":"..."}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: VOICE_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Unexpected response format");

    const captions = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ captions });
  } catch (err) {
    console.error("Caption generation error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
