import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

export async function POST(req: NextRequest) {
  try {
    const { employeeName, goals, period } = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json(getMockCheckinResponse(employeeName));
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const goalsText = goals.map((g: { title: string; target: number; actual: number; weightage: number }, i: number) =>
      `${i + 1}. "${g.title}" — Target: ${g.target}, Actual: ${g.actual}, Weightage: ${g.weightage}%`
    ).join('\n');

    const prompt = `You are a manager's assistant helping draft a professional quarterly check-in summary.

Employee: ${employeeName}
Period: ${period}

Goals and Progress:
${goalsText}

Return a JSON object:
{
  "summary": "A 2-3 sentence professional summary of the employee's progress this quarter",
  "coachingQuestions": ["3 open-ended coaching questions for the manager to ask"],
  "overallProgress": "one of: excellent, on_track, needs_attention, at_risk"
}

Rules:
- Do NOT assign performance ratings or scores
- Keep tone supportive and constructive
- Focus on observable progress, not personality
- Return ONLY the JSON object`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response');
    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err: unknown) {
    console.error('AI Checkin Assistant error:', err);
    return NextResponse.json(getMockCheckinResponse('the employee'));
  }
}

function getMockCheckinResponse(name: string) {
  return {
    summary: `${name} has demonstrated solid progress this quarter, with most goals tracking on or ahead of schedule. The technical objectives show strong momentum, while the certification goal may benefit from a structured timeline review.`,
    coachingQuestions: [
      `What has been your biggest challenge in achieving the API response time goal, and what support would help?`,
      `How are you prioritising the certification path alongside your sprint commitments?`,
      `What would "excellent" look like for you in Q2, and what would need to be true to get there?`,
    ],
    overallProgress: 'on_track',
  };
}
