import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

export async function POST(req: NextRequest) {
  try {
    const { title, description, uom_type } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Goal title is required.' }, { status: 400 });
    }

    // Fallback mock if no API key configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json(getMockResponse(title));
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `You are an HR goal-quality assistant helping employees write SMART goals.
    
Given this goal:
Title: "${title}"
Description: "${description || 'Not provided'}"
Unit of Measure: ${uom_type}

Return a JSON object with exactly these fields:
{
  "improvedTitle": "A clearer, SMART version of the goal title (Specific, Measurable, Achievable, Relevant, Time-bound)",
  "improvedDescription": "A detailed description with scope, approach, and measurable success criteria",
  "suggestedUom": "one of: number, percentage, binary, currency",
  "suggestedTarget": a numeric target value,
  "scoreDirection": "one of: higher_better, lower_better, binary, timeline",
  "risks": ["list of 2-3 risks or weaknesses in the original goal"],
  "coachingQuestions": ["list of 2-3 questions the employee should answer to strengthen this goal"]
}

Rules:
- Do NOT assign performance ratings
- Keep language professional and neutral
- Focus on measurability and clarity
- Return ONLY the JSON object, no other text`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error('AI Goal Coach error:', err);
    // If we crash before reading the body, title will be undefined, so we default to 'Goal'
    return NextResponse.json(getMockResponse('Goal'));
  }
}

function getMockResponse(title: string) {
  return {
    improvedTitle: `${title} — Measured quarterly with defined baseline and target`,
    improvedDescription: `By end of FY2026, achieve the stated objective through a structured approach with monthly milestones. Success will be measured by comparing actuals against targets in each quarterly review window. The baseline will be established in Q1.`,
    suggestedUom: 'percentage',
    suggestedTarget: 100,
    scoreDirection: 'higher_better',
    risks: [
      "Goal lacks a quantified baseline \u2014 it's unclear what the starting point is.",
      'Target may be ambitious without intermediate milestones defined.',
      'Dependencies on other teams or systems are not captured.',
    ],
    coachingQuestions: [
      'What is the current baseline value, and how was it measured?',
      'What are the key milestones or checkpoints during the year?',
      'What resources or support do you need to achieve this goal?',
    ],
  };
}
