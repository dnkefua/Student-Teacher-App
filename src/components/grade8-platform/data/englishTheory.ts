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
    {
      title: 'The Novel — Character, Setting, Theme',
      description:
        'A novel is a long prose narrative that builds meaning through three interlocking elements: who the characters are, where and when the story is set, and what bigger ideas (themes) the writer is exploring.',
      paragraphs: [
        'CHARACTER is the heart of a novel. Writers reveal character through what a person says, does, thinks and how others react to them. A static character barely changes; a DYNAMIC character grows or breaks over the course of the story. Charlie Bucket and Wonder\'s August Pullman are dynamic — their journey IS the novel.',
        'SETTING is more than a backdrop. The factory in Charlie and the Chocolate Factory is mysterious and rule-bound for a reason — it lets Dahl test each child\'s flaw in turn. In Wonder, the move from homeschool to Beecher Prep IS the conflict — without that setting shift there is no story.',
        'THEME is the idea the novel keeps coming back to. "Kindness" runs through Wonder the way "the corrupting power of greed" runs through Charlie and the Chocolate Factory. To find a theme, ask: what does the writer want me to feel or believe by the last page?',
        'POINT OF VIEW shapes everything. A FIRST-PERSON narrator (Auggie in Wonder) gives intimate access to one mind but no objective view of events. A THIRD-PERSON narrator can roam between characters but loses immediacy. Notice when Palacio switches between voices — each switch is a deliberate craft choice.',
      ],
      keyIdeas: [
        'Character revealed through speech, action, thought, and others\' reactions.',
        'Setting is functional — it presses on the characters and creates conflict.',
        'Theme = the recurring idea the novel keeps returning to.',
        'Point of view (1st / 3rd / multiple) shapes intimacy and scope.',
      ],
      vocabulary: [
        { term: 'Protagonist', definition: 'The main character driving the story.', example: 'Charlie Bucket in Charlie and the Chocolate Factory.' },
        { term: 'Antagonist', definition: 'The character (or force) opposing the protagonist.' },
        { term: 'Foreshadowing', definition: 'Early hints of events that come later.' },
        { term: 'Motif', definition: 'A repeated image or phrase that supports the theme.' },
      ],
    },
  ],

  unit3: [
    {
      title: 'Voices in Verse — Reading Poetry',
      description:
        'Poetry compresses meaning into very few words by leaning hard on sound, image and form. To read a poem well, you slow down and look at three things at once: what it says, how it sounds, and what shape it makes on the page.',
      paragraphs: [
        'A poet picks every word for SENSE and SOUND. Read the poem aloud at least twice. Listen for ALLITERATION (repeated consonant sounds — "wild, wet wind"), ASSONANCE (repeated vowel sounds), and ONOMATOPOEIA (words that mimic sounds — "buzz", "crash"). These devices guide the reader\'s ear and create mood.',
        'IMAGERY is sense-based language: sights, sounds, smells, touches and tastes painted in words. A METAPHOR says one thing IS another ("hope is a bird"). A SIMILE uses "like" or "as" ("brave as a lion"). PERSONIFICATION gives human qualities to non-human things ("the fog crept in on little cat feet").',
        'STRUCTURE matters: how many lines, how many stanzas, how long each line is. A SONNET has 14 lines and a tight rhyme scheme. A HAIKU has 17 syllables across 3 lines. Free verse abandons regular metre. Always ask: why this shape and not a paragraph?',
        'RHYTHM and METRE control pace. STRESSED syllables fall on heavy beats. Iambic pentameter — five iambs (da-DUM) per line — is the engine of most English poetry from Shakespeare onwards. A sudden break in metre often signals a tonal pivot.',
      ],
      keyIdeas: [
        'Read aloud at least twice — your ear catches more than your eye.',
        'Devices for sound: alliteration, assonance, onomatopoeia, rhyme.',
        'Devices for image: metaphor, simile, personification, symbolism.',
        'Structure and rhythm are CHOICES — ask what they\'re doing.',
      ],
      vocabulary: [
        { term: 'Stanza', definition: 'A grouped block of lines in a poem — paragraphs in prose.' },
        { term: 'Enjambment', definition: 'When a sentence runs across a line break without punctuation.' },
        { term: 'Volta', definition: 'A turn in tone or argument inside a poem, often in a sonnet between octave and sestet.' },
        { term: 'Speaker', definition: 'The voice of the poem — not necessarily the poet themselves.' },
      ],
    },
  ],

  unit4: [
    {
      title: 'Language & Film — Reading the Moving Image',
      description:
        'A film is a text. The director chooses every frame, sound and edit to move the audience. Reading film well means naming those choices the way you would name persuasive devices in a written advert.',
      paragraphs: [
        'CAMERA SHOTS are the basic units. A WIDE shot sets the scene; a CLOSE-UP forces emotional intimacy. A LOW ANGLE makes the subject powerful; a HIGH ANGLE shrinks them. The same actor saying the same line is read completely differently depending on the shot the director chose.',
        'EDITING is how shots are stitched together. A SLOW edit (long takes) feels reflective and patient. RAPID cuts feel chaotic and urgent. A CROSS-CUT between two scenes builds tension by suggesting parallel action. Pay attention to WHERE the cut happens — that\'s a directorial decision worth analysing.',
        'SOUND has two layers. DIEGETIC sound is in the world of the film — characters can hear it (footsteps, dialogue, a radio). NON-DIEGETIC sound comes from outside the world (orchestral score, voiceover). David Attenborough\'s Our Planet uses both: roaring whales (diegetic) layered under a soaring orchestral score (non-diegetic) to create awe.',
        'MISE-EN-SCÈNE is everything visible in the frame: lighting, costume, setting, props, body language, even where actors stand relative to each other. A character on the LEFT of the frame is usually leading the eye into the scene; on the RIGHT, they\'re receiving attention.',
      ],
      keyIdeas: [
        'Every shot, cut, and sound is a directorial choice — analyse it.',
        'Shot types: wide, mid, close-up, extreme close-up. Angles: low / eye / high.',
        'Diegetic vs non-diegetic sound — both push the audience differently.',
        'Mise-en-scène: lighting + costume + setting + props + blocking.',
      ],
      vocabulary: [
        { term: 'Diegetic', definition: 'Sound originating from inside the world of the film.' },
        { term: 'Non-diegetic', definition: 'Sound added in post-production that the characters can\'t hear.' },
        { term: 'Mise-en-scène', definition: 'Everything visible in the frame — the visual design of a scene.' },
        { term: 'Establishing shot', definition: 'A wide shot at the start of a scene that anchors location and time.' },
      ],
    },
  ],

  unit5: [
    {
      title: 'Shakespeare — Reading The Taming of the Shrew',
      description:
        'Shakespeare\'s language can feel like a wall on first read. The trick is to listen for rhythm, watch for verse vs prose, and remember that every line is being SPOKEN by an actor — so every line is in service of revealing the speaker.',
      paragraphs: [
        'Most of Shakespeare\'s plays are written in IAMBIC PENTAMETER — five iambic feet per line, ten syllables, alternating unstressed and stressed (da-DUM da-DUM da-DUM da-DUM da-DUM). Listen for it: "Shall I compare thee to a summer\'s day" is perfect iambic pentameter.',
        'Characters switch between VERSE and PROSE for a reason. Nobles and lovers usually speak in verse (iambic pentameter, elevated language). Servants, fools and the lower classes often speak in PROSE. A noble suddenly dropping into prose can signal madness, jest, or honesty.',
        'A SOLILOQUY is a speech delivered alone on stage — the audience hears the character\'s real thoughts. An ASIDE is a quick comment to the audience while other characters are still on stage. Both let the audience in on something the other characters don\'t know.',
        'In The Taming of the Shrew, Katherina and Petruchio\'s relationship swings between sharp verbal sparring and longer set-piece speeches. Read them with two questions: who has the verbal upper hand at the end of the exchange? And what does each character say about gender, marriage and power?',
      ],
      keyIdeas: [
        'Iambic pentameter — five da-DUMs per line — is the default rhythm.',
        'Verse vs prose: a deliberate switch always means something.',
        'Soliloquy = alone, full inner thought. Aside = quick line to the audience.',
        'Always ask: who has the power in this exchange, and how is the language showing it?',
      ],
      vocabulary: [
        { term: 'Iambic pentameter', definition: 'Five iambs (unstressed-STRESSED) per line — ten syllables.' },
        { term: 'Soliloquy', definition: 'A speech the character delivers alone on stage, voicing their inner thoughts.' },
        { term: 'Aside', definition: 'A quick remark made to the audience while other characters can\'t hear.' },
        { term: 'Dramatic irony', definition: 'When the audience knows something a character doesn\'t.' },
      ],
    },
  ],
};
