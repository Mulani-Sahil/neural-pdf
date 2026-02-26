import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from PDF manually without pdf-parse
    const text = extractTextFromPDF(buffer);

    if (!text.trim()) {
      return NextResponse.json({ error: 'PDF appears to be empty or unreadable' }, { status: 400 });
    }

    // Estimate page count
    const pageCount = (text.match(/\f/g) || []).length + 1;

    return NextResponse.json({
      success: true,
      filename: file.name,
      pdfText: text,
      pageCount,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to process PDF';
    console.error('Error in /api/upload:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractTextFromPDF(buffer: Buffer): string {
  const content = buffer.toString('latin1');
  const chunks: string[] = [];

  // Extract text from BT...ET blocks
  const btEtRegex = /BT([\s\S]*?)ET/g;
  let match;

  while ((match = btEtRegex.exec(content)) !== null) {
    const block = match[1];

    // Match Tj, TJ, ' and " operators
    const textRegex = /\(((?:[^()\\]|\\[\s\S])*)\)\s*(?:Tj|'|")|(\[.*?\])\s*TJ/g;
    let textMatch;

    while ((textMatch = textRegex.exec(block)) !== null) {
      if (textMatch[1] !== undefined) {
        chunks.push(decodePDFString(textMatch[1]));
      } else if (textMatch[2] !== undefined) {
        // TJ array
        const arr = textMatch[2];
        const strRegex = /\(((?:[^()\\]|\\[\s\S])*)\)/g;
        let s;
        while ((s = strRegex.exec(arr)) !== null) {
          chunks.push(decodePDFString(s[1]));
        }
      }
    }
    chunks.push(' ');
  }

  return chunks
    .join('')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\s{3,}/g, ' ')
    .trim();
}

function decodePDFString(str: string): string {
  return str
    .replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')');
}
