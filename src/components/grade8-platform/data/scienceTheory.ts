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

export const scienceTheoryData: Record<string, ConceptDef[]> = {
  unit1: [
    {
      title: "Cellular Organization",
      description: "Cells are the fundamental building blocks of all living organisms. In multicellular organisms, cells specialize to perform specific functions and organize into tissues, organs, and organ systems. Different types of cells have different structures. For example, plant cells typically contain chloroplasts for photosynthesis and a rigid cell wall for structural support, which are completely absent in animal cells.",
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
      description: "The digestive system breaks down food into simple nutrients such as carbohydrates, fats, and proteins so they can be absorbed into the bloodstream. It relies on a combination of mechanical force and chemical catalysts.",
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
      description: "These two systems work intimately together. The respiratory system pulls oxygen from the air into the bloodstream and expels carbon dioxide. The circulatory system serves as the transport network, pumping this oxygenated blood throughout the entire body.",
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
      description: "Homeostasis is the necessary process of maintaining a relatively stable internal environment despite external changes or internal disruptions. It relies heavily on negative feedback loops.",
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
      title: "The Atom and Physical Chemical Changes",
      description: "All matter is composed of incredibly small particles called atoms. Atoms consist of a dense, positively charged nucleus surrounded by a cloud of negatively charged electrons. When atoms rearrange themselves during reactions, chemical changes occur, but mass is always perfectly conserved.",
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
      title: "Ecology: Energy Flow and Interdependence",
      description: "An ecosystem consists of all the living organisms (biotic factors) and physical environment (abiotic factors) interacting together. Energy from the sun flows linearly through these systems, dramatically decreasing at each trophic stage.",
      media: [
        {
          type: "image",
          url: img_foodweb_jpg,
          caption: "Ecological pyramid displaying the severe energy loss between producers, primary consumers, and apex predators."
        }
      ],
      vocabulary: [
        { term: "Trophic Level", definition: "A specific feeding level within a food chain or web.", example: "Plants are Trophic Level 1 (Producers)." },
        { term: "Mutualism", definition: "A symbiotic biological relationship where both species benefit.", example: "Clownfish residing inside a sea anemone." },
        { term: "Carrying Capacity", definition: "The maximum population size an environment can sustain indefinitely.", example: "Limited by food, water, or physical space." }
      ],
      formulas: [
        {
          name: "The 10% Energy Rule",
          equation: "Energy Received = Energy Available at Previous Level × 0.10",
          explanation: "Estimates the energy transfer efficiency between trophic levels.",
          stepByStep: [
            "Step 1: Identify the total energy present at the lower trophic level (e.g., producers having 10,000 kJ).",
            "Step 2: Multiply by 0.10 (or 10%) to account for the energy lost to heat and bodily processes.",
            "Step 3: The result is the energy available to the next predator level up."
          ]
        }
      ]
    }
  ],
  unit4: [
    {
      title: "Energy & Future: Global Consequences",
      description: "Humanity requires massive amounts of energy. The methods we use to generate this energy—especially burning fossil fuels—have direct consequences on the composition of our atmosphere, leading to phenomena such as the enhanced greenhouse effect.",
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
      description: "Waves are the mathematical mechanism by which energy travels through space and media without permanently moving the actual matter.",
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
      title: "Photosynthesis",
      description: "Photosynthesis is the fundamental biochemical process by which plants harness kinetic solar energy into stable chemical energy (glucose), supporting virtually all life on Earth.",
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

