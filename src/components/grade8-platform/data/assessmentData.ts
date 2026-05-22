export const assessmentsData = {
  math: {
    criteriaA: [
      {
        optionTitle: 'Option 1: Number & Algebra Foundation (10 Questions)',
        questions: Array.from({length: 10}).map((_, i) => ({
          id: `m_a_1_${i}`,
          question: `Find the value of x if 2x + ${i*2} = ${i*5 + 10}`,
          marks: 1
        }))
      },
      {
        optionTitle: 'Option 2: Geometry & Trigonometry (10 Questions)',
        questions: Array.from({length: 10}).map((_, i) => ({
          id: `m_a_2_${i}`,
          question: `Calculate the area of a circle with radius ${i + 2} cm (Use pi = 3.14).`,
          marks: 1
        }))
      },
      {
        optionTitle: 'Option 3: Statistics & Probability (10 Questions)',
        questions: Array.from({length: 10}).map((_, i) => ({
          id: `m_a_3_${i}`,
          question: `If the probability of rain is ${(0.1 + i*0.05).toFixed(2)}, what is the probability of no rain?`,
          marks: 1
        }))
      }
    ],
    criteriaB: [
      {
        optionTitle: 'Option 1: Pattern Investigation - Tiles',
        description: 'Examine the sequence of tile patterns. Pattern 1 has 3 tiles, Pattern 2 has 5 tiles, Pattern 3 has 7 tiles.',
        questions: [
          'What is the common difference?',
          'How many tiles will be in Pattern 8?',
          'Write down the general rule (nth term).'
        ]
      },
      {
        optionTitle: 'Option 2: Pattern Investigation - Sequences',
        description: 'Consider the numbering sequence: 10, 15, 20, 25, 30...',
        questions: [
          'Identify whether this is an arithmetic or geometric sequence.',
          'Find the 50th term.',
          'Formulate the nth term expression.'
        ]
      },
      {
        optionTitle: 'Option 3: Advanced Patterns - Quadratics',
        description: 'A growing structural framework has the pattern: 2, 6, 12, 20...',
        questions: [
          'Find the first and second differences.',
          'Predict the next two numbers in the sequence.',
          'Formulate the quadratic nth term.'
        ]
      }
    ],
    criteriaC: [
      {
        optionTitle: 'Option 1: Communicating Algebraic Methods',
        prompt: 'Explain the difference between simplifying an expression and solving an equation. Use the examples 2x+3x and 2x=10 in your explanation.'
      },
      {
        optionTitle: 'Option 2: Justifying Geometric Proofs',
        prompt: 'Describe step-by-step how to prove that the sum of interior angles in a triangle is always 180 degrees using alternate interior angles.'
      },
      {
        optionTitle: 'Option 3: Analyzing Statistical Validity',
        prompt: 'A student claims that since the mean score is 85, most students scored 85. Explain mathematically why this statement might be misleading.'
      }
    ],
    criteriaD: [
      {
        optionTitle: 'Option 1: Real-Life Application - Telecom Plans',
        prompt: 'Compare two phone plans. Plan A costs $20/month plus $2/GB. Plan B costs $40/month with unlimited data. Write equations for both plans. Find the break-even point. Write a recommendation for a user who uses 15GB of data monthly.'
      },
      {
        optionTitle: 'Option 2: Real-Life Application - Architecture',
        prompt: 'You are tasked with laying out a garden in the shape of a composite figure (rectangle + semicircle). Calculate the total perimeter for fencing (costing $15/m). Calculate total area for turfing (costing $8/sqm). Evaluate if a budget of $2000 is sufficient.'
      },
      {
        optionTitle: 'Option 3: Real-Life Application - Finance',
        prompt: 'An investment of $5000 is made into an account earning 5% compound interest annually. Write the formula for the compound interest. Calculate the total amount after 3 years. Discuss the limitations of assuming a constant interest rate in real world economics.'
      }
    ]
  },
  science: {
    criteriaA: [
      { optionTitle: 'Option 1: Biology - Cell Structures', prompt: 'List 5 organelles and their specific functions within an animal cell.' },
      { optionTitle: 'Option 2: Chemistry - Atomic Theory', prompt: 'Explain the composition of a Bohr model for an atom of Carbon-12.' },
      { optionTitle: 'Option 3: Physics - Forces', prompt: 'State Newton\'s three laws of motion with one practical example for each.' }
    ],
    criteriaB: [
      { optionTitle: 'Option 1: Inquiring - Osmosis', prompt: 'Design an experiment to test the effect of different salt concentrations on potato cylinder mass.' },
      { optionTitle: 'Option 2: Inquiring - Acid Reactions', prompt: 'Formulate a hypothesis and variable control list for testing the reaction rate of HCl with Magnesium.' },
      { optionTitle: 'Option 3: Inquiring - Pendulum', prompt: 'Identify the independent, dependent, and three controlled variables for an experiment testing pendulum length vs period.' }
    ],
    criteriaC: [
      { optionTitle: 'Option 1: Evaluating Data - Plant Growth', prompt: 'Given a table of plant heights over 10 days, calculate the mean growth rate and evaluate the reliability of the anomalous Day 4 result.' },
      { optionTitle: 'Option 2: Evaluating Data - Titration', prompt: 'Review a set of pH readings during a titration. Identify the neutralization point and comment on the precision.' },
      { optionTitle: 'Option 3: Evaluating Data - Thermal Loss', prompt: 'Analyze a cooling curve graph for water in different insulating cups. Conclude which material is the best insulator and suggest improvements to the method.' }
    ],
    criteriaD: [
      { optionTitle: 'Option 1: Impacts - Genetic Modification', prompt: 'Discuss the ethical and environmental impacts of cultivating genetically modified, pest-resistant crops.' },
      { optionTitle: 'Option 2: Impacts - Plastics', prompt: 'Evaluate the economic benefits vs the environmental consequences of single-use plastics in the medical industry.' },
      { optionTitle: 'Option 3: Impacts - Renewable Energy', prompt: 'Analyze the societal and geographical impacts of transitioning heavily to hydroelectric power in a developing country.' }
    ]
  },
  english: {
    criteriaA: [
      { optionTitle: 'Option 1: Analyzing Poetry', prompt: 'Analyze how the poet uses sensory imagery and enjambment to convey a sense of isolation in the provided stanza.' },
      { optionTitle: 'Option 2: Analyzing Prose', prompt: 'Identify the narrative perspective and discuss how it shapes the reader\'s understanding of the protagonist\'s bias.' },
      { optionTitle: 'Option 3: Analyzing Media', prompt: 'Deconstruct a short commercial, explaining how the creator uses lighting, music (diegetic vs non-diegetic), and camera angles to persuade the target audience.' }
    ],
    criteriaB: [
      { optionTitle: 'Option 1: Organizing - Comparative Essay', prompt: 'Create a detailed outline (Introduction, 3 Body Paragraphs, Conclusion) comparing the theme of ambition in two different texts.' },
      { optionTitle: 'Option 2: Organizing - Persuasive Speech', prompt: 'Structure a persuasive speech using the AFOREST rhetorical devices to argue for stricter environmental policies.' },
      { optionTitle: 'Option 3: Organizing - Creative Narrative', prompt: 'Map out the plot of a short story using the standard narrative arc (Exposition, Rising Action, Climax, Falling Action, Resolution).' }
    ],
    criteriaC: [
      { optionTitle: 'Option 1: Producing Text - Narrative Writing', prompt: 'Write a 400-word creative narrative from the perspective of an inanimate object witnessing a historic event, focusing on establishing a distinct voice.' },
      { optionTitle: 'Option 2: Producing Text - Editorial', prompt: 'Draft a formal editorial for a newspaper arguing for the importance of arts education in schools, adapting your register for a formal adult audience.' },
      { optionTitle: 'Option 3: Producing Text - Scriptwriting', prompt: 'Write a two-page script for a dramatic confrontation between two characters, utilizing subtext and stage directions effectively.' }
    ],
    criteriaD: [
      { optionTitle: 'Option 1: Using Language - Vocabulary', prompt: 'Rewrite the provided passive, simplistic paragraph using active voice and high-level academic vocabulary (e.g., replace "good" with "beneficial").' },
      { optionTitle: 'Option 2: Using Language - Punctuation & Syntax', prompt: 'Draft a descriptive paragraph of a chaotic storm, deliberately using varied sentence lengths, semicolons, and dashes to dictate the pace of reading.' },
      { optionTitle: 'Option 3: Using Language - Figurative Language', prompt: 'Compose a poem of at least three stanzas that relies heavily on extended metaphor and personification to describe a modern city.' }
    ]
  }
};
