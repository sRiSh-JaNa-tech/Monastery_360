import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Voyage, a tour guide for Sikkim." },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message?.content || "No response" });
  } catch (err: any) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: "Failed to fetch response" });
  }
}