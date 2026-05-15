// Prompt builders for the structured AI flows.
//
// Every prompt forces the model to return ONLY valid JSON. The route
// handlers then parse the JSON; if parsing fails the route returns a
// well-shaped mock instead of crashing the demo.

import type {
  Generate3DSceneInput,
  GenerateAssignmentInput,
  GenerateLessonInput,
  GradeAnswerInput,
} from './types';

export const SYSTEM_PROMPT = `You are an expert IB MYP Year 8 mathematics teacher, EIS curriculum designer, and 3D animated learning planner.
Use the EIS IB Year 8 (MYP 3) curriculum as the source of truth — its four units are: Numerical Reasoning, Abstract Reasoning, Spatial Reasoning, and Reasoning with Data.
Always generate accurate Grade 8 mathematics content with inquiry framing, student-friendly explanations, worked examples, animated explainer steps, assignment questions with feedback rubrics, and a safe predefined 3D scene type from this exact set:
- pythagoras_3d
- equation_balance_3d
- linear_graph_3d
- circle_lab_3d
- ratio_mixer_3d
- solid_geometry_3d
- angle_lab_3d
- probability_spinner_3d
- percentage_bar_3d
- data_visualisation_3d
RULES:
- Return valid JSON only. No markdown. No prose outside the JSON object.
- Use ASCII characters in formulas (e.g. "x^2" instead of "x²" if unicode would risk encoding issues).
- The threeDType field must be one of the values above, lower-snake-case.
- unit must be one of: numerical, abstract, spatial, data.
- Keep tone warm and concrete; favour real-world examples a 13-year-old will recognise.`;

const ALLOWED_3D_TYPES = [
  'pythagoras_3d',
  'equation_balance_3d',
  'linear_graph_3d',
  'circle_lab_3d',
  'ratio_mixer_3d',
  'solid_geometry_3d',
  'angle_lab_3d',
  'probability_spinner_3d',
  'percentage_bar_3d',
  'data_visualisation_3d',
] as const;

export function lessonPrompt(input: GenerateLessonInput): string {
  return `Generate a complete EIS Grade 8 maths lesson on the topic: "${input.topic}".
${input.unit ? `Unit hint: ${input.unit}.` : ''}
${input.strand ? `Strand: ${input.strand}.` : ''}
${input.context ? `Additional context the teacher provided:\n${input.context.slice(0, 1500)}` : ''}

Return JSON matching exactly this schema:
{
  "title": string,
  "unit": "numerical" | "abstract" | "spatial" | "data",
  "strand": string,
  "topic": string,
  "inquiryQuestion": string,
  "objectives": string[],
  "studentExplanation": string,
  "teacherNotes": string,
  "animatedSteps": string[],            // 4-6 beats, each a single sentence
  "threeDType": one of ${ALLOWED_3D_TYPES.join(' | ')},
  "workedExamples": [{ "prompt": string, "steps": string[], "answer": string }],
  "practiceQuestions": [{ "question": string, "answer": string, "explanation": string }],
  "assignmentQuestions": [{ "question": string, "expectedAnswer": string, "acceptedKeywords": string[], "rubric": string }],
  "extensionChallenge": string
}

Constraints:
- 4 to 6 animatedSteps.
- 1 to 2 workedExamples.
- 2 to 3 practiceQuestions.
- 2 to 3 assignmentQuestions.
- acceptedKeywords are short fragments that, if present in a student answer (case- and space-insensitive), indicate correctness. Keep them tight (e.g. ["x=7"]).`;
}

export function assignmentPrompt(input: GenerateAssignmentInput): string {
  const count = Math.min(Math.max(input.count ?? 3, 1), 6);
  return `Generate ${count} EIS Grade 8 maths assignment questions on the topic: "${input.topic}".
${input.unit ? `Unit: ${input.unit}.` : ''}
${input.inquiryQuestion ? `Inquiry frame: ${input.inquiryQuestion}` : ''}
Target difficulty: ${input.difficulty ?? 'core'}.

Return JSON matching exactly this schema:
{
  "topic": string,
  "difficulty": "core" | "support" | "extension",
  "threeDType": one of ${ALLOWED_3D_TYPES.join(' | ')},
  "questions": [{
    "question": string,
    "expectedAnswer": string,
    "acceptedKeywords": string[],
    "rubric": string
  }]
}`;
}

export function gradePrompt(input: GradeAnswerInput): string {
  return `You are grading a Grade 8 student's answer.

Question: ${input.question}
Expected answer: ${input.expectedAnswer}
${input.acceptedKeywords?.length ? `Accepted keyword fragments: ${JSON.stringify(input.acceptedKeywords)}` : ''}
${input.rubric ? `Rubric: ${input.rubric}` : ''}

Student answer: ${input.studentAnswer}

Return JSON matching exactly this schema:
{
  "score": number,             // 0-100 integer
  "feedback": string,          // 1-2 sentences, warm and specific
  "strengths": string[],       // short bullet phrases
  "misconceptions": string[],  // short bullet phrases; empty array if none
  "nextStep": string           // one concrete next action for the student
}`;
}

export function scenePrompt(input: Generate3DSceneInput): string {
  return `A teacher wants the right 3D scene to anchor this maths concept.

Topic: ${input.topic}
${input.conceptHint ? `Concept hint: ${input.conceptHint}` : ''}

Pick exactly one threeDType from the set above. Briefly justify your choice and outline 4-6 short narration beats that would play during the animation.

Return JSON matching exactly:
{
  "threeDType": one of ${ALLOWED_3D_TYPES.join(' | ')},
  "rationale": string,
  "animatedSteps": string[]
}`;
}
