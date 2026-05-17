// EIS Year 8 English — built from the school's real Sequence-of-Learning
// unit plans (Text Book/year8unitplans/). Each unit follows the EIS
// structure: weekly objectives, formative + summative tasks, Tier 2 / 3
// vocabulary, grammar focus, big write task, teacher notes.
//
// Sources:
//   Unit 1 — Media: Advertising (8 weeks)
//   Unit 2 — Novel: Charlie and the Chocolate Factory (Roald Dahl) + Wonder
//   Unit 3 — Poetry: Anthology (Personal & Cultural Expression, 6 weeks)
//   Unit 4 — Language & Film: Our Planet (Netflix documentary)
//   Unit 5 — Drama: The Taming of the Shrew (Shakespeare)

import type { SubjectLesson, SubjectUnit } from '../types';

const ENGLISH = {
  subject: 'english' as const,
  subjectLabel: 'English' as const,
  grade: 'Grade 8' as const,
};

/* ─── Lesson helper ──────────────────────────────────────────────────── */

type LessonInput = Omit<SubjectLesson, 'subject' | 'subjectLabel' | 'grade'>;
function L(input: LessonInput): SubjectLesson {
  return { ...ENGLISH, ...input };
}

/* ─── Unit 1 · Media — Advertising ───────────────────────────────────── */

const UNIT1_ID = 'eis-eng-y8-u1-advertising';

const u1Lessons: SubjectLesson[] = [
  L({
    id: 'eng-y8-u1-w1-persuasive-techniques',
    unitId: UNIT1_ID,
    unitTitle: 'Media · Advertising',
    strand: 'Reading & Writing',
    topic: 'Persuasive techniques',
    title: 'Persuasive devices in advertising',
    inquiryQuestion: 'How do advertisers persuade an audience?',
    keyConcept: 'Communication',
    relatedConcepts: ['Purpose', 'Audience', 'Style'],
    objectives: [
      'Understand the main types of persuasive techniques used in adverts.',
      'Recognise and identify persuasive elements in real adverts.',
      'Begin to assess the effectiveness of persuasive devices.',
    ],
    studentExplanation:
      'Advertisers do not just describe a product — they persuade you to feel something about it. Today we learn the toolkit: logo, slogan, direct address, facts, statistics, repetition and rhetorical questions. We will spot each one in a real advert and decide which works hardest.',
    teacherNotes:
      'Anchor the lesson with a recognisable UAE brand (Emirates, RTA, ADNOC). Use Quizlet for the spelling quiz; the SMILE framework chart is on the department drive. Grammar focus: A.3 modal verbs, B.4 hyphens, A.8 punctuation.',
    animatedSteps: [
      'Define persuasion vs information — the same product can be described two ways.',
      'Introduce 7 core devices: logo, slogan, direct address, facts, statistics, repetition, rhetorical question.',
      'Annotate a single advert as a class — mark every device.',
      'Rate each device 1-5 for effectiveness and justify in pairs.',
    ],
    interactiveType: 'text_annotation_lab',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'What is the difference between a slogan and a tagline?',
        answer: 'A slogan is a short memorable phrase used in marketing; a tagline is the brand\'s long-term identifier across campaigns.',
      },
      {
        id: 'p2',
        type: 'multiple_choice',
        question: 'Which device asks the reader a question to make them think?',
        choices: ['Slogan', 'Rhetorical question', 'Statistic', 'Logo'],
        answer: 'Rhetorical question',
      },
      {
        id: 'p3-myp-ethos',
        type: 'multiple_choice',
        question: 'Which rhetorical appeal relies on demonstrating authority, expertise or trust?',
        choices: ['Ethos', 'Pathos', 'Logos', 'Kairos'],
        answer: 'Ethos',
        explanation:
          'Ethos = credibility. A doctor recommending a brand, an Olympic athlete wearing a kit, or a celebrity chef cooking with a product are all ethos appeals.',
      },
      {
        id: 'p4-myp-pathos',
        type: 'multiple_choice',
        question: 'A slogan that reads "Life\'s too short to be average" primarily uses which appeal?',
        choices: ['Logos · logic', 'Pathos · feeling', 'Ethos · trust', 'Anecdote'],
        answer: 'Pathos · feeling',
        explanation:
          'It works on emotion through hyperbole — exaggerating the cost of being "average" to provoke desire for the product.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Choose any print or digital advert and analyse THREE persuasive devices it uses. For each device, explain WHAT it is, WHERE it appears, and WHY it persuades a target audience.',
        rubric:
          'Full marks: 3 clearly named devices, accurate placement, and an explanation that links the device to a specific target audience and intended response. Half marks: device named and located but explanation is vague.',
        marks: 9,
      },
    ],
    extensionChallenge:
      'Find an advert that BREAKS one of the persuasive rules deliberately (e.g. an honest ad, an anti-ad). Why did the agency choose to do that?',
  }),

  L({
    id: 'eng-y8-u1-w2-print-vs-visual',
    unitId: UNIT1_ID,
    unitTitle: 'Media · Advertising',
    strand: 'Reading & Writing',
    topic: 'Print vs visual elements',
    title: 'Visual + textual synergy in adverts',
    inquiryQuestion: 'How do words and pictures work together to amplify a message?',
    keyConcept: 'Communication',
    relatedConcepts: ['Style', 'Audience', 'Purpose'],
    objectives: [
      'Compare visual and textual elements in print adverts.',
      'Understand how synergy between visuals and text makes advertising effective.',
      'Evaluate which side carries the most persuasive weight in a chosen advert.',
    ],
    studentExplanation:
      'A great advert is never just words OR pictures — it is the way they LIFT each other. A red Ferrari plus the word "Tomorrow" implies something different from a red Ferrari plus the word "Forever". This lesson teaches us to read both layers at once.',
    teacherNotes:
      'Use the brand-war exemplars (Pepsi vs Coca-Cola, Audi vs BMW, ALDI vs M&S). Grammar focus: A.4 cohesive devices, A.8 punctuation, C.2 verb prefixes. Big Write: analytical paragraph on ONE chosen advert.',
    animatedSteps: [
      'Show a print advert with the text covered — what do you infer from the image alone?',
      'Show the text with the image covered — what changes?',
      'Reveal both and discuss the SYNERGY — how does each amplify the other?',
      'Introduce vocabulary: connotation, inference, juxtaposition, amplify, exaggerate.',
      'Write one paragraph evaluating the synergy in a chosen advert.',
    ],
    interactiveType: 'text_annotation_lab',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Give an example of an advert where the image and text contrast deliberately. What effect does the juxtaposition create?',
        answer: 'Sample: Dove "Real Beauty" — soft natural photography paired with bold text confronting beauty standards. The juxtaposition makes the message feel honest rather than sales-driven.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write an analytical paragraph (PETAL structure) evaluating the effectiveness of one print advert. Discuss the visual AND textual elements and decide which carries the persuasive weight.',
        rubric:
          'Top band: Point clearly states which element dominates; quoted/described evidence from both visual and text; explanation links to audience response; sophisticated vocabulary (connotation, juxtaposition, amplify); cohesive devices throughout.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Redesign a famous advert so the TEXT does the heavy lifting and the image takes second place. Explain what you changed and why.',
  }),

  L({
    id: 'eng-y8-u1-w6-create-an-advert',
    unitId: UNIT1_ID,
    unitTitle: 'Media · Advertising',
    strand: 'Writing & Speaking',
    topic: 'Original advertisement design',
    title: 'Design and pitch your own advert',
    inquiryQuestion: 'How do you convince an audience to choose YOUR product?',
    keyConcept: 'Creativity',
    relatedConcepts: ['Purpose', 'Audience', 'Style'],
    objectives: [
      'Create an original advertisement that effectively communicates a chosen message.',
      'Demonstrate understanding of how visual and textual elements convey purpose.',
      'Present and justify creative choices to a peer audience.',
    ],
    studentExplanation:
      'Now you become the advertiser. Invent a product, identify its audience, and design an advert that puts the techniques we have studied to work. Then pitch it to the class and defend your decisions.',
    teacherNotes:
      'Allow 50 min for design and 5 min per group pitch. Encourage at least 4 of the studied techniques to appear. Grammar focus: A.7 subject-verb agreement. AW: presentations can take longer than expected — budget 2 lessons.',
    animatedSteps: [
      'Brainstorm an original product and define the target audience in one sentence.',
      'Pick 4 persuasive techniques to anchor the advert.',
      'Draft the visual + textual layout on paper or slides.',
      'Pitch to the class — defend WHY you chose each technique.',
      'Receive peer feedback against the persuasive-techniques checklist.',
    ],
    interactiveType: 'writing_revision_studio',
    modality: 'writing_workshop',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Why is identifying the target audience BEFORE writing the advert essential?',
        answer: 'Because every choice (tone, register, image, slogan) is calibrated to the audience\'s values, vocabulary and habits. The same product needs different adverts for different buyers.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Design an original advert for an original product. Submit (a) the advert itself and (b) a 100-word designer\'s statement naming the 4 persuasive techniques you used and why.',
        rubric:
          'Top band: Advert is coherent and visually clear; 4+ techniques deployed and named in the statement; clear sense of target audience; the statement justifies every choice.',
        marks: 15,
      },
    ],
    extensionChallenge:
      'Re-pitch your advert for a completely different demographic. What stays? What flips?',
  }),

  L({
    id: 'eng-y8-u1-w7-summative-analysis',
    unitId: UNIT1_ID,
    unitTitle: 'Media · Advertising',
    strand: 'Reading',
    topic: 'Analytical response — summative',
    title: 'Summative analysis of an advert',
    inquiryQuestion: 'Can you analyse an advert sharply, with evidence?',
    keyConcept: 'Communication',
    relatedConcepts: ['Purpose', 'Audience', 'Style'],
    objectives: [
      'Apply analytical skills to an unseen advertisement.',
      'Demonstrate accurate use of subject vocabulary and persuasive devices.',
      'Write a controlled response with strong structure and coherence.',
    ],
    studentExplanation:
      'This is the summative for the unit. You will analyse one advert across multiple devices, using PETAL paragraphs and the academic vocabulary we have built up over the unit.',
    teacherNotes:
      'Grammar focus: A.8 punctuation, A.10 coherence + cohesion, B.1 semicolons / colons / dashes. Criteria A & B (analysing, interpreting). Use a fresh unseen advert; do not pre-teach it.',
    animatedSteps: [
      'Skim the advert and note your first impression.',
      'Identify the target audience in one line.',
      'Bullet-list 4-6 persuasive devices and pick the 3 strongest.',
      'Plan PETAL paragraphs around each chosen device.',
      'Write the response; embed quotes; finish with an evaluation of overall effectiveness.',
    ],
    interactiveType: 'essay_planner',
    modality: 'writing_workshop',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Define the PETAL structure.',
        answer: 'Point · Evidence · Technique · Analysis · Link. A scaffold for analytical paragraphs in IB MYP English.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Analyse the effectiveness of the supplied advertisement. Use at least 3 PETAL paragraphs. Embed accurate technique vocabulary and explain WHO the advert is for and WHY it works.',
        rubric:
          'Criteria A (analysing): 8 marks; Criteria B (organisation): 8 marks. Top band: precise technique vocabulary, layered analysis (not just identification), clear sense of audience, paragraphs cohere into an argument with a final evaluation.',
        marks: 16,
      },
    ],
    extensionChallenge:
      'Could the same advert work in a different country? Argue your case in one extra paragraph.',
  }),
];

/* ─── Unit 2 · Novel — Charlie and the Chocolate Factory + Wonder ────── */

const UNIT2_ID = 'eis-eng-y8-u2-novel';

const u2Lessons: SubjectLesson[] = [
  L({
    id: 'eng-y8-u2-w1-characterisation',
    unitId: UNIT2_ID,
    unitTitle: 'Novel · Charlie and the Chocolate Factory',
    strand: 'Reading',
    topic: 'Characterisation',
    title: 'How Dahl builds Charlie',
    inquiryQuestion: 'How does Roald Dahl shape our view of Charlie across chapters?',
    keyConcept: 'Identity',
    relatedConcepts: ['Perspective', 'Style', 'Theme'],
    objectives: [
      'Explore characterisation in a prose text across chapters.',
      'Analyse the impact of characterisation on a reader\'s interpretation.',
    ],
    studentExplanation:
      'Roald Dahl never says "Charlie is kind" — he SHOWS it through what Charlie does, what he says, and what he gives up. This lesson teaches us to read characterisation closely and to write back in the same voice.',
    teacherNotes:
      'Use the red-box key character spelling routine. Grammar focus: B.2 colons for lists, B.3 punctuation of bullet points, A.8 punctuation. AWO: diary entry due after the half term holiday.',
    animatedSteps: [
      'Define characterisation: direct vs indirect.',
      'Read the chapter where Charlie shares his birthday chocolate. Annotate Dahl\'s choices.',
      'Build a list of adjectives that Dahl earns without using.',
      'Draft a diary entry FROM Charlie about wanting a golden ticket — write IN the same voice.',
    ],
    interactiveType: 'character_analysis_board',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Give one example of indirect characterisation from the chocolate-sharing chapter and explain what it reveals.',
        answer: 'Charlie cuts the chocolate into tiny pieces to make it last for his family — indirect, but reveals patience, generosity, and an awareness of scarcity.',
      },
      {
        id: 'p2-myp-clauses',
        type: 'multiple_choice',
        question: 'Identify the MAIN clause in: "Because the rain stopped, we decided to walk outside."',
        choices: [
          'Because the rain stopped',
          'we decided to walk outside',
          'the rain stopped',
          'to walk outside',
        ],
        answer: 'we decided to walk outside',
        explanation:
          'A main (independent) clause makes sense on its own. "We decided to walk outside" stands alone; "Because the rain stopped" is subordinate.',
      },
      {
        id: 'p3-myp-subjunctive',
        type: 'short_answer',
        question: 'Rewrite the indicative sentence "He is going to school" in the SUBJUNCTIVE mood to express a wish.',
        answer:
          'I wish that he WERE at home right now. (Subjunctive uses "were" for all persons in wish-statements.)',
        explanation:
          'The subjunctive mood is used for wishes, hypotheticals and demands. Note "were", not "was" — this is the marker that proves the subjunctive is intentional.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write a diary entry from Charlie\'s perspective the night before the golden-ticket announcement. Use first-person narration and at least three pieces of evidence drawn directly from the novel.',
        rubric:
          'Top band: voice is unmistakably Charlie\'s; three textually accurate references woven naturally; diary conventions correctly used (date, salutation, reflective tone).',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Rewrite the same diary entry from Veruca Salt\'s perspective. What changes in the voice tells us the most about characterisation as a craft?',
  }),

  L({
    id: 'eng-y8-u2-w3-themes-narrative-techniques',
    unitId: UNIT2_ID,
    unitTitle: 'Novel · Charlie and the Chocolate Factory',
    strand: 'Reading & Writing',
    topic: 'Themes & narrative techniques',
    title: 'Recognising themes across a narrative',
    inquiryQuestion: 'How do recurring themes turn separate scenes into one story?',
    keyConcept: 'Theme',
    relatedConcepts: ['Style', 'Perspective', 'Symbol'],
    objectives: [
      'Recognise themes in narratives across chapters.',
      'Analyse literary techniques used to convey themes.',
      'Reinforce understanding of narrative techniques (simile, onomatopoeia).',
    ],
    studentExplanation:
      'A theme is the question a book keeps asking. We will trace the themes that thread through Dahl\'s chapters and learn the techniques he uses to keep them alive — repetition, contrast, symbol, simile.',
    teacherNotes:
      'Grammar focus: B.1 semi-colons / colons / dashes between independent clauses, A.2 clauses, A.5 figurative language. Big Write: third-person descriptive paragraph.',
    animatedSteps: [
      'Define theme — distinguish from plot.',
      'Brainstorm themes in CATCF: family, greed, fairness, dreaming.',
      'Pick ONE theme and trace it through three chapters using a dual-coded chart.',
      'Identify the literary techniques Dahl uses to carry that theme.',
      'Draft a third-person descriptive paragraph that EXPRESSES one of those themes.',
    ],
    interactiveType: 'text_annotation_lab',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'How does Dahl use the contrast between Charlie\'s home and the Factory to develop the theme of dreaming?',
        answer: 'The cramped, cold home heightens every detail of the Factory — colour, sound, abundance. The contrast turns the Factory into a literal dream space, not just a setting.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write a third-person descriptive paragraph that captures ONE chosen theme from the novel. Use at least one simile, one piece of onomatopoeia, and one semicolon-linked sentence.',
        rubric:
          'Top band: theme is clearly carried by craft choices; figurative language earns its place rather than being decorative; punctuation accurate; voice consistent.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Read a one-page extract from R.J. Palacio\'s Wonder. Identify ONE theme it shares with CATCF. How is it carried differently?',
  }),

  L({
    id: 'eng-y8-u2-w6-summative-descriptive',
    unitId: UNIT2_ID,
    unitTitle: 'Novel · Charlie and the Chocolate Factory + Wonder',
    strand: 'Writing',
    topic: 'Narrative style — summative',
    title: 'Descriptive writing summative',
    inquiryQuestion: 'Can you write description that carries a feeling without naming it?',
    keyConcept: 'Style',
    relatedConcepts: ['Mood', 'Imagery', 'Perspective'],
    objectives: [
      'Recognise and explore different narrative styles.',
      'Analyse the effect of narrative style on storytelling.',
      'Complete a descriptive writing entry for the summative assessment.',
    ],
    studentExplanation:
      'Description is not decoration — it is feeling, made of details. Today\'s summative asks you to write a descriptive, first-person account of August seeing his family cry after the death of Daisy (from Wonder). Show, do not tell.',
    teacherNotes:
      'Grammar focus: A.7 subject-verb agreement, A.8 punctuation, A.10 coherence. Criteria C & D. Two scheduled UAE public holidays in this window — adjust pacing.',
    animatedSteps: [
      'Re-read the Daisy scene and underline three sensory details.',
      'List feelings that are NOT named in the text but are clearly present.',
      'Plan a paragraph that carries each feeling using a different sense.',
      'Draft, then revise for cohesion, punctuation and subject-verb accuracy.',
    ],
    interactiveType: 'writing_revision_studio',
    modality: 'writing_workshop',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Explain what "Show, don\'t tell" means with one short example.',
        answer: 'Show vs tell: replace "I was scared" with "My fingers shook against the doorframe and I could hear my own breath." The reader infers the feeling rather than being told it.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write a first-person descriptive account of August watching his family cry after Daisy\'s death. Do NOT name the emotions directly — show them through detail, action and sensory language. 250-350 words.',
        rubric:
          'Criteria C (producing text): 8 marks; Criteria D (use of language): 8 marks. Top band: precise sensory detail; controlled pacing; emotional weight carried without telling; cohesive punctuation and varied sentence structure.',
        marks: 16,
      },
    ],
    extensionChallenge:
      'Rewrite your strongest paragraph in THIRD person. Which version feels more honest? Why?',
  }),
];

/* ─── Unit 3 · Poetry — Anthology (Personal & Cultural Expression) ───── */

const UNIT3_ID = 'eis-eng-y8-u3-poetry';

const u3Lessons: SubjectLesson[] = [
  L({
    id: 'eng-y8-u3-w1-elements-of-poetry',
    unitId: UNIT3_ID,
    unitTitle: 'Poetry · Anthology (Personal & Cultural Expression)',
    strand: 'Reading & Writing',
    topic: 'Elements of poetry',
    title: 'Basic elements of poetry',
    inquiryQuestion: 'What makes a poem a poem?',
    keyConcept: 'Style',
    relatedConcepts: ['Voice', 'Form', 'Sound'],
    objectives: [
      'Understand the basic elements of poetry: stanza, verse, rhyme, rhythm.',
      'Recognise different forms and styles of poetry.',
      'Begin analysing how poets use language deliberately.',
    ],
    studentExplanation:
      'A poem is built from STRUCTURE and SOUND working together. Today we name the building blocks — stanza, verse, rhyme, rhythm — and spot how a poem like "Mr. Nobody" uses an ABCB rhyme scheme to make its mystery feel light.',
    teacherNotes:
      'Use Seigal\'s "I Don\'t Like Poetry" as the warm-up. Then "Mr. Nobody" (Anonymous). Grammar focus: B.3 punctuation of bullet points, C.1 noun → verb conversion. AWO: poem-writing task due commencement 6 January.',
    animatedSteps: [
      'Quiz the spellings: poem, rhyme, verse, stanza, simile, metaphor, alliteration, onomatopoeia.',
      'Read Seigal\'s "I Don\'t Like Poetry" — what tone, what feeling?',
      'Read "Mr. Nobody" — label the stanzas and the ABCB rhyme.',
      'Discuss why ABCB feels different from AABB.',
      'Draft your own short poem using at least 3 techniques. Challenge: use ABAB or ABCB.',
    ],
    interactiveType: 'poetry_device_highlighter',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'multiple_choice',
        question: 'What is an ABCB rhyme scheme?',
        choices: [
          'Every line rhymes with the line before it.',
          'Lines 1 and 3 rhyme; lines 2 and 4 rhyme.',
          'Lines 2 and 4 rhyme; lines 1 and 3 do not.',
          'No lines rhyme.',
        ],
        answer: 'Lines 2 and 4 rhyme; lines 1 and 3 do not.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Compose a poem (at least two stanzas, four lines each) that uses a variety of key techniques. Challenge: use an ABAB or ABCB rhyme scheme. Annotate the techniques you used.',
        rubric:
          'Top band: clear stanza structure, at least 3 techniques deployed with intent, rhyme scheme accurate when attempted, brief annotation justifies each choice.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Rewrite your poem in free verse (no rhyme, no fixed metre). What is gained? What is lost?',
  }),

  L({
    id: 'eng-y8-u3-w2-identity-poetry',
    unitId: UNIT3_ID,
    unitTitle: 'Poetry · Anthology',
    strand: 'Reading & Writing',
    topic: 'Identity & cultural expression',
    title: 'Sheikh Mohammed & Adam Mohammed — poems of identity',
    inquiryQuestion: 'How do poets express pride, conflict and cultural identity?',
    keyConcept: 'Identity',
    relatedConcepts: ['Culture', 'Voice', 'Tone'],
    objectives: [
      'Identify and analyse poetic devices that convey happiness, pride and cultural identity.',
      'Explore the purpose behind Sheikh Mohammed bin Rashid Al Maktoum\'s writing of "Happiest Nation".',
      'Analyse how living between two contrasting cultures affects the speaker\'s identity.',
    ],
    studentExplanation:
      'Poets carry whole cultures in a handful of lines. "Happiest Nation" by Sheikh Mohammed celebrates national pride; "Untitled" by Adam Mohammed wrestles with the tension of living between two cultures. We read both for the techniques that make the feeling land.',
    teacherNotes:
      'Grammar focus: A.2 clauses, A.5 figurative language. Big Write: analytical paragraph on Adam Mohammed\'s conflict of cultural identity. Video of Adam Mohammed\'s poem is in further reading.',
    animatedSteps: [
      'Read "Happiest Nation" aloud. What feelings does it INVITE the reader to share?',
      'Annotate the devices: hyperbole, allusion, rhetorical question, mood.',
      'Read Adam Mohammed\'s "Untitled". What does it imply about belonging to two cultures?',
      'Compare the two poets\' purposes side by side.',
      'Draft an analytical paragraph on the conflict of cultural identity in "Untitled".',
    ],
    interactiveType: 'poetry_device_highlighter',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Define hyperbole and explain why Sheikh Mohammed uses it in "Happiest Nation".',
        answer: 'Hyperbole is deliberate exaggeration for emphasis. In "Happiest Nation" it elevates national pride to a near-mythic scale — the reader is invited to share an unshakeable joy.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write an analytical paragraph on Adam Mohammed\'s "Untitled". Focus on how he conveys the conflict of cultural identity. Use PETAL and quote at least two devices.',
        rubric:
          'Top band: precise device labels (hyperbole, allusion, rhetorical question, enjambment); quotes embedded into the analysis; clear sense that the speaker is BETWEEN two cultures rather than rejecting either; sophisticated tone.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Write four lines of your own poetry that capture a tension of identity you have felt (or observed). Mark the technique you used.',
  }),

  L({
    id: 'eng-y8-u3-w3-social-justice-poetry',
    unitId: UNIT3_ID,
    unitTitle: 'Poetry · Anthology',
    strand: 'Reading & Writing',
    topic: 'Social justice in poetry',
    title: 'Agard & Zephaniah — poems of empathy',
    inquiryQuestion: 'How do poets use irregular form and sound to advocate for justice?',
    keyConcept: 'Communication',
    relatedConcepts: ['Voice', 'Sound', 'Tone'],
    objectives: [
      'Discuss how irregular line breaks, lack of punctuation, and unique rhythm reinforce a poem\'s themes.',
      'Understand how sound devices contribute to a poem\'s impact.',
      'Explore how language and tone evoke empathy and shared humanity.',
      'Understand the role of literature in advocating for social justice and compassion.',
    ],
    studentExplanation:
      'John Agard\'s "Half-Caste" REFUSES to be tidy — and that is the point. Benjamin Zephaniah\'s "We Refugees" pulls the reader into a shared humanity using colloquialism and a steady rhythm. We learn to read form as meaning.',
    teacherNotes:
      'Grammar focus: A.6 sentence mood (indicative / imperative / subjunctive), A.8 punctuation, B.1 colons / semicolons / dashes. Formative assessment: PETAL on "We Refugees". UNICEF teaching activities + Zephaniah video in further reading.',
    animatedSteps: [
      'Read "Half-Caste" aloud — note where the punctuation refuses to settle.',
      'Discuss: how does form mirror the speaker\'s argument?',
      'Read "We Refugees" — track the contractions, colloquialisms, and tone shifts.',
      'Practise sentence mood: identify an indicative, imperative and subjunctive line in either poem.',
      'Draft a PETAL paragraph on "We Refugees".',
    ],
    interactiveType: 'poetry_device_highlighter',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'How does the lack of standard punctuation in "Half-Caste" support the speaker\'s argument?',
        answer: 'The missing punctuation refuses the idea that the speaker — or the speaker\'s identity — can be neatly contained. Form mirrors meaning.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write an analytical PETAL paragraph on Benjamin Zephaniah\'s "We Refugees". Focus on how language and tone evoke empathy. Embed two quotes.',
        rubric:
          'Top band: clear PETAL structure; identifies devices accurately (colloquialism, contraction, rhythm); explains HOW tone produces empathy rather than just naming it; uses subject vocabulary (tone, subtext, social justice).',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Explore one UNICEF teaching activity on refugees. Connect ONE statistic from it to a line in Zephaniah\'s poem.',
  }),

  L({
    id: 'eng-y8-u3-w4-displacement-nichols',
    unitId: UNIT3_ID,
    unitTitle: 'Poetry · Anthology',
    strand: 'Reading & Writing',
    topic: 'Displacement & belonging',
    title: 'Grace Nichols — Island Man & Wherever I Hang',
    inquiryQuestion: 'How do memories of place shape personal identity?',
    keyConcept: 'Identity',
    relatedConcepts: ['Culture', 'Memory', 'Voice'],
    objectives: [
      'Understand how personal and cultural identity can be shaped by memory and attachment to place.',
      'Analyse how Nichols uses techniques to convey cultural adjustment and belonging.',
      'Explore themes of exile, displacement and nostalgia.',
      'Develop skills in group work analysis.',
    ],
    studentExplanation:
      'Grace Nichols moves between Caribbean sunlight and London grey, and her poems carry both. We will read "Island Man" as a group and "Wherever I Hang" independently, then compare how she uses sound and image to make displacement feel real.',
    teacherNotes:
      'Group work week. Grammar focus: A.4 cohesive devices, A.10 coherence + cohesion. Big Write: students compose their own poem about moving to Dubai. Live WCF (whole-class feedback) potential.',
    animatedSteps: [
      'Group read "Island Man" aloud — pass each line round.',
      'Annotate: where does the poem move from dream to reality? What sound shift signals it?',
      'Independently read "Wherever I Hang" — identify how Nichols carries diaspora in everyday detail.',
      'Compare both poems against Agard\'s "Half-Caste" — what do all three share?',
      'Draft your own short poem about moving to Dubai.',
    ],
    interactiveType: 'text_annotation_lab',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'In "Island Man", what is the role of the sound shift between dawn and London traffic?',
        answer: 'It enacts displacement on the page — the body wakes in one place while the imagination is still on the island. Sound carries the dislocation faster than description could.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write your own poem (at least 12 lines) about your experience of moving to — or living in — Dubai. Use at least one cohesive device, one piece of figurative language, and one sound device.',
        rubric:
          'Top band: voice feels honest; techniques chosen with intent; cohesion drives a single feeling; punctuation accurate. Bonus: a short reflection naming what you DID and WHY.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Watch a short video on descriptive writing OR "Show, don\'t tell". Apply ONE idea to revise your poem.',
  }),

  L({
    id: 'eng-y8-u3-w5-presents-haiku',
    unitId: UNIT3_ID,
    unitTitle: 'Poetry · Anthology',
    strand: 'Reading & Writing',
    topic: 'Dual identity & haiku',
    title: 'Moniza Alvi & writing your own haikus',
    inquiryQuestion: 'How can the smallest form (the haiku) carry the biggest themes?',
    keyConcept: 'Style',
    relatedConcepts: ['Identity', 'Form', 'Imagery'],
    objectives: [
      'Identify and interpret imagery and symbolism in "Presents from My Aunt in Pakistan".',
      'Reflect on the speaker\'s struggle to reconcile Pakistani and British identities.',
      'Identify the 5-7-5 syllable structure of haikus.',
      'Write haikus reflecting your own cultural background or personal experiences.',
    ],
    studentExplanation:
      'Moniza Alvi\'s "Presents from My Aunt in Pakistan" is built from clothes — but really it is built from a teenager pulled between two cultures. Then we shrink the form down to the haiku and try to carry our own identity in 17 syllables.',
    teacherNotes:
      'Group close-read of Alvi. Grammar focus: A.3 modal verbs, A.4 cohesion, A.5 figurative language. Big Write: original haikus (classroom display). BBC Bitesize link for haiku scaffolding.',
    animatedSteps: [
      'Read Alvi together. Annotate the colours, textures and weights of the clothes.',
      'Discuss: how do material objects symbolise dual identity?',
      'Introduce the haiku form: 5-7-5 syllables.',
      'Draft three haikus reflecting an aspect of your own identity.',
      'Read them aloud — workshop one for the classroom display.',
    ],
    interactiveType: 'poetry_device_highlighter',
    modality: 'writing_workshop',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Count the syllables: "Quiet evening light / a sparrow rests on the rail / I belong to both." Is it a haiku?',
        answer: '5 / 7 / 5 — yes, this is a haiku.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write three original haikus that reflect aspects of your cultural background or personal experience. Annotate the syllable count for each line.',
        rubric:
          'Top band: syllables accurate; imagery is concrete (not abstract); each haiku carries one clear moment or feeling; the set has variety.',
        marks: 9,
      },
    ],
    extensionChallenge:
      'Write a fourth haiku that BREAKS the 5-7-5 rule in one line for deliberate effect. Explain the break.',
  }),

  L({
    id: 'eng-y8-u3-w6-summative-original-poem',
    unitId: UNIT3_ID,
    unitTitle: 'Poetry · Anthology',
    strand: 'Writing',
    topic: 'Summative original poem',
    title: 'Original poem on personal or cultural experience',
    inquiryQuestion: 'Can you apply everything you have learned to write one honest poem?',
    keyConcept: 'Identity',
    relatedConcepts: ['Voice', 'Style', 'Memory'],
    objectives: [
      'Interpret imagery and symbolism as a metaphor for language and identity (Bhatt, "Search For My Tongue").',
      'Discuss how poets across cultures and eras grapple with shared questions about life, death and legacy.',
      'Apply knowledge of poetic elements and techniques in personal writing.',
      'Craft a poem that reflects personal or cultural experiences.',
    ],
    studentExplanation:
      'You have read poets from across the world this term. Now you write your own. The summative is a single original poem reflecting on a personal or cultural experience, controlled by the techniques you have built up.',
    teacherNotes:
      'Grammar focus: A.5 figurative language, A.8 punctuation, A.10 coherence + cohesion. Summative criteria B, C & D. Place the summative on a Thursday. Close-read Bhatt\'s "Search For My Tongue" and Abu Nawas\' "The Last Poem" in the run-up.',
    animatedSteps: [
      'Re-read your favourite poem from the unit and underline the technique that hit hardest.',
      'Free-write for 5 minutes on a personal or cultural memory.',
      'Pick the three sharpest images from the free-write.',
      'Draft a poem of at least 12 lines using those images and at least 3 techniques.',
      'Revise for coherence, cohesion and accurate punctuation.',
    ],
    interactiveType: 'writing_revision_studio',
    modality: 'writing_workshop',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Why does Bhatt use both English and Gujarati script in "Search For My Tongue"?',
        answer: 'The two scripts on the page enact the speaker\'s bilingual life — the poem cannot fully exist in one language alone.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write an original poem (at least 12 lines) reflecting on a personal or cultural experience. Use at least 3 techniques and explain your choices in a short reflection (4-6 lines).',
        rubric:
          'Criteria B (organising): 8; C (producing text): 8; D (use of language): 8. Top band: clear voice; technique deployed with intent; coherence across stanzas; the reflection names what you did and why.',
        marks: 24,
      },
    ],
    extensionChallenge:
      'Translate your poem into your home language (or another language you know). Note what changes — what gets stronger, what disappears.',
  }),
];

/* ─── Unit 4 · Language & Film — Our Planet ──────────────────────────── */

const UNIT4_ID = 'eis-eng-y8-u4-our-planet';

const u4Lessons: SubjectLesson[] = [
  L({
    id: 'eng-y8-u4-w1-film-techniques',
    unitId: UNIT4_ID,
    unitTitle: 'Language & Film · Our Planet',
    strand: 'Reading & Speaking',
    topic: 'Introduction to film techniques',
    title: 'Reading a documentary like a text',
    inquiryQuestion: 'How does Our Planet make us care about sustainability?',
    keyConcept: 'Communication',
    relatedConcepts: ['Audience', 'Purpose', 'Mood'],
    objectives: [
      'Identify and understand key film techniques.',
      'Explore how documentaries connect audiences to global issues.',
      'Understand film techniques through storyboarding.',
      'Examine the purpose and impact of film techniques in creating meaning.',
    ],
    studentExplanation:
      'A documentary uses the same toolkit as a poem — pace, repetition, tone — but adds camera, sound and narration. Today we read Our Planet by Netflix the way we would read a poem, then storyboard our own scene.',
    teacherNotes:
      'Ramadan timing — 30 min lessons. Grammar focus: B.3 punctuation of bullet points. Big Write: a storyboard of a short sustainability scene. Trailer + Unit 4 learning guide in further reading.',
    animatedSteps: [
      'Watch the Our Planet trailer with no sound. What do you predict?',
      'Watch it again with sound. What did the soundtrack add?',
      'Introduce film vocabulary: long shot, close-up, zoom-out, tracking shot, diegetic sound.',
      'Storyboard a 6-frame scene that conveys ONE environmental theme.',
    ],
    interactiveType: 'story_structure_map',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Define diegetic sound and give one example from a documentary you have watched.',
        answer: 'Diegetic sound exists within the world of the scene (wind, footsteps, animal calls). Example: the wing-beats of a flock of starlings inside an Our Planet sequence.',
      },
      {
        id: 'p2-myp-non-diegetic',
        type: 'multiple_choice',
        question: 'A sweeping orchestral score plays as a polar bear walks across the ice. The bear cannot hear it. What kind of sound is this?',
        choices: ['Diegetic', 'Non-diegetic', 'Voiceover', 'Foley'],
        answer: 'Non-diegetic',
        explanation:
          'Non-diegetic sound sits outside the world of the scene — added by the editor to shape audience emotion. Diegetic sound exists inside the scene; voiceover is a narrator speaking over the action.',
      },
      {
        id: 'p3-myp-storyboard',
        type: 'short_answer',
        question: 'In a 3-frame sustainability storyboard — Wide → Close-up → ECU — what does each shot type do for the argument?',
        answer:
          'Wide establishes the unspoiled environment (audience trusts what is at stake). Close-up introduces the threat (audience focuses on the agent). ECU on a struggling animal\'s eye creates accountability — the audience cannot look away.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Create a 6-frame storyboard for a short Our-Planet-style scene about a local UAE environmental issue. Annotate which technique each frame uses and why.',
        rubric:
          'Top band: scene has narrative arc; techniques chosen with purpose; annotations name and justify each choice; theme is clear and specific.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Rewrite the same storyboard for a 30-second TikTok. What changes?',
  }),

  L({
    id: 'eng-y8-u4-w3-letter-of-reflection',
    unitId: UNIT4_ID,
    unitTitle: 'Language & Film · Our Planet',
    strand: 'Writing',
    topic: 'DAFOREST + persuasive letter',
    title: 'Writing a letter to Sheikh Mohammed bin Zayed Al Nahyan',
    inquiryQuestion: 'How can a film make us speak up?',
    keyConcept: 'Communication',
    relatedConcepts: ['Purpose', 'Audience', 'Voice'],
    objectives: [
      'Develop a deeper understanding of the relationship between film techniques, theme and audience.',
      'Analyse how Our Planet addresses global issues through storytelling and visuals.',
      'Reflect on how global issues can resonate personally and culturally.',
    ],
    studentExplanation:
      'After watching key Our Planet scenes, we use D.A.F.O.R.E.S.T. (Direct address, Alliteration, Facts, Opinions, Rhetorical questions, Emotive language, Statistics, Triples) to compose a respectful, well-argued letter to His Highness about an environmental issue.',
    teacherNotes:
      'Grammar focus: A.10 coherence + cohesion via varied sentence structures. BBC Bitesize letter-writing scaffold in further reading.',
    animatedSteps: [
      'Spell + define DAFOREST.',
      'Watch one Our Planet sequence with David Attenborough narration. Annotate the narration\'s DAFOREST devices.',
      'Plan a respectful letter: greeting, context, evidence, recommendation, sign-off.',
      'Draft 250-350 words.',
      'Revise for varied sentence structure and accurate cohesion.',
    ],
    interactiveType: 'essay_planner',
    modality: 'writing_workshop',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'What does DAFOREST stand for?',
        answer: 'Direct address, Alliteration, Facts, Opinions, Rhetorical question, Emotive language, Statistics, Triples (rule of three).',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write a respectful, formal letter to Sheikh Mohammed bin Zayed Al Nahyan reflecting on one global issue raised in Our Planet. Use at least four DAFOREST devices. 250-350 words.',
        rubric:
          'Top band: tone is appropriate to the audience; 4+ devices deployed with intent; coherent paragraph structure; varied sentence types; respectful sign-off.',
        marks: 16,
      },
    ],
    extensionChallenge:
      'Adapt your letter into a one-minute speech. What stays? What changes for the ear?',
  }),
];

/* ─── Unit 5 · Drama — The Taming of the Shrew ───────────────────────── */

const UNIT5_ID = 'eis-eng-y8-u5-taming-shrew';

const u5Lessons: SubjectLesson[] = [
  L({
    id: 'eng-y8-u5-w1-drama-conventions',
    unitId: UNIT5_ID,
    unitTitle: 'Drama · The Taming of the Shrew',
    strand: 'Reading & Speaking',
    topic: 'Drama conventions & character archetypes',
    title: 'Reading Shakespeare\'s stagecraft',
    inquiryQuestion: 'How does a playwright direct a scene without writing the action?',
    keyConcept: 'Style',
    relatedConcepts: ['Voice', 'Tone', 'Audience'],
    objectives: [
      'Revisit key character archetypes (hero, villain, fool).',
      'Understand the structure of a typical narrative arc.',
      'Explore key dramatic conventions: monologue, dialogue, aside, soliloquy, blocking, stage direction.',
      'Examine the purpose and impact of stage devices in creating meaning.',
    ],
    studentExplanation:
      'Shakespeare directs his actors through every choice he makes — even punctuation has stagecraft. Today we revisit archetypes, the narrative arc, and the convention list (monologue, soliloquy, aside, blocking), then meet The Taming of the Shrew.',
    teacherNotes:
      'Grammar focus: B.3 punctuation of bullet points + lists. AWO: GL exams, Eid holidays and early school finish in June will disrupt pacing — adjust. Cartoon play summary in further reading; key Shakespearean words translated.',
    animatedSteps: [
      'Quick recap: hero, villain, fool, sidekick.',
      'Spelling + meaning quiz on early-modern English (doth, n\'er, oft, aye, thee, thou, thy).',
      'Distinguish monologue, soliloquy, aside, blocking, stage direction.',
      'Watch a modern adaptation trailer of The Taming of the Shrew.',
      'Read the Prologue and Act 1 Scene 1; mark the stage directions.',
    ],
    interactiveType: 'character_analysis_board',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'multiple_choice',
        question: 'A character speaks alone on stage, sharing their inner thoughts. This is:',
        choices: ['Dialogue', 'Aside', 'Soliloquy', 'Monologue'],
        answer: 'Soliloquy',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write the opening setting for an original drama scene. Use stage directions, props and lighting to communicate mood, tone, or a key theme. Around 200 words.',
        rubric:
          'Top band: stage directions are precise; lighting and props contribute to mood; the reader can visualise the stage; punctuation supports performability.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Translate one of your stage directions into the language of a film camera shot. Which medium gives the writer more control?',
  }),

  L({
    id: 'eng-y8-u5-w3-monologue-scriptwriting',
    unitId: UNIT5_ID,
    unitTitle: 'Drama · The Taming of the Shrew',
    strand: 'Writing & Speaking',
    topic: 'Monologue & scriptwriting',
    title: 'Write Katherina\'s monologue',
    inquiryQuestion: 'How does a monologue let us inside a character?',
    keyConcept: 'Identity',
    relatedConcepts: ['Voice', 'Perspective', 'Subtext'],
    objectives: [
      'Identify dramatic techniques in a character monologue.',
      'Explore how dialogue and action reveal personality and intent.',
      'Develop script writing skills using dramatic conventions.',
    ],
    studentExplanation:
      'A monologue is more than a long speech — it is a window into someone\'s head, with the audience as eavesdropper. Today we workshop scriptwriting then write a formative monologue from Katherina\'s perspective after her early interactions with Petruchio.',
    teacherNotes:
      'Grammar focus: A.10 coherence + cohesion via varied sentence structures. Formative assessment in this week. Drama-script writing tutorial in further reading.',
    animatedSteps: [
      'Scriptwriting workshop: format, character heading, stage directions, line breaks.',
      'Analyse the structure of a Shakespearean monologue.',
      'Plan Katherina\'s thinking: what does she want? What is she afraid of?',
      'Draft her monologue using at least 2 dramatic techniques (irony, subtext, repetition).',
      'Mark a section for performance — pace, pause, emphasis.',
    ],
    interactiveType: 'essay_planner',
    modality: 'writing_workshop',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'What is the difference between subtext and text in a monologue?',
        answer: 'Text is what the character says; subtext is what they mean underneath. A good monologue uses the gap between the two for effect.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write a monologue (200-300 words) from Katherina\'s perspective reflecting on her interactions with Petruchio in Acts 1-2. Use script formatting and at least two dramatic techniques.',
        rubric:
          'Top band: script formatting correct; voice unmistakably Katherina\'s; subtext present; techniques deployed with intent; punctuation supports performability.',
        marks: 16,
      },
    ],
    extensionChallenge:
      'Write Petruchio\'s response monologue. Use the same scene, but flipped — what does each character believe is happening?',
  }),

  L({
    id: 'eng-y8-u5-w4-power-and-language',
    unitId: UNIT5_ID,
    unitTitle: 'Drama · The Taming of the Shrew',
    strand: 'Reading & Writing',
    topic: 'Power, irony & PETAL analysis',
    title: 'How Shakespeare reveals control through language',
    inquiryQuestion: 'How does Shakespeare use language to show power?',
    keyConcept: 'Communication',
    relatedConcepts: ['Tone', 'Irony', 'Subtext'],
    objectives: [
      'Examine how Shakespeare reveals character through speech.',
      'Identify how tone, irony, and rhetorical devices influence point of view.',
      'Practise paragraph-level analytical writing using P.E.T.A.L. structure.',
    ],
    studentExplanation:
      'Acts 3.1 and 3.2 are where power tilts. Bianca takes a tutor for granted; Petruchio arrives late to his own wedding. We close-read both scenes and write a controlled PETAL paragraph on how Shakespeare uses language to show power.',
    teacherNotes:
      'Grammar focus: A.4 cohesive devices. WAGOLL analysis in lesson. Group annotation task on the wedding scene.',
    animatedSteps: [
      'Read Act 3 Scene 1 — annotate Bianca\'s reversed power dynamic with her tutors.',
      'Read Petruchio\'s wedding monologue in Act 3 Scene 2. Mark every instance of tonal contrast.',
      'Identify irony, rhetorical questions, repetition.',
      'Plan a PETAL paragraph on language and power.',
      'Draft and peer-review against the WAGOLL.',
    ],
    interactiveType: 'text_annotation_lab',
    modality: 'reading_analysis',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'What is dramatic irony? Give one example from Act 3.',
        answer: 'Dramatic irony is when the audience knows something a character does not. Example: in Act 3.2 the audience sees Petruchio\'s deliberate strategy in his late arrival, while Katherina reads only humiliation.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write a PETAL paragraph on how Shakespeare uses language to show power and control in Act 3. Embed at least two quotes and use accurate dramatic vocabulary.',
        rubric:
          'Top band: PETAL structure clean; precise vocabulary (irony, subtext, authority, foreshadow); two quotes embedded; analysis goes BEYOND identification; cohesive devices link sentences.',
        marks: 16,
      },
    ],
    extensionChallenge:
      'Modern audiences sometimes read The Taming of the Shrew as troubling. Write a one-paragraph response — are you persuaded?',
  }),
];

/* ─── Export ─────────────────────────────────────────────────────────── */

export const year8EnglishLessons: SubjectLesson[] = [
  ...u1Lessons,
  ...u2Lessons,
  ...u3Lessons,
  ...u4Lessons,
  ...u5Lessons,
];

export const year8EnglishUnits: SubjectUnit[] = [
  {
    id: UNIT1_ID,
    subject: 'english',
    subjectLabel: 'English',
    grade: 'Grade 8',
    title: 'Media · Advertising',
    strand: 'Reading, Writing & Speaking',
    inquiryQuestion: 'How do advertisers shape what we believe, want and value?',
    statementOfInquiry:
      'Effective communication relies on a deliberate combination of audience, purpose and style — and adverts are the most concentrated form of that combination in our daily lives.',
    keyConcept: 'Communication',
    relatedConcepts: ['Purpose', 'Audience', 'Style', 'Influence'],
    lessons: u1Lessons,
  },
  {
    id: UNIT2_ID,
    subject: 'english',
    subjectLabel: 'English',
    grade: 'Grade 8',
    title: 'Novel · Charlie and the Chocolate Factory + Wonder',
    strand: 'Reading & Writing',
    inquiryQuestion: 'How do writers build identity, theme and viewpoint across a long narrative?',
    statementOfInquiry:
      'A novelist\'s craft — characterisation, theme, narrative arc, viewpoint — turns separate moments into a story that asks the same question in many ways.',
    keyConcept: 'Identity',
    relatedConcepts: ['Theme', 'Perspective', 'Style'],
    lessons: u2Lessons,
  },
  {
    id: UNIT3_ID,
    subject: 'english',
    subjectLabel: 'English',
    grade: 'Grade 8',
    title: 'Poetry · Anthology (Personal & Cultural Expression)',
    strand: 'Reading & Writing',
    inquiryQuestion: 'How do poets carry personal and cultural identity in a handful of lines?',
    statementOfInquiry:
      'Personal and cultural expression in poetry depends on the deliberate use of form, sound, image and voice — and the same toolkit lets every reader speak back.',
    keyConcept: 'Identity',
    relatedConcepts: ['Culture', 'Voice', 'Form', 'Memory'],
    lessons: u3Lessons,
  },
  {
    id: UNIT4_ID,
    subject: 'english',
    subjectLabel: 'English',
    grade: 'Grade 8',
    title: 'Language & Film · Our Planet',
    strand: 'Reading, Writing & Speaking',
    inquiryQuestion: 'How do filmmakers use language and image to move an audience to act on global issues?',
    statementOfInquiry:
      'Documentary film is persuasive writing in a new register — sound, image and narration replace the page, but the techniques of audience, purpose and style stay the same.',
    keyConcept: 'Communication',
    relatedConcepts: ['Audience', 'Purpose', 'Mood', 'Tone'],
    lessons: u4Lessons,
  },
  {
    id: UNIT5_ID,
    subject: 'english',
    subjectLabel: 'English',
    grade: 'Grade 8',
    title: 'Drama · The Taming of the Shrew (Shakespeare)',
    strand: 'Reading, Writing & Speaking',
    inquiryQuestion: 'How does a playwright reveal character, power and identity on a stage?',
    statementOfInquiry:
      'Shakespeare\'s stagecraft — monologue, soliloquy, irony, blocking — is a precise system for revealing what characters say, mean, and conceal.',
    keyConcept: 'Identity',
    relatedConcepts: ['Voice', 'Tone', 'Subtext', 'Power'],
    lessons: u5Lessons,
  },
];

export function findEnglishLessonById(id: string) {
  return year8EnglishLessons.find((l) => l.id === id);
}
