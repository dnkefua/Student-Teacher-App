// EIS Year 8 Science — IB MYP Year 3. Four units span biology, chemistry,
// physics and electricity. Each lesson follows the SubjectLesson shape so
// the same Lesson Player, Hub mastery, and recommendation engine work the
// way they do for Maths and English.

import type { SubjectLesson, SubjectUnit } from '../types';

const SCIENCE = {
  subject: 'science' as const,
  subjectLabel: 'Science' as const,
  grade: 'Grade 8' as const,
};

type LessonInput = Omit<SubjectLesson, 'subject' | 'subjectLabel' | 'grade'>;
function L(input: LessonInput): SubjectLesson {
  return { ...SCIENCE, ...input };
}

/* ─── Unit 1 · Cells & Living Things ────────────────────────────────── */

const UNIT1_ID = 'eis-sci-y8-u1-cells';

const u1Lessons: SubjectLesson[] = [
  L({
    id: 'sci-y8-u1-w1-cell-structure',
    unitId: UNIT1_ID,
    unitTitle: 'Cells & Living Things',
    strand: 'Biology',
    topic: 'Cell structure',
    title: 'Animal vs plant cells',
    inquiryQuestion: 'What do all living cells share, and what makes plant cells different?',
    keyConcept: 'Systems',
    relatedConcepts: ['Function', 'Models'],
    objectives: [
      'Identify the main organelles in animal and plant cells.',
      'Explain the function of each organelle.',
      'Compare and contrast animal and plant cells.',
    ],
    studentExplanation:
      'A cell is the smallest unit that is still alive. Animal and plant cells share most parts — nucleus, membrane, cytoplasm, mitochondria — but plant cells add a chloroplast (for photosynthesis), a cell wall (for shape), and a permanent vacuole (for storage). Today we tour both cells in 3D.',
    teacherNotes:
      'Use the interactive 3D cell to spin and label organelles before the practical microscope work. Cross-link to Unit 2: chloroplasts → photosynthesis. Common misconception: animal cells DO have vacuoles, just small temporary ones.',
    animatedSteps: [
      'Start with the cell membrane — gatekeeper of every cell.',
      'Drop in the nucleus — the control centre that holds DNA.',
      'Add mitochondria — where respiration releases energy.',
      'For plants, add cell wall, chloroplasts and a large vacuole.',
      'Compare side by side: three shared, three plant-only.',
    ],
    interactiveType: 'cell_3d',
    modality: '3d_interactive',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'multiple_choice',
        question: 'Which organelle is found ONLY in plant cells?',
        choices: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Cell membrane'],
        answer: 'Chloroplast',
      },
      {
        id: 'p2',
        type: 'short_answer',
        question: 'Explain the role of the mitochondria in one sentence.',
        answer: 'Mitochondria carry out aerobic respiration, releasing energy from glucose for the cell to use.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Draw and label an animal cell and a plant cell. For each cell, write one function next to three different organelles.',
        rubric: 'Top band: both cells drawn with clear shapes, 6+ correctly labelled organelles total, 6+ accurate functions, plant-specific organelles highlighted.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Bacteria are also cells but they have no nucleus. What does that suggest about how bacterial DNA is organised?',
  }),

  L({
    id: 'sci-y8-u1-w2-photosynthesis',
    unitId: UNIT1_ID,
    unitTitle: 'Cells & Living Things',
    strand: 'Biology',
    topic: 'Photosynthesis & respiration',
    title: 'How plants make their own food',
    inquiryQuestion: 'How do plants turn sunlight into stored energy?',
    keyConcept: 'Change',
    relatedConcepts: ['Energy', 'Balance'],
    objectives: [
      'Write and balance the word equation for photosynthesis.',
      'Explain why chloroplasts are essential.',
      'Compare photosynthesis with respiration.',
    ],
    studentExplanation:
      'Photosynthesis is the chemical reaction inside chloroplasts that takes carbon dioxide + water and (with sunlight) builds glucose + oxygen. Respiration is the reverse — every living cell uses glucose + oxygen to release energy, producing CO₂ + water back. They are two sides of the same coin.',
    teacherNotes:
      'Anchor with the leaf-disc floating practical if time allows. Common misconception: plants do NOT only photosynthesise — they respire 24/7 too. Highlight the balanced word equations side by side.',
    animatedSteps: [
      'CO₂ enters the leaf through stomata; water arrives via xylem.',
      'Inside chloroplasts, sunlight provides energy.',
      'Glucose is built and stored as starch; oxygen escapes through stomata.',
      'In respiration, the cell breaks glucose back down to release energy.',
    ],
    interactiveType: 'particle_model_3d',
    modality: 'animated_explainer',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Write the word equation for photosynthesis.',
        answer: 'carbon dioxide + water → glucose + oxygen (sunlight + chlorophyll required).',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Explain in 3-4 sentences why a plant kept in the dark for a week will eventually die, even with water.',
        rubric: 'Top band: links photosynthesis to glucose production, glucose to respiration, respiration to energy. Identifies that water alone does not provide the carbon backbone.',
        marks: 8,
      },
    ],
    extensionChallenge:
      'Some plants have variegated (green + white) leaves. Predict which areas can photosynthesise and design an experiment using iodine to test your prediction.',
  }),

  L({
    id: 'sci-y8-u1-w3-ecosystems',
    unitId: UNIT1_ID,
    unitTitle: 'Cells & Living Things',
    strand: 'Biology',
    topic: 'Ecosystems & interdependence',
    title: 'Food chains, webs and energy flow',
    inquiryQuestion: 'How does energy flow through an ecosystem?',
    keyConcept: 'Systems',
    relatedConcepts: ['Interdependence', 'Energy'],
    objectives: [
      'Construct food chains and food webs.',
      'Identify producers, consumers and decomposers.',
      'Explain why energy loss limits the length of a food chain.',
    ],
    studentExplanation:
      'Every food chain starts with a producer (a plant that traps sunlight). Each step up — primary consumer, secondary, tertiary — loses about 90% of the energy as heat, movement and waste. That is why food chains rarely have more than 4-5 links.',
    teacherNotes:
      'Use the desert ecosystem example (UAE-relevant) — date palm → camel → human. Connect to Unit 4 (energy transfer) for the 10% rule.',
    animatedSteps: [
      'Draw the producer at the base — usually a plant.',
      'Add a primary consumer (herbivore).',
      'Add a secondary consumer (carnivore or omnivore).',
      'Show energy loss arrows at each step.',
      'Combine multiple chains into a food web.',
    ],
    interactiveType: 'ecosystem_simulation',
    modality: 'simulation',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Why are food chains rarely longer than 5 links?',
        answer: 'Because about 90% of energy is lost at each trophic level — by the 5th link there is too little energy left to support another consumer.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Construct a food web for a UAE desert ecosystem containing at least 5 organisms. Label producers, primary consumers and secondary consumers.',
        rubric: 'Top band: 5+ organisms; arrows in the correct direction (energy flow); roles labelled correctly; at least one decomposer included.',
        marks: 10,
      },
    ],
    extensionChallenge:
      'If a disease wiped out all the herbivores in your food web, predict the impact on producers AND on top predators. Justify each prediction.',
  }),
];

/* ─── Unit 2 · States of Matter & Particle Model ─────────────────────── */

const UNIT2_ID = 'eis-sci-y8-u2-particles';

const u2Lessons: SubjectLesson[] = [
  L({
    id: 'sci-y8-u2-w1-particle-model',
    unitId: UNIT2_ID,
    unitTitle: 'States of Matter',
    strand: 'Chemistry',
    topic: 'The particle model',
    title: 'Solids, liquids and gases — at the particle level',
    inquiryQuestion: 'How does particle behaviour explain the three states of matter?',
    keyConcept: 'Models',
    relatedConcepts: ['Energy', 'Change'],
    objectives: [
      'Describe particle arrangement and movement in each state.',
      'Explain changes of state using the particle model.',
      'Predict the effect of heat on particle motion.',
    ],
    studentExplanation:
      'In a solid, particles are packed tightly and vibrate in place. In a liquid, they touch but slide past each other. In a gas, they move fast in all directions with big spaces between them. Heating gives particles energy — heat enough and they move from one state to the next.',
    teacherNotes:
      'Use the 3D particle model to switch between states. Common misconception: heating does not change particle SIZE — it changes their kinetic energy.',
    animatedSteps: [
      'Start with a solid — particles in a fixed grid, only vibrating.',
      'Heat → melting. Bonds loosen and particles flow.',
      'Heat more → boiling. Particles fly apart with high speed.',
      'Cool back down — the process reverses.',
    ],
    interactiveType: 'particle_model_3d',
    modality: '3d_interactive',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'multiple_choice',
        question: 'Which statement is TRUE about particles in a gas?',
        choices: [
          'They are larger than in a solid.',
          'They have more kinetic energy than in a liquid.',
          'They are arranged in a fixed grid.',
          'They have no spaces between them.',
        ],
        answer: 'They have more kinetic energy than in a liquid.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Draw the particle arrangement in a solid, liquid and gas. Annotate each diagram with: (a) arrangement, (b) movement, (c) energy.',
        rubric: 'Top band: three accurate diagrams, all three annotation categories filled in for each, energy comparison correct.',
        marks: 9,
      },
    ],
    extensionChallenge:
      'Sublimation is the change from solid directly to gas (e.g. dry ice). Use the particle model to explain why this skips the liquid stage entirely.',
  }),

  L({
    id: 'sci-y8-u2-w2-diffusion',
    unitId: UNIT2_ID,
    unitTitle: 'States of Matter',
    strand: 'Chemistry',
    topic: 'Diffusion',
    title: 'Why perfume travels across the room',
    inquiryQuestion: 'How do particles spread from high to low concentration?',
    keyConcept: 'Change',
    relatedConcepts: ['Energy', 'Movement'],
    objectives: [
      'Define diffusion using the particle model.',
      'Explain why diffusion is faster in gases than in liquids.',
      'Predict the effect of temperature on diffusion rate.',
    ],
    studentExplanation:
      'Diffusion is the net movement of particles from a region of high concentration to a region of low concentration. It happens because particles are always moving randomly. Gases diffuse fastest because their particles have most kinetic energy and the biggest spaces to travel through.',
    teacherNotes:
      'Demo: open a bottle of perfume at the front of the room and time how long it takes students at the back to smell it. Common misconception: diffusion is not "pushed" — it is the result of random motion.',
    animatedSteps: [
      'Drop coloured particles into one side of a box.',
      'Watch random motion gradually spread them.',
      'Heat the system — particles move faster, diffusion speeds up.',
    ],
    interactiveType: 'particle_model_3d',
    modality: '3d_interactive',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'Predict how diffusion rate changes when the temperature increases. Justify using the particle model.',
        answer: 'Diffusion rate increases. Higher temperature → particles have more kinetic energy → they move faster → they spread out more quickly.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Two students stand at opposite ends of a 10 m corridor. A perfume bottle is opened at the midpoint. Explain, using the particle model, why both students smell it — but not at the same time.',
        rubric: 'Top band: explains random motion, net movement from high to low concentration, particles having different speeds, and travel time depending on distance.',
        marks: 8,
      },
    ],
    extensionChallenge:
      'Design a fair-test experiment to measure how diffusion rate depends on temperature. Identify the independent, dependent and control variables.',
  }),

  L({
    id: 'sci-y8-u2-w3-acids-alkalis',
    unitId: UNIT2_ID,
    unitTitle: 'States of Matter',
    strand: 'Chemistry',
    topic: 'Acids, alkalis & pH',
    title: 'The pH scale and indicators',
    inquiryQuestion: 'How can we measure how acidic or alkaline a solution is?',
    keyConcept: 'Systems',
    relatedConcepts: ['Balance', 'Models'],
    objectives: [
      'Describe the pH scale from 0 to 14.',
      'Use universal indicator to classify solutions.',
      'Predict the products of an acid + alkali reaction.',
    ],
    studentExplanation:
      'pH measures how acidic (0-6), neutral (7) or alkaline (8-14) a solution is. Universal indicator turns red in strong acids, orange/yellow in weak acids, green at neutral, blue in weak alkalis and purple in strong alkalis. When acids react with alkalis, they neutralise each other to form a salt + water.',
    teacherNotes:
      'Lab safety: use dilute HCl and NaOH only. Common misconception: pH 7 means "no chemistry happening" — actually it means equal H⁺ and OH⁻ ions.',
    animatedSteps: [
      'Show the pH scale colour band from 0 to 14.',
      'Drop universal indicator into each test tube.',
      'Mix acid + alkali — observe the colour shift toward green.',
      'Identify the salt + water products by name.',
    ],
    interactiveType: 'chemical_reaction_lab',
    modality: 'virtual_lab',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'multiple_choice',
        question: 'A solution turns universal indicator dark purple. Its pH is most likely:',
        choices: ['1', '5', '7', '13'],
        answer: '13',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Hydrochloric acid reacts with sodium hydroxide. Write the word equation, state the pH at the end-point, and explain why this reaction is called neutralisation.',
        rubric: 'Top band: correct word equation (HCl + NaOH → NaCl + H₂O), pH 7 at end-point, explanation linking H⁺ + OH⁻ → water.',
        marks: 10,
      },
    ],
    extensionChallenge:
      'Many household cleaners are strongly alkaline. Why is it dangerous to mix them with acidic toilet cleaners?',
  }),
];

/* ─── Unit 3 · Forces & Motion ──────────────────────────────────────── */

const UNIT3_ID = 'eis-sci-y8-u3-forces';

const u3Lessons: SubjectLesson[] = [
  L({
    id: 'sci-y8-u3-w1-forces-balance',
    unitId: UNIT3_ID,
    unitTitle: 'Forces & Motion',
    strand: 'Physics',
    topic: 'Balanced vs unbalanced forces',
    title: 'When forces cancel and when they don\'t',
    inquiryQuestion: 'How do balanced and unbalanced forces affect motion?',
    keyConcept: 'Relationships',
    relatedConcepts: ['Movement', 'Balance'],
    objectives: [
      'Identify the forces acting on an object.',
      'Distinguish balanced from unbalanced forces.',
      'Predict motion given a force diagram.',
    ],
    studentExplanation:
      'A force is a push or pull, measured in newtons (N). If forces on an object cancel (balanced), the object stays still OR keeps moving at constant velocity. If they don\'t cancel (unbalanced), the object accelerates in the direction of the resultant force.',
    teacherNotes:
      'Drag the slider in the Forces & Motion simulator to see how friction changes the resultant. Common misconception: "no force = no movement". Actually, no UNBALANCED force = no acceleration, but the object can still be moving.',
    animatedSteps: [
      'Show a stationary box with weight and reaction force balanced.',
      'Add a push to the right — show acceleration.',
      'Add friction to the left — show the new resultant.',
      'Set friction = push: balanced again, constant velocity.',
    ],
    interactiveType: 'forces_motion_sim',
    modality: 'simulation',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'A car drives at a constant 60 km/h. Are the forces balanced or unbalanced? Explain.',
        answer: 'Balanced. Driving force from the engine equals friction + air resistance, so there is no acceleration.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'A 500 N skydiver is in free fall with 200 N of air resistance. Draw a force diagram, calculate the resultant force, and describe the motion at this moment.',
        rubric: 'Top band: arrows correctly drawn and labelled, resultant = 300 N downward, motion described as accelerating downward.',
        marks: 8,
      },
    ],
    extensionChallenge:
      'As the skydiver falls faster, air resistance increases. Predict what happens to the resultant force over time and define the moment when motion becomes constant.',
  }),

  L({
    id: 'sci-y8-u3-w2-friction',
    unitId: UNIT3_ID,
    unitTitle: 'Forces & Motion',
    strand: 'Physics',
    topic: 'Friction',
    title: 'When friction helps and when it hurts',
    inquiryQuestion: 'How does friction affect motion, and when do we want more or less of it?',
    keyConcept: 'Relationships',
    relatedConcepts: ['Energy', 'Movement'],
    objectives: [
      'Identify situations where friction is useful and where it is a problem.',
      'Suggest ways to increase or decrease friction.',
      'Explain how friction transfers kinetic energy to heat.',
    ],
    studentExplanation:
      'Friction is a force that opposes motion between two surfaces in contact. We want lots of it for walking, gripping a pen, or stopping a car — but little for skating, machine bearings, or sliding down a slide. Friction always turns useful kinetic energy into heat.',
    teacherNotes:
      'Use the slider for surface roughness in the simulator. Connect to Unit 4 (energy transfer): friction = useful → wasted (heat).',
    animatedSteps: [
      'Push a block on rough sandpaper — high friction.',
      'Switch to a smooth surface — block slides further.',
      'Add oil — friction drops even more.',
      'Note the temperature rise on the rough surface.',
    ],
    interactiveType: 'forces_motion_sim',
    modality: 'simulation',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'List two situations where we WANT high friction and two where we want LOW friction.',
        answer: 'High friction: walking on a pavement, braking a car. Low friction: bicycle chain, ice skating.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Design a bicycle pedal that is comfortable but has high friction so feet don\'t slip. Justify three design choices using your knowledge of friction.',
        rubric: 'Top band: three sensible design choices (surface pattern, material, contact area), each justified by linking to friction.',
        marks: 9,
      },
    ],
    extensionChallenge:
      'Most of the energy a Formula 1 car uses ends up as heat through friction. Where? List three sources of friction in a racing car.',
  }),

  L({
    id: 'sci-y8-u3-w3-speed-distance-time',
    unitId: UNIT3_ID,
    unitTitle: 'Forces & Motion',
    strand: 'Physics',
    topic: 'Speed, distance and time',
    title: 'Reading and drawing distance-time graphs',
    inquiryQuestion: 'What can a distance-time graph tell us about an object\'s motion?',
    keyConcept: 'Relationships',
    relatedConcepts: ['Movement', 'Models'],
    objectives: [
      'Calculate speed from distance and time.',
      'Interpret distance-time graphs.',
      'Identify stationary, constant-speed and accelerating motion from a graph.',
    ],
    studentExplanation:
      'Speed = distance ÷ time. On a distance-time graph: a flat line means stationary, a straight slope means constant speed (steeper = faster), and a curve means changing speed (acceleration if curving up, deceleration if curving down).',
    teacherNotes:
      'Connect to maths (gradient = rate). Common misconception: a flat line means "going backwards" — actually, it means "not moving".',
    animatedSteps: [
      'Walk forward at 1 m/s for 3 seconds — straight line up.',
      'Stop for 2 seconds — flat horizontal line.',
      'Run forward at 3 m/s — much steeper line.',
      'Identify speed at any point by reading the gradient.',
    ],
    interactiveType: 'forces_motion_sim',
    modality: 'simulation',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'A car travels 120 km in 1.5 hours. Calculate its average speed in km/h.',
        answer: 'speed = 120 ÷ 1.5 = 80 km/h.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Sketch a distance-time graph for a 10 minute journey: 2 min walking, 3 min stopped at lights, 5 min running. Annotate each section with its speed.',
        rubric: 'Top band: three distinct sections drawn correctly, gradients reflect the speeds, annotations accurate, axes labelled with units.',
        marks: 10,
      },
    ],
    extensionChallenge:
      'A speed-time graph for the same journey would look different. Sketch it and explain what each axis now represents.',
  }),
];

/* ─── Unit 4 · Electricity & Magnetism ──────────────────────────────── */

const UNIT4_ID = 'eis-sci-y8-u4-electricity';

const u4Lessons: SubjectLesson[] = [
  L({
    id: 'sci-y8-u4-w1-circuits',
    unitId: UNIT4_ID,
    unitTitle: 'Electricity & Magnetism',
    strand: 'Physics',
    topic: 'Electric circuits',
    title: 'Series vs parallel circuits',
    inquiryQuestion: 'How does the way components are connected change how a circuit behaves?',
    keyConcept: 'Systems',
    relatedConcepts: ['Connection', 'Energy'],
    objectives: [
      'Draw and recognise series and parallel circuit diagrams.',
      'Predict what happens to current and brightness when a bulb is added.',
      'Explain why one broken bulb breaks a series circuit but not a parallel one.',
    ],
    studentExplanation:
      'In a SERIES circuit, components are connected in one loop — current is the same everywhere, and if any bulb breaks, all go out. In a PARALLEL circuit, components have their own branch — each branch has its own current, and a broken branch doesn\'t affect the others.',
    teacherNotes:
      'Use the Circuit Builder to drag a battery, bulbs and switches. Common misconception: "more bulbs = more current". In series, more bulbs = MORE resistance = LESS current.',
    animatedSteps: [
      'Build a single-bulb circuit and measure the current.',
      'Add a second bulb in series — both dim, current halves.',
      'Reset; put the second bulb in parallel — both bright, total current doubles.',
      'Break one bulb in each: predict, then test.',
    ],
    interactiveType: 'electric_circuit_builder',
    modality: 'simulation',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'multiple_choice',
        question: 'You remove ONE bulb from a circuit and the others stay lit. The circuit must be:',
        choices: ['Series', 'Parallel', 'Open', 'Short'],
        answer: 'Parallel',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Draw both a series circuit and a parallel circuit using 1 battery and 2 bulbs each. Predict and justify which circuit will have brighter bulbs.',
        rubric: 'Top band: correct symbols, both circuits drawn accurately, prediction (parallel brighter) justified by current/voltage reasoning.',
        marks: 10,
      },
    ],
    extensionChallenge:
      'House wiring is parallel, not series. Give two reasons why parallel is the safer and more practical choice.',
  }),

  L({
    id: 'sci-y8-u4-w2-current-voltage',
    unitId: UNIT4_ID,
    unitTitle: 'Electricity & Magnetism',
    strand: 'Physics',
    topic: 'Current, voltage, resistance',
    title: 'Reading ammeters and voltmeters',
    inquiryQuestion: 'How are current, voltage and resistance related in a circuit?',
    keyConcept: 'Relationships',
    relatedConcepts: ['Energy', 'Models'],
    objectives: [
      'Define current (A), voltage (V) and resistance (Ω).',
      'Use the formula V = I × R.',
      'Connect ammeters in series and voltmeters in parallel.',
    ],
    studentExplanation:
      'Current (A) is the flow of charge — measured by an ammeter IN series with the component. Voltage (V) is the energy per charge — measured by a voltmeter ACROSS the component. Resistance (Ω) is how hard the component is to push current through. Ohm\'s Law: V = I × R.',
    teacherNotes:
      'Use the Circuit Builder to add meters and read live values. Cross-link to maths: this is a direct proportion (V ∝ I) at fixed R.',
    animatedSteps: [
      'Place an ammeter in series — its symbol is a circle with A.',
      'Place a voltmeter across a bulb — its symbol is a circle with V.',
      'Increase resistance — current drops, voltage stays.',
      'Verify with V = I × R for three values.',
    ],
    interactiveType: 'electric_circuit_builder',
    modality: 'simulation',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'short_answer',
        question: 'A 12 V battery drives 2 A through a resistor. Calculate its resistance.',
        answer: 'R = V ÷ I = 12 ÷ 2 = 6 Ω.',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Design an experiment to test whether the current through a fixed resistor is proportional to the voltage across it. List apparatus, method, variables and the expected graph.',
        rubric: 'Top band: clear independent (V), dependent (I), control (R); apparatus complete; expected straight-line graph through origin; safety mentioned.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Real bulbs do NOT obey Ohm\'s Law because their resistance changes with temperature. Sketch the I-V graph for a bulb and explain its shape.',
  }),

  L({
    id: 'sci-y8-u4-w3-energy-resources',
    unitId: UNIT4_ID,
    unitTitle: 'Electricity & Magnetism',
    strand: 'Physics',
    topic: 'Energy resources',
    title: 'Renewable vs non-renewable energy',
    inquiryQuestion: 'How do we generate electricity, and what are the trade-offs?',
    keyConcept: 'Global interactions',
    relatedConcepts: ['Energy', 'Sustainability'],
    objectives: [
      'Classify energy sources as renewable or non-renewable.',
      'Compare advantages and disadvantages of each source.',
      'Evaluate the UAE\'s energy mix.',
    ],
    studentExplanation:
      'Non-renewable resources (coal, oil, gas, nuclear) run out and most release carbon dioxide. Renewable resources (solar, wind, hydro, tidal, geothermal) are virtually unlimited and produce little or no CO₂ — but each has limitations. The UAE is investing heavily in solar (Mohammed bin Rashid Solar Park) and nuclear (Barakah) to reduce dependence on oil.',
    teacherNotes:
      'Make this a discussion lesson. The Mohammed bin Rashid Solar Park is the world\'s largest single-site solar farm — a strong local hook. Connect to global citizenship (MYP service-as-action).',
    animatedSteps: [
      'Categorise 6 sources into renewable / non-renewable.',
      'For each, list one advantage and one disadvantage.',
      'Examine the UAE\'s current energy mix.',
      'Predict how the mix might look in 2030.',
    ],
    interactiveType: 'energy_transfer_sim',
    modality: 'discussion',
    practiceQuestions: [
      {
        id: 'p1',
        type: 'multiple_choice',
        question: 'Which energy source is RENEWABLE?',
        choices: ['Coal', 'Natural gas', 'Nuclear', 'Solar'],
        answer: 'Solar',
      },
    ],
    assignmentQuestions: [
      {
        id: 'a1',
        question: 'Write a 200-word evaluation: should the UAE continue to invest in solar energy? Use at least 3 scientific arguments and 1 economic argument.',
        rubric: 'Top band: balanced argument, 3+ scientific points (CO₂, abundance, intermittency, land use), economic point (oil exports vs domestic use), clear conclusion.',
        marks: 12,
      },
    ],
    extensionChallenge:
      'Solar panels produce less electricity in summer dust storms. Suggest two engineering solutions to this problem.',
  }),
];

/* ─── Export ─────────────────────────────────────────────────────────── */

export const year8ScienceLessons: SubjectLesson[] = [
  ...u1Lessons,
  ...u2Lessons,
  ...u3Lessons,
  ...u4Lessons,
];

export const year8ScienceUnits: SubjectUnit[] = [
  {
    id: UNIT1_ID,
    subject: 'science',
    subjectLabel: 'Science',
    grade: 'Grade 8',
    title: 'Cells & Living Things',
    strand: 'Biology',
    inquiryQuestion: 'How do living systems work — from a single cell to a whole ecosystem?',
    statementOfInquiry:
      'Living systems are organised at different scales — cell, organism, ecosystem — and at every scale, structure determines function.',
    keyConcept: 'Systems',
    relatedConcepts: ['Function', 'Energy', 'Interdependence'],
    lessons: u1Lessons,
  },
  {
    id: UNIT2_ID,
    subject: 'science',
    subjectLabel: 'Science',
    grade: 'Grade 8',
    title: 'States of Matter',
    strand: 'Chemistry',
    inquiryQuestion: 'How does the particle model explain everything we see around us?',
    statementOfInquiry:
      'Models help us explain phenomena we cannot directly observe — and the particle model is the foundation of chemistry.',
    keyConcept: 'Models',
    relatedConcepts: ['Energy', 'Change', 'Balance'],
    lessons: u2Lessons,
  },
  {
    id: UNIT3_ID,
    subject: 'science',
    subjectLabel: 'Science',
    grade: 'Grade 8',
    title: 'Forces & Motion',
    strand: 'Physics',
    inquiryQuestion: 'How do forces shape motion in everyday life?',
    statementOfInquiry:
      'Forces are interactions between objects, and the resultant force determines how motion changes — or stays the same.',
    keyConcept: 'Relationships',
    relatedConcepts: ['Movement', 'Energy', 'Balance'],
    lessons: u3Lessons,
  },
  {
    id: UNIT4_ID,
    subject: 'science',
    subjectLabel: 'Science',
    grade: 'Grade 8',
    title: 'Electricity & Magnetism',
    strand: 'Physics',
    inquiryQuestion: 'How does electricity power our world, and what does it cost?',
    statementOfInquiry:
      'Energy is transferred through circuits in predictable ways — and the choices we make about generation shape our planet.',
    keyConcept: 'Systems',
    relatedConcepts: ['Energy', 'Connection', 'Sustainability'],
    lessons: u4Lessons,
  },
];

export function findScienceLessonById(id: string) {
  return year8ScienceLessons.find((l) => l.id === id);
}
