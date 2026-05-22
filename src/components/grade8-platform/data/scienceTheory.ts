import { ConceptDef } from '../types';
// Hand-authored labelled SVG diagrams under /public/grade8-platform/svg/.
// SVGs scale crisply at any size, have real text labels and are far smaller
// than the previous AI-generated bitmaps (some of which were corrupt).
const img_cells_png = '/grade8-platform/svg/cells.svg';
const img_digestive_png = '/grade8-platform/svg/digestive.svg';
const img_circulatory_png = '/grade8-platform/svg/circulatory.svg';
const img_respiratory_png = '/grade8-platform/svg/respiratory.svg';
const img_homeostasis_png = '/grade8-platform/svg/homeostasis.svg';
const img_bohr_png = '/grade8-platform/svg/bohr.svg';
const img_periodic_table_png = '/grade8-platform/svg/periodic-table.svg';
const img_foodweb_jpg = '/grade8-platform/svg/foodweb.svg';
const img_greenhouse_png = '/grade8-platform/svg/greenhouse.svg';
const img_em_spectrum_png = '/grade8-platform/svg/em-spectrum.svg';
const img_transverse_wave = '/grade8-platform/svg/transverse-wave.svg';
const img_longitudinal_wave = '/grade8-platform/svg/longitudinal-wave.svg';
const img_photosynthesis_png = '/grade8-platform/svg/photosynthesis.svg';
const img_food_chain = '/grade8-platform/svg/food-chain.svg';
const img_food_web = '/grade8-platform/svg/food-web.svg';
const img_energy_pyramid = '/grade8-platform/svg/foodweb.svg'; // legacy filename kept; this is the pyramid
const img_decomposers = '/grade8-platform/svg/decomposers.svg';

export const scienceTheoryData: Record<string, ConceptDef[]> = {
  unit1: [
    {
      title: "Cellular Organization",
      description: "Cells are the fundamental building blocks of all living organisms. In multicellular organisms, cells specialize to perform specific functions and organize into tissues, organs, and organ systems.",
      paragraphs: [
        "Every cell is a tiny self-contained factory. It is bounded by a cell membrane that controls what gets in and out, and contains organelles — miniature 'machines' that each do one job. The nucleus is the control centre (it stores DNA), the mitochondria release energy from food, and ribosomes build proteins.",
        "Plant cells include three extra features that animal cells do NOT have: a rigid cell wall for structural support, a large central vacuole that stores water and keeps the cell turgid, and chloroplasts where photosynthesis happens. These differences explain why a plant can stand upright and feed itself, while an animal needs a skeleton and has to eat.",
        "Cells of the same type group into tissues (e.g. muscle tissue), tissues form organs (e.g. the heart), and organs form systems (e.g. the circulatory system). This hierarchy is what makes complex multicellular life possible.",
      ],
      keyIdeas: [
        "Cells → tissues → organs → organ systems → organism.",
        "Plant cells differ from animal cells in 3 ways: cell wall, large vacuole, chloroplasts.",
        "Mitochondria release energy from food; chloroplasts capture energy from light.",
      ],
      media: [
        {
          type: "image",
          url: img_cells_png,
          caption: "Plant Cell vs Animal Cell Structures (Plant cell shown with rigid walls and chloroplasts)"
        }
      ],
      vocabulary: [
        { term: "Organelle", definition: "A tiny cellular structure that performs specific functions within a cell.", example: "Mitochondria act as the powerhouses of the cell." },
        { term: "Tissue", definition: "A group of similar cells working together to perform a specific function.", example: "Muscle tissue allows for movement." }
      ],
      formulas: [
        { 
          name: "Magnification Calculation", 
          equation: "Magnification = Image Size ÷ Actual Size", 
          explanation: "Calculates how much larger a microscopic image appears compared to the real object.",
          stepByStep: [
            "Step 1: Write down the formula: Magnification = Image / Actual",
            "Step 2: Ensure both measurements use the same unit (e.g., convert mm to µm if necessary. 1 mm = 1000 µm).",
            "Step 3: Divide the observed Image Size by the Actual physical size of the specimen."
          ]
        }
      ]
    },
    {
      title: "The Digestive System",
      description: "The digestive system breaks down food into simple nutrients so they can be absorbed into the bloodstream.",
      paragraphs: [
        "Digestion happens in two ways. Mechanical digestion is the physical breakdown of large pieces of food into smaller pieces — teeth chewing, the stomach churning, the intestines mixing. Mechanical digestion does not change the chemicals; it just increases their surface area.",
        "Chemical digestion is where enzymes (biological catalysts) break complex molecules into small absorbable nutrients. Salivary amylase begins breaking starches into sugars in the mouth, pepsin breaks proteins in the stomach, and lipase breaks fats in the small intestine.",
        "The small intestine is where most absorption happens. Its walls are folded into tiny finger-like projections called villi that hugely increase the surface area for nutrients to cross into the bloodstream. The large intestine then reabsorbs water from what remains.",
      ],
      keyIdeas: [
        "Two types of digestion: mechanical (physical) and chemical (with enzymes).",
        "Order of organs: mouth → esophagus → stomach → small intestine → large intestine.",
        "Villi in the small intestine maximise surface area for absorption.",
      ],
      media: [
        {
          type: "image",
          url: img_digestive_png,
          caption: "Labeled diagram of the Human Digestive System, tracing the path from the esophagus to the intestines."
        }
      ],
      vocabulary: [
        { term: "Mechanical Digestion", definition: "The physical breakdown of large pieces of food into smaller pieces to increase surface area.", example: "Teeth chewing food in the mouth." },
        { term: "Chemical Digestion", definition: "The process where enzymes break down complex food molecules into small, absorbable nutrients.", example: "Salivary amylase breaking down complex starches into simple sugars." },
        { term: "Enzyme", definition: "A biological catalyst (usually a protein) that drastically speeds up chemical reactions in the body.", example: "Pepsin digests proteins in the highly acidic stomach environment." }
      ]
    },
    {
      title: "The Circulatory & Respiratory Systems",
      description: "These two systems work intimately together. The respiratory system gets oxygen into the bloodstream and removes carbon dioxide; the circulatory system transports that blood around the entire body.",
      paragraphs: [
        "The respiratory pathway is: nose → trachea → bronchi → bronchioles → alveoli. Alveoli are millions of tiny air sacs inside the lungs surrounded by capillaries. Their thin walls and huge combined surface area make gas exchange fast and efficient — oxygen diffuses INTO the blood, carbon dioxide diffuses OUT.",
        "The heart is a double pump. The right side sends deoxygenated blood to the lungs (pulmonary circulation), and the left side sends oxygenated blood to the body (systemic circulation). Because human blood passes through the heart twice in one full circuit, we call this a 'double circulatory loop' — it keeps the two blood types from mixing.",
        "Three vessel types do different jobs. Arteries carry blood AWAY from the heart under high pressure (thick walls). Veins return blood to the heart at low pressure (thinner walls, with valves). Capillaries are one-cell-thick — that is where gas and nutrient exchange happens.",
      ],
      keyIdeas: [
        "Alveoli + capillaries are where O₂ enters the blood and CO₂ leaves.",
        "Right heart → lungs; left heart → body. Two pumps in one organ.",
        "Arteries: high pressure, away from heart. Veins: low pressure, back to heart. Capillaries: exchange site.",
      ],
      media: [
        {
          type: "image",
          url: img_circulatory_png,
          caption: "Labeled Diagram of the Human Circulatory System."
        },
        {
          type: "image",
          url: img_respiratory_png,
          caption: "Labeled Diagram of the Human Respiratory System."
        }
      ],
      vocabulary: [
        { term: "Gas Exchange", definition: "The physical swapping of oxygen and carbon dioxide across a thin membrane.", example: "Occurs continuously within the microscopic alveoli sacs of the lungs." },
        { term: "Double Circulatory Loop", definition: "A system where blood passes through the heart twice per complete circuit.", example: "Humans have a pulmonary circulation (to lungs) and a systemic circulation (to the rest of the body)." }
      ],
      formulas: [
        { 
          name: "Cardiac Output", 
          equation: "Cardiac Output = Heart Rate × Stroke Volume", 
          explanation: "Calculates the total volume of blood pumped by the heart per minute.",
          stepByStep: [
            "Step 1: Identify the Heart Rate (beats per minute).",
            "Step 2: Identify the Stroke Volume (volume of blood pumped in a single beat, usually in mL).",
            "Step 3: Multiply the two values together.",
            "Step 4: If required, convert the final answer from mL/min to L/min by dividing by 1000."
          ]
        },
        { 
          name: "Minute Ventilation", 
          equation: "Minute Ventilation = Tidal Volume × Breathing Rate", 
          explanation: "Calculates the total volume of air inhaled and exhaled by the lungs per minute.",
          stepByStep: [
            "Step 1: Identify Tidal Volume (amount of air per breath, in mL).",
            "Step 2: Identify Breathing Rate (breaths per minute).",
            "Step 3: Multiply them together."
          ]
        }
      ]
    },
    {
      title: "Homeostasis",
      description: "Homeostasis is how the body keeps a stable internal environment despite outside changes. It relies on negative feedback loops.",
      paragraphs: [
        "A negative feedback loop has five parts: a STIMULUS (a change from the set point), a RECEPTOR that detects it, a CONTROL CENTRE (usually in the brain) that decides what to do, an EFFECTOR that carries out the response, and a RESPONSE that pushes the body back towards the set point.",
        "Thermoregulation is the classic example. If you get too hot, thermoreceptors in your skin detect the change, the hypothalamus signals the sweat glands to release sweat, blood vessels widen (vasodilation) to release heat, and your body temperature drops back to about 37 °C. If you get too cold, the same loop operates in reverse: shivering and vasoconstriction trap heat.",
        "Blood glucose works the same way. When sugar in the blood rises after a meal, the pancreas releases insulin, which tells cells to absorb sugar and the liver to store it. When sugar falls too low, the pancreas releases glucagon, which tells the liver to release stored sugar back into the blood.",
      ],
      keyIdeas: [
        "Five parts of any feedback loop: stimulus → receptor → control → effector → response.",
        "Negative feedback always opposes the change to restore the set point.",
        "Examples: temperature ≈ 37 °C, blood glucose, water balance, blood pH.",
      ],
      media: [
        {
          type: "image",
          url: img_homeostasis_png,
          caption: "A diagram illustrating the negative feedback loop that maintains body temperature (thermoregulation)."
        }
      ],
      vocabulary: [
        { term: "Negative Feedback Loop", definition: "A control mechanism that detects a deviation from the normal state and triggers a response that directly opposes or reverses the deviation.", example: "When blood glucose rises, insulin is released to lower it back to normal bounds." },
        { term: "Thermoregulation", definition: "The specific homeostatic balancing of internal core body temperature.", example: "Sweating to cool down, or shivering to generate heat." }
      ]
    }
  ],
  unit2: [
    {
      title: "States of Matter — The Particle Model",
      description: "Every substance is made of tiny particles. How energetic those particles are — and how strongly they hold onto each other — decides whether you see a solid, a liquid or a gas.",
      paragraphs: [
        "The particle model says that all matter is made of tiny particles (atoms or molecules) that are always in motion. The amount of energy they have and the strength of the forces holding them together are what give each state its distinctive behaviour.",
        "In a SOLID, particles vibrate in fixed positions in a regular lattice. The attraction between particles is strong, so the substance keeps a definite shape and volume. Heat enough energy in and the particles break free from their lattice — the solid MELTS.",
        "In a LIQUID, particles stay in contact but can slide past each other. The substance has a definite volume but takes the shape of its container. Add more energy and the particles overcome their forces of attraction entirely — the liquid BOILS / EVAPORATES into a gas.",
        "In a GAS, particles fly freely with large empty spaces between them. The attraction is very weak, so a gas expands to fill any container — no fixed shape and no fixed volume. Remove energy and the reverse happens: gas → liquid → solid (condensation and freezing).",
      ],
      keyIdeas: [
        "Solid → liquid → gas — particles gain energy and move further apart.",
        "Adding heat = melting → boiling.  Removing heat = condensing → freezing.",
        "Mass is conserved — same particles, just rearranged.",
      ],
      vocabulary: [
        { term: "Particle", definition: "A tiny piece of matter — an atom, ion or molecule.", example: "Water (H₂O) is a particle made of three atoms." },
        { term: "Melting Point", definition: "The temperature at which a solid becomes a liquid.", example: "Ice melts at 0 °C." },
        { term: "Boiling Point", definition: "The temperature at which a liquid becomes a gas.", example: "Water boils at 100 °C at standard pressure." },
        { term: "Diffusion", definition: "The spreading out of particles from high to low concentration. Faster in gases, slower in liquids." },
      ],
      interactiveLab: "states-of-matter",
    },
    {
      title: "The Atom and Physical vs Chemical Changes",
      description: "All matter is built from atoms — tiny particles with a dense positive nucleus and electrons surrounding it. Knowing how atoms combine and rearrange explains every chemical reaction.",
      paragraphs: [
        "An atom has three sub-particles: protons (positive, in the nucleus), neutrons (neutral, in the nucleus) and electrons (negative, orbiting in shells). The number of protons defines which element you are looking at — change that and you change the element. Atoms gain, lose or share electrons to form chemical bonds.",
        "Pure substances come in two flavours. ELEMENTS are made of one kind of atom (oxygen, gold, iron). COMPOUNDS are two or more elements chemically bonded in a fixed ratio (water H₂O, table salt NaCl). MIXTURES are physically blended substances that can be separated — salt water, air, a salad.",
        "Physical changes alter the FORM of a substance but not its identity — melting ice, dissolving sugar, breaking glass. The chemical formula stays the same. Chemical changes create NEW substances with different properties — burning wood, rusting iron, baking a cake. Look for signs: bubbles, colour change, temperature change, light or a precipitate.",
        "In every reaction, mass is CONSERVED. The number of each kind of atom going in equals the number coming out — they have just been rearranged. This is why we balance chemical equations.",
      ],
      keyIdeas: [
        "Atom = nucleus (protons + neutrons) + electron shells.",
        "Element → one type of atom.  Compound → atoms chemically bonded.  Mixture → physically combined.",
        "Physical change: same substance, new form.  Chemical change: new substance.",
        "Mass is conserved in every reaction — atoms are only rearranged.",
      ],
      media: [
        {
          type: "image",
          url: img_bohr_png,
          caption: "Bohr Model of the Atom, showing protons and neutrons in the nucleus, with electrons in orbit."
        },
        {
          type: "image",
          url: img_periodic_table_png,
          caption: "The Periodic Table of Elements organizes all known atoms by atomic number."
        }
      ],
      vocabulary: [
        { term: "Element", definition: "A pure substance made entirely from one type of atom.", example: "Pure Gold (Au) or Oxygen (O2)." },
        { term: "Compound", definition: "A pure substance composed of two or more different elements chemically bonded together in fixed ratios.", example: "Water (H2O) or Carbon Dioxide (CO2)." },
        { term: "Mixture", definition: "A physical combination of two or more substances that are not chemically bonded.", example: "Saltwater or Air." }
      ],
      formulas: [
        {
          name: "Calculating Subatomic Particles",
          equation: "Neutrons = Mass Number - Atomic Number",
          explanation: "Determines the neutral particles in an atomic nucleus.",
          stepByStep: [
            "Step 1: Identify the Atomic Number (this is the number of protons and electrons in a neutral atom).",
            "Step 2: Identify the Mass Number (the total weight of Protons + Neutrons).",
            "Step 3: Subtract the Atomic Number from the Mass Number."
          ]
        },
        {
          name: "Chromatography Retention Factor (Rf)",
          equation: "Rf = Distance traveled by substance ÷ Distance traveled by solvent front",
          explanation: "Calculates how soluble a pigment is within a given solvent. Rf has no units and is always between 0 and 1.",
          stepByStep: [
            "Step 1: Measure how far the starting dot of pigment traveled up the paper.",
            "Step 2: Measure how far the water (or solvent) traveled up the paper.",
            "Step 3: Divide the pigment distance by the solvent distance."
          ]
        }
      ]
    }
  ],
  unit3: [
    {
      title: "Food Chains — Who Eats Whom",
      description: "A food chain shows how energy moves through an ecosystem, one organism eating another in a straight line.",
      paragraphs: [
        "Every food chain starts with a PRODUCER — a plant or alga that makes its own food by capturing sunlight (photosynthesis). Producers are the only step that gets energy directly from the sun; everything else gets it second-hand by eating.",
        "Then come the CONSUMERS in order of who eats whom. Primary consumers (herbivores) eat producers. Secondary consumers (carnivores or omnivores) eat primary consumers. Tertiary consumers eat secondary consumers. The last link in the chain — with no predators of its own — is an APEX predator.",
        "The arrows in a food chain ALWAYS point in the direction energy flows. 'Grass → grasshopper' means the grasshopper eats the grass. Many students get this backwards — read each arrow as 'is eaten by'.",
      ],
      keyIdeas: [
        "Producer → primary → secondary → tertiary → apex.",
        "Producers capture solar energy; consumers get it second-hand.",
        "Arrows point in the direction of energy flow (eaten → eater).",
      ],
      media: [
        {
          type: "image",
          url: img_food_chain,
          caption: "A simple grassland food chain. Read each arrow as 'eaten by'."
        }
      ],
      vocabulary: [
        { term: "Producer", definition: "An organism that makes its own food, usually by photosynthesis.", example: "Grass, trees, algae." },
        { term: "Consumer", definition: "An organism that gets energy by eating others.", example: "A rabbit (primary) or a fox (secondary)." },
        { term: "Trophic Level", definition: "A specific feeding level within a food chain or web.", example: "Plants are Trophic Level 1 (Producers)." },
      ],
    },
    {
      title: "Food Webs and the Energy Pyramid",
      description: "Real ecosystems contain many interlocking food chains. The food web shows the full network of who eats whom; the energy pyramid shows how energy shrinks dramatically at every level.",
      paragraphs: [
        "Animals rarely eat just one thing. A fox might eat rabbits AND mice AND birds, and rabbits are eaten by foxes AND owls AND hawks. When you connect all these overlapping chains, you get a food WEB — a network instead of a single line. The food-web diagram below shows producers on the left and energy flowing through the network towards the apex predator on the right.",
        "Only about 10 % of the energy at one trophic level is passed on to the next. The other 90 % is lost as heat from movement, growth, and life processes, or stays locked in undigested parts. That is why ecosystems can only support a few apex predators — there simply is not enough energy left at the top.",
        "Drawing an ENERGY PYRAMID makes the loss obvious: producers form a wide base, primary consumers a smaller layer, secondary smaller still, and apex predators a tiny tip.",
      ],
      keyIdeas: [
        "A food web = many overlapping food chains.",
        "Only ~10 % of energy passes from one level to the next.",
        "Fewer organisms can be supported at higher trophic levels.",
        "Decomposers receive dead matter from every level and recycle nutrients.",
      ],
      media: [
        {
          type: "image",
          url: img_food_web,
          caption: "A food WEB: many overlapping food chains. Arrows point from the eaten organism to the one that eats it."
        },
        {
          type: "image",
          url: img_energy_pyramid,
          caption: "Energy pyramid showing the 10 % rule. Producers form the base; only a fraction of energy reaches the apex."
        }
      ],
      vocabulary: [
        { term: "Food Web", definition: "A network of overlapping food chains in an ecosystem." },
        { term: "10 % Rule", definition: "About 90 % of energy is lost between trophic levels; only ~10 % passes on." },
        { term: "Apex Predator", definition: "A predator with no natural predators of its own.", example: "Lion, shark, eagle." },
      ],
      formulas: [
        {
          name: "The 10% Energy Rule",
          equation: "Energy Received = Energy at Previous Level × 0.10",
          explanation: "Estimates how much energy a trophic level passes up to the next.",
          stepByStep: [
            "Step 1: Identify the total energy at the lower trophic level (e.g. producers = 10 000 kJ).",
            "Step 2: Multiply by 0.10 to account for the 90 % lost as heat and life processes.",
            "Step 3: The result is the energy available at the next level up (e.g. 1 000 kJ).",
          ],
        },
      ],
    },
    {
      title: "Decomposers — Recycling the Ecosystem",
      description: "Decomposers break down dead organisms and waste, returning nutrients to the soil so producers can use them again.",
      paragraphs: [
        "Bacteria, fungi (mushrooms, moulds) and detritivores like earthworms are nature's recyclers. When a plant or animal dies, decomposers digest it externally, extracting energy for themselves and releasing nitrogen, phosphorus and other nutrients back into the soil.",
        "Without decomposers, dead matter would pile up indefinitely and the nutrients trapped inside it would never return to plants. The whole food chain would grind to a halt because the producers at the base would have nothing to grow with.",
        "Decomposers also act on every trophic level — not just the top. A dead grasshopper, a dead frog and a dead snake are all broken down by the same recyclers, closing the loop of the ecosystem.",
      ],
      keyIdeas: [
        "Decomposers convert dead matter back into raw nutrients.",
        "Without them, producers would run out of soil nutrients.",
        "Bacteria + fungi + detritivores (worms, beetles) are the main decomposer groups.",
      ],
      media: [
        {
          type: "image",
          url: img_decomposers,
          caption: "Decomposers close the loop — dead matter is broken down and nutrients return to the soil for producers."
        }
      ],
      vocabulary: [
        { term: "Decomposer", definition: "An organism (bacterium, fungus, detritivore) that breaks down dead matter." },
        { term: "Detritivore", definition: "An animal that eats decomposing organic matter.", example: "Earthworms, woodlice." },
        { term: "Nutrient Cycle", definition: "The continuous movement of nutrients from soil → producers → consumers → decomposers → soil." },
      ],
    },
  ],
  unit4: [
    {
      title: "Energy & The Future: Global Consequences",
      description: "Humanity runs on energy. The way we generate it — especially by burning fossil fuels — is changing the composition of our atmosphere and the climate.",
      paragraphs: [
        "Energy is the ability to do work or cause change. It exists in many forms: chemical (in fuels and batteries), kinetic (in moving objects), thermal (heat), light, electrical, nuclear, gravitational potential, elastic potential. Energy is never created or destroyed — only TRANSFERRED from one form to another. This is the law of conservation of energy.",
        "Fossil fuels (coal, oil, natural gas) are stores of ancient solar energy locked in dead plant matter over millions of years. Burning them releases that energy as heat — but it also releases carbon dioxide that was buried for millions of years, back into the atmosphere in just a few decades.",
        "Carbon dioxide and methane are GREENHOUSE GASES. They let visible sunlight through to the Earth's surface, but they absorb the longer-wave infrared radiation that the Earth tries to re-emit back into space. The trapped radiation warms the lower atmosphere — the enhanced greenhouse effect.",
        "Renewable sources — solar, wind, hydro, geothermal — do not emit greenhouse gases when generating electricity. They are the only path to keeping global warming inside the limits the science recommends. Nuclear power is low-carbon but creates radioactive waste that has to be safely stored for thousands of years.",
      ],
      keyIdeas: [
        "Energy is conserved — only transferred, never destroyed.",
        "Burning fossil fuels releases CO₂, the main greenhouse gas.",
        "Greenhouse gases trap infrared radiation → enhanced greenhouse effect → warming.",
        "Renewables (solar, wind, hydro) are the low-carbon alternative.",
      ],
      media: [
        {
          type: "image",
          url: img_greenhouse_png,
          caption: "The Greenhouse Effect. High frequency solar radiation enters, but low frequency thermal radiation is trapped."
        }
      ],
      vocabulary: [
        { term: "Renewable Energy", definition: "An energy resource that is naturally replenished on a human timescale.", example: "Solar, wind, or hydroelectric power." },
        { term: "Enhanced Greenhouse Effect", definition: "The anomalous, human-driven warming of the planet due to excessive carbon emissions.", example: "Results in rising sea levels and extreme weather." }
      ],
      formulas: [
        {
          name: "Energy Efficiency",
          equation: "Efficiency = (Useful Energy Output ÷ Total Energy Input) × 100",
          explanation: "Calculates what percentage of fuel energy actually performs useful work, rather than being wasted as heat.",
          stepByStep: [
            "Step 1: Identify the useful energy generated (e.g. electrical output).",
            "Step 2: Identify the total fuel energy consumed.",
            "Step 3: Divide useful output by total input.",
            "Step 4: Multiply by 100 to get a percentage."
          ]
        },
        {
          name: "Electrical Power",
          equation: "Power (W) = Voltage (V) × Current (A)",
          explanation: "Calculates the electrical power generated by a system like a solar panel.",
          stepByStep: [
            "Step 1: Identify the Voltage (V).",
            "Step 2: Identify the Current (Amperes, A).",
            "Step 3: Multiply them together to find Watts (W)."
          ]
        }
      ]
    }
  ],
  unit5: [
    {
      title: "Waves and the Electromagnetic Spectrum",
      description: "A wave is a way of moving energy from one place to another without permanently moving the material. The electromagnetic family of waves can even travel through the vacuum of space.",
      paragraphs: [
        "Every wave has the same four properties: AMPLITUDE (the size of the disturbance — louder sound, brighter light), WAVELENGTH (the distance from one crest to the next), FREQUENCY (the number of waves passing per second, measured in hertz) and SPEED. They are linked by one equation: speed = frequency × wavelength.",
        "Mechanical waves need a medium (air, water, a string) and come in two types. TRANSVERSE waves have particles oscillating at right angles to the direction of travel — water ripples, light, a wave on a rope. LONGITUDINAL waves have particles oscillating in the same direction the wave travels — sound, an earthquake P-wave.",
        "Electromagnetic waves are all transverse and all travel at the speed of light (≈ 3 × 10⁸ m/s) in a vacuum. The electromagnetic spectrum is the family of these waves arranged by wavelength, from the longest (radio waves) to the shortest (gamma rays). Visible light is a tiny slice in the middle.",
        "Higher frequency means higher energy per wave. That is why UV burns your skin, X-rays can damage cells, and gamma rays are dangerous: their photons carry enough energy to break chemical bonds.",
      ],
      keyIdeas: [
        "Wave equation: speed = frequency × wavelength  (v = f × λ).",
        "Transverse wave: oscillation ⊥ direction (light).  Longitudinal: oscillation ‖ direction (sound).",
        "All EM waves travel at 3 × 10⁸ m/s in a vacuum.",
        "Shorter wavelength = higher frequency = higher energy.",
      ],
      media: [
        {
          type: "image",
          url: img_em_spectrum_png,
          caption: "The Electromagnetic Spectrum. Notice the inverse relationship between wavelength and frequency."
        },
        {
          type: "image",
          url: img_transverse_wave,
          caption: "A Transverse Wave diagram showing crests, troughs, wavelength, and amplitude."
        },
        {
          type: "image",
          url: img_longitudinal_wave,
          caption: "A Longitudinal Wave diagram showing compressions and rarefactions."
        }
      ],
      vocabulary: [
        { term: "Transverse Wave", definition: "A wave where the medium oscillates strictly perpendicular (90 degrees) to the direction the energy travels.", example: "Light waves or ripples on a pond." },
        { term: "Longitudinal Wave", definition: "A wave where the medium compresses and expands parallel to the direction of energy travel.", example: "Sound waves." },
        { term: "Amplitude", definition: "The absolute maximum displacement of a wave from its calm equilibrium position.", example: "Dictates the loudness of a sound or brightness of a light." }
      ],
      formulas: [
        {
          name: "The Universal Wave Equation",
          equation: "Velocity (v) = Frequency (f) × Wavelength (λ)",
          explanation: "Relates the physical size of a wave, its speed, and how often it oscillates.",
          stepByStep: [
            "Step 1: Identify frequency in Hertz (Hz).",
            "Step 2: Identify wavelength in meters (m).",
            "Step 3: Multiply them to find the velocity in meters per second (m/s)."
          ]
        },
        {
          name: "Frequency from Period",
          equation: "Frequency (f) = 1 ÷ Time Period (T)",
          explanation: "Calculates frequency from the time it takes one complete wave to pass.",
          stepByStep: [
            "Step 1: Measure the time for one complete cycle (in seconds).",
            "Step 2: Divide 1 by this time period."
          ]
        }
      ]
    }
  ],
  unit6: [
    {
      title: "Photosynthesis — How Plants Capture Light",
      description: "Photosynthesis is how green plants and algae convert light energy into chemical energy stored in glucose. It is the foundation of almost every food chain on Earth.",
      paragraphs: [
        "The overall reaction is straightforward: six molecules of carbon dioxide and six molecules of water, in the presence of light, produce one molecule of glucose and six molecules of oxygen. In symbols: 6 CO₂ + 6 H₂O ──light──> C₆H₁₂O₆ + 6 O₂.",
        "Photosynthesis happens inside the CHLOROPLASTS — green organelles found mainly in leaf cells. Chloroplasts contain CHLOROPHYLL, the pigment that gives leaves their green colour and that actually absorbs the red and blue parts of sunlight. Green light reflects, which is why we see leaves as green.",
        "Plants need four inputs: light (energy source), carbon dioxide (in through the leaves via tiny openings called stomata), water (up from the roots) and chlorophyll (the catalyst). Outputs are oxygen (released through the stomata) and glucose (used immediately for energy or stored as starch).",
        "The RATE of photosynthesis is controlled by three limiting factors: light intensity, carbon dioxide concentration, and temperature. Plants in a Dubai greenhouse, for instance, can be more productive in winter when temperatures are ideal — but only if light and CO₂ are also sufficient.",
      ],
      keyIdeas: [
        "Equation: 6 CO₂ + 6 H₂O  →  C₆H₁₂O₆ + 6 O₂  (with light).",
        "Happens in chloroplasts.  Chlorophyll absorbs light energy.",
        "Inputs: light, CO₂, H₂O, chlorophyll.  Outputs: glucose + O₂.",
        "Limiting factors: light intensity, CO₂, temperature.",
      ],
      media: [
        {
          type: "image",
          url: img_photosynthesis_png,
          caption: "Summary of the materials required and produced during photosynthesis."
        }
      ],
      vocabulary: [
        { term: "Chlorophyll", definition: "The green pigment in plant cells that physically intercepts and captures light energy.", example: "Located strictly within chloroplasts." },
        { term: "Limiting Factor", definition: "An environmental variable that, when strictly in short supply, restricts the maximum pace of a biological process.", example: "Light intensity, CO2 levels, or physical temperature." },
        { term: "Xylem & Phloem", definition: "The internal vascular tubing networks of a plant.", example: "Xylem transports water up; Phloem moves sugar everywhere." }
      ],
      formulas: [
        {
          name: "Reaction Rate",
          equation: "Rate = Quantity of Product Formed ÷ Time Taken",
          explanation: "Calculates the average speed of a biological reaction in the lab.",
          stepByStep: [
            "Step 1: Count the total product formed (e.g. oxygen bubbles).",
            "Step 2: Note the time duration.",
            "Step 3: Divide product by time."
          ]
        },
        {
          name: "Inverse Square Law",
          equation: "Relative Light Intensity ∝ 1 ÷ Distance²",
          explanation: "Demonstrates that light energy falls off exponentially as you move away from the source.",
          stepByStep: [
            "Step 1: Measure the distance to the light source.",
            "Step 2: Square the distance.",
            "Step 3: Divide 1 by this squared number."
          ]
        }
      ]
    }
  ]
};

