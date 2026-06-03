'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, CheckCircle2, XCircle, ArrowRight, ArrowLeft,
  RotateCcw, Send, GraduationCap, Pencil, Shuffle, Type,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface MCQ {
  id: number; section: 'A' | 'B' | 'C'; type: 'mcq';
  text: string; context?: string;
  options: string[]; answer: string; explanation: string;
  marks: number;
}
interface Scramble {
  id: number; section: 'D'; type: 'scramble';
  hint: string; scrambledLetters: string[];
  answer: string; explanation: string;
}
type Question = MCQ | Scramble;
type SectionKey = 'A' | 'B' | 'C' | 'D';

// ── Passage ────────────────────────────────────────────────────────────────────
const PASSAGE = `The rain hammered against the train windows as Noah stared out into the darkness. Every few seconds, a flash of lightning illuminated the empty countryside beyond the tracks. Across from him, an elderly woman clutched a small leather suitcase tightly to her chest.

"You should get some rest," she said quietly.

Noah forced a smile. "I'm not tired."

That was not entirely true. He was exhausted, but the strange atmosphere inside the carriage made sleep impossible. The train had been delayed for hours, and none of the passengers seemed willing to speak above a whisper.

Suddenly, the lights flickered.

For one brief moment, the carriage was plunged into darkness.

When the lights returned, the elderly woman's suitcase was gone.

She gasped sharply. "It was right here!"

Several passengers looked up nervously, but nobody moved. Noah stood and scanned the carriage. At the far end, a tall man in a grey coat was hurrying through the connecting door.

"Stop!" Noah shouted.

The man did not turn around.

Without thinking, Noah sprinted after him. The train rocked violently beneath his feet as he pushed through the door into the next carriage. It was empty.

Completely empty.

A cold shiver crept down his spine.

Then he heard footsteps behind him.`;

// ── All Questions ──────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  // ─── SECTION A: Reading Comprehension ───────────────────────────────────────
  { id:1, section:'A', type:'mcq', marks:1,
    text:'What is the weather like outside the train?',
    context:'"The rain hammered against the train windows… a flash of lightning illuminated the empty countryside."',
    options:['Sunny and dry','Raining heavily with lightning','Foggy and misty','Snowing heavily'],
    answer:'Raining heavily with lightning',
    explanation:'"The rain hammered against the train windows" = heavy rain. "A flash of lightning illuminated the empty countryside" = lightning. Together they describe a violent storm.' },

  { id:2, section:'A', type:'mcq', marks:1,
    text:'Which single word in the passage tells us Noah is very tired?',
    context:'"That was not entirely true. He was exhausted…"',
    options:['delayed','impossible','exhausted','nervous'],
    answer:'exhausted',
    explanation:'"Exhausted" means extremely tired — far stronger than "tired". It directly contradicts his earlier claim of "I\'m not tired," revealing the truth of his condition.' },

  { id:3, section:'A', type:'mcq', marks:2,
    text:'Why does Noah find it difficult to sleep? Choose the best answer.',
    context:'"…the strange atmosphere inside the carriage made sleep impossible. The train had been delayed for hours…"',
    options:[
      'The train is too noisy for sleeping',
      'He is worried about missing his stop',
      'The strange atmosphere and long delay combined to make sleep impossible',
      'The elderly woman kept asking him questions'],
    answer:'The strange atmosphere and long delay combined to make sleep impossible',
    explanation:'Two reasons: (1) "the strange atmosphere inside the carriage made sleep impossible" and (2) "The train had been delayed for hours." Both must be identified for full marks.' },

  { id:4, section:'A', type:'mcq', marks:4,
    text:'Which technique best describes how the writer creates suspense? Choose the most complete answer.',
    context:'"Suddenly, the lights flickered." / "Completely empty."',
    options:[
      'Long descriptions of the dark countryside outside',
      'Short sharp sentences and sudden unexplained events that leave questions unanswered',
      'Polite conversation between all the passengers',
      'Detailed background information about Noah\'s past'],
    answer:'Short sharp sentences and sudden unexplained events that leave questions unanswered',
    explanation:'Evidence: (1) "Suddenly, the lights flickered." — an abrupt one-sentence shock. (2) "Completely empty." — a fragment that forces the reader to pause. (3) The vanishing suitcase and empty carriage create unexplained mystery. Short sentences mirror panic.' },

  { id:5, section:'A', type:'mcq', marks:3,
    text:'What impression do we get of the elderly woman?',
    context:'"…an elderly woman clutched a small leather suitcase tightly to her chest."',
    options:[
      'She is calm and confident throughout',
      'She is rude and unhelpful to other passengers',
      'She is anxious and fiercely protective of her suitcase',
      'She is suspicious and likely a thief'],
    answer:'She is anxious and fiercely protective of her suitcase',
    explanation:'"Clutched tightly to her chest" — "clutched" = gripped firmly; "tightly to her chest" = guarding something precious. Her gasp "It was right here!" confirms panic and distress when it vanishes.' },

  { id:6, section:'A', type:'mcq', marks:3,
    text:'Why is the sentence "It was empty. Completely empty." effective?',
    context:'"…he pushed through the door into the next carriage. It was empty. Completely empty."',
    options:[
      'It introduces a brand new character into the story',
      'It tells us Noah has found the missing suitcase',
      'The repetition and short fragment create shock and emphasise eerie impossibility',
      'It speeds the narrative past an unimportant moment'],
    answer:'The repetition and short fragment create shock and emphasise eerie impossibility',
    explanation:'"Completely empty" repeats "empty" — dramatic emphasis through repetition. The sentence fragment forces the reader to stop and absorb the impossibility. Short structure mirrors Noah\'s stunned shock.' },

  { id:7, section:'A', type:'mcq', marks:3,
    text:'Predict what might happen next, using evidence from the passage.',
    context:'"A cold shiver crept down his spine. Then he heard footsteps behind him."',
    options:[
      'Noah finds the suitcase and returns it calmly to the woman',
      'The train arrives safely at the next station',
      'Noah turns to confront whoever followed him into the empty carriage',
      'Noah falls asleep and dreams about the journey'],
    answer:'Noah turns to confront whoever followed him into the empty carriage',
    explanation:'Footsteps in an "empty" carriage means someone followed Noah without being seen. The story ends at peak tension. Evidence of danger throughout (flickering lights, running man, cold shiver) all point to a confrontation.' },

  { id:8, section:'A', type:'mcq', marks:3,
    text:'What is the effect of the final sentence "Then he heard footsteps behind him" on the reader?',
    context:'"A cold shiver crept down his spine. Then he heard footsteps behind him."',
    options:[
      'It resolves the mystery and brings closure',
      'It creates a cliffhanger — suspense peaks and the reader is left wanting more',
      'It confirms Noah has caught the man in the grey coat',
      'It suggests Noah is no longer frightened'],
    answer:'It creates a cliffhanger — suspense peaks and the reader is left wanting more',
    explanation:'A cliffhanger ends at the highest moment of tension with no resolution. New footsteps in a supposedly empty carriage raise danger to maximum. The reader is compelled to continue — a deliberate structural technique.' },

  // ─── SECTION B: Vocabulary & Grammar ────────────────────────────────────────
  { id:9, section:'B', type:'mcq', marks:1,
    text:'Which word is closest in meaning to "illuminated" as used in the passage?',
    context:'"…a flash of lightning illuminated the empty countryside beyond the tracks."',
    options:['darkened','brightened','destroyed','hidden'],
    answer:'brightened',
    explanation:'"Illuminated" = lit up / made bright. The lightning briefly brightens the dark countryside. Root: Latin "illuminare" (to light up). Antonym: darkened.' },

  { id:10, section:'B', type:'mcq', marks:1,
    text:'Choose the grammatically correct sentence.',
    options:[
      "Noah dont trust the passengers.",
      "Noah doesn't trusts the passengers.",
      "Noah doesn't trust the passengers.",
      "Noah didn't trusted the passengers."],
    answer:"Noah doesn't trust the passengers.",
    explanation:'Present tense, 3rd person singular: "does not" → "doesn\'t" + base verb "trust" (no extra -s). A: missing apostrophe + wrong form. B: extra -s. D: double past marker (didn\'t + trusted).' },

  { id:11, section:'B', type:'mcq', marks:1,
    text:'Which word is an adjective?',
    options:['sprinted','nervous','sharply','shouted'],
    answer:'nervous',
    explanation:'"Nervous" describes a noun — how the passengers appeared. "Sprinted" and "shouted" are verbs. "Sharply" is an adverb (modifies a verb). Adjective test: does it answer "what kind?"' },

  { id:12, section:'B', type:'mcq', marks:2,
    text:'Which version correctly adds the missing punctuation?',
    context:'Original (unpunctuated): what are you doing asked noah',
    options:[
      '"What are you doing." asked Noah.',
      '"What are you doing?" asked Noah.',
      '"what are you doing?" asked Noah.',
      '"What are you doing?" Asked Noah.'],
    answer:'"What are you doing?" asked Noah.',
    explanation:'Direct question inside speech marks → question mark (?) before closing speech mark. "asked" is a reporting verb continuing the sentence — no capital letter. Speech opens with capital "W".' },

  { id:13, section:'B', type:'mcq', marks:2,
    text:'Rewrite in past tense: "The train moves slowly through the station."',
    options:[
      'The train has moved slowly through the station.',
      'The train moved slowly through the station.',
      'The train will move slowly through the station.',
      'The train is moving slowly through the station.'],
    answer:'The train moved slowly through the station.',
    explanation:'Simple past: "moves" → "moved" (regular verb, add -d). A = present perfect. C = future simple. D = present continuous.' },

  { id:14, section:'B', type:'mcq', marks:2,
    text:'Identify the subordinate clause in: "Although the train was delayed, nobody complained."',
    options:[
      'nobody complained',
      'Although the train was delayed',
      'the train was delayed',
      'the train was delayed, nobody complained'],
    answer:'Although the train was delayed',
    explanation:'"Although the train was delayed" cannot stand alone as a sentence — it depends on "nobody complained" (the main clause) for meaning. "Although" is a subordinating conjunction: it always introduces a subordinate clause.' },

  { id:15, section:'B', type:'mcq', marks:2,
    text:'Replace "walked quickly" with a more ambitious vocabulary choice.',
    context:'"The man walked quickly through the carriage."',
    options:[
      'The man went through the carriage.',
      'The man moved through the carriage.',
      'The man strode briskly through the carriage.',
      'The man hurried a lot through the carriage.'],
    answer:'The man strode briskly through the carriage.',
    explanation:'"Strode" (moved with long purposeful steps) and "briskly" (with speed and energy) replace "walked quickly" with precise, vivid language. Options A and B are vaguer; D is informal and clumsy.' },

  { id:16, section:'B', type:'mcq', marks:1,
    text:'Which sentence corrects the spelling error in: "The passangers looked anxiously at one another."',
    options:[
      'The passangers looked anxiously at one another.',
      'The passengers looked anxiously at one another.',
      'The passingers looked anxiously at one another.',
      'The passangers looked ansiously at one another.'],
    answer:'The passengers looked anxiously at one another.',
    explanation:'Correct: PASSENGERS. Error was "passangers" — "a" instead of "e" in the second syllable. Remember: PASS-EN-GERS. Root: from "passing" through.' },

  { id:17, section:'B', type:'mcq', marks:3,
    text:'Which is the best simile to describe the storm?',
    options:[
      'The storm was very loud and wet.',
      'The thunder crashed like an angry giant slamming a door.',
      'It was raining outside the train.',
      'The storm was big and scary.'],
    answer:'The thunder crashed like an angry giant slamming a door.',
    explanation:'A simile uses "like" or "as" to compare two unlike things for vivid effect. "Like an angry giant slamming a door" is specific, unexpected, and creates a strong sensory image. The other options are plain statements with no comparison.' },

  // ─── SECTION C: Punctuation Fix ─────────────────────────────────────────────
  { id:18, section:'C', type:'mcq', marks:2,
    text:'Which version correctly punctuates this sentence from the adventure park story?',
    context:'Unpunctuated: "last saturday my cousins and i visited the new adventure park in the city"',
    options:[
      'Last saturday my cousins and I visited the new adventure park in the city.',
      'Last Saturday, my cousins and I visited the new adventure park in the city.',
      'Last Saturday my cousins and i visited the new Adventure Park in the city.',
      'last Saturday, My cousins and I visited the new adventure park in the city.'],
    answer:'Last Saturday, my cousins and I visited the new adventure park in the city.',
    explanation:'"Last Saturday" starts the sentence → capital L. "Saturday" is a proper noun → capital S. Comma after "Saturday" separates the introductory time phrase. "I" is always capitalised. "adventure park" is a common noun — no capitals needed.' },

  { id:19, section:'C', type:'mcq', marks:2,
    text:'Choose the correctly punctuated version of this sentence.',
    context:'Unpunctuated: "i cant believe how fast that ride was said adam while eating his chips"',
    options:[
      '"I can\'t believe how fast that ride was!" said Adam while eating his chips.',
      '"I cant believe how fast that ride was!" Said Adam while eating his chips.',
      '"i can\'t believe how fast that ride was!" said adam while eating his chips.',
      '"I can\'t believe how fast that ride was." said Adam, while eating his chips.'],
    answer:'"I can\'t believe how fast that ride was!" said Adam while eating his chips.',
    explanation:'Speech opens with capital "I". Apostrophe in "can\'t" = missing "no". Exclamation mark (!) fits the excited tone. "said" after the speech does NOT start a new sentence → no capital. "Adam" is a proper noun → always capitalised.' },

  { id:20, section:'C', type:'mcq', marks:2,
    text:'Which version correctly punctuates this sentence from the talent show story?',
    context:'Unpunctuated: "i hope i dont forget my words whispered yusuf as he waited behind the curtain"',
    options:[
      '"I hope I dont forget my words," whispered Yusuf as he waited behind the curtain.',
      '"I hope I don\'t forget my words," whispered Yusuf as he waited behind the curtain.',
      '"I hope I don\'t forget my words." Whispered Yusuf as he waited behind the curtain.',
      '"I hope I don\'t forget my words," Whispered Yusuf as he waited behind the curtain.'],
    answer:'"I hope I don\'t forget my words," whispered Yusuf as he waited behind the curtain.',
    explanation:'"don\'t" needs the apostrophe (replaces "o" in "not"). Comma inside the speech marks before the reporting clause. "whispered" is not a new sentence → no capital. Both "I" pronouns are always capitalised.' },

  { id:21, section:'C', type:'mcq', marks:2,
    text:'Which sentence correctly uses an apostrophe for possession and commas for a list?',
    context:'Unpunctuated: "the judges praised the students creativity confidence and teamwork"',
    options:[
      "The judges praised the student's creativity, confidence and teamwork.",
      "The judges praised the students' creativity, confidence and teamwork.",
      "The judges praised the students creativity, confidence, and teamwork.",
      "The judges praised the students's creativity, confidence and teamwork."],
    answer:"The judges praised the students' creativity, confidence and teamwork.",
    explanation:'Multiple students own the creativity → plural possession: students\'. For plural nouns ending in "s", add only the apostrophe after the "s". "student\'s" (singular) and "students\'s" are both wrong here.' },

  { id:22, section:'C', type:'mcq', marks:2,
    text:'Which version correctly punctuates this sentence from the farm story?',
    context:'Unpunctuated: "grandad shouted quick come and look at the new baby goat"',
    options:[
      'Grandad shouted, "Quick, come and look at the new baby goat!"',
      'Grandad shouted "Quick come and look at the new baby goat!"',
      'grandad shouted, "quick, come and look at the new baby goat!"',
      'Grandad shouted "Quick, come and look at the new baby goat."'],
    answer:'Grandad shouted, "Quick, come and look at the new baby goat!"',
    explanation:'"Grandad" used as a name/title → capital G. Comma after "shouted" introduces the direct speech. "Quick" starts the speech → capital Q. Comma after "Quick" separates the exclamation from the instruction. Exclamation mark conveys urgency.' },

  { id:23, section:'C', type:'mcq', marks:2,
    text:'Which sentence shows the correct apostrophe for possession?',
    context:'"we stayed at our grandparents farm in the countryside"',
    options:[
      "We stayed at our grandparent's farm in the countryside.",
      "We stayed at our grandparents' farm in the countryside.",
      "We stayed at our grandparents's farm in the countryside.",
      "We stayed at our grandparents farm in the countryside."],
    answer:"We stayed at our grandparents' farm in the countryside.",
    explanation:'Two grandparents own the farm → plural possession. Plural noun ending in "s": add apostrophe after the "s" only → grandparents\'. "Grandparent\'s" = only one grandparent. "Grandparents\'s" is never correct.' },

  // ─── SECTION D: Spelling Scramble ───────────────────────────────────────────
  { id:24, section:'D', type:'scramble', hint:'Meaning: "to reside" (verb) or "alive / on-air" (adjective)', scrambledLetters:['E','V','L','I'], answer:'live', explanation:'LIVE — "They live in France." (verb, rhymes with give) / "The show is live." (adjective, rhymes with five). Two pronunciations!' },
  { id:25, section:'D', type:'scramble', hint:'Meaning: "of different kinds; several"', scrambledLetters:['R','I','U','O','A','S','V'], answer:'various', explanation:'VARIOUS — "There are various reasons to consider." From Latin "varius" (varied). Ends in -ious.' },
  { id:26, section:'D', type:'scramble', hint:'Meaning: "the ordinal number after the eighteenth"', scrambledLetters:['N','T','H','E','N','E','I','T','N','H'], answer:'nineteenth', explanation:'NINETEENTH — nine + teen + th. Keep the "e": nineteen → nineteenth. Common error: dropping the "e" before "th".' },
  { id:27, section:'D', type:'scramble', hint:'Meaning: "stocks of food or materials"', scrambledLetters:['P','U','L','S','E','S','P','I'], answer:'supplies', explanation:'SUPPLIES — supply → supplies (y → ies). "The expedition ran low on supplies."' },
  { id:28, section:'D', type:'scramble', hint:'Meaning: "food and nutrients needed for health"', scrambledLetters:['O','R','U','M','H','E','N','T','S','N','I'], answer:'nourishment', explanation:'NOURISHMENT — nourish + ment. Key: nour- not nur-. From Old French "norrir" (to feed).' },
  { id:29, section:'D', type:'scramble', hint:'Meaning: "sadly; as a result of bad luck"', scrambledLetters:['O','T','U','L','R','F','N','A','E','Y','U','N','T'], answer:'unfortunately', explanation:'UNFORTUNATELY — un + fortunate + ly. Keep the "e" before "ly". Break it: un-fort-un-ate-ly.' },
  { id:30, section:'D', type:'scramble', hint:'Meaning: "to gradually become smaller or fewer"', scrambledLetters:['I','W','D','N','L','E','D'], answer:'dwindle', explanation:'DWINDLE — "The supplies began to dwindle." Note the -le ending. From Middle English "dwinnen".' },
  { id:31, section:'D', type:'scramble', hint:'Meaning: "an area of land under the control of a ruler or state"', scrambledLetters:['E','R','I','T','R','O','Y','T','R'], answer:'territory', explanation:'TERRITORY — ter-ri-to-ry. Three r\'s total. From Latin "territorium" (land around a town).' },
  { id:32, section:'D', type:'scramble', hint:'Meaning: "tried to find" (past tense of seek)', scrambledLetters:['U','H','T','G','S','O'], answer:'sought', explanation:'SOUGHT — irregular past tense of "seek". Pattern: seek → sought (like teach → taught). The -ough- cluster is the tricky part.' },
  { id:33, section:'D', type:'scramble', hint:'Meaning: "endangered; put at risk of harm"', scrambledLetters:['E','T','R','H','D','N','A','E','T','E'], answer:'threatened', explanation:'THREATENED — threaten + ed. Note the "ea" pair: thre-at-ened. "The species is threatened with extinction."' },
  { id:34, section:'D', type:'scramble', hint:'Meaning: "the act of completely ruining something"', scrambledLetters:['T','R','E','S','I','D','N','U','O','C','T'], answer:'destruction', explanation:'DESTRUCTION — destruct + ion. Note: destroy → destruction (NOT "destroytion"). From Latin "destructionem".' },
  { id:35, section:'D', type:'scramble', hint:'Meaning: "connected or linked with"', scrambledLetters:['S','I','C','O','D','A','E','S','T','A'], answer:'associated', explanation:'ASSOCIATED — associate + d. Five vowels! a-o-ia-e. "Smoking is associated with health risks." From Latin "associare".' },
  { id:36, section:'D', type:'scramble', hint:'Meaning: "plant life of a particular area"', scrambledLetters:['E','T','A','I','O','G','V','N','T','E'], answer:'vegetation', explanation:'VEGETATION — vegetat + ion. Note: vege- not veggi-. From Latin "vegetare" (to enliven).' },
  { id:37, section:'D', type:'scramble', hint:'Meaning: "going away; becoming less common"', scrambledLetters:['P','A','R','I','D','E','I','A','P','G','S','N'], answer:'disappearing', explanation:'DISAPPEARING — dis + ap + pear + ing. Double "p": dis-ap-pear. "The rainforests are disappearing rapidly."' },
  { id:38, section:'D', type:'scramble', hint:'Meaning: "existing in large amounts; more than enough"', scrambledLetters:['T','I','L','N','E','F','P','U','L'], answer:'plentiful', explanation:'PLENTIFUL — plenty + ful (y → i). "Food was plentiful at harvest." Antonym: scarce.' },
  { id:39, section:'D', type:'scramble', hint:'Meaning: "people who study or work in a branch of science"', scrambledLetters:['T','I','C','S','S','E','N','T','I','S'], answer:'scientists', explanation:'SCIENTISTS — science + tists. Key: scien- not sien-. From Latin "scientia" (knowledge).' },
  { id:40, section:'D', type:'scramble', hint:'Meaning: "able to exist together without conflict"', scrambledLetters:['A','M','I','T','P','L','E','O','C','B'], answer:'compatible', explanation:'COMPATIBLE — com-pat-ible. Note: -ible not -able. From Latin "compati" (to sympathise).' },
];

const SECTIONS: { key: SectionKey; label: string; desc: string; colour: string; icon: React.ReactNode }[] = [
  { key:'A', label:'Section A', desc:'Reading Comprehension', colour:'text-blue-600 bg-blue-50 border-blue-200', icon:<BookOpen className="w-4 h-4"/> },
  { key:'B', label:'Section B', desc:'Vocabulary & Grammar', colour:'text-violet-600 bg-violet-50 border-violet-200', icon:<Type className="w-4 h-4"/> },
  { key:'C', label:'Section C', desc:'Punctuation Fix', colour:'text-amber-600 bg-amber-50 border-amber-200', icon:<Pencil className="w-4 h-4"/> },
  { key:'D', label:'Section D', desc:'Spelling Scramble', colour:'text-emerald-600 bg-emerald-50 border-emerald-200', icon:<Shuffle className="w-4 h-4"/> },
];

const SECTION_ORDER: SectionKey[] = ['A','B','C','D'];

// ── Scramble tile component ────────────────────────────────────────────────────
interface Tile { letter: string; key: string; }

function ScrambleInput({
  q, value, onChange, submitted,
}: { q: Scramble; value: string; onChange: (w: string) => void; submitted: boolean }) {
  const init = useCallback(
    () => q.scrambledLetters.map((l, i) => ({ letter: l, key: `${l}-${i}` })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q.id],
  );
  const [pool, setPool] = useState<Tile[]>(init);
  const [placed, setPlaced] = useState<Tile[]>([]);

  useEffect(() => { setPool(init()); setPlaced([]); }, [init]);
  useEffect(() => { onChange(placed.map(t => t.letter).join('').toLowerCase()); }, [placed, onChange]);

  const place = (key: string) => {
    if (submitted) return;
    const t = pool.find(x => x.key === key); if (!t) return;
    setPool(p => p.filter(x => x.key !== key));
    setPlaced(p => [...p, t]);
  };
  const unplace = (key: string) => {
    if (submitted) return;
    const t = placed.find(x => x.key === key); if (!t) return;
    setPlaced(p => p.filter(x => x.key !== key));
    setPool(p => [...p, t]);
  };
  const clear = () => { if (submitted) return; setPool(init()); setPlaced([]); };

  const isCorrect = submitted && value === q.answer.toLowerCase();
  const isWrong   = submitted && value !== q.answer.toLowerCase();

  return (
    <div className="space-y-3">
      {/* placed area */}
      <div className={`min-h-[3rem] flex flex-wrap gap-1.5 items-center p-3 rounded-xl border-2 transition ${
        isCorrect ? 'border-emerald-400 bg-emerald-50' : isWrong ? 'border-rose-400 bg-rose-50' : 'border-indigo-300 bg-indigo-50'
      }`}>
        {placed.length === 0
          ? <span className="text-xs text-slate-400 italic">Click letters below to build the word…</span>
          : placed.map(t => (
              <button key={t.key} onClick={() => unplace(t.key)} disabled={submitted}
                className="w-9 h-9 rounded-lg bg-indigo-500 text-white font-black text-sm flex items-center justify-center hover:bg-indigo-400 disabled:opacity-60 active:scale-95 transition select-none">
                {t.letter}
              </button>
            ))
        }
      </div>
      {/* pool */}
      <div className="flex flex-wrap gap-1.5">
        {pool.map(t => (
          <button key={t.key} onClick={() => place(t.key)} disabled={submitted}
            className="w-9 h-9 rounded-lg bg-amber-400 text-slate-900 font-black text-sm flex items-center justify-center hover:bg-amber-300 disabled:opacity-50 active:scale-95 transition select-none">
            {t.letter}
          </button>
        ))}
      </div>
      {!submitted && placed.length > 0 && (
        <button onClick={clear} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition">
          <RotateCcw className="w-3 h-3"/> Clear
        </button>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function NGRTFinalExam() {
  type Phase = 'intro' | SectionKey | 'results';
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [passageOpen, setPassageOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = useCallback((id: number, val: string) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  }, []);

  const sectionQs = (s: SectionKey) => QUESTIONS.filter(q => q.section === s);
  const totalMarks = QUESTIONS.filter((q): q is MCQ => q.type === 'mcq').reduce((s, q) => s + q.marks, 0) + sectionQs('D').length;

  const score = () => {
    let correct = 0;
    QUESTIONS.forEach(q => {
      const ans = (answers[q.id] ?? '').trim().toLowerCase();
      const cor = q.answer.toLowerCase();
      if (ans === cor) correct++;
    });
    return correct;
  };

  const sectionScore = (s: SectionKey) => {
    const qs = sectionQs(s);
    return qs.filter(q => (answers[q.id] ?? '').trim().toLowerCase() === q.answer.toLowerCase()).length;
  };

  const sectionTotal = (s: SectionKey) => sectionQs(s).length;

  const currentSectionIdx = SECTION_ORDER.indexOf(phase as SectionKey);
  const isLastSection = currentSectionIdx === SECTION_ORDER.length - 1;

  const goNext = () => {
    if (isLastSection) { setSubmitted(true); setPhase('results'); }
    else setPhase(SECTION_ORDER[currentSectionIdx + 1]);
  };
  const goPrev = () => {
    if (currentSectionIdx > 0) setPhase(SECTION_ORDER[currentSectionIdx - 1]);
  };

  // ── Intro ────────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-10 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-black mb-1">Year 8 English NGRT Final Exam</h1>
            <p className="text-blue-200 text-sm font-medium">New Group Reading Test · 45 minutes · 50 marks</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 gap-3 mb-8">
              {SECTIONS.map(s => (
                <div key={s.key} className={`flex items-center gap-3 p-4 rounded-2xl border ${s.colour}`}>
                  {s.icon}
                  <div>
                    <p className="font-black text-xs uppercase tracking-wide">{s.label}</p>
                    <p className="text-xs font-medium opacity-75">{s.desc} · {sectionTotal(s.key)} Qs</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-sm text-slate-600 space-y-1">
              <p>📖 <strong>Section A:</strong> Read the passage carefully, then answer questions from memory.</p>
              <p>✏️ <strong>Sections B & C:</strong> Choose the best answer from the four options.</p>
              <p>🔤 <strong>Section D:</strong> Rearrange the letter tiles to spell each word correctly.</p>
              <p>✅ <strong>Answers & explanations</strong> are revealed in full at the end.</p>
            </div>
            <button onClick={() => setPhase('A')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition shadow-sm">
              Start Exam <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ──────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const total = score();
    const pct = Math.round((total / QUESTIONS.length) * 100);
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
        {/* Score banner */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-indigo-600"/>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Exam Complete</h2>
          <p className="text-slate-500 mb-6">Year 8 English NGRT Final Exam</p>
          <div className="inline-block bg-slate-50 border border-slate-200 rounded-2xl px-12 py-6">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Total Score</p>
            <p className="text-5xl font-black text-indigo-600">{total} <span className="text-2xl text-slate-400">/ {QUESTIONS.length}</span></p>
            <p className="text-slate-500 text-sm mt-1">{pct}% · {pct >= 70 ? '🌟 Excellent' : pct >= 50 ? '👍 Good effort' : '📚 Keep practising'}</p>
          </div>
          {/* Section breakdown */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {SECTIONS.map(s => (
              <div key={s.key} className={`p-3 rounded-xl border text-center ${s.colour}`}>
                <p className="font-black text-lg">{sectionScore(s.key)}<span className="text-xs font-normal opacity-60">/{sectionTotal(s.key)}</span></p>
                <p className="text-[10px] font-bold uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => { setPhase('intro'); setAnswers({}); setSubmitted(false); setPassageOpen(true); }}
            className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition">
            Restart Exam
          </button>
        </div>

        {/* Full answer review */}
        {SECTIONS.map(s => (
          <div key={s.key} className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className={`px-6 py-4 border-b flex items-center gap-3 ${s.colour}`}>
              {s.icon}
              <div>
                <p className="font-black text-sm uppercase tracking-wide">{s.label}: {s.desc}</p>
                <p className="text-xs opacity-75">{sectionScore(s.key)} / {sectionTotal(s.key)} correct</p>
              </div>
            </div>
            {s.key === 'A' && (
              <div className="px-6 pt-4 pb-2">
                <details open className="group">
                  <summary className="cursor-pointer text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 select-none">
                    <BookOpen className="w-3.5 h-3.5"/> Reading Passage (click to show/hide)
                  </summary>
                  <div className="mt-2 max-h-48 overflow-y-auto text-sm text-slate-600 bg-slate-50 rounded-xl border border-slate-200 p-4 leading-relaxed">
                    {PASSAGE.split('\n\n').map((p, i) => <p key={i} className="mb-2 last:mb-0">{p}</p>)}
                  </div>
                </details>
              </div>
            )}
            <div className="divide-y divide-slate-100">
              {sectionQs(s.key).map((q, idx) => {
                const userAns = (answers[q.id] ?? '').trim().toLowerCase();
                const correct = q.answer.toLowerCase();
                const right = userAns === correct;
                return (
                  <div key={q.id} className="px-6 py-5">
                    <div className="flex gap-3">
                      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5 ${right ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        {right ? '✓' : '✗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm mb-1">Q{idx+1}. {q.type === 'scramble' ? q.hint : q.text}</p>
                        {q.type === 'mcq' && q.context && (
                          <p className="text-xs italic text-slate-400 border-l-2 border-amber-300 pl-2 mb-2">{q.context}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm mb-2">
                          <span>Your answer: <strong className={right ? 'text-emerald-600' : 'text-rose-600'}>{answers[q.id] ? answers[q.id].toUpperCase() : '(no answer)'}</strong></span>
                          {!right && <span>Correct: <strong className="text-emerald-600">{q.answer.toUpperCase()}</strong></span>}
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Explanation</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Active section ────────────────────────────────────────────────────────────
  const sec = phase as SectionKey;
  const secMeta = SECTIONS.find(s => s.key === sec)!;
  const qs = sectionQs(sec);
  const answered = qs.filter(q => (answers[q.id] ?? '').trim().length > 0).length;
  const progress = Math.round((answered / qs.length) * 100);

  return (
    <div className="max-w-2xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 mb-6 -mx-4 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wide ${secMeta.colour}`}>
            {secMeta.icon} {secMeta.label}: {secMeta.desc}
          </div>
          <span className="text-xs font-bold text-slate-500">{answered}/{qs.length} answered</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}/>
        </div>
        <div className="flex justify-between mt-1">
          {SECTION_ORDER.map((s, i) => (
            <div key={s} className={`text-[9px] font-black uppercase tracking-widest ${s === sec ? 'text-indigo-600' : i < currentSectionIdx ? 'text-emerald-500' : 'text-slate-300'}`}>
              {s === sec ? `▶ ${s}` : i < currentSectionIdx ? `✓ ${s}` : s}
            </div>
          ))}
        </div>
      </div>

      {/* Reading passage (Section A only) */}
      {sec === 'A' && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 overflow-hidden">
          <button onClick={() => setPassageOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-3 text-blue-700 font-bold text-sm hover:bg-blue-100 transition">
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4"/> Reading Passage — click to {passageOpen ? 'hide' : 'show'}</span>
            {passageOpen ? <XCircle className="w-4 h-4 opacity-50"/> : <ArrowRight className="w-4 h-4 opacity-50"/>}
          </button>
          {passageOpen && (
            <div className="px-5 pb-5 max-h-60 overflow-y-auto">
              {PASSAGE.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-slate-700 mb-3 last:mb-0 leading-relaxed">{para}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {qs.map((q, idx) => {
          const userAns = answers[q.id] ?? '';
          return (
            <div key={q.id} className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border ${secMeta.colour}`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {q.type === 'mcq' && q.context && (
                    <p className="text-xs italic text-slate-400 border-l-2 border-amber-300 pl-2 mb-2">{q.context}</p>
                  )}
                  <p className="font-semibold text-slate-900 text-sm leading-snug">
                    {q.type === 'scramble' ? q.hint : q.text}
                    {q.type === 'mcq' && q.marks > 1 && (
                      <span className="ml-2 text-[10px] font-bold text-slate-400">({q.marks} marks)</span>
                    )}
                  </p>
                </div>
              </div>

              {q.type === 'mcq' ? (
                <div className="grid grid-cols-1 gap-2 ml-10">
                  {q.options.map((opt, i) => (
                    <button key={i} onClick={() => setAnswer(q.id, opt)}
                      className={`text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                        userAns === opt
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50'
                      }`}>
                      <span className="font-black text-slate-400 mr-2">{String.fromCharCode(65+i)}.</span>{opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="ml-10">
                  <ScrambleInput
                    q={q as Scramble}
                    value={userAns}
                    onChange={val => setAnswer(q.id, val)}
                    submitted={submitted}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
        <button onClick={goPrev} disabled={currentSectionIdx === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition">
          <ArrowLeft className="w-4 h-4"/> Back
        </button>
        <span className="text-xs text-slate-400 font-bold">
          {answered < qs.length && <span className="text-amber-500">{qs.length - answered} unanswered · </span>}
          Section {currentSectionIdx + 1} of {SECTION_ORDER.length}
        </span>
        <button onClick={goNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition shadow-sm ${
            isLastSection ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}>
          {isLastSection ? <><Send className="w-4 h-4"/> Submit Exam</> : <>Next Section <ArrowRight className="w-4 h-4"/></>}
        </button>
      </div>
    </div>
  );
}
