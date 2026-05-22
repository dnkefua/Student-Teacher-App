export type SubjectId = 'english' | 'science';
export type UnitId = 'unit1' | 'unit2' | 'unit3' | 'unit4' | 'unit5' | 'unit6';

import { Example, PracticeQuestion, Asset } from '../types';
import { scienceTheoryData } from './scienceTheory';
// Hand-authored labelled SVG diagrams under /public/grade8-platform/svg/.
const img_cells_png = '/grade8-platform/svg/cells.svg';
const img_digestive_png = '/grade8-platform/svg/digestive.svg';
const img_circulatory_png = '/grade8-platform/svg/circulatory.svg';
const img_homeostasis_png = '/grade8-platform/svg/homeostasis.svg';
const img_bohr_png = '/grade8-platform/svg/bohr.svg';
const img_periodic_table_png = '/grade8-platform/svg/periodic-table.svg';
const img_foodweb_jpg = '/grade8-platform/svg/foodweb.svg';
const img_greenhouse_png = '/grade8-platform/svg/greenhouse.svg';
const img_em_spectrum_png = '/grade8-platform/svg/em-spectrum.svg';
const img_photosynthesis_png = '/grade8-platform/svg/photosynthesis.svg';

export const scienceUnit1Examples: Example[] = [
  {
    "id": "sci_u1_1",
    "title": "1.2 Problem 1: Cellular Magnification Calculation",
    "problem": "A student views a human cheek cell under a light microscope. The image size of the cell is 48 mm across. If the actual size of the cell is 0.06 mm, calculate the magnification used.",
    "context": "Cellular Organization",
    "method1Name": "Step-by-Step Analytical Calculation",
    "method1Steps": [
      "State the magnification formula.\\n$$\\text{Magnification} = \\frac{\\text{Image Size}}{\\text{Actual Size}}$$",
      "Ensure both measurements are in the same units. Here, both are in mm: Image = 48 mm, Actual = 0.06 mm.",
      "Substitute the values and solve.\\n$$\\text{Magnification} = \\frac{48}{0.06} = 800$$",
      "The magnification is x800."
    ],
    "techniques": [
      {
        "name": "Organelles",
        "description": "Specialized structures within a cell that perform distinct processes.",
        "color": "emerald",
        "excerpt": "Example: The nucleus controls cell activities, while mitochondria generate energy."
      },
      {
        "name": "Magnification",
        "description": "The ability to make small objects seem larger, such as making a microscopic cell visible.",
        "color": "teal",
        "excerpt": "Using a convex lens or microscope."
      }
    ]
  },
  {
    "id": "sci_u1_2",
    "title": "1.2 Problem 2: Cardiac Output Volume Dynamics",
    "problem": "A person has a resting heart rate of 72 beats per minute (bpm) and a stroke volume of 70 mL. Calculate their total cardiac output in liters per minute (L/min).",
    "context": "The Circulatory & Respiratory Systems",
    "method1Name": "Calculation",
    "method1Steps": [
      "State the cardiac output equation.\\n$$\\text{Cardiac Output} = \\text{Heart Rate} \\times \\text{Stroke Volume}$$",
      "Substitute the given numbers into the formula.\\n$$\\text{Cardiac Output} = 72 \\times 70 = 5040 \\text{ mL/min}$$",
      "Convert the final volume from mL to L by dividing by 1000.\\n$$\\frac{5040}{1000} = 5.04 \\text{ L/min}$$",
      "The cardiac output is 5.04 L/min."
    ],
    "techniques": [
      {
        "name": "Cardiac Output",
        "description": "The volume of blood pumped by the heart per minute.",
        "color": "emerald"
      },
      {
        "name": "Stroke Volume",
        "description": "The amount of blood pumped by the left ventricle of the heart in one contraction.",
        "color": "teal"
      }
    ]
  },
  {
    "id": "sci_u1_3",
    "title": "1.2 Problem 3: Interpreting Enzyme Activity Graphs",
    "problem": "An experiment measures the rate of reaction of salivary amylase at different temperatures. The rate peaks at 37°C and drops sharply to 0 by 60°C. Explain the molecular changes causing the drop after 37°C.",
    "context": "The Digestive System",
    "method1Name": "Analysis",
    "method1Steps": [
      "Identify the optimum temperature (37°C), where kinetic energy allows maximum collisions between enzymes and substrates.",
      "Analyze the effect of high temperature on proteins. Beyond 40°C, thermal energy breaks the weak bonds holding the enzyme's specific 3D tertiary structure.",
      "Describe the structural consequence. The active site changes shape permanently, meaning the substrate can no longer bind. The enzyme has become denatured."
    ],
    "techniques": [
      {
        "name": "Enzyme",
        "description": "A biological catalyst (usually a protein) that speeds up chemical reactions.",
        "color": "emerald",
        "excerpt": "Example: Amylase breaks down starch."
      },
      {
        "name": "Denaturation",
        "description": "The structural breakdown of a protein caused by extreme temperature or pH, rendering it non-functional.",
        "color": "teal"
      }
    ]
  },
  {
    "id": "sci_u1_4",
    "title": "1.2 Problem 4: Breathing Rate Ventilation Rates",
    "problem": "During a 10-minute fitness test, a student breathes in 500 mL of air per breath at a frequency of 18 breaths per minute. Calculate the total volume of air ventilated by the lungs in one minute.",
    "context": "The Circulatory & Respiratory Systems",
    "method1Name": "Calculation",
    "method1Steps": [
      "State the formula for minute ventilation rate.\\n$$\\text{Minute Ventilation} = \\text{Tidal Volume} \\times \\text{Breathing Rate}$$",
      "Calculate using the values provided.\\n$$\\text{Minute Ventilation} = 500 \\text{ mL} \\times 18 = 9000 \\text{ mL/min}$$",
      "Express the answer in standard units (L/min).\\n$$\\frac{9000}{1000} = 9 \\text{ L/min}$$"
    ],
    "techniques": [
      {
        "name": "Ventilation",
        "description": "The physical movement of air into and out of the lungs.",
        "color": "emerald"
      },
      {
        "name": "Tidal Volume",
        "description": "The volume of air inhaled or exhaled in a single normal breath.",
        "color": "teal"
      }
    ]
  },
  {
    "id": "sci_u1_5",
    "title": "1.2 Problem 5: Homeostatic Feedback Loop Analysis",
    "problem": "Explain step-by-step how the human body uses an internal system loop to correct an increase in blood glucose levels immediately after eating a carbohydrate-heavy meal.",
    "context": "Homeostasis",
    "method1Name": "Feedback Loop Mechanism",
    "method1Steps": [
      "Stimulus & Detection: Blood glucose rises; receptors in the pancreas detect the increase.",
      "Hormone Release: The pancreas responds by secreting the hormone insulin into the bloodstream.",
      "Target Action: Insulin travels to the liver and skeletal muscles, causing them to absorb excess glucose and convert it into stored glycogen.",
      "Blood glucose levels fall back to a stable baseline via negative feedback."
    ],
    "techniques": [
      {
        "name": "Homeostasis",
        "description": "The maintenance of a relatively stable internal state despite external changes.",
        "color": "emerald",
        "excerpt": "Example: Body temperature regulation (sweating or shivering)."
      },
      {
        "name": "Negative Feedback",
        "description": "A control mechanism that reduces or reverses a change in the internal environment.",
        "color": "teal"
      }
    ]
  }
];

export const scienceUnit1Practice: PracticeQuestion[] = [
  {
    "id": 1,
    "question": "Draw a table comparing the structures found in a typical plant cell versus an animal cell.",
    "answerFullWorking": "Plant cells contain chloroplasts, a rigid cell wall, and a large central vacuole, which are absent in animal cells. Both contain a nucleus, cytoplasm, cell membrane, and mitochondria.",
    "type": "free-text",
    "interactiveAnswer": "Plant cells have chloroplasts and a cell wall."
  },
  {
    "id": 2,
    "question": "If a red blood cell is 8 μm in diameter and a microscope image shows it as 4 mm across, what is the magnification?",
    "answerFullWorking": "1 mm = 1000 μm. Image size = 4 mm = 4000 μm. Actual size = 8 μm. Magnification = 4000 / 8 = 500. The magnification is x500.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "x50",
      "x500",
      "x5000",
      "x5"
    ],
    "interactiveAnswer": "x500"
  },
  {
    "id": 3,
    "question": "State the primary function of the following organelles: mitochondria, ribosomes, and the cell membrane.",
    "answerFullWorking": "Mitochondria: Site of cellular respiration (energy production). Ribosomes: Site of protein synthesis. Cell Membrane: Controls which substances enter and exit the cell.",
    "type": "free-text",
    "interactiveAnswer": "Mitochondria produce energy, ribosomes synthesize proteins, and the cell membrane controls entry/exit."
  },
  {
    "id": 4,
    "question": "Name the main enzyme responsible for breaking down proteins in the human stomach, and state its optimum pH.",
    "answerFullWorking": "The main enzyme is pepsin (a type of protease), and its optimum pH is strongly acidic (roughly pH 1.5 - 2.0).",
    "type": "free-text",
    "interactiveAnswer": "Pepsin, pH 1.5 - 2.0"
  },
  {
    "id": 5,
    "question": "Explain how the microscopic structure of the villi in the small intestine optimizes nutrient absorption.",
    "answerFullWorking": "They have a large surface area, a thin wall (one cell thick) for a short diffusion path, and a rich capillary network to maintain a steep concentration gradient.",
    "type": "free-text",
    "interactiveAnswer": "They increase surface area and have a rich blood supply."
  },
  {
    "id": 6,
    "question": "Trace the path of an oxygen molecule from the nasal cavity down to an individual alveolus.",
    "answerFullWorking": "Nasal cavity -> Pharynx -> Larynx -> Trachea -> Bronchi -> Bronchioles -> Alveolus.",
    "type": "free-text",
    "interactiveAnswer": "Nasal cavity -> Trachea -> Bronchi -> Bronchioles -> Alveolus"
  },
  {
    "id": 7,
    "question": "Why are the walls of the left ventricle significantly thicker than the walls of the right ventricle?",
    "answerFullWorking": "The left ventricle must pump blood at a higher pressure across the entire systemic circulation (the whole body), whereas the right ventricle only pumps blood to the lungs.",
    "type": "free-text",
    "interactiveAnswer": "It must pump blood to the entire body at higher pressure."
  },
  {
    "id": 8,
    "question": "Define homeostasis and give two examples of physical conditions regulated by it.",
    "answerFullWorking": "Homeostasis is the maintenance of a constant internal environment despite external changes. Examples: Thermoregulation (body temperature) and blood glucose regulation.",
    "type": "free-text",
    "interactiveAnswer": "Maintenance of a constant internal environment. Examples: Body temperature, blood glucose."
  },
  {
    "id": 9,
    "question": "Describe the physiological response of human skin when internal core body temperature drops below 37°C.",
    "answerFullWorking": "Vasoconstriction occurs (blood vessels near the skin surface narrow to trap heat) and shivering begins, creating heat through muscle contraction.",
    "type": "free-text",
    "interactiveAnswer": "Blood vessels constrict (vasoconstriction) and shivering occurs."
  },
  {
    "id": 10,
    "question": "What would happen to human cellular respiration if the circulatory system failed to deliver glucose?",
    "answerFullWorking": "Cellular respiration would cease due to a lack of fuel, meaning no ATP would be produced, ultimately leading to organ failure and cell death.",
    "type": "free-text",
    "interactiveAnswer": "Respiration would stop, ATP production would fail, and cells would die."
  }
];

export const scienceUnit2Examples: Example[] = [
  {
    "id": "sci_u2_1",
    "title": "2.2 Problem 1: Atomic Structure Breakdown",
    "problem": "An atom of Sodium (Na) has an atomic number of 11 and a mass number of 23. Calculate the exact number of protons, neutrons, and electrons present in a neutral sodium atom.",
    "context": "The Atom",
    "method1Name": "Calculation",
    "method1Steps": [
      "Protons = Atomic Number. Number of Protons = 11.",
      "In a neutral atom, Electrons = Protons. Number of Electrons = 11.",
      "Neutrons = Mass Number - Atomic Number. Number of Neutrons = 23 - 11 = 12.",
      "Protons = 11, Electrons = 11, Neutrons = 12."
    ],
    "techniques": [
      {
        "name": "Protons",
        "description": "Positively charged subatomic particles found in the nucleus.",
        "color": "teal",
        "excerpt": "Determines the atomic number and identity of the element."
      },
      {
        "name": "Neutrons",
        "description": "Neutral subatomic particles found in the nucleus. Contributes to the mass number.",
        "color": "emerald",
        "excerpt": "Isotopes vary in the number of neutrons."
      }
    ]
  },
  {
    "id": "sci_u2_2",
    "title": "2.2 Problem 2: Calculating RF Values in Chromatography",
    "problem": "In a food coloring separation experiment, a drop of dye travels a distance of 4.2 cm up the paper. The solvent front (water) travels a total distance of 6.0 cm. Calculate the Retention Factor (Rf).",
    "context": "Elements, Compounds, and Mixtures",
    "method1Name": "Calculation",
    "method1Steps": [
      "State the Rf formula.\\n$$R_f = \\frac{\\text{Distance traveled by the substance}}{\\text{Distance traveled by the solvent front}}$$",
      "Substitute the measured values into the equation: Rf = 4.2 / 6.0",
      "Calculate the decimal value (Rf has no units): Rf = 0.70"
    ],
    "techniques": [
      {
        "name": "Chromatography",
        "description": "A separation technique based on the different solubilities of substances in a solvent.",
        "color": "teal",
        "excerpt": "Useful for separating ink, food dyes, and plant pigments."
      },
      {
        "name": "Retention Factor (Rf)",
        "description": "The ratio of the distance traveled by a pigment to the distance traveled by the solvent.",
        "color": "emerald"
      }
    ]
  },
  {
    "id": "sci_u2_3",
    "title": "2.2 Problem 3: Balancing a Chemical Equation",
    "problem": "Balance the following skeleton chemical equation representing the combustion of hydrogen gas:\\n$$\\text{H}_2 + \\text{O}_2 \\rightarrow \\text{H}_2\\text{O}$$",
    "context": "Physical vs. Chemical Change",
    "method1Name": "Balancing Equations",
    "method1Steps": [
      "Count the atoms on both sides. Reactants: H=2, O=2. Products: H=2, O=1.",
      "Balance O by placing a 2 in front of water: $$\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$$",
      "Balance H by placing a 2 in front of H2: $$2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$$"
    ],
    "techniques": [
      {
        "name": "Law of Conservation of Mass",
        "description": "Matter cannot be created or destroyed in a chemical reaction. Atoms are merely rearranged.",
        "color": "teal",
        "excerpt": "This is why equations must be balanced."
      },
      {
        "name": "Combustion",
        "description": "A rapid chemical reaction with oxygen that releases heat and light.",
        "color": "emerald",
        "excerpt": "Burning of fossil fuels, wood, or hydrogen."
      }
    ]
  },
  {
    "id": "sci_u2_4",
    "title": "2.2 Problem 4: Verifying the Law of Conservation of Mass",
    "problem": "10 g of calcium carbonate is heated and completely decomposes into 5.6 g of solid calcium oxide and an unknown mass of carbon dioxide gas. Calculate the mass of gas produced.",
    "context": "Physical vs. Chemical Change",
    "method1Name": "Calculation",
    "method1Steps": [
      "Apply the Law of Conservation of Mass: Total Mass of Reactants = Total Mass of Products.",
      "Set up the equation: 10 g = 5.6 g + Mass of CO2.",
      "Isolate the unknown: Mass of CO2 = 10 - 5.6 = 4.4 g."
    ],
    "techniques": [
      {
        "name": "Decomposition",
        "description": "A chemical reaction where a single substance breaks down into two or more simpler substances.",
        "color": "teal"
      }
    ]
  },
  {
    "id": "sci_u2_5",
    "title": "2.2 Problem 5: Determining Densities of Mystery Matter",
    "problem": "An unknown metallic cube has a mass of 54 g and a side length of 2 cm. Calculate its density to find out if it is made of pure aluminum (density = 2.7 g/cm³).",
    "context": "Properties of Matter",
    "method1Name": "Calculation",
    "method1Steps": [
      "Calculate the volume of the cube: Volume = 2 * 2 * 2 = 8 cm³.",
      "State the density formula: Density = Mass / Volume.",
      "Substitute and calculate: Density = 54 / 8 = 6.75 g/cm³. It is not pure aluminum."
    ],
    "techniques": [
      {
        "name": "Density",
        "description": "The mass per unit volume of a substance. It is a physical property used to identify materials.",
        "color": "teal",
        "excerpt": "Density = Mass / Volume"
      }
    ]
  }
];

export const scienceUnit2Practice: PracticeQuestion[] = [
  {
    "id": 1,
    "question": "Define the terms element, compound, and mixture.",
    "answerFullWorking": "Element: A pure substance made of one type of atom. Compound: A substance containing two or more different elements chemically bonded. Mixture: A combination of substances not chemically bonded together.",
    "type": "free-text",
    "interactiveAnswer": "Element is one type of atom, Compound is chemically bonded different elements, Mixture is not chemically bonded."
  },
  {
    "id": 2,
    "question": "Find the missing value: An element has 17 protons and 18 neutrons. State its mass number.",
    "answerFullWorking": "Mass number = Protons + Neutrons = 17 + 18 = 35. The element is Chlorine.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "17",
      "18",
      "35",
      "52"
    ],
    "interactiveAnswer": "35"
  },
  {
    "id": 3,
    "question": "Explain how you would safely separate a mixture of sand, salt, and water to recover both the dry sand and pure water.",
    "answerFullWorking": "Filter the mixture to separate the sand. Then distil the remaining salt water solution to evaporate the water and collect the pure water as condensation.",
    "type": "free-text",
    "interactiveAnswer": "Filter for sand, distill for pure water."
  },
  {
    "id": 4,
    "question": "Identify if melting ice is a physical or chemical change.",
    "answerFullWorking": "Physical change, as the chemical composition (H2O) remains the same.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "Physical change",
      "Chemical change"
    ],
    "interactiveAnswer": "Physical change"
  },
  {
    "id": 5,
    "question": "Explain why distillation can separate a mixture of alcohol and water.",
    "answerFullWorking": "Because alcohol and water have different boiling points. Alcohol boils at a lower temperature and will evaporate and can be condensed before water.",
    "type": "free-text",
    "interactiveAnswer": "They have different boiling points."
  }
];

export const scienceUnit3Examples: Example[] = [
  {
    "id": "sci_u3_1",
    "title": "3.2 Problem 1: Trophic Level Energy Transfer",
    "problem": "The primary producers trap 20,000 kJ of light energy. Using the 10% efficiency rule, calculate the energy transferred up to the secondary consumers.",
    "context": "Energy Flow",
    "method1Name": "Calculation",
    "method1Steps": [
      "Energy at Level 2 (primary consumers) = 20,000 * 0.10 = 2000 kJ.",
      "Energy at Level 3 (secondary consumers) = 2000 * 0.10 = 200 kJ."
    ]
  },
  {
    "id": "sci_u3_2",
    "title": "3.2 Problem 2: Estimating Population Size Using Quadrats",
    "problem": "A student samples a 50m x 40m field using a 1m² quadrat 5 times. Counts: 4, 6, 3, 7, and 5 plants. Estimate the total population.",
    "context": "Ecosystem Structure",
    "method1Name": "Calculation",
    "method1Steps": [
      "Total Area = 50 * 40 = 2000 m².",
      "Mean number of plants per quadrat = (4 + 6 + 3 + 7 + 5) / 5 = 5 plants/m².",
      "Estimated Total Population = 5 * 2000 = 10,000 plants."
    ]
  },
  {
    "id": "sci_u3_3",
    "title": "3.2 Problem 3: Analyzing Predator-Prey Graphs",
    "problem": "Explain why the predator population curve always peaks slightly after the prey population curve.",
    "context": "Interdependence",
    "method1Name": "Analysis",
    "method1Steps": [
      "When prey population rises, food becomes abundant.",
      "Predators require time to reproduce and expand their population.",
      "As predators increase, they eat more prey, causing prey population to crash."
    ]
  },
  {
    "id": "sci_u3_4",
    "title": "3.2 Problem 4: Constructing a Biomass Scale",
    "problem": "Ecosystem has 500 kg grass, 50 kg grasshoppers, 5 kg frogs. A drawn pyramid uses 1 cm for 10 kg. Calculate the width for each.",
    "context": "Ecological Pyramids",
    "method1Name": "Calculation",
    "method1Steps": [
      "Grass: 500 kg / 10 = 50 cm width.",
      "Grasshoppers: 50 / 10 = 5 cm width.",
      "Frogs: 5 / 10 = 0.5 cm width."
    ]
  },
  {
    "id": "sci_u3_5",
    "title": "3.2 Problem 5: Classifying Symbiotic Relationships",
    "problem": "A clownfish lives safely inside sea anemone tentacles. Anemone protects clownfish, clownfish chases away anemone predators. Identify the symbiosis.",
    "context": "Interdependence",
    "method1Name": "Analysis",
    "method1Steps": [
      "Clownfish is protected (benefits).",
      "Anemone is protected from predators (benefits).",
      "Both benefit: Mutualism."
    ]
  }
];

export const scienceUnit3Practice: PracticeQuestion[] = [
  {
    "id": 1,
    "question": "Differentiate between an abiotic factor and a biotic factor.",
    "answerFullWorking": "Abiotic factors are non-living parts of an ecosystem (e.g., temperature, water). Biotic factors are the living parts (e.g., plants, animals).",
    "type": "free-text",
    "interactiveAnswer": "Abiotic is non-living, biotic is living."
  },
  {
    "id": 2,
    "question": "Why are food chains rarely longer than four or five trophic levels?",
    "answerFullWorking": "Because 90% of energy is lost at each trophic level (as heat from respiration, movement, etc.), leaving insufficient energy to support further levels.",
    "type": "free-text",
    "interactiveAnswer": "Energy loss at each trophic level makes it unsustainable."
  },
  {
    "id": 3,
    "question": "A tick feeds on the blood of a desert gazelle, weakening the animal over time. Name this type of symbiosis.",
    "answerFullWorking": "Parasitism.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "Mutualism",
      "Commensalism",
      "Parasitism",
      "Competition"
    ],
    "interactiveAnswer": "Parasitism"
  },
  {
    "id": 4,
    "question": "What is the ultimate source of energy fueling almost all biological food webs on Earth?",
    "answerFullWorking": "The Sun.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "The Sun",
      "The Earth's core",
      "Water",
      "Oxygen"
    ],
    "interactiveAnswer": "The Sun"
  },
  {
    "id": 5,
    "question": "Define carrying capacity.",
    "answerFullWorking": "Carrying capacity is the maximum population size of a biological species that can be sustained by that specific environment, given the food, habitat, and other necessities available.",
    "type": "free-text",
    "interactiveAnswer": "Maximum population size an environment can sustain."
  }
];

export const scienceUnit4Examples: Example[] = [
  {
    "id": "sci_u4_1",
    "title": "4.2 Problem 1: Energy Efficiency Percentage Conversions",
    "problem": "A gas-fired power station consumes 500 MJ of chemical energy. It transforms this into 175 MJ of useful electrical energy. Calculate percentage efficiency.",
    "context": "Electricity Generation",
    "method1Name": "Calculation",
    "method1Steps": [
      "Efficiency = (Useful Output / Total Input) * 100",
      "Efficiency = (175 / 500) * 100 = 0.35 * 100",
      "The power station runs at 35% efficiency."
    ]
  },
  {
    "id": "sci_u4_2",
    "title": "4.2 Problem 2: Carbon Footprint Accumulation",
    "problem": "Driving a car releases 0.12 kg CO2/km. Commute is 25 km each way, everyday for 20 days. Total mass of CO2 produced?",
    "context": "Climate Change Mechanics",
    "method1Name": "Calculation",
    "method1Steps": [
      "Daily Distance = 25 km * 2 = 50 km.",
      "Total Distance = 50 * 20 = 1000 km.",
      "Total CO2 = 1000 * 0.12 = 120 kg."
    ]
  },
  {
    "id": "sci_u4_3",
    "title": "4.2 Problem 3: Calculating Electrical Power Output",
    "problem": "Solar panel generates current of 8 A at 24 V. Calculate total electrical power output in Watts.",
    "context": "Electricity Generation",
    "method1Name": "Calculation",
    "method1Steps": [
      "Power = Voltage * Current",
      "Power = 24 * 8",
      "Power = 192 W"
    ]
  },
  {
    "id": "sci_u4_4",
    "title": "4.2 Problem 4: Interpreting Global Temperature and Carbon Data",
    "problem": "CO2 levels rise from 315ppm to 420ppm while global temperature rises 1.2°C. Describe relationship.",
    "context": "Climate Change Mechanics",
    "method1Name": "Analysis",
    "method1Steps": [
      "Both show parallel upward slopes.",
      "Rising CO2 traps more infrared radiation within the atmosphere.",
      "Strong positive correlation between industrial emissions and rising global surface temperatures."
    ]
  },
  {
    "id": "sci_u4_5",
    "title": "4.2 Problem 5: Payback Time Analysis for Renewable Investments",
    "problem": "Villa insulation costs 6000 AED upfront. Saves 125 AED per month on AC. Calculate payback period in years.",
    "context": "Human Footprint",
    "method1Name": "Calculation",
    "method1Steps": [
      "Annual Savings = 125 * 12 = 1500 AED/year.",
      "Payback Period = Upfront Cost / Annual Savings.",
      "Payback Period = 6000 / 1500 = 4 years."
    ]
  }
];

export const scienceUnit4Practice: PracticeQuestion[] = [
  {
    "id": 1,
    "question": "Define renewable energy.",
    "answerFullWorking": "Energy from a source that is not depleted when used, such as wind or solar power.",
    "type": "free-text",
    "interactiveAnswer": "Energy source that doesn't run out."
  },
  {
    "id": 2,
    "question": "Explain the difference between natural greenhouse effect and enhanced greenhouse effect.",
    "answerFullWorking": "Natural is necessary for life, keeping the planet warm. Enhanced is the extra warming caused by human-produced greenhouse gases.",
    "type": "free-text",
    "interactiveAnswer": "Enhanced is caused by excess human emissions."
  },
  {
    "id": 3,
    "question": "A modern LED bulb uses 12 W. An old filament bulb uses 60 W. How much power is saved?",
    "answerFullWorking": "60 W - 12 W = 48 W.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "12 W",
      "48 W",
      "60 W",
      "72 W"
    ],
    "interactiveAnswer": "48 W"
  },
  {
    "id": 4,
    "question": "What environmental impact does burning fossil fuels have on marine environments?",
    "answerFullWorking": "Increased CO2 is absorbed by the ocean, forming carbonic acid and causing ocean acidification.",
    "type": "free-text",
    "interactiveAnswer": "Ocean acidification."
  },
  {
    "id": 5,
    "question": "Name two non-renewable energy resources.",
    "answerFullWorking": "Coal, Oil, Natural Gas.",
    "type": "free-text",
    "interactiveAnswer": "Coal and Oil."
  }
];

export const scienceUnit5Examples: Example[] = [
  {
    "id": "sci_u5_1",
    "title": "5.2 Problem 1: Solving for Wave Speed",
    "problem": "A sound wave traveling through water has a frequency of 250 Hz and a wavelength of 6.0 m. Calculate the speed of this sound wave.",
    "context": "The Wave Equation",
    "interactiveUrl": "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html",
    "method1Name": "Calculation",
    "method1Steps": [
      "Wave equation: v = f * λ",
      "v = 250 * 6.0",
      "v = 1500 m/s."
    ]
  },
  {
    "id": "sci_u5_2",
    "title": "5.2 Problem 2: Calculating Wave Frequency from Period",
    "problem": "The time interval between two consecutive wave crests passing a buoy is 4.0 seconds (period). Calculate the wave frequency.",
    "context": "Wave Properties",
    "method1Name": "Calculation",
    "method1Steps": [
      "f = 1 / T",
      "f = 1 / 4.0",
      "f = 0.25 Hz."
    ]
  },
  {
    "id": "sci_u5_3",
    "title": "5.2 Problem 3: Finding Wavelength of Radio Waves",
    "problem": "Broadcast frequency is 100,000,000 Hz. Speed of light is 300,000,000 m/s. Calculate wavelength.",
    "context": "The Wave Equation",
    "method1Name": "Calculation",
    "method1Steps": [
      "λ = v / f",
      "λ = 300,000,000 / 100,000,000",
      "λ = 3 m."
    ]
  },
  {
    "id": "sci_u5_4",
    "title": "5.2 Problem 4: Law of Reflection Coordinate Mapping",
    "problem": "A laser beam strikes a flat mirror surface at an angle of 35° relative to the mirror surface itself. Calculate the exact angle of reflection relative to the normal.",
    "context": "Light and EM Spectrum",
    "method1Name": "Calculation",
    "method1Steps": [
      "Normal line is perpendicular (90°) to the mirror surface.",
      "Angle of Incidence (i) = 90 - 35 = 55°.",
      "Angle of Reflection (r) = Angle of Incidence (i) = 55°."
    ]
  },
  {
    "id": "sci_u5_5",
    "title": "5.2 Problem 5: Sound Echo Distance Calculation",
    "problem": "A ship emits an ultrasonic pulse downward. It travels at 1500 m/s. Echo is received 1.2 seconds later. Calculate depth.",
    "context": "Sound Waves",
    "method1Name": "Calculation",
    "method1Steps": [
      "Total distance = Speed * Time = 1500 * 1.2 = 1800 m.",
      "Sound travels down and back up. Depth = 1800 / 2 = 900 m."
    ]
  }
];

export const scienceUnit5Practice: PracticeQuestion[] = [
  {
    "id": 1,
    "question": "A wave has a frequency of 50 Hz and a wavelength of 2 m. Calculate its speed.",
    "answerFullWorking": "Speed (v) = f * λ = 50 * 2 = 100 m/s.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "25 m/s",
      "50 m/s",
      "100 m/s",
      "200 m/s"
    ],
    "interactiveAnswer": "100 m/s"
  },
  {
    "id": 2,
    "question": "Why can sound waves travel through solid steel structures but out into the vacuum of space?",
    "answerFullWorking": "Sound waves are mechanical waves that require a medium (particles) to travel through. Space has no particles.",
    "type": "free-text",
    "interactiveAnswer": "Sound needs a medium (particles) to travel."
  },
  {
    "id": 3,
    "question": "List the regions of the Electromagnetic Spectrum in order from lowest to highest frequency.",
    "answerFullWorking": "Radio waves, Microwaves, Infrared, Visible light, Ultraviolet, X-rays, Gamma rays.",
    "type": "free-text",
    "interactiveAnswer": "Radio, Micro, Infrared, Visible, UV, X-ray, Gamma."
  },
  {
    "id": 4,
    "question": "A wave has a speed of 340 m/s and a frequency of 170 Hz. Calculate its wavelength.",
    "answerFullWorking": "λ = v / f = 340 / 170 = 2 m.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "1 m",
      "2 m",
      "4 m",
      "0.5 m"
    ],
    "interactiveAnswer": "2 m"
  },
  {
    "id": 5,
    "question": "How does increasing the amplitude of a sound wave change what a listener hears?",
    "answerFullWorking": "The sound becomes louder.",
    "type": "multiple-choice",
    "interactiveOptions": [
      "It becomes higher pitched",
      "It becomes louder",
      "It becomes softer",
      "It becomes lower pitched"
    ],
    "interactiveAnswer": "It becomes louder"
  }
];

export const scienceUnit6Examples: Example[] = [
  {
    "id": "sci_u6_1",
    "title": "6.2 Problem 1: Balancing the Photosynthesis Equation",
    "problem": "Write out the complete balanced symbol chemical equation for photosynthesis.",
    "context": "The Photosynthesis Reaction",
    "method1Name": "Balancing",
    "method1Steps": [
      "Raw reactants: Carbon Dioxide (CO2) & Water (H2O).",
      "Products: Glucose (C6H12O6) & Oxygen (O2).",
      "6CO2 + 6H2O -> C6H12O6 + 6O2"
    ]
  },
  {
    "id": "sci_u6_2",
    "title": "6.2 Problem 2: Calculating Rates of Photosynthesis",
    "problem": "A pondweed produces 45 bubbles of oxygen in 3 minutes. Calculate the mean rate of photosynthesis.",
    "context": "Testing Photosynthesis",
    "method1Name": "Calculation",
    "method1Steps": [
      "Rate = Quantity of Product Formed / Time Taken.",
      "Rate = 45 / 3 = 15 bubbles/minute."
    ]
  },
  {
    "id": "sci_u6_3",
    "title": "6.2 Problem 3: Applying the Inverse Square Law to Light",
    "problem": "A lamp is moved from 10 cm (0.1 m) to 30 cm (0.3 m) away from a plant. How much does relative light intensity drop?",
    "context": "Limiting Factors",
    "method1Name": "Calculation",
    "method1Steps": [
      "I = 1 / d²",
      "Original intensity (d=1) = 1 / 1² = 1.",
      "New intensity (d=3) = 1 / 3² = 1/9.",
      "Reduces to 1/9th of original value."
    ]
  },
  {
    "id": "sci_u6_4",
    "title": "6.2 Problem 4: Interpreting Limiting Factor Plateaus",
    "problem": "A graph of photosynthesis rate vs light intensity curves up and then flattens. Why?",
    "context": "Limiting Factors",
    "method1Name": "Analysis",
    "method1Steps": [
      "Rising section: Light is the limiting factor.",
      "Plateau section: Further increases in light intensity no longer change the rate.",
      "Another factor (like CO2 or temperature) is now acting as the limiting factor."
    ]
  },
  {
    "id": "sci_u6_5",
    "title": "6.2 Problem 5: Calculating Stomatal Density Calculations",
    "problem": "Microscope field of view is 2 mm². 30 stomata are counted. Calculate stomatal density.",
    "context": "Leaf Structure Anatomy",
    "method1Name": "Calculation",
    "method1Steps": [
      "Stomatal Density = Total Stomata / Total Surface Area.",
      "Stomatal Density = 30 / 2 = 15 stomata per mm²."
    ]
  }
];

export const scienceUnit6Practice: PracticeQuestion[] = [
  {
    "id": 1,
    "question": "Write the complete chemical word equation for photosynthesis.",
    "answerFullWorking": "Carbon Dioxide + Water -> Glucose + Oxygen (in the presence of light and chlorophyll).",
    "type": "free-text",
    "interactiveAnswer": "Carbon Dioxide + Water -> Glucose + Oxygen"
  },
  {
    "id": 2,
    "question": "State the primary function of chlorophyll pigments inside plant cells.",
    "answerFullWorking": "To absorb light energy for photosynthesis. Found in chloroplasts.",
    "type": "free-text",
    "interactiveAnswer": "To absorb light energy."
  },
  {
    "id": 3,
    "question": "What are the three primary environmental factors that can act as limiting factors on photosynthesis?",
    "answerFullWorking": "Light intensity, carbon dioxide concentration, and temperature.",
    "type": "free-text",
    "interactiveAnswer": "Light intensity, carbon dioxide concentration, and temperature."
  },
  {
    "id": 4,
    "question": "Describe the structural difference between xylem and phloem vessels.",
    "answerFullWorking": "Xylem transports water and minerals up from the roots. Phloem transports dissolved sugars (glucose) around the plant.",
    "type": "free-text",
    "interactiveAnswer": "Xylem carries water upwards, phloem carries sugars everywhere."
  },
  {
    "id": 5,
    "question": "Why does the rate of photosynthesis drop to zero when temperatures exceed 50°C?",
    "answerFullWorking": "At high temperatures, the enzymes controlling the photosynthesis reactions become denatured. Their active sites change shape permanently.",
    "type": "free-text",
    "interactiveAnswer": "Enzymes get denatured at high temperatures."
  }
];

export const scienceAssets: Asset[] = [
  {
    "id": "sci_u1_asset_1",
    "type": "diagram",
    "title": "Cell Structure Comparison",
    "url": img_cells_png,
    "description": "Comparison of Animal and Plant Cell structures. Plant cells have a rigid cell wall, chloroplasts for photosynthesis, and a large central vacuole."
  },
  {
    "id": "sci_u1_asset_2",
    "type": "diagram",
    "title": "The Digestive System",
    "url": img_digestive_png,
    "description": "Detailed diagram of human digestive tract."
  },
  {
    "id": "sci_u1_asset_3",
    "type": "diagram",
    "title": "The Circulatory and Respiratory Systems",
    "url": img_circulatory_png,
    "description": "Detailed diagram showing heart and lungs."
  },
  {
    "id": "sci_u1_asset_4",
    "type": "diagram",
    "title": "Homeostasis and Feedback Loops",
    "url": img_homeostasis_png,
    "description": "Overview of biological feedback loops."
  },
  {
    "id": "sci_u2_asset_1",
    "type": "diagram",
    "title": "Bohr Model of the Atom",
    "description": "A simple visual representation of the atom with a central nucleus containing protons and neutrons, orbited by electrons in distinct energy levels.",
    "url": img_bohr_png
  },
  {
    "id": "sci_u2_asset_2",
    "type": "image",
    "title": "The Periodic Table of Elements",
    "description": "A comprehensive reference chart listing all known chemical elements organized by atomic number, electron configuration, and recurring properties.",
    "url": img_periodic_table_png
  },
  {
    "id": "sci_u3_asset_1",
    "type": "diagram",
    "title": "Food Web & Ecological Pyramids",
    "description": "A graphical model of energy flow in a community. The different levels represent the primary producers, primary consumers, and secondary consumers.",
    "url": img_foodweb_jpg
  },
  {
    "id": "sci_u4_asset_1",
    "type": "diagram",
    "title": "The Greenhouse Effect",
    "description": "An illustration showing how atmospheric greenhouse gases trap thermal radiation emitted by the Earth's surface, accelerating climate change.",
    "url": img_greenhouse_png
  },
  {
    "id": "sci_u5_asset_1",
    "type": "diagram",
    "title": "The Electromagnetic Spectrum",
    "description": "A continuous scale showing the types of electromagnetic radiation, ordered by frequency, wavelength, and energy (from Radio waves to Gamma rays).",
    "url": img_em_spectrum_png
  },
  {
    "id": "sci_u6_asset_1",
    "type": "diagram",
    "title": "Photosynthesis Equation and Process",
    "description": "A diagrammatic summary showing water and carbon dioxide entering the plant leaf, and the light-dependent transformation into glucose and oxygen.",
    "url": img_photosynthesis_png
  }
];


