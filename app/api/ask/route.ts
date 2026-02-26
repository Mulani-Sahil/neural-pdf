import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question, pdfText } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
    }

    const contextText = pdfText ? (pdfText as string).slice(0, 80000) : null;

    const systemPrompt = contextText
      ? `You are a helpful AI assistant. You have been given a PDF document as context.
RULES:
1. If the question relates to the PDF, answer using the PDF content.
2. For general questions (math, coding, science, etc.), use your own knowledge.
3. If using the PDF, mention it briefly e.g. "According to the PDF...".
4. Be helpful, clear and concise.

PDF CONTENT:
${contextText}`
      : `You are a helpful AI assistant. Answer clearly and concisely.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? 'No answer generated.';
    return NextResponse.json({ answer });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
