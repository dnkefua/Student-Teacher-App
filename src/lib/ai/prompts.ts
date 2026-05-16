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

export const SYSTEM_PROMPT_MATH = `You are an expert IB MYP Year 8 mathematics teacher, EIS curriculum designer, and 3D animated learning planner.
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

export const SYSTEM_PROMPT_ENGLISH = `You are an expert IB MYP Year 8 English teacher and EIS curriculum designer.
The Year 8 sequence covers media & advertising, the novel (Roald Dahl + R. J. Palacio), the poetry anthology
(personal & cultural expression), language & film (Our Planet), and Shakespeare's Taming of the Shrew.
Always frame the lesson with an inquiry question, IB key concept and related concepts, then deliver student-friendly
explanations, PETAL-shaped or analytical worked examples, assignment questions with explicit rubrics, and an
interactive workshop type from this exact set:
- text_annotation_lab
- essay_planner
- poetry_device_highlighter
- grammar_sentence_builder
- writing_revision_studio
- character_analysis_board
- story_structure_map
- vocabulary_practice
- debate_simulator
- speaking_feedback
RULES:
- Return valid JSON only. No markdown. No prose outside the JSON object.
- subjectInteractiveType must be one of the values above, lower-snake-case.
- Keep tone warm and concrete; favour examples a 13-year-old reader/writer will recognise.`;

export const SYSTEM_PROMPT_SCIENCE = `You are an expert IB MYP Year 8 science teacher and EIS curriculum designer.
The Year 8 sequence covers biology (cells, photosynthesis, ecosystems), chemistry (particle model, diffusion,
acids & alkalis), physics (forces, friction, motion graphs) and electricity (series/parallel circuits, V/I/R,
energy resources). Always frame the lesson with an inquiry question, IB key concept and related concepts, then
deliver student-friendly explanations, a hands-on worked example, assignment questions with explicit rubrics,
and an interactive workshop type from this exact set:
- cell_3d
- particle_model_3d
- forces_motion_sim
- electric_circuit_builder
- chemical_reaction_lab
- ecosystem_simulation
- energy_transfer_sim
- body_system_3d
- earth_space_orbit
- scientific_method_lab
RULES:
- Return valid JSON only. No markdown. No prose outside the JSON object.
- subjectInteractiveType must be one of the values above, lower-snake-case.
- Keep tone warm and concrete; favour real-world examples a 13-year-old will recognise.`;

/** Backwards-compatible export — defaults to the maths system prompt. */
export const SYSTEM_PROMPT = SYSTEM_PROMPT_MATH;

export function systemPromptForSubject(subject: 'mathematics' | 'english' | 'science'): string {
  switch (subject) {
    case 'english':
      return SYSTEM_PROMPT_ENGLISH;
    case 'science':
      return SYSTEM_PROMPT_SCIENCE;
    default:
      return SYSTEM_PROMPT_MATH;
  }
}

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

const ALLOWED_ENGLISH_INTERACTIVES = [
  'text_annotation_lab',
  'essay_planner',
  'poetry_device_highlighter',
  'grammar_sentence_builder',
  'writing_revision_studio',
  'character_analysis_board',
  'story_structure_map',
  'vocabulary_practice',
  'debate_simulator',
  'speaking_feedback',
] as const;

const ALLOWED_SCIENCE_INTERACTIVES = [
  'cell_3d',
  'particle_model_3d',
  'forces_motion_sim',
  'electric_circuit_builder',
  'chemical_reaction_lab',
  'ecosystem_simulation',
  'energy_transfer_sim',
  'body_system_3d',
  'earth_space_orbit',
  'scientific_method_lab',
] as const;

export function lessonPrompt(input: GenerateLessonInput): string {
  const subject = input.subject ?? 'mathematics';
  if (subject === 'english') return englishLessonPrompt(input);
  if (subject === 'science') return scienceLessonPrompt(input);
  return mathLessonPrompt(input);
}

function mathLessonPrompt(input: GenerateLessonInput): string {
  return `Generate a complete EIS Grade 8 maths lesson on the topic: "${input.topic}".
${input.unit ? `Unit hint: ${input.unit}.` : ''}
${input.strand ? `Strand: ${input.strand}.` : ''}
${input.context ? `Additional context the teacher provided:\n${input.context.slice(0, 1500)}` : ''}

Return JSON matching exactly this schema:
{
  "title": string,
  "subject": "mathematics",
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

function englishLessonPrompt(input: GenerateLessonInput): string {
  return `Generate a complete EIS Year 8 English lesson on the topic: "${input.topic}".
${input.strand ? `Strand: ${input.strand}.` : ''}
${input.context ? `Additional context the teacher provided:\n${input.context.slice(0, 1500)}` : ''}

Return JSON matching exactly this schema:
{
  "title": string,
  "subject": "english",
  "strand": string,                    // "Reading & Writing", "Writing & Speaking", "Reading", etc.
  "topic": string,
  "inquiryQuestion": string,
  "objectives": string[],
  "studentExplanation": string,
  "teacherNotes": string,
  "animatedSteps": string[],           // 4-6 beats, each a single sentence
  "subjectInteractiveType": one of ${ALLOWED_ENGLISH_INTERACTIVES.join(' | ')},
  "workedExamples": [{ "prompt": string, "steps": string[], "answer": string }],
  "practiceQuestions": [{ "question": string, "answer": string, "explanation": string }],
  "assignmentQuestions": [{ "question": string, "expectedAnswer": string, "acceptedKeywords": string[], "rubric": string }],
  "extensionChallenge": string
}

Constraints:
- 4 to 6 animatedSteps.
- 1 to 2 workedExamples (model PETAL paragraphs or annotated extracts where relevant).
- 2 to 3 practiceQuestions.
- 1 to 2 assignmentQuestions with explicit IB MYP-style rubrics referencing criteria A-D where possible.
- acceptedKeywords are short fragments the student answer should contain — for English, allow phrase-level keywords (e.g. ["rhetorical question", "direct address"]).`;
}

function scienceLessonPrompt(input: GenerateLessonInput): string {
  return `Generate a complete EIS Year 8 science lesson on the topic: "${input.topic}".
${input.strand ? `Strand: ${input.strand}.` : ''}
${input.context ? `Additional context the teacher provided:\n${input.context.slice(0, 1500)}` : ''}

Return JSON matching exactly this schema:
{
  "title": string,
  "subject": "science",
  "strand": string,                    // "Biology", "Chemistry", "Physics", or "Earth & Space"
  "topic": string,
  "inquiryQuestion": string,
  "objectives": string[],
  "studentExplanation": string,
  "teacherNotes": string,
  "animatedSteps": string[],           // 4-6 beats, each a single sentence
  "subjectInteractiveType": one of ${ALLOWED_SCIENCE_INTERACTIVES.join(' | ')},
  "workedExamples": [{ "prompt": string, "steps": string[], "answer": string }],
  "practiceQuestions": [{ "question": string, "answer": string, "explanation": string }],
  "assignmentQuestions": [{ "question": string, "expectedAnswer": string, "acceptedKeywords": string[], "rubric": string }],
  "extensionChallenge": string
}

Constraints:
- 4 to 6 animatedSteps.
- 1 to 2 workedExamples (numerical reasoning OR clear method demonstrations).
- 2 to 3 practiceQuestions.
- 1 to 2 assignmentQuestions with explicit rubrics.
- acceptedKeywords are short fragments (e.g. ["chloroplast", "photosynthesis"]).`;
}

export function assignmentPrompt(input: GenerateAssignmentInput): string {
  const subject = input.subject ?? 'mathematics';
  const count = Math.min(Math.max(input.count ?? 3, 1), 6);
  const inquiry = input.inquiryQuestion ? `Inquiry frame: ${input.inquiryQuestion}` : '';
  const difficulty = `Target difficulty: ${input.difficulty ?? 'core'}.`;

  if (subject === 'english') {
    return `Generate ${count} EIS Year 8 English assignment questions on the topic: "${input.topic}".
${inquiry}
${difficulty}

Return JSON matching exactly this schema:
{
  "topic": string,
  "subject": "english",
  "difficulty": "core" | "support" | "extension",
  "subjectInteractiveType": one of ${ALLOWED_ENGLISH_INTERACTIVES.join(' | ')},
  "questions": [{
    "question": string,
    "expectedAnswer": string,
    "acceptedKeywords": string[],
    "rubric": string
  }]
}`;
  }
  if (subject === 'science') {
    return `Generate ${count} EIS Year 8 science assignment questions on the topic: "${input.topic}".
${inquiry}
${difficulty}

Return JSON matching exactly this schema:
{
  "topic": string,
  "subject": "science",
  "difficulty": "core" | "support" | "extension",
  "subjectInteractiveType": one of ${ALLOWED_SCIENCE_INTERACTIVES.join(' | ')},
  "questions": [{
    "question": string,
    "expectedAnswer": string,
    "acceptedKeywords": string[],
    "rubric": string
  }]
}`;
  }
  return `Generate ${count} EIS Grade 8 maths assignment questions on the topic: "${input.topic}".
${input.unit ? `Unit: ${input.unit}.` : ''}
${inquiry}
${difficulty}

Return JSON matching exactly this schema:
{
  "topic": string,
  "subject": "mathematics",
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
  const subject = input.subject ?? 'mathematics';
  const hint = input.conceptHint ? `Concept hint: ${input.conceptHint}` : '';
  if (subject === 'english') {
    return `A teacher wants the right interactive workshop to anchor this English concept.

Topic: ${input.topic}
${hint}

Pick exactly one workshop id from the allowed set. Justify your choice and outline 4-6 short narration beats.

Return JSON matching exactly:
{
  "subject": "english",
  "subjectInteractiveType": one of ${ALLOWED_ENGLISH_INTERACTIVES.join(' | ')},
  "rationale": string,
  "animatedSteps": string[]
}`;
  }
  if (subject === 'science') {
    return `A teacher wants the right simulation to anchor this science concept.

Topic: ${input.topic}
${hint}

Pick exactly one simulation id from the allowed set. Justify your choice and outline 4-6 short narration beats.

Return JSON matching exactly:
{
  "subject": "science",
  "subjectInteractiveType": one of ${ALLOWED_SCIENCE_INTERACTIVES.join(' | ')},
  "rationale": string,
  "animatedSteps": string[]
}`;
  }
  return `A teacher wants the right 3D scene to anchor this maths concept.

Topic: ${input.topic}
${hint}

Pick exactly one threeDType from the allowed set. Justify your choice and outline 4-6 short narration beats.

Return JSON matching exactly:
{
  "subject": "mathematics",
  "threeDType": one of ${ALLOWED_3D_TYPES.join(' | ')},
  "rationale": string,
  "animatedSteps": string[]
}`;
}
