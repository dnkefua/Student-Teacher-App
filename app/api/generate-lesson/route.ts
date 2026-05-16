import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import { lessonPrompt } from '@/lib/ai/prompts';
import type {
  GenerateLessonInput,
  GeneratedLesson,
  GeneratedAssignmentQuestion,
  GeneratedPracticeQuestion,
  GeneratedWorkedExample,
} from '@/lib/ai/types';
import type { CurriculumUnit, ThreeDType } from '@/lib/grade8Curriculum';
import type { SubjectId } from '@/lib/subjects/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UNITS = new Set<CurriculumUnit>(['numerical', 'abstract', 'spatial', 'data']);
const THREE_D_TYPES = new Set<ThreeDType>([
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
]);
const ENGLISH_INTERACTIVES = new Set<string>([
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
]);
const SCIENCE_INTERACTIVES = new Set<string>([
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
]);

function asStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  if (!v.every((x) => typeof x === 'string')) return null;
  return v as string[];
}

function asWorkedExamples(v: unknown): GeneratedWorkedExample[] | null {
  if (!Array.isArray(v)) return null;
  const out: GeneratedWorkedExample[] = [];
  for (const item of v) {
    if (typeof item !== 'object' || item === null) return null;
    const r = item as Record<string, unknown>;
    if (typeof r.prompt !== 'string' || typeof r.answer !== 'string') return null;
    const steps = asStringArray(r.steps);
    if (!steps) return null;
    out.push({ prompt: r.prompt, steps, answer: r.answer });
  }
  return out;
}

function asPracticeQuestions(v: unknown): GeneratedPracticeQuestion[] | null {
  if (!Array.isArray(v)) return null;
  const out: GeneratedPracticeQuestion[] = [];
  for (const item of v) {
    if (typeof item !== 'object' || item === null) return null;
    const r = item as Record<string, unknown>;
    if (
      typeof r.question !== 'string' ||
      typeof r.answer !== 'string' ||
      typeof r.explanation !== 'string'
    ) {
      return null;
    }
    out.push({ question: r.question, answer: r.answer, explanation: r.explanation });
  }
  return out;
}

function asAssignmentQuestions(v: unknown): GeneratedAssignmentQuestion[] | null {
  if (!Array.isArray(v)) return null;
  const out: GeneratedAssignmentQuestion[] = [];
  for (const item of v) {
    if (typeof item !== 'object' || item === null) return null;
    const r = item as Record<string, unknown>;
    if (typeof r.question !== 'string' || typeof r.expectedAnswer !== 'string' || typeof r.rubric !== 'string') {
      return null;
    }
    const acceptedKeywords = asStringArray(r.acceptedKeywords) ?? [];
    out.push({
      question: r.question,
      expectedAnswer: r.expectedAnswer,
      acceptedKeywords,
      rubric: r.rubric,
    });
  }
  return out;
}

function lessonParser(subject: SubjectId) {
  return (raw: unknown): GeneratedLesson | null => {
    if (typeof raw !== 'object' || raw === null) return null;
    const r = raw as Record<string, unknown>;
    if (
      typeof r.title !== 'string' ||
      typeof r.strand !== 'string' ||
      typeof r.topic !== 'string' ||
      typeof r.inquiryQuestion !== 'string' ||
      typeof r.studentExplanation !== 'string' ||
      typeof r.teacherNotes !== 'string' ||
      typeof r.extensionChallenge !== 'string'
    ) {
      return null;
    }

    const objectives = asStringArray(r.objectives);
    const animatedSteps = asStringArray(r.animatedSteps);
    if (!objectives || !animatedSteps) return null;
    const workedExamples = asWorkedExamples(r.workedExamples);
    const practiceQuestions = asPracticeQuestions(r.practiceQuestions);
    const assignmentQuestions = asAssignmentQuestions(r.assignmentQuestions);
    if (!workedExamples || !practiceQuestions || !assignmentQuestions) return null;

    const base: GeneratedLesson = {
      title: r.title,
      subject,
      strand: r.strand,
      topic: r.topic,
      inquiryQuestion: r.inquiryQuestion,
      objectives,
      studentExplanation: r.studentExplanation,
      teacherNotes: r.teacherNotes,
      animatedSteps,
      workedExamples,
      practiceQuestions,
      assignmentQuestions,
      extensionChallenge: r.extensionChallenge,
    };

    if (subject === 'mathematics') {
      const unit = r.unit as CurriculumUnit | undefined;
      const threeDType = r.threeDType as ThreeDType | undefined;
      if (!unit || !UNITS.has(unit)) return null;
      if (!threeDType || !THREE_D_TYPES.has(threeDType)) return null;
      return { ...base, unit, threeDType };
    }

    const allowedInteractives = subject === 'english' ? ENGLISH_INTERACTIVES : SCIENCE_INTERACTIVES;
    const subjectInteractiveType = r.subjectInteractiveType;
    if (typeof subjectInteractiveType !== 'string' || !allowedInteractives.has(subjectInteractiveType)) {
      return null;
    }
    return { ...base, subjectInteractiveType };
  };
}

function mathsMock(topic: string): GeneratedLesson {
  return {
    title: `Demo lesson · ${topic}`,
    subject: 'mathematics',
    unit: 'abstract',
    strand: 'Algebra',
    topic,
    inquiryQuestion: `What is the most efficient way to reason about ${topic.toLowerCase()}?`,
    objectives: [
      `Define the key terms used in ${topic.toLowerCase()}.`,
      'Apply the technique to at least three different problems.',
      'Verify each answer using a substitution or check step.',
    ],
    studentExplanation:
      'In this lesson we will see the idea step by step, watch a 3D model that makes it visual, and then solve a few practice questions together before you try one on your own.',
    teacherNotes:
      'Anchor the lesson with the matching 3D explainer scene. Pause at the checkpoint to elicit student predictions before revealing each next step.',
    animatedSteps: [
      'Introduce the inquiry question and connect it to the 3D scene.',
      'Walk through the core method one step at a time.',
      'Highlight the key formula and why each piece matters.',
      'Demonstrate a worked example end to end.',
      'Pause for a student checkpoint before the practice round.',
    ],
    threeDType: 'equation_balance_3d',
    workedExamples: [
      {
        prompt: 'Example problem typical for this topic.',
        steps: ['Identify the structure.', 'Apply the technique.', 'Check by substitution.'],
        answer: 'The worked answer goes here.',
      },
    ],
    practiceQuestions: [
      {
        question: 'A short no-stakes practice item.',
        answer: 'Example answer.',
        explanation: 'Why the answer is right, in plain language.',
      },
    ],
    assignmentQuestions: [
      {
        question: 'A grade-able question matching the lesson.',
        expectedAnswer: 'expected answer',
        acceptedKeywords: ['expected', 'answer'],
        rubric: 'Award full marks for correct working AND correct final value. Half marks for correct method only.',
      },
    ],
    extensionChallenge: 'A stretch problem for students who finish early.',
  };
}

function englishMock(topic: string): GeneratedLesson {
  return {
    title: `Demo lesson · ${topic}`,
    subject: 'english',
    strand: 'Reading & Writing',
    topic,
    inquiryQuestion: `What craft choices make this approach to ${topic.toLowerCase()} effective?`,
    objectives: [
      'Identify the techniques the writer uses to shape meaning.',
      'Explain how each technique affects the reader.',
      'Apply at least one technique in your own writing.',
    ],
    studentExplanation:
      'Today we look closely at a short extract, name the writer\'s choices, then practise using one of them in our own paragraph.',
    teacherNotes:
      'Use the text annotation lab for the close-read step. Anchor PETAL responses to two specific quotes from the extract.',
    animatedSteps: [
      'Read the extract aloud and name first impressions.',
      'Annotate the writer\'s techniques in pairs.',
      'Model one PETAL paragraph on the board.',
      'Draft your own paragraph using one of the techniques.',
    ],
    subjectInteractiveType: 'text_annotation_lab',
    workedExamples: [
      {
        prompt: 'Model PETAL paragraph for the chosen quote.',
        steps: ['Point.', 'Evidence.', 'Technique.', 'Analysis.', 'Link back.'],
        answer: 'A model paragraph that earns the top band.',
      },
    ],
    practiceQuestions: [
      {
        question: 'Name two techniques in the extract and explain their effect.',
        answer: 'Sample: rhetorical question + emotive language; together they pull the reader to take a side.',
        explanation: 'Both devices push the reader toward agreement without stating it plainly.',
      },
    ],
    assignmentQuestions: [
      {
        question: 'Write a PETAL paragraph analysing one technique in the extract.',
        expectedAnswer: 'Top-band paragraph with embedded quote and clear analysis.',
        acceptedKeywords: ['rhetorical question', 'direct address', 'emotive'],
        rubric: 'Criteria A: 4 marks for analysis; Criteria B: 4 marks for structure. Top band: quote embedded into the sentence; analysis goes beyond identification.',
      },
    ],
    extensionChallenge: 'Re-write the extract for a different audience. What changes?',
  };
}

function scienceMock(topic: string): GeneratedLesson {
  return {
    title: `Demo lesson · ${topic}`,
    subject: 'science',
    strand: 'Biology',
    topic,
    inquiryQuestion: `What does ${topic.toLowerCase()} tell us about how living systems work?`,
    objectives: [
      'Define the key terms.',
      'Use a diagram or model to explain the process.',
      'Apply the idea to predict an outcome.',
    ],
    studentExplanation:
      'We start with a 3D model of the system, name its parts, then trace what happens at each step. Finally we predict what would change if one part broke.',
    teacherNotes:
      'Use the matching interactive simulation as the anchor. Predict-Observe-Explain is a good routine here.',
    animatedSteps: [
      'Introduce the inquiry question.',
      'Spin the 3D model and label the parts.',
      'Trace the process step by step.',
      'Predict the effect of removing one component.',
    ],
    subjectInteractiveType: 'cell_3d',
    workedExamples: [
      {
        prompt: 'Worked example showing the process end-to-end.',
        steps: ['Identify the inputs.', 'Apply the process.', 'Name the outputs.'],
        answer: 'A model answer with the right scientific vocabulary.',
      },
    ],
    practiceQuestions: [
      {
        question: 'Describe the role of one component in your own words.',
        answer: 'Sample: the nucleus stores DNA and directs protein synthesis.',
        explanation: 'Function follows structure — the nucleus is membrane-bound to protect DNA.',
      },
    ],
    assignmentQuestions: [
      {
        question: 'Predict what happens to the system if one component is removed. Justify scientifically.',
        expectedAnswer: 'A reasoned prediction backed by the model.',
        acceptedKeywords: ['nucleus', 'mitochondria', 'membrane'],
        rubric: 'Top band: clear prediction + 2 scientific reasons + correct vocabulary throughout.',
      },
    ],
    extensionChallenge: 'Design a fair-test experiment to verify your prediction.',
  };
}

function mockForSubject(subject: SubjectId, topic: string): GeneratedLesson {
  if (subject === 'english') return englishMock(topic);
  if (subject === 'science') return scienceMock(topic);
  return mathsMock(topic);
}

export async function POST(request: Request) {
  let body: GenerateLessonInput;
  try {
    body = (await request.json()) as GenerateLessonInput;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body?.topic || typeof body.topic !== 'string') {
    return NextResponse.json({ error: 'Request must include a topic string.' }, { status: 400 });
  }

  const subject: SubjectId = body.subject === 'english' || body.subject === 'science' ? body.subject : 'mathematics';

  const result = await callStructured<GeneratedLesson>({
    userPrompt: lessonPrompt({ ...body, subject }),
    subject,
    mock: mockForSubject(subject, body.topic),
    parse: lessonParser(subject),
  });

  return NextResponse.json(result);
}
