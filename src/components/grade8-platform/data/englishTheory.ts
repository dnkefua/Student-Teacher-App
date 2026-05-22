import { ConceptDef } from '../types';

/**
 * English "Learn" concepts mirrored on the Science theory shape.
 *
 * Each unit holds rich teaching paragraphs, key ideas and an optional
 * `interactiveLab` flag that the LearnView dispatches to a registered
 * React component (e.g. the McDonald's persuasive-devices lab).
 *
 * Subtopics are intentionally written so a student can learn the
 * material here without needing the original textbook.
 */
export const englishTheoryData: Record<string, ConceptDef[]> = {
  unit1: [
    {
      title: 'Persuasive Devices in Advertising',
      description:
        'Advertising is the art of moving an audience to act — to buy, to feel, to remember. To do that, advertisers stack a small set of repeatable language and design techniques. Once you can name them, you can analyse any advert (and write your own) far more sharply.',
      paragraphs: [
        'A persuasive device is any deliberate choice — a word, a colour, an image, a layout — that is designed to make the audience think or feel a particular way. Devices work because they appeal to one of three classical modes: ethos (trust), pathos (emotion) or logos (logic).',
        'Strong analytical writing names the device, quotes the evidence, then explains the effect on the audience. The McDonald\'s lab below shows the same global brand selling itself two completely different ways depending on the cultural market — a perfect side-by-side to spot devices in action.',
      ],
      keyIdeas: [
        'Headline + price anchors hook the audience in the first second.',
        'Close-up food photography drives appetite appeal before any reading happens.',
        'Cultural framing (US value vs. UAE Ramadan) shifts the entire emotional register.',
        'Logos, taglines and colour palettes carry brand identity without using words.',
      ],
      vocabulary: [
        { term: 'Persuasive device', definition: 'A specific technique used to move an audience to think, feel or act.' },
        { term: 'AFOREST', definition: 'A mnemonic for common persuasive devices: Alliteration, Fact, Opinion, Repetition, Emotive language, Statistics, Triplet.' },
        { term: 'Ethos / Pathos / Logos', definition: 'The classical appeals to trust, emotion, and logic.' },
        { term: 'Tone', definition: 'The attitude the writer takes towards the subject — urgent, calm, playful, warm, etc.' },
      ],
      interactiveLab: 'mcdonalds-ads',
    },
    {
      title: 'Reading the Image: Layout, Colour and Composition',
      description:
        'Advertising is a visual language as much as a written one. The eye lands on the largest, brightest, most central element first; designers exploit this with hierarchy, leading lines and contrast.',
      paragraphs: [
        'Visual hierarchy tells the reader what to look at first, second and third. A bright headline at the top-left will outrank a smaller block of body text every time, even if the body text contains the most important information.',
        'Colour carries meaning: red signals urgency and appetite, gold signals premium, green signals freshness and trust. Look at the colour palette and you have already half-decoded the brief.',
        'Composition guides the eye along leading lines. A diagonal sweep from product to price tag forces the viewer to associate them, even if the link is never spoken.',
      ],
      keyIdeas: [
        'Largest + most central element wins the first glance.',
        'Colour is a shortcut to emotion — analyse the palette before the words.',
        'Negative space (empty space) communicates calm, premium or exclusivity.',
        'Repetition of a colour or shape across an advert creates unity and recall.',
      ],
      vocabulary: [
        { term: 'Visual hierarchy', definition: 'The order in which the eye sees elements on a page, controlled by size, contrast and placement.' },
        { term: 'Leading line', definition: 'A line in the composition (an arm, a road, a price tag) that pulls the eye towards a focal point.' },
        { term: 'Negative space', definition: 'The empty area around the subject. Lots of it signals luxury or seriousness.' },
      ],
    },
  ],

  unit2: [
    {
      title: 'PETAL Paragraphs — Structuring an Analytical Response',
      description:
        'When you write about a text, examiners reward students who can prove a point with evidence and then EXPLAIN the effect. PETAL gives you a five-move template that does exactly that.',
      paragraphs: [
        'PETAL stands for Point, Evidence, Technique, Analysis, Link. Start with a focused point that answers the question. Quote the smallest piece of evidence that supports it. Name the device the writer used. Analyse the effect on the reader. Link back to the question to tie the paragraph together.',
        'The trap students fall into is stopping at Evidence — they quote something and then move on. The marks are in the Analysis: WHY does that word, that image, that rhythm work on the reader?',
      ],
      keyIdeas: [
        'Every body paragraph in an analytical essay should answer one focused point.',
        'Evidence must be embedded inside a sentence, never dropped as a stand-alone line.',
        'The Analysis step is where 60 % of the marks are won.',
        'Always link back to the original question — this proves your paragraph was on-task.',
      ],
      vocabulary: [
        { term: 'Embedded quotation', definition: 'A short quote woven into your own sentence so it reads as one flow.' },
        { term: 'Connotation', definition: 'The emotional weight a word carries beyond its literal meaning.' },
        { term: 'Tone shift', definition: 'A change in the writer\'s attitude inside the text — often the most analysable moment.' },
      ],
    },
  ],
};
