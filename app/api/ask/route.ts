import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question, pdfBase64, pdfText } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
    }

    let messages: Groq.Chat.ChatCompletionMessageParam[];

    if (pdfBase64) {
      // Send PDF directly to Groq as a document
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a helpful AI assistant. Answer the following question. If a PDF is provided, use it as context but also use your own knowledge for general questions.\n\nQuestion: ${question}`,
            },
            {
              type: 'document' as any,
              document: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64,
              },
            },
          ],
        },
      ];
    } else {
      // No PDF — general chat
      const contextText = pdfText ? pdfText.slice(0, 80000) : null;
      const systemPrompt = contextText
        ? `You are a helpful AI assistant. PDF content:\n\n${contextText}`
        : `You are a helpful AI assistant. Answer clearly and concisely.`;

      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ];
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2048,
      messages,
    });

    const answer = completion.choices[0]?.message?.content ?? 'No answer generated.';
    return NextResponse.json({ answer });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error in /api/ask:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
