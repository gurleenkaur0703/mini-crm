import { NextResponse } from 'next/server';

export async function POST(req) {
  const { prompt } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 80,
      }),
    });

    const data = await openaiRes.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json({ error: 'No message generated' }, { status: 500 });
    }

    return NextResponse.json({ message: data.choices[0].message.content.trim() });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate message' }, { status: 500 });
  }
}