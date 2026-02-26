import { NextRequest, NextResponse } from 'next/server';

const pdfParse = require('pdf-parse');

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
    const data = await pdfParse(buffer);

    if (!data.text?.trim()) {
      return NextResponse.json({ error: 'PDF appears to be empty or unreadable' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      pdfText: data.text,
      pageCount: data.numpages,
    });
  } catch (err: any) {
    console.error('Error in /api/upload:', err);
    return NextResponse.json({ error: err.message || 'Failed to process PDF' }, { status: 500 });
  }
}
