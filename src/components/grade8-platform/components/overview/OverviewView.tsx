import React from 'react';
import { Target, Layers, BrainCircuit, Milestone, PlayCircle, Maximize2 } from 'lucide-react';
import { UnitId, SubjectId } from '../../types';

function VideoEmbed({ videoId, title }: { videoId: string, title?: string }) {
  if (!videoId) return null;
  return (
    <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 mb-8 relative group">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title || "Educational Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export function OverviewView({ unit, subject }: { unit: UnitId, subject?: SubjectId }) {
  if (subject === 'science') {
      const getScienceData = () => {
      switch (unit) {
        case 'unit1': return {
          title: "Who are we?", concept: "Systems", related: "Function, Balance, Interaction", context: "Identities and Relationships",
          soi: "Human biological systems rely on interconnected structures and physiological balances to maintain life and interact with the environment.", color: "emerald", videoId: "gEUu-A2wfSE",
          topics: [
            { name: "Cellular Organization", desc: "Understanding the hierarchy of life from cells to tissues, organs, organ systems, and organisms.", example: "E.g., Heart muscle cells form cardiac tissue, making up the heart (organ), part of the circulatory system." },
            { name: "The Digestive System", desc: "The mechanical and chemical breakdown of food into nutrients.", example: "E.g., Enzymes in saliva breaking down starch into simple sugars." },
            { name: "The Circulatory & Respiratory Systems", desc: "How oxygen and nutrients are delivered to cells while removing waste.", example: "E.g., Alveoli in lungs exchanging gas with capillaries." },
            { name: "Homeostasis", desc: "The maintenance of a stable internal environment despite external changes.", example: "E.g., Sweating when hot to cool down the body." }
          ]
        };
        case 'unit2': return {
          title: "How do we map matter?", concept: "Change", related: "Structure, Properties, Evidence", context: "Orientation in Space and Time",
          soi: "Classifying the atomic structures and properties of matter provides essential evidence for understanding chemical and physical transformations.", color: "teal", videoId: "thnDxFdkzZs",
          topics: [
            { name: "The Atom", desc: "The fundamental unit of matter consisting of protons, neutrons, and electrons.", example: "E.g., Drawing a Bohr model of a Lithium atom." },
            { name: "Elements, Compounds, and Mixtures", desc: "Classifying pure substances and physical combinations.", example: "E.g., Water (H2O) is a compound, salt water is a mixture." },
            { name: "The Periodic Table", desc: "Organizing elements by atomic number and chemical properties.", example: "E.g., Recognizing noble gases as unreactive elements." },
            { name: "Physical vs. Chemical Change", desc: "Distinguishing between changes in state/shape and the formation of new substances.", example: "E.g., Ice melting is physical; iron rusting is chemical." }
          ]
        };
        case 'unit3': return {
          title: "Ecology - How does our planet work?", concept: "Relationships", related: "Interaction, Energy, Environment", context: "Globalization and Sustainability",
          soi: "Energy transfer and organism interactions within an environment determine the stability and sustainability of ecosystems.", color: "green", videoId: "sjE-Pkjp3u4",
          topics: [
            { name: "Ecosystem Structure", desc: "Identifying biotic and abiotic components in an environment.", example: "E.g., Plants and animals interacting with soil and sunlight." },
            { name: "Energy Flow", desc: "Tracing energy from the sun through producers and consumers.", example: "E.g., A food chain showing Grass → Grasshopper → Frog → Snake." },
            { name: "Ecological Pyramids", desc: "Understanding energy loss at each trophic level.", example: "E.g., Only ~10% of energy transfers from primary producers to herbivores." },
            { name: "Interdependence", desc: "How species rely on each other for survival.", example: "E.g., Symbiotic relationship between bees and flowering plants." }
          ]
        };
        case 'unit4': return {
          title: "Where are we now and where might we be going?", concept: "Global Interactions", related: "Consequences, Energy, Sustainability", context: "Scientific and Technical Innovation",
          soi: "Technical innovations in energy production have global environmental consequences that require sustainable solutions for our future.", color: "cyan", videoId: "G4H1N_yXBiA",
          topics: [
            { name: "Energy Sources", desc: "Evaluating renewable vs. non-renewable energy options.", example: "E.g., Comparing solar panels to coal-fired power plants." },
            { name: "Electricity Generation", desc: "How kinetic energy is converted into electrical energy.", example: "E.g., Using a turbine and generator in a wind farm." },
            { name: "Climate Change Mechanics", desc: "Understanding the greenhouse effect and human impact.", example: "E.g., High CO2 emissions trapping infrared radiation in the atmosphere." },
            { name: "Human Footprint", desc: "Calculating ecological impact and proposing sustainable habits.", example: "E.g., Reducing single-use plastics to decrease landfill waste." }
          ]
        };
        case 'unit5': return {
          title: "What does a wave tell us", concept: "Relationships", related: "Models, Movement, Energy", context: "Orientation in Space and Time",
          soi: "Waves serve as mathematical models for understanding how energy moves through space and time, enabling information transfer across distances.", color: "blue", videoId: "RVyHkV3wIyk",
          topics: [
            { name: "Wave Properties", desc: "Understanding amplitude, wavelength, frequency, and period.", example: "E.g., Measuring the crest-to-crest distance on an ocean wave." },
            { name: "The Wave Equation", desc: "Calculating wave speed using v = fλ.", example: "E.g., Finding the speed of a sound wave given its frequency and wavelength." },
            { name: "Sound Waves", desc: "Analyzing longitudinal waves and pitch vs. volume.", example: "E.g., A higher frequency sound wave produces a higher pitch." },
            { name: "Light and the EM Spectrum", desc: "Exploring transverse waves and electromagnetic radiation.", example: "E.g., Comparing radio waves (low frequency) to gamma rays (high frequency)." }
          ]
        };
        case 'unit6': return {
          title: "Photosynthesis", concept: "Energy", related: "Transformation, Function, Interaction", context: "Globalization and Sustainability",
          soi: "Biochemical transformations of matter and energy within specialized plant structures sustain global food webs and atmospheric balance.", color: "lime", videoId: "sQK3Yr4Sc_k",
          topics: [
            { name: "The Photosynthesis Reaction", desc: "The chemical equation for converting light to chemical energy.", example: "E.g., Six carbon dioxide molecules + six water molecules → glucose + oxygen." },
            { name: "Leaf Structure Anatomy", desc: "How physical properties optimize light absorption and gas exchange.", example: "E.g., Stomata opening to let CO2 in and O2 out." },
            { name: "Limiting Factors", desc: "Environmental variables that affect the rate of photosynthesis.", example: "E.g., Lack of sunlight slowing down oxygen production." },
            { name: "Testing Photosynthesis", desc: "Using indicators to measure biological processes.", example: "E.g., Using iodine solution to test a leaf for the presence of starch." }
          ]
        };
        default: return null;
      }
    };
    
    const data = getScienceData();
    
    if (data) {
      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-10">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 mb-3">
              {data.title}
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Unit {unit.replace('unit', '')} Overview &bull; Grade 8 (MYP 2) Science
            </p>
          </header>

          {data.videoId && <VideoEmbed videoId={data.videoId} title={data.title} />}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-${data.color}-100 text-${data.color}-600`}>
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Key Concept: {data.concept}</h2>
              </div>
              
              <div className="flex items-center gap-3 mb-4 mt-6">
                <div className={`p-3 rounded-xl bg-slate-100 text-slate-600`}>
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Related Concepts</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">{data.related}</p>

              <h3 className="text-md font-bold text-slate-900 border-t border-slate-100 pt-4 mt-2">Statement of Inquiry</h3>
              <p className="text-slate-700 italic mt-2">"{data.soi}"</p>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">Global Context: {data.context}</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 shadow-md">
                 <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-slate-800 text-${data.color}-400`}>
                    <Milestone className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Core Topics & Subtopics</h2>
                </div>
                <ul className="space-y-4">
                  {data.topics.map((topic, i) => (
                    <li key={i} className="flex gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-${data.color}-400`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{topic.name}</div>
                        <div className="text-sm text-slate-400 mt-1">{topic.desc}</div>
                        <div className="text-xs text-slate-500 mt-1 italic">{topic.example}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (subject === 'english') {
    if (unit === 'unit1') {
      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-10">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 mb-3">
              Advertising & Persuasion
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Unit 1 Overview &bull; Grade 8 (MYP) English Language & Literature
            </p>
          </header>

          <VideoEmbed videoId="f0ZS9sImoOE" title="Persuasive Techniques in Advertising" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Key Concept</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                In this unit, we explore <strong className="text-slate-900">Communication</strong>. We analyze how organizations and creators share information and ideas.
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Related Concepts</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[100px]">Audience:</span>
                  Who is being targeted and why?
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[100px]">Purpose:</span>
                  The underlying intention behind a text or image.
                </li>
              </ul>

              <h3 className="text-md font-bold text-slate-900 border-t border-slate-100 pt-4 mt-2">Statement of Inquiry</h3>
              <p className="text-slate-700 italic mt-2">
                "Companies use purposeful communication to persuade audiences to act or think in a certain way."
              </p>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">Global Context: Personal and Cultural Expression</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 shadow-md">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
                    <Milestone className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Unit Focus</h2>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Core Topics & Subtopics</h3>
                <ul className="text-slate-400 leading-relaxed space-y-4 list-disc pl-4 mt-4">
                  <li>
                    <strong className="text-white">Media Analysis:</strong> Deconstructing print and television advertisements.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Analyzing a car commercial to see how music sets an adventurous mood.</div>
                  </li>
                  <li>
                    <strong className="text-white">Visual Literacy:</strong> Analyzing how layout, color, and imagery target specific demographics.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., A sports drink ad using high-contrast bold colors to target young athletes.</div>
                  </li>
                  <li>
                    <strong className="text-white">Persuasive Language:</strong> Identifying and applying the AFOREST techniques.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Spotting 'Alliteration' in a slogan like "Don't just dream it, drive the dream."</div>
                  </li>
                  <li>
                    <strong className="text-white">NGRT Skill Focus:</strong> Deducing authorial intent, identifying persuasive bias, and understanding vocabulary in context.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Identifying the bias in a newspaper editorial about climate change.</div>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
                <div className="flex items-center gap-3 mb-3">
                  <BrainCircuit className="text-amber-600 w-6 h-6" />
                  <h2 className="text-xl font-bold text-amber-900">Why it matters?</h2>
                </div>
                <p className="text-amber-800/80 leading-relaxed">
                  We are surrounded by advertising aiming to influence our decisions. By learning how to deconstruct media and rhetorical techniques, you become a critical consumer, able to think independently rather than being subconsciously swayed by corporate messaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (unit === 'unit2') {
       return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-10">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 mb-3">
              The Novel – Character & Perspective
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Unit 2 Overview &bull; Grade 8 (MYP) English Language & Literature
            </p>
          </header>

          <VideoEmbed videoId="aHYh0fGYu-w" title="Character Types and Tropes" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-rose-100 text-rose-600">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Key Concept</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                In this unit, we explore <strong className="text-slate-900">Relationships</strong>. We analyze how characters interact and affect one another within a narrative.
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-fuchsia-100 text-fuchsia-600">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Related Concepts</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Perspective:</span>
                  The narrator's viewpoint.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Characterization:</span>
                  How an author builds a character.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Theme:</span>
                  The underlying message.
                </li>
              </ul>

              <h3 className="text-md font-bold text-slate-900 border-t border-slate-100 pt-4 mt-2">Statement of Inquiry</h3>
              <p className="text-slate-700 italic mt-2">
                "Authors manipulate narrative viewpoint and character relationships to challenge the reader's perspective on human nature."
              </p>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">Global Context: Identities and Relationships</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 shadow-md">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800 text-rose-400">
                    <Milestone className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Unit Focus</h2>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Core Topics & Subtopics</h3>
                <ul className="text-slate-400 leading-relaxed space-y-4 list-disc pl-4 mt-4">
                  <li>
                    <strong className="text-white">Character Archetypes:</strong> Protagonists, antagonists, static, dynamic, and flat characters.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Mapping how a seemingly 'flat' bully becomes a 'dynamic' character by the novel's end.</div>
                  </li>
                  <li>
                    <strong className="text-white">Narrative Viewpoints:</strong> First-person, third-person limited, and omniscient.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Rewriting a scene to show 'omniscient' access to all characters' internal thoughts.</div>
                  </li>
                  <li>
                    <strong className="text-white">Structural Mechanics:</strong> Mapping the components of a narrative arc.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Identifying the exact moment of 'climax' where the protagonist faces their greatest fear.</div>
                  </li>
                  <li>
                    <strong className="text-white">Advanced Grammar:</strong> Applying colons and semi-colons.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., "The storm was brutal; nevertheless, we walked home."</div>
                  </li>
                </ul>
              </div>

              <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
                <div className="flex items-center gap-3 mb-3">
                  <BrainCircuit className="text-rose-600 w-6 h-6" />
                  <h2 className="text-xl font-bold text-rose-900">Why it matters?</h2>
                </div>
                <p className="text-rose-800/80 leading-relaxed">
                  Understanding how characters interact and drive a story allows us to better understand empathy, human nature, and our own relationships in the real world.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (unit === 'unit3') {
       return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-10">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 mb-3">
              Voices in Verse – Poetry & Form
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Unit 3 Overview &bull; Grade 8 (MYP) English Language & Literature
            </p>
          </header>

          <VideoEmbed videoId="JwhouCNq-Fc" title="Understanding Poetry Structure" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-fuchsia-100 text-fuchsia-600">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Key Concept</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                In this unit, we explore <strong className="text-slate-900">Creativity</strong>. We analyze how poets manipulate structure and language to express fresh perspectives.
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Related Concepts</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Self-expression:</span>
                  The personal nature of poetry.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Form:</span>
                  The structure and conventions used.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Pattern:</span>
                  The repeated sounds, rhythms, and elements.
                </li>
              </ul>

              <h3 className="text-md font-bold text-slate-900 border-t border-slate-100 pt-4 mt-2">Statement of Inquiry</h3>
              <p className="text-slate-700 italic mt-2">
                "Poets manipulate structural forms and language patterns to express creative perspectives on identity and the world."
              </p>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">Global Context: Personal and Cultural Expression</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 shadow-md">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800 text-fuchsia-400">
                    <Milestone className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Unit Focus</h2>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Core Topics & Subtopics</h3>
                <ul className="text-slate-400 leading-relaxed space-y-4 list-disc pl-4 mt-4">
                  <li>
                    <strong className="text-white">Poetic Structures:</strong> Fixed forms (Sonnets, Haikus) vs. Free Verse.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Drafting a strict 14-line sonnet with ABAB rhyme constraints.</div>
                  </li>
                  <li>
                    <strong className="text-white">Auditory Devices:</strong> Alliteration, assonance, sibilance, onomatopoeia.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Using sibilance ("Softly, the serpent slithered") to create a menacing sound out loud.</div>
                  </li>
                  <li>
                    <strong className="text-white">Imagery & Tropes:</strong> Extended metaphors, personification, hyperbole.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Developing an extended metaphor comparing 'hope' to a 'bird' throughout a poem.</div>
                  </li>
                  <li>
                    <strong className="text-white">Grammar & Rhythms:</strong> Enjambment, caesura, voltas.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Using caesura (periods in the middle of a line) to abruptly halt reading speed.</div>
                  </li>
                </ul>
              </div>

              <div className="bg-fuchsia-50 rounded-3xl p-8 border border-fuchsia-100">
                <div className="flex items-center gap-3 mb-3">
                  <BrainCircuit className="text-fuchsia-600 w-6 h-6" />
                  <h2 className="text-xl font-bold text-fuchsia-900">Why it matters?</h2>
                </div>
                <p className="text-fuchsia-800/80 leading-relaxed">
                  Poetry teaches us the precision of language and the power of sound. It gives us the tools to express complex emotions and uniquely observe the world around us.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (unit === 'unit4') {
      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-10">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 mb-3">
              Language & Film – Visual Literacy
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Unit 4 Overview &bull; Grade 8 (MYP) English Language & Literature
            </p>
          </header>

          <VideoEmbed videoId="vR_l1vTfaNk" title="Visual Literacy and Cinematic Techniques" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-rose-100 text-rose-600">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Key Concept</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                In this unit, we explore <strong className="text-slate-900">Perspective</strong>. We analyze how visual language manipulates audience viewpoints.
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Related Concepts</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Point of View:</span>
                  The lens through which the story is told.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Audience:</span>
                  Who the film is intended for.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Message:</span>
                  The central theme or idea communicated.
                </li>
              </ul>

              <h3 className="text-md font-bold text-slate-900 border-t border-slate-100 pt-4 mt-2">Statement of Inquiry</h3>
              <p className="text-slate-700 italic mt-2">
                "Filmmakers use technical choices and visual language to manipulate audience perspective and convey specific messages."
              </p>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">Global Context: Scientific and Technical Innovation</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 shadow-md">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800 text-rose-400">
                    <Milestone className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Unit Focus</h2>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Core Topics & Subtopics</h3>
                <ul className="text-slate-400 leading-relaxed space-y-4 list-disc pl-4 mt-4">
                  <li>
                    <strong className="text-white">Cinematography Basics:</strong> Camera distances and angles.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Using a high-angle shot to make a character appear vulnerable.</div>
                  </li>
                  <li>
                    <strong className="text-white">Camera Movement:</strong> Tracking shots, panning, tilting, zoom.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Analyzing how a smooth tracking shot builds tension as it follows a character down a hallway.</div>
                  </li>
                  <li>
                    <strong className="text-white">Mise-en-scène & Lighting:</strong> Props, costumes, high/low-key lighting.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Using dark, low-key lighting to signify danger in a thriller scene.</div>
                  </li>
                  <li>
                    <strong className="text-white">Sound Design:</strong> Diegetic and non-diegetic sound.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Hearing heavy breathing in the scene (diegetic) vs adding a scary violin soundtrack (non-diegetic).</div>
                  </li>
                </ul>
              </div>

              <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
                <div className="flex items-center gap-3 mb-3">
                  <BrainCircuit className="text-rose-600 w-6 h-6" />
                  <h2 className="text-xl font-bold text-rose-900">Why it matters?</h2>
                </div>
                <p className="text-rose-800/80 leading-relaxed">
                  Understanding visual literacy allows us to decode the media we consume daily, revealing how directors construct meaning and influence our emotions through technical choices.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (unit === 'unit5') {
      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-10">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 mb-3">
              'The Taming of the Shrew' – Shakespeare & Context
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Unit 5 Overview &bull; Grade 8 (MYP) English Language & Literature
            </p>
          </header>

          <VideoEmbed videoId="FS2ndY5WJXA" title="Shakespeare's World and Language" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Key Concept</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                In this unit, we explore <strong className="text-slate-900">Culture</strong>. We delve into how historical context shapes literature and its enduring relevance.
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Related Concepts</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Context:</span>
                  The Elizabethan society and its norms.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Power:</span>
                  Dynamics between characters, especially Petruchio and Katherina.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="font-bold text-slate-900 min-w-[120px]">Gender Roles:</span>
                  Expectations of women in Shakespeare's time vs today.
                </li>
              </ul>

              <h3 className="text-md font-bold text-slate-900 border-t border-slate-100 pt-4 mt-2">Statement of Inquiry</h3>
              <p className="text-slate-700 italic mt-2">
                "Exploring classical drama allows audiences to analyze how historical and cultural contexts shape expressions of gender and power."
              </p>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">Global Context: Identities and Relationships</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 shadow-md">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
                    <Milestone className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Unit Focus</h2>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Core Topics & Subtopics</h3>
                <ul className="text-slate-400 leading-relaxed space-y-4 list-disc pl-4 mt-4">
                  <li>
                    <strong className="text-white">Elizabethan Context:</strong> Social hierarchy, theater culture.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Exploring how plays functioned as social instruction for the audience.</div>
                  </li>
                  <li>
                    <strong className="text-white">Dramatic Devices:</strong> Soliloquies, asides, dramatic irony.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., The audience knowing a character's true plan via an 'aside' while other characters are unaware.</div>
                  </li>
                  <li>
                    <strong className="text-white">Linguistic Techniques:</strong> Blank verse, iambic pentameter, puns.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Breaking down the 10-syllable rhythm ("da-DUM da-DUM da-DUM da-DUM da-DUM") of a famous speech.</div>
                  </li>
                  <li>
                    <strong className="text-white">Character Dynamics:</strong> Petruchio and Katherina's relationship.
                    <div className="text-sm text-slate-500 mt-1 italic block">E.g., Analyzing rapid-fire 'stichomythia' dialog trading insults to show battle-of-wits tension.</div>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
                <div className="flex items-center gap-3 mb-3">
                  <BrainCircuit className="text-amber-600 w-6 h-6" />
                  <h2 className="text-xl font-bold text-amber-900">Why it matters?</h2>
                </div>
                <p className="text-amber-800/80 leading-relaxed">
                  Shakespeare's plays transcend time. By analyzing this comedy, we learn to decode archaic language and critically examine societal expectations about gender and relationships that persist today.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const getUnitData = () => {
    switch (unit) {
      case 'unit1':
        return {
          title: 'Numerical and Abstract Reasoning',
          subtitle: 'Unit 1 Overview',
          conceptName: 'Form and Logic',
          conceptDesc: 'Understanding how mathematical forms can be manipulated logically allows us to model real-world situations effectively.',
          keyConceptsIconColor: 'bg-violet-100 text-violet-600',
          relatedIconColor: 'bg-cyan-100 text-cyan-600',
          relatedConcepts: [
            { name: 'Equivalence', desc: 'Understanding different representations of the same value.' },
            { name: 'Simplification', desc: 'Reducing expressions to their most basic and useful form.' },
            { name: 'Quantity', desc: 'Measuring amounts and comparing magnitudes.' }
          ],
          focusTitle: 'Subtopic 1.1 Focus',
          focusSubtitle: 'Proportional Reasoning & Percentages',
          focusDesc: 'Applying percentages, ratios, and rates to real-world scenarios, particularly financial literacy (VAT, discounts, exchange rates) and measurements.',
          focusIconColor: 'bg-slate-800 text-cyan-400',
          whyItMatters: "Whether you are shopping at the Dubai Mall, calculating your family's DEWA bill, or traveling abroad, proportional reasoning is the mathematical engine behind intelligent financial decisions.",
          videoId: "USmit5zUGas"
        };
      case 'unit2':
        return {
          title: 'Thinking with Models',
          subtitle: 'Unit 2 Overview',
          conceptName: 'Relationships and Systems',
          conceptDesc: 'Understanding how variables connect allows us to build reliable systems and mathematical models.',
          keyConceptsIconColor: 'bg-fuchsia-100 text-fuchsia-600',
          relatedIconColor: 'bg-rose-100 text-rose-600',
          relatedConcepts: [
            { name: 'Change', desc: 'Analyzing how things shift over time or given different inputs.' },
            { name: 'Patterns', desc: 'Identifying repeating structures to predict future outcomes.' },
            { name: 'Representation', desc: 'Visualizing numbers through graphs and charts.' },
            { name: 'Simplification', desc: 'Refining complex real situations into clean mathematics.' }
          ],
          focusTitle: 'Subtopics 2.1 & 2.2 Focus',
          focusSubtitle: 'Linear Functions & Systems',
          focusDesc: 'Translating real-world scenarios into algebraic equations, generating tables of values, graphing relationships on a coordinate plane, and applying algorithmic thinking.',
          focusIconColor: 'bg-slate-800 text-violet-400',
          whyItMatters: "Mathematical models allow us to build systems that automate and predict reality—from taxi fares to mobile phone plans and algorithms that power modern software.",
          videoId: "Br7qn4yLf-I"
        };
      case 'unit3':
        return {
          title: 'Spatial Reasoning',
          subtitle: 'Unit 3 Overview',
          conceptName: 'Space and Perspective',
          conceptDesc: 'Visualizing how objects exist in dimensions helps us understand architecture, engineering, and digital spaces.',
          keyConceptsIconColor: 'bg-emerald-100 text-emerald-600',
          relatedIconColor: 'bg-teal-100 text-teal-600',
          relatedConcepts: [
            { name: 'Model', desc: 'Representing physical objects through mathematical formulas.' },
            { name: 'Space', desc: 'Understanding the physical properties of areas and volumes.' },
            { name: 'Measurement', desc: 'Quantifying physical dimensions with precision.' },
            { name: 'Equivalence', desc: 'Understanding how different shapes can hold identical volumes.' }
          ],
          focusTitle: 'Subtopics 3.1 & 3.2 Focus',
          focusSubtitle: '3D Geometry & Transformations',
          focusDesc: 'Moving between 2D nets and 3D objects, applying surface area and volume to structures, and understanding spatial transformations like sliding, turning, and flipping.',
          focusIconColor: 'bg-slate-800 text-emerald-400',
          whyItMatters: "From packing shipping containers at Jebel Ali Port to rendering 3D environments in video games, understanding spatial reasoning ensures things fit and function perfectly in physical and digital worlds.",
          videoId: "qJwecTgce6c"
        };
      case 'unit4':
        return {
          title: 'Reasoning with Data',
          subtitle: 'Unit 4 Overview',
          conceptName: 'Connections and Global Interaction',
          conceptDesc: 'By analyzing connections within datasets, we can understand global trends and make informed decisions.',
          keyConceptsIconColor: 'bg-amber-100 text-amber-600',
          relatedIconColor: 'bg-orange-100 text-orange-600',
          relatedConcepts: [
            { name: 'Justification', desc: 'Using hard data to prove arguments.' },
            { name: 'Trends', desc: 'Noticing the direction things are moving over time.' },
            { name: 'Validity', desc: 'Ensuring your data collection methods are fair and unbiased.' },
            { name: 'Approximation', desc: 'Using estimates when absolute certainty is impossible.' }
          ],
          focusTitle: 'Subtopics 4.1 & 4.2 Focus',
          focusSubtitle: 'Statistics & Probability',
          focusDesc: 'Collecting and interpreting data using central tendency, identifying outliers, reading scatter plots for correlation, and analyzing the likelihood of events.',
          focusIconColor: 'bg-slate-800 text-amber-400',
          whyItMatters: "We live in an age of big data. Understanding statistics and probability protects you from misleading claims in media, and allows you to predict outcomes in business, science, and public policy.",
          videoId: "B1HEzNTGeZ4"
        };
      default:
        return null;
    }
  };

  const data = getUnitData();
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 mb-3">
          {data.title}
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          {data.subtitle} &bull; Grade 8 (MYP 2)
        </p>
      </header>

      {/* @ts-ignore - dynamic key */}
      {data.videoId && <VideoEmbed videoId={data.videoId} title={data.title} />}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${data.keyConceptsIconColor}`}>
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Key Concepts</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-6">
            In this unit, we explore <strong className="text-slate-900">{data.conceptName.split(' and ')[0]}</strong> and <strong className="text-slate-900">{data.conceptName.split(' and ')[1]}</strong>. 
            {' '}{data.conceptDesc}
          </p>
          
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${data.relatedIconColor}`}>
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Related Concepts</h3>
          </div>
          <ul className="space-y-3">
            {data.relatedConcepts.map(concept => (
              <li key={concept.name} className="flex gap-3 text-slate-600">
                <span className="font-bold text-slate-900 min-w-[120px]">{concept.name}:</span>
                {concept.desc}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 shadow-md">
             <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${data.focusIconColor}`}>
                <Milestone className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">{data.focusTitle}</h2>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{data.focusSubtitle}</h3>
            <p className="text-slate-400 leading-relaxed">
              {data.focusDesc}
            </p>
          </div>

          <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
            <div className="flex items-center gap-3 mb-3">
              <BrainCircuit className="text-amber-600 w-6 h-6" />
              <h2 className="text-xl font-bold text-amber-900">Why it matters?</h2>
            </div>
            <p className="text-amber-800/80 leading-relaxed">
              {data.whyItMatters}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
