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

    // Trim PDF text to avoid token limits
    const contextText = pdfText ? pdfText.slice(0, 12000) : null;

    const systemPrompt = contextText
      ? `You are a helpful AI assistant. You have been given a PDF document as context.

RULES:
1. If the question is related to the PDF, answer using the PDF content.
2. If the question is a general question (math, coding, science, history, etc.), answer it using your own knowledge.
3. If you use the PDF to answer, mention it briefly (e.g. "According to the PDF...").
4. Always be helpful, clear and concise.

PDF CONTENT:
${contextText}`
      : `You are a helpful AI assistant. Answer the user's questions clearly and concisely.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? 'No answer generated.';
    return NextResponse.json({ answer });

  } catch (err: any) {
    console.error('Error in /api/ask:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}