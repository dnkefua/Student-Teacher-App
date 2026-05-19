import { AnimationMode, CourseChapter, CourseLesson } from './eisMypMathCourse';

export type ConceptVisualStrategy = {
  title: string;
  method: string;
  classroomMove: string;
  animationCue: string;
};

/**
 * A worked solution step. `text` is the teacher's explanation in plain English;
 * `working` is the numeric or algebraic line that backs it up (rendered in a
 * monospace box). Pairing the two means the student sees both the WHY and the
 * mechanical line they should write down.
 */
export type WorkedStep = {
  text: string;
  working?: string;
};

export type ConceptExample = {
  label: string;
  prompt: string;
  /** Legacy single-paragraph method. Still rendered when `steps` is empty. */
  method: string;
  answer: string;
  /** Multi-step worked solution. Each item is a numbered step the student can advance through. */
  steps?: WorkedStep[];
  /** Optional key formula shown above the steps (e.g. "C = π × d"). */
  formula?: string;
};

export type ConceptExercise = {
  label: string;
  prompt: string;
  successCheck: string;
};

export type ConceptResearchPack = {
  topic: string;
  researchNote: string;
  visualStrategies: ConceptVisualStrategy[];
  examples: ConceptExample[];
  exercises: ConceptExercise[];
};

const researchNote =
  'Demonstrations use multiple linked representations: visual model, symbolic form, table or graph, interactive motion, and a real EIS context. This follows the same design pattern used by dynamic maths tools where students manipulate one representation and watch the others update.';

const visualStrategyCopy: Record<AnimationMode, ConceptVisualStrategy[]> = {
  'number-line': [
    {
      title: 'Number-line sweep',
      method: 'Place values, integers or solution sets on a horizontal scale with boundary markers.',
      classroomMove: 'Ask students to predict the landing point before the marker moves.',
      animationCue: 'Animate a glowing point travelling left or right, then pulse at the final value.',
    },
    {
      title: 'Place-value zoom',
      method: 'Zoom from large units to decimal columns so magnitude is visible before calculation.',
      classroomMove: 'Have students explain which digit controls the decision.',
      animationCue: 'Columns expand from millions to thousandths, with the deciding digit highlighted.',
    },
    {
      title: 'Open and closed endpoints',
      method: 'Use circles and rays to distinguish strict and inclusive boundaries.',
      classroomMove: 'Students give three numbers that belong and one that does not.',
      animationCue: 'Open circles stay hollow, closed circles fill, and rays grow across the line.',
    },
    {
      title: 'Real-world scale',
      method: 'Connect the line to temperature, elevation, money or score changes.',
      classroomMove: 'Invite an EIS example such as house points or temperature change.',
      animationCue: 'A second contextual scale fades in under the mathematical one.',
    },
    {
      title: 'Estimate then calculate',
      method: 'Show a rough benchmark first, then reveal the exact calculation.',
      classroomMove: 'Students decide if the final answer is reasonable.',
      animationCue: 'A wide estimate band narrows into an exact value marker.',
    },
  ],
  'percentage-bars': [
    {
      title: 'Hundred-grid shade',
      method: 'Represent fractions, decimals and percentages as shaded parts of 100.',
      classroomMove: 'Students translate the same shade into three forms.',
      animationCue: 'Cells fill in rows of ten, then regroup into fraction and decimal labels.',
    },
    {
      title: 'Bar model comparison',
      method: 'Use equal-length bars to compare different totals fairly.',
      classroomMove: 'Ask which bar represents the whole before calculating.',
      animationCue: 'Bars resize to the same 100% width and labels slide into place.',
    },
    {
      title: 'Multiplier machine',
      method: 'Show increase, decrease and reverse percentage as multiplication by a scale factor.',
      classroomMove: 'Students name the multiplier before pressing run.',
      animationCue: 'A value enters the machine and exits larger or smaller with the multiplier visible.',
    },
    {
      title: 'Discount tag',
      method: 'Connect percentage change to AED prices, school-shop offers and fees.',
      classroomMove: 'Students decide whether to subtract the change or find the original.',
      animationCue: 'A price tag folds to show original, change and final value.',
    },
    {
      title: 'Triple representation',
      method: 'Keep fraction, decimal and percent cards linked on screen.',
      classroomMove: 'Hide one card and ask students to recover it.',
      animationCue: 'Editing one card updates the other two cards instantly.',
    },
  ],
  'ratio-mixer': [
    {
      title: 'Part-to-part mixer',
      method: 'Pour coloured parts into connected containers to show ratio structure.',
      classroomMove: 'Students count total parts before finding one part.',
      animationCue: 'Containers fill in linked pulses that preserve the ratio.',
    },
    {
      title: 'Tape diagram',
      method: 'Break the total into equal blocks and label each share.',
      classroomMove: 'Ask which blocks belong to each person or ingredient.',
      animationCue: 'Blocks snap together, then split into named shares.',
    },
    {
      title: 'Scale table',
      method: 'Build equivalent ratios by multiplying both columns.',
      classroomMove: 'Students complete a missing row and justify the scale factor.',
      animationCue: 'Rows duplicate and stretch with the same multiplier badge.',
    },
    {
      title: 'Unit-rate lens',
      method: 'Convert rates to one unit for fair comparison.',
      classroomMove: 'Students identify the unit being standardised.',
      animationCue: 'A magnifier locks onto the one-unit row.',
    },
    {
      title: 'Map and model scale',
      method: 'Place scale drawings beside real dimensions.',
      classroomMove: 'Students check units before applying the scale.',
      animationCue: 'A ruler expands from drawing length to real length.',
    },
  ],
  'algebra-tiles': [
    {
      title: 'Growing tile pattern',
      method: 'Show term 1, 2 and 3, then generalise to term n.',
      classroomMove: 'Students name what stays constant and what grows.',
      animationCue: 'Tiles duplicate by term and collapse into an nth-term rule.',
    },
    {
      title: 'Like-term sorting',
      method: 'Sort variables, constants and powers into matching groups.',
      classroomMove: 'Ask why unlike terms cannot be combined.',
      animationCue: 'Matching terms magnetise into groups while unlike terms repel.',
    },
    {
      title: 'Area model for brackets',
      method: 'Use rectangles to show distribution across every term.',
      classroomMove: 'Students point to each product before simplifying.',
      animationCue: 'A bracket opens into a rectangle split into product regions.',
    },
    {
      title: 'Factorisation reverse',
      method: 'Reverse expansion by pulling out a common factor.',
      classroomMove: 'Students find the greatest common factor first.',
      animationCue: 'Terms slide back into a bracket tray labelled by the factor.',
    },
    {
      title: 'Context-to-expression',
      method: 'Translate a school scenario into variables and operations.',
      classroomMove: 'Students define the variable before writing the expression.',
      animationCue: 'Words fade into symbols one phrase at a time.',
    },
  ],
  'equation-balance': [
    {
      title: 'Balance scale',
      method: 'Represent both sides of an equation as equal weights.',
      classroomMove: 'Students say the inverse operation and apply it to both sides.',
      animationCue: 'Both pans change together and return to level after each step.',
    },
    {
      title: 'Equation flowchart',
      method: 'Trace operations from x to the output, then reverse the flow.',
      classroomMove: 'Students list inverse operations in reverse order.',
      animationCue: 'Arrows reverse direction when solving starts.',
    },
    {
      title: 'Substitution panel',
      method: 'Plug values into a formula with variables highlighted by colour.',
      classroomMove: 'Students check units and replace one variable at a time.',
      animationCue: 'Variables drop into empty slots and the result calculates live.',
    },
    {
      title: 'Inequality boundary',
      method: 'Show a boundary value and the range that remains true.',
      classroomMove: 'Students test one value on each side of the boundary.',
      animationCue: 'True values glow; false values fade.',
    },
    {
      title: 'Check step',
      method: 'Substitute the solution back into the original statement.',
      classroomMove: 'Students decide whether both sides match.',
      animationCue: 'Left and right expressions evaluate side by side.',
    },
  ],
  'coordinate-grid': [
    {
      title: 'Point plotter',
      method: 'Plot ordered pairs by moving horizontally then vertically.',
      classroomMove: 'Students call x first, then y.',
      animationCue: 'A marker travels along the x-axis before rising or falling.',
    },
    {
      title: 'Table-to-graph',
      method: 'Build a table of values and plot each row as a point.',
      classroomMove: 'Students predict the shape before all points appear.',
      animationCue: 'Rows light up and points appear on the grid in sequence.',
    },
    {
      title: 'Gradient triangle',
      method: 'Draw rise and run between two points.',
      classroomMove: 'Students state gradient as rise divided by run.',
      animationCue: 'A right triangle grows under the line and labels both legs.',
    },
    {
      title: 'Rate tracker',
      method: 'Connect distance-time or cost-quantity stories to line graphs.',
      classroomMove: 'Students identify what the slope means in context.',
      animationCue: 'A moving object traces the graph as values update.',
    },
    {
      title: 'Intersection lens',
      method: 'Use crossing graphs to compare two rules or choices.',
      classroomMove: 'Students interpret the intersection as equal value.',
      animationCue: 'The crossing point pulses and displays both coordinates.',
    },
  ],
  'angle-lab': [
    {
      title: 'Angle arms',
      method: 'Rotate rays around a vertex to form measured angles.',
      classroomMove: 'Students classify the angle before the measure appears.',
      animationCue: 'The angle arc grows as the arm rotates.',
    },
    {
      title: 'Parallel-line overlay',
      method: 'Highlight corresponding, alternate and co-interior angles.',
      classroomMove: 'Students name the relationship before calculating.',
      animationCue: 'Equal angles flash in matching colours.',
    },
    {
      title: 'Polygon sum build',
      method: 'Split polygons into triangles to reveal angle sums.',
      classroomMove: 'Students count triangles from one vertex.',
      animationCue: 'Diagonals draw in, then triangle sums stack to the total.',
    },
    {
      title: 'Bearing compass',
      method: 'Measure clockwise from north using a compass rose.',
      classroomMove: 'Students write bearings with three digits.',
      animationCue: 'A compass needle sweeps clockwise and stops at the bearing.',
    },
    {
      title: 'Geometric proof trail',
      method: 'Chain facts from the diagram to justify an unknown angle.',
      classroomMove: 'Students say the reason after every calculation.',
      animationCue: 'Each reason becomes a breadcrumb on the diagram.',
    },
  ],
  'circle-lab': [
    {
      title: 'Circle-part reveal',
      method: 'Reveal radius, diameter, chord, arc, sector and segment one at a time.',
      classroomMove: 'Students identify the part before the label appears.',
      animationCue: 'Each part glows and its label orbits into position.',
    },
    {
      title: 'Circumference unwrap',
      method: 'Unroll the circle boundary into a straight strip.',
      classroomMove: 'Students connect diameter to pi times around.',
      animationCue: 'The circular boundary peels off and stretches into a line.',
    },
    {
      title: 'Area sector rearrange',
      method: 'Cut the circle into sectors and rearrange them into a near-rectangle.',
      classroomMove: 'Students identify why the rectangle dimensions become pi r and r.',
      animationCue: 'Sectors alternate and slide into a rectangle shape.',
    },
    {
      title: 'Fractional circle pieces',
      method: 'Show semicircles and quadrants as fractions of the full circle.',
      classroomMove: 'Students multiply by one half or one quarter before adding straight edges.',
      animationCue: 'Circle pieces detach, rotate and snap to straight segments.',
    },
    {
      title: 'Object measurement',
      method: 'Connect formulas to wheels, fields, clocks or school logos.',
      classroomMove: 'Students choose whether length or area is being measured.',
      animationCue: 'A real object outline overlays the mathematical circle.',
    },
  ],
  'construction-compass': [
    {
      title: 'Compass arcs',
      method: 'Use equal-radius arcs to locate exact points.',
      classroomMove: 'Students explain why fixed compass width matters.',
      animationCue: 'Arcs sweep from endpoints and sparkle at intersections.',
    },
    {
      title: 'Construction replay',
      method: 'Show each ruler-and-compass step as a repeatable sequence.',
      classroomMove: 'Students narrate the next tool action before it happens.',
      animationCue: 'A timeline ticks through base, arcs, joins and checks.',
    },
    {
      title: 'Congruence motion',
      method: 'Slide, rotate or reflect one shape onto another.',
      classroomMove: 'Students decide whether size and shape are preserved.',
      animationCue: 'Shapes move in 3D space until corresponding parts align.',
    },
    {
      title: 'Equal-distance locus',
      method: 'Show points that are the same distance from endpoints or sides.',
      classroomMove: 'Students describe the property before naming the bisector.',
      animationCue: 'Distance lines pulse equally from a moving point.',
    },
    {
      title: 'Precision checklist',
      method: 'Connect the final drawing to measurements and success criteria.',
      classroomMove: 'Students verify side lengths, angles and construction marks.',
      animationCue: 'Checkmarks appear beside each construction condition.',
    },
  ],
  'solid-builder': [
    {
      title: 'Net unfold',
      method: 'Unfold a 3D solid into flat faces before calculating area.',
      classroomMove: 'Students count faces and pair equal rectangles.',
      animationCue: 'Faces hinge outward and land as a labelled net.',
    },
    {
      title: 'Unit-cube fill',
      method: 'Fill volume layer by layer with cubes.',
      classroomMove: 'Students identify length, width and height as repeated layers.',
      animationCue: 'Cubes stack in rows, then layers, then display the product.',
    },
    {
      title: 'Shape decomposition',
      method: 'Split compound shapes into rectangles, triangles or prisms.',
      classroomMove: 'Students choose a split that makes calculation simpler.',
      animationCue: 'Cut lines draw in and each piece lifts slightly.',
    },
    {
      title: 'Dimension slider',
      method: 'Adjust length, width or height and watch area or volume respond.',
      classroomMove: 'Students predict what doubles or squares.',
      animationCue: 'A slider stretches the model while formula values update.',
    },
    {
      title: 'Design constraint',
      method: 'Use classroom objects, packaging or study pods as measurement contexts.',
      classroomMove: 'Students justify the units and optimisation choice.',
      animationCue: 'A premium 3D model rotates with dimensions pinned to edges.',
    },
  ],
  'data-lab': [
    {
      title: 'Data pipeline',
      method: 'Move from question to sample, collection, display and conclusion.',
      classroomMove: 'Students identify where bias could enter.',
      animationCue: 'Responses flow through filters labelled sample, table, graph and claim.',
    },
    {
      title: 'Dot-plot stack',
      method: 'Stack repeated values to expose frequency and shape.',
      classroomMove: 'Students describe centre and spread before calculating.',
      animationCue: 'Dots fall into columns and the centre marker slides in.',
    },
    {
      title: 'Mean balance',
      method: 'Represent the mean as a balance point of the data.',
      classroomMove: 'Students compare mean, median and mode for the same set.',
      animationCue: 'A balance beam tilts, then levels at the mean.',
    },
    {
      title: 'Two-distribution comparison',
      method: 'Display two data sets with matching scales.',
      classroomMove: 'Students write one sentence about centre and one about spread.',
      animationCue: 'Two dot plots compress and stretch while summary labels update.',
    },
    {
      title: 'Claim audit',
      method: 'Connect graph choice and sample quality to trustworthy conclusions.',
      classroomMove: 'Students mark claims as supported, weak or biased.',
      animationCue: 'Evidence badges attach to each claim.',
    },
  ],
  'probability-spinner': [
    {
      title: 'Probability scale',
      method: 'Place events from impossible to certain on a 0 to 1 line.',
      classroomMove: 'Students justify whether an event is closer to 0, 1/2 or 1.',
      animationCue: 'Event cards slide along the probability scale.',
    },
    {
      title: 'Spinner sectors',
      method: 'Show favourable outcomes as highlighted sectors of a spinner.',
      classroomMove: 'Students count favourable and total equally likely outcomes.',
      animationCue: 'The spinner slows and the target sectors glow.',
    },
    {
      title: 'Complement flip',
      method: 'Show an event and not-event covering the full sample space.',
      classroomMove: 'Students calculate the easier part first.',
      animationCue: 'The selected sector flips colour to reveal its complement.',
    },
    {
      title: 'Trial simulator',
      method: 'Compare experimental frequency with theoretical probability.',
      classroomMove: 'Students predict how the estimate changes with more trials.',
      animationCue: 'A bar graph stabilises as trial count increases.',
    },
    {
      title: 'Fairness test',
      method: 'Use probability to judge whether a game or reward system is fair.',
      classroomMove: 'Students redesign one outcome to make the model fairer.',
      animationCue: 'Outcome weights rebalance until probabilities match the goal.',
    },
  ],
};

const exampleCopy: Record<AnimationMode, Omit<ConceptExample, 'label'>[]> = {
  'number-line': [
    {
      prompt: 'Order −2.5, −1/4, 0.6, and −3 from smallest to largest.',
      method: 'Convert every value to the same form, place each on a shared number line, then read left to right.',
      answer: '−3,  −2.5,  −1/4,  0.6',
      formula: 'a < b on a number line  ⟺  a is to the LEFT of b',
      steps: [
        { text: 'Write every value in decimal so they can be compared on one scale.', working: '−1/4 = −0.25' },
        { text: 'Plot the four points on a number line from −4 to 1.' },
        { text: 'The further LEFT a point is, the smaller the value. Negative values are smaller than 0.', working: 'leftmost = smallest' },
        { text: 'Read the order left → right.', working: '−3 ,  −2.5 ,  −0.25 ,  0.6' },
      ],
    },
    {
      prompt: 'Round 8,746 to the nearest hundred.',
      method: 'Identify the digit in the hundreds place, then use the tens digit to decide whether to round up or down.',
      answer: '8,700',
      formula: 'If the next digit is 5 or more → round up. Otherwise → round down.',
      steps: [
        { text: 'Underline the rounding digit — the hundreds place.', working: '8 , 7̲ 4 6' },
        { text: 'Look at the digit immediately to its right (the tens digit).', working: 'tens digit = 4' },
        { text: 'Apply the rule: 4 is less than 5, so the hundreds digit stays the same.' },
        { text: 'Replace the tens and units with zeros.', working: '→ 8,700' },
      ],
    },
    {
      prompt: 'A score changes by −6, +14, then −3. What is the final change?',
      method: 'Treat each change as a hop on the number line and combine the integers.',
      answer: '+5',
      formula: 'Net change  =  Σ (each signed change)',
      steps: [
        { text: 'Start at 0 on the number line.', working: 'position = 0' },
        { text: 'Apply the first change: move 6 to the LEFT.', working: '0 − 6 = −6' },
        { text: 'Apply the second change: move 14 to the RIGHT.', working: '−6 + 14 = +8' },
        { text: 'Apply the third change: move 3 to the LEFT.', working: '+8 − 3 = +5' },
      ],
    },
    {
      prompt: 'Solve x ≥ −1 and show the solution set on a number line.',
      method: 'Mark the boundary, choose the correct circle, then shade in the direction the inequality demands.',
      answer: 'x ∈ [−1, ∞)   —   closed circle at −1, ray to the right',
      formula: '≥  or  ≤  → CLOSED circle.    >  or  <  → OPEN circle.',
      steps: [
        { text: 'Identify the boundary value.', working: 'boundary = −1' },
        { text: 'Decide the circle type. Because the inequality is ≥, the boundary itself IS a solution.', working: 'closed (filled) circle' },
        { text: 'Decide the direction. “x is greater than or equal to” means values to the RIGHT.', working: 'shade right →' },
        { text: 'Verify with a test value: x = 2.', working: '2 ≥ −1  ✓' },
      ],
    },
    {
      prompt: 'Estimate 39.8 × 21 before calculating, then check.',
      method: 'Round each factor to the easiest nearby benchmark, multiply, and compare with the exact value.',
      answer: 'Estimate ≈ 800   (exact 835.8)',
      formula: 'Estimate ≈ round(a) × round(b)',
      steps: [
        { text: 'Round each factor to the nearest 10.', working: '39.8 → 40,   21 → 20' },
        { text: 'Multiply the rounded values.', working: '40 × 20 = 800' },
        { text: 'Decide whether the estimate is HIGH or LOW. We rounded 39.8 UP and 21 DOWN, so the estimate is roughly balanced.' },
        { text: 'Calculate the exact answer to confirm the estimate is sensible.', working: '39.8 × 21 = 835.8 ≈ 800  ✓' },
      ],
    },
  ],

  'percentage-bars': [
    {
      prompt: 'Write 3/8 as a percentage.',
      method: 'Convert the fraction to a decimal by dividing, then multiply by 100.',
      answer: '37.5 %',
      formula: 'fraction  →  decimal  →  × 100  =  percentage',
      steps: [
        { text: 'A percentage means “out of 100”. Begin by converting the fraction to a decimal.', working: '3 ÷ 8 = 0.375' },
        { text: 'Multiply by 100 to express the decimal as a percentage.', working: '0.375 × 100 = 37.5' },
        { text: 'Attach the % sign.', working: '→ 37.5 %' },
      ],
    },
    {
      prompt: 'Find 18 % of 250 AED.',
      method: 'Either convert 18 % to its decimal multiplier (0.18) or build it from 10 %, 5 % and 3 %.',
      answer: '45 AED',
      formula: 'x % of N  =  (x ÷ 100) × N',
      steps: [
        { text: 'Convert the percentage to its decimal multiplier.', working: '18 % = 18 ÷ 100 = 0.18' },
        { text: 'Multiply the whole amount by the multiplier.', working: '0.18 × 250' },
        { text: 'Compute the product.', working: '= 45' },
        { text: 'Add the unit.', working: '→ 45 AED' },
      ],
    },
    {
      prompt: 'A price rises from 80 AED to 92 AED. Find the percentage increase.',
      method: 'Find the actual change, divide by the ORIGINAL price (not the new one), then multiply by 100.',
      answer: '+15 %',
      formula: '% change  =  (change ÷ original) × 100',
      steps: [
        { text: 'Find the change in price (new − original).', working: '92 − 80 = 12 AED' },
        { text: 'Divide the change by the ORIGINAL price.', working: '12 ÷ 80 = 0.15' },
        { text: 'Multiply by 100 to get a percentage.', working: '0.15 × 100 = 15' },
        { text: 'Because the price went up, write the answer as an INCREASE.', working: '→ +15 %' },
      ],
    },
    {
      prompt: 'After a 20 % discount, a bag costs 96 AED. Find the original price.',
      method: 'The sale price represents 100 % − 20 % = 80 % of the original. Reverse the multiplier to recover the original.',
      answer: '120 AED',
      formula: 'original  =  sale price  ÷  (1 − discount as decimal)',
      steps: [
        { text: 'Identify what fraction of the original price the sale price is.', working: '100 % − 20 % = 80 % = 0.8' },
        { text: 'Write the relationship as an equation.', working: '0.8 × original = 96' },
        { text: 'Divide both sides by 0.8 to isolate the original.', working: 'original = 96 ÷ 0.8' },
        { text: 'Compute the quotient.', working: '= 120 AED' },
        { text: 'Check by reapplying the discount.', working: '120 × 0.8 = 96  ✓' },
      ],
    },
    {
      prompt: 'Which is larger: 7/20 or 32 %?',
      method: 'Convert both to the SAME representation before comparing.',
      answer: '7/20 is larger (35 %)',
      formula: 'a/b  =  (a × 100 ÷ b)  %',
      steps: [
        { text: 'Convert 7/20 to a percentage. Multiply numerator and denominator by 5 to get a denominator of 100.', working: '7/20 = 35/100 = 35 %' },
        { text: 'Compare the two percentages directly.', working: '35 % vs 32 %' },
        { text: '35 > 32, so 7/20 is larger.' },
      ],
    },
  ],

  'ratio-mixer': [
    {
      prompt: 'Share 84 AED in the ratio 2 : 5.',
      method: 'Add the parts to find the total share, divide the total by that, then multiply by each part.',
      answer: '24 AED and 60 AED',
      formula: 'one part  =  total  ÷  (sum of parts)',
      steps: [
        { text: 'Add the parts of the ratio to find how many equal shares there are.', working: '2 + 5 = 7 parts' },
        { text: 'Divide the total by the number of parts to find the size of ONE part.', working: '84 ÷ 7 = 12 AED' },
        { text: 'Multiply each share by the size of one part.', working: '2 × 12 = 24,   5 × 12 = 60' },
        { text: 'Check by adding the shares.', working: '24 + 60 = 84  ✓' },
      ],
    },
    {
      prompt: 'Simplify the ratio 36 : 48.',
      method: 'Divide both sides by the greatest common factor (HCF) of the two numbers.',
      answer: '3 : 4',
      formula: 'a : b  =  (a ÷ k) : (b ÷ k)   where k is the HCF',
      steps: [
        { text: 'Find the greatest common factor of 36 and 48.', working: 'HCF(36, 48) = 12' },
        { text: 'Divide each side of the ratio by 12.', working: '36 ÷ 12 = 3,   48 ÷ 12 = 4' },
        { text: 'Write the simplified ratio.', working: '→ 3 : 4' },
        { text: 'Check 3 and 4 share no common factor greater than 1.' },
      ],
    },
    {
      prompt: 'A recipe uses rice : water = 2 : 5. How much water is needed for 300 g of rice?',
      method: 'Find the size of one rice-part, then multiply by 5 to get the water.',
      answer: '750 g of water',
      formula: 'water  =  rice × (5 ÷ 2)',
      steps: [
        { text: 'Identify what one rice-part represents.', working: '2 parts ↔ 300 g  ⇒  1 part = 150 g' },
        { text: 'Water uses 5 parts. Multiply the size of one part by 5.', working: '5 × 150 = 750' },
        { text: 'Attach the correct unit.', working: '→ 750 g of water' },
      ],
    },
    {
      prompt: 'Which is better value: 4 pens for 18 AED, or 6 pens for 24 AED?',
      method: 'Convert each offer to a UNIT rate (price per pen) and compare.',
      answer: '6 pens for 24 AED (4 AED per pen)',
      formula: 'unit price  =  total price  ÷  quantity',
      steps: [
        { text: 'Find the unit price of the first offer.', working: '18 ÷ 4 = 4.50 AED per pen' },
        { text: 'Find the unit price of the second offer.', working: '24 ÷ 6 = 4.00 AED per pen' },
        { text: 'Compare. The smaller unit price is better value.', working: '4.00 < 4.50' },
        { text: 'Conclude.', working: '→ 6 pens for 24 AED is the better deal' },
      ],
    },
    {
      prompt: 'A drawing uses scale 1 : 250. A wall is 6 cm on the plan. Find the real length.',
      method: 'Multiply the drawing length by the scale factor to recover the real-world length.',
      answer: '15 m',
      formula: 'real  =  drawing × scale factor',
      steps: [
        { text: 'Read the scale: 1 cm on the plan represents 250 cm in real life.' },
        { text: 'Multiply the drawing length by 250.', working: '6 × 250 = 1500 cm' },
        { text: 'Convert cm to a sensible unit. 100 cm = 1 m.', working: '1500 cm ÷ 100 = 15 m' },
      ],
    },
  ],

  'algebra-tiles': [
    {
      prompt: 'Find the n-th term for the sequence 5, 9, 13, 17, …',
      method: 'Find the common difference (the gradient of the pattern), then adjust to land on the first term.',
      answer: 'Tₙ = 4n + 1',
      formula: 'Tₙ  =  (common difference) × n  +  adjustment',
      steps: [
        { text: 'Find the common difference between consecutive terms.', working: '9 − 5 = 4,   13 − 9 = 4   →   d = 4' },
        { text: 'Start the rule with 4n (the difference times n).', working: 'try Tₙ = 4n' },
        { text: 'Test n = 1.', working: '4 × 1 = 4  ✗  (should be 5)' },
        { text: 'Add the correction so that T₁ = 5.', working: '5 − 4 = +1' },
        { text: 'Write the final rule and verify for n = 2.', working: 'Tₙ = 4n + 1   ;   4(2)+1 = 9  ✓' },
      ],
    },
    {
      prompt: 'Simplify 6x − 2y + 3x + 7y.',
      method: 'Collect like terms — x-terms together, y-terms together. Constants would be separate too if present.',
      answer: '9x + 5y',
      steps: [
        { text: 'Group the x-terms and the y-terms.', working: '(6x + 3x) + (−2y + 7y)' },
        { text: 'Combine the x-terms.', working: '6x + 3x = 9x' },
        { text: 'Combine the y-terms (signs matter).', working: '−2y + 7y = 5y' },
        { text: 'Write the simplified expression.', working: '→ 9x + 5y' },
      ],
    },
    {
      prompt: 'Expand 3(2a − 5).',
      method: 'Use the distributive law: multiply the outside number by EVERY term inside the bracket.',
      answer: '6a − 15',
      formula: 'k(a + b)  =  ka + kb',
      steps: [
        { text: 'Multiply the first term inside the bracket by 3.', working: '3 × 2a = 6a' },
        { text: 'Multiply the second term inside the bracket by 3, keeping the sign.', working: '3 × (−5) = −15' },
        { text: 'Combine the products.', working: '→ 6a − 15' },
      ],
    },
    {
      prompt: 'Factorise 12m + 18.',
      method: 'Find the greatest common factor of every term, then write it outside a bracket.',
      answer: '6(2m + 3)',
      formula: 'ka + kb  =  k(a + b)',
      steps: [
        { text: 'Find the HCF of 12 and 18.', working: 'HCF(12, 18) = 6' },
        { text: 'Divide each original term by 6 to find what stays inside the bracket.', working: '12m ÷ 6 = 2m,   18 ÷ 6 = 3' },
        { text: 'Write the factorised form.', working: '→ 6(2m + 3)' },
        { text: 'Check by expanding.', working: '6 × 2m + 6 × 3 = 12m + 18  ✓' },
      ],
    },
    {
      prompt: 'A club charges 15 AED plus 4 AED per activity. Write the cost for n activities.',
      method: 'Identify the fixed (constant) cost and the variable (per-activity) cost, then add them.',
      answer: 'C = 4n + 15',
      formula: 'Cost  =  fixed  +  rate × quantity',
      steps: [
        { text: 'Identify the fixed charge that does not depend on n.', working: 'fixed = 15 AED' },
        { text: 'Identify the rate per activity.', working: 'rate = 4 AED per activity' },
        { text: 'Write the variable part as rate × n.', working: 'variable = 4n' },
        { text: 'Add the two parts together.', working: '→ C = 4n + 15' },
      ],
    },
  ],

  'equation-balance': [
    {
      prompt: 'Solve 4x + 9 = 33.',
      method: 'Undo the operations in REVERSE order. The same operation on both sides keeps the balance.',
      answer: 'x = 6',
      formula: 'Reverse BIDMAS: undo +/− first, then ×/÷',
      steps: [
        { text: 'Subtract 9 from both sides to remove the constant from the left.', working: '4x + 9 − 9 = 33 − 9   ⇒   4x = 24' },
        { text: 'Divide both sides by 4 to isolate x.', working: '4x ÷ 4 = 24 ÷ 4   ⇒   x = 6' },
        { text: 'Check by substituting x = 6 into the original.', working: '4(6) + 9 = 24 + 9 = 33  ✓' },
      ],
    },
    {
      prompt: 'Solve 3(x − 2) = 24.',
      method: 'Either divide first or expand the bracket first — either path is valid.',
      answer: 'x = 10',
      steps: [
        { text: 'Divide both sides by 3 to remove the bracket factor.', working: '(x − 2) = 24 ÷ 3 = 8' },
        { text: 'Add 2 to both sides.', working: 'x = 8 + 2' },
        { text: 'Simplify.', working: 'x = 10' },
        { text: 'Check.', working: '3(10 − 2) = 3 × 8 = 24  ✓' },
      ],
    },
    {
      prompt: 'Solve 5x − 4 = 2x + 11.',
      method: 'Variables on one side, numbers on the other. Then divide.',
      answer: 'x = 5',
      steps: [
        { text: 'Subtract 2x from both sides to bring x to one side only.', working: '5x − 2x − 4 = 11   ⇒   3x − 4 = 11' },
        { text: 'Add 4 to both sides to isolate the variable term.', working: '3x = 15' },
        { text: 'Divide both sides by 3.', working: 'x = 5' },
        { text: 'Check by substitution.', working: '5(5) − 4 = 21  ;   2(5) + 11 = 21  ✓' },
      ],
    },
    {
      prompt: 'Use the formula A = l × w to find the area when l = 12 and w = 7.',
      method: 'Substitute the given values, then evaluate the arithmetic.',
      answer: 'A = 84',
      formula: 'A  =  l × w',
      steps: [
        { text: 'Substitute the given values into the formula.', working: 'A = 12 × 7' },
        { text: 'Evaluate the product.', working: 'A = 84' },
        { text: 'Attach the unit (if asked).', working: 'A = 84 square units' },
      ],
    },
    {
      prompt: 'Solve the inequality 2x + 5 < 17.',
      method: 'Treat it like an equation, but keep the inequality direction unless you multiply or divide by a negative.',
      answer: 'x < 6',
      formula: 'Whatever you do to one side, do to the other. Flip the sign only when × or ÷ by a negative.',
      steps: [
        { text: 'Subtract 5 from both sides.', working: '2x < 12' },
        { text: 'Divide both sides by 2 (positive, so the sign stays).', working: 'x < 6' },
        { text: 'Express the solution. Any value less than 6 works.', working: 'x ∈ (−∞, 6)' },
      ],
    },
  ],

  'coordinate-grid': [
    {
      prompt: 'Plot A(−3, 4) on a coordinate grid and state its quadrant.',
      method: 'Read (x, y) — x is horizontal, y is vertical. Negative x means LEFT of the y-axis; positive y means ABOVE the x-axis.',
      answer: 'A is in Quadrant II',
      formula: 'Quadrant signs:  Q1 (+,+)  Q2 (−,+)  Q3 (−,−)  Q4 (+,−)',
      steps: [
        { text: 'From the origin, move 3 units to the LEFT (because x = −3).' },
        { text: 'From there, move 4 units UP (because y = 4).' },
        { text: 'Mark the point and label it A.' },
        { text: 'Identify the quadrant from the sign pattern (−, +).', working: '(−, +) → Quadrant II' },
      ],
    },
    {
      prompt: 'Complete a table of values for y = 2x + 1 when x = −1, 0, 1, 2.',
      method: 'Substitute each x-value into the rule one at a time.',
      answer: 'y-values:  −1, 1, 3, 5',
      steps: [
        { text: 'Substitute x = −1.', working: 'y = 2(−1) + 1 = −2 + 1 = −1' },
        { text: 'Substitute x = 0.', working: 'y = 2(0) + 1 = 1' },
        { text: 'Substitute x = 1.', working: 'y = 2(1) + 1 = 3' },
        { text: 'Substitute x = 2.', working: 'y = 2(2) + 1 = 5' },
      ],
    },
    {
      prompt: 'Find the gradient of the line joining (1, 3) and (5, 11).',
      method: 'Gradient is the change in y divided by the change in x (“rise over run”).',
      answer: 'm = 2',
      formula: 'm  =  (y₂ − y₁) ÷ (x₂ − x₁)',
      steps: [
        { text: 'Label the points. Let (x₁, y₁) = (1, 3) and (x₂, y₂) = (5, 11).' },
        { text: 'Calculate the change in y (the rise).', working: '11 − 3 = 8' },
        { text: 'Calculate the change in x (the run).', working: '5 − 1 = 4' },
        { text: 'Divide rise by run.', working: 'm = 8 ÷ 4 = 2' },
      ],
    },
    {
      prompt: 'A taxi charges 8 AED plus 3 AED per km. Write a rule for the cost C after k km.',
      method: 'Recognise the y-intercept (fixed) and the gradient (per-unit rate).',
      answer: 'C = 3k + 8',
      formula: 'y = mx + c    →    m = rate,  c = starting value',
      steps: [
        { text: 'Identify the starting value when k = 0 (the y-intercept).', working: 'c = 8' },
        { text: 'Identify the per-km charge (the gradient).', working: 'm = 3' },
        { text: 'Combine into y = mx + c form, using C and k.', working: '→ C = 3k + 8' },
      ],
    },
    {
      prompt: 'Find the point where y = x + 2 meets y = 6.',
      method: 'Set the two expressions for y equal to each other and solve for x.',
      answer: '(4, 6)',
      steps: [
        { text: 'Set the right-hand sides equal.', working: 'x + 2 = 6' },
        { text: 'Solve for x.', working: 'x = 6 − 2 = 4' },
        { text: 'Use y = 6 (given) and write the intersection as an ordered pair.', working: '→ (4, 6)' },
      ],
    },
  ],

  'angle-lab': [
    {
      prompt: 'Two angles on a straight line are 63° and x. Find x.',
      method: 'Angles on a straight line always add to 180°.',
      answer: 'x = 117°',
      formula: 'Angles on a straight line  →  sum = 180°',
      steps: [
        { text: 'State the rule.', working: 'a + b = 180°' },
        { text: 'Substitute the known angle.', working: '63 + x = 180' },
        { text: 'Subtract 63 from both sides.', working: 'x = 180 − 63' },
        { text: 'Simplify.', working: 'x = 117°' },
      ],
    },
    {
      prompt: 'A triangle has two angles of 48° and 67°. Find the third angle.',
      method: 'The three interior angles of any triangle sum to 180°.',
      answer: '65°',
      formula: 'Angle sum of a triangle  =  180°',
      steps: [
        { text: 'State the rule.', working: 'a + b + c = 180°' },
        { text: 'Add the two known angles.', working: '48 + 67 = 115' },
        { text: 'Subtract from 180.', working: '180 − 115 = 65' },
        { text: 'Write the answer with units.', working: '→ 65°' },
      ],
    },
    {
      prompt: 'Find each exterior angle of a regular octagon.',
      method: 'The exterior angles of ANY convex polygon add to 360°. For a regular polygon, divide equally.',
      answer: '45°',
      formula: 'Exterior angle of a regular n-gon  =  360° ÷ n',
      steps: [
        { text: 'State the total.', working: 'Σ exterior = 360°' },
        { text: 'An octagon has n = 8 sides.', working: 'n = 8' },
        { text: 'Divide.', working: '360 ÷ 8 = 45°' },
      ],
    },
    {
      prompt: 'A bearing is 075°. Describe the direction.',
      method: 'A bearing is always written with three digits and measured CLOCKWISE from north.',
      answer: '75° clockwise from north — roughly east-north-east',
      formula: 'Bearings: 000° = N,  090° = E,  180° = S,  270° = W',
      steps: [
        { text: 'Locate north as 0° on a compass diagram.' },
        { text: 'Rotate clockwise by 75°.' },
        { text: 'Identify the cardinal directions on either side.', working: '075° is between N (000°) and E (090°)' },
      ],
    },
    {
      prompt: 'Two parallel lines are cut by a transversal. One alternate angle is 38°. Find its matching alternate angle.',
      method: 'Alternate angles formed by a transversal cutting parallel lines are EQUAL.',
      answer: '38°',
      formula: 'Parallel lines  →  alternate angles are equal (Z-angles)',
      steps: [
        { text: 'Identify the “Z” shape formed by the transversal and the parallel lines.' },
        { text: 'Apply the alternate-angles rule.', working: 'angle A = angle B' },
        { text: 'Write the matching angle.', working: '→ 38°' },
      ],
    },
  ],

  'circle-lab': [
    {
      prompt: 'A circle has radius 7 cm. Find the diameter.',
      method: 'The diameter is twice the radius.',
      answer: '14 cm',
      formula: 'd  =  2r',
      steps: [
        { text: 'State the formula.', working: 'd = 2r' },
        { text: 'Substitute r = 7.', working: 'd = 2 × 7' },
        { text: 'Compute and add the unit.', working: '→ 14 cm' },
      ],
    },
    {
      prompt: 'Find the circumference of a circle with diameter 12 cm.',
      method: 'Use C = π × d directly.',
      answer: '12π cm  ≈  37.7 cm',
      formula: 'C  =  π × d',
      steps: [
        { text: 'State the formula.', working: 'C = π d' },
        { text: 'Substitute d = 12.', working: 'C = π × 12' },
        { text: 'Leave in exact form OR evaluate with π ≈ 3.142.', working: '12π ≈ 12 × 3.142 ≈ 37.7' },
        { text: 'Write the answer with units.', working: '→ 37.7 cm  (3 s.f.)' },
      ],
    },
    {
      prompt: 'Find the area of a circle with radius 6 m.',
      method: 'Use A = π × r². Remember to SQUARE the radius first.',
      answer: '36π m²  ≈  113.1 m²',
      formula: 'A  =  π × r²',
      steps: [
        { text: 'State the formula.', working: 'A = π r²' },
        { text: 'Square the radius first (this is the most common error to avoid).', working: 'r² = 6² = 36' },
        { text: 'Multiply by π.', working: 'A = 36π' },
        { text: 'Evaluate to 1 d.p.', working: '36 × 3.142 ≈ 113.1' },
        { text: 'Write with the correct unit (m² because area is two-dimensional).', working: '→ 113.1 m²' },
      ],
    },
    {
      prompt: 'Find the area of a semicircle with radius 5 cm.',
      method: 'Find the full-circle area first, then halve it.',
      answer: '12.5π cm²  ≈  39.3 cm²',
      formula: 'Semicircle area  =  ½ × π × r²',
      steps: [
        { text: 'State the full-circle formula.', working: 'A = π r²' },
        { text: 'Substitute r = 5 and square.', working: 'A = π × 25 = 25π' },
        { text: 'Halve the result for a semicircle.', working: '25π ÷ 2 = 12.5π' },
        { text: 'Evaluate numerically.', working: '12.5 × 3.142 ≈ 39.3' },
      ],
    },
    {
      prompt: 'Find the arc length of a quadrant (quarter-circle) with radius 8 cm.',
      method: 'A quadrant is one quarter of the full circumference.',
      answer: '4π cm  ≈  12.6 cm',
      formula: 'Arc of a quadrant  =  ¼ × 2π r  =  (π r) ÷ 2',
      steps: [
        { text: 'Find the full circumference.', working: 'C = 2π r = 2π × 8 = 16π' },
        { text: 'Take one quarter (because a quadrant is 90° ÷ 360° = ¼).', working: '16π ÷ 4 = 4π' },
        { text: 'Evaluate.', working: '4 × 3.142 ≈ 12.6' },
        { text: 'Add the unit.', working: '→ 12.6 cm' },
      ],
    },
  ],

  'construction-compass': [
    {
      prompt: 'Can sides of length 4 cm, 6 cm and 9 cm form a triangle?',
      method: 'Use the triangle inequality: the sum of the two shorter sides must exceed the longest side.',
      answer: 'Yes — 4 + 6 = 10 > 9',
      formula: 'Triangle inequality:   a + b > c   for the longest side c',
      steps: [
        { text: 'Identify the longest side.', working: 'longest = 9 cm' },
        { text: 'Add the two shorter sides.', working: '4 + 6 = 10 cm' },
        { text: 'Compare with the longest side.', working: '10 > 9  ✓' },
        { text: 'Conclude.', working: '→ Yes, a triangle can be drawn' },
      ],
    },
    {
      prompt: 'Describe how to construct a triangle with sides 5 cm, 5 cm and 8 cm.',
      method: 'Draw the base, then use compass arcs of the two side-lengths from each end.',
      answer: 'An isosceles triangle with base 8 cm and two equal 5 cm sides',
      steps: [
        { text: 'Draw the base AB of length 8 cm with a ruler.' },
        { text: 'Set the compass to 5 cm. From A, draw an arc above the line.' },
        { text: 'Keep the compass at 5 cm. From B, draw a second arc that crosses the first.' },
        { text: 'Label the intersection C and join A→C and B→C with straight lines.' },
        { text: 'Verify the triangle is isosceles (AC = BC).', working: 'AC = BC = 5  ✓' },
      ],
    },
    {
      prompt: 'What property does a perpendicular bisector guarantee?',
      method: 'Every point on the perpendicular bisector of a segment is equidistant from the segment’s two endpoints.',
      answer: 'Every point on it is the same distance from each endpoint',
      formula: 'Locus property:  d(P, A) = d(P, B)   for every P on the bisector of AB',
      steps: [
        { text: 'Draw segment AB.' },
        { text: 'Open the compass to more than half of AB. Draw arcs from A and from B above and below the line.' },
        { text: 'Join the two arc intersections — that is the perpendicular bisector.' },
        { text: 'Pick any point P on this new line and measure PA and PB.', working: 'PA = PB always' },
      ],
    },
    {
      prompt: 'Are two rectangles each 6 cm by 4 cm congruent if one is rotated 90°?',
      method: 'Rigid transformations (translation, rotation, reflection) preserve all side lengths and angles.',
      answer: 'Yes — congruent',
      formula: 'Rigid transformation  →  preserves size & shape',
      steps: [
        { text: 'List the side lengths of both rectangles.', working: 'both have sides 6 cm and 4 cm' },
        { text: 'A 90° rotation is a rigid transformation — it preserves both lengths and angles.' },
        { text: 'Conclude that the two figures are congruent (only orientation differs).' },
      ],
    },
    {
      prompt: 'Bisect a 70° angle. What is each half-angle?',
      method: 'An angle bisector divides an angle into two equal parts.',
      answer: '35° each',
      formula: 'Each half  =  original ÷ 2',
      steps: [
        { text: 'Mark the angle 70° at vertex V.' },
        { text: 'Draw an arc from V crossing both arms at points P and Q.' },
        { text: 'From P and Q, draw equal arcs that intersect inside the angle at R.' },
        { text: 'Join V → R. This ray bisects the angle.' },
        { text: 'Divide to find each half-angle.', working: '70 ÷ 2 = 35°' },
      ],
    },
  ],

  'solid-builder': [
    {
      prompt: 'Find the area of a parallelogram with base 11 cm and perpendicular height 6 cm.',
      method: 'Use A = base × perpendicular height — NOT the slant side.',
      answer: '66 cm²',
      formula: 'A  =  b × h    (h must be PERPENDICULAR to b)',
      steps: [
        { text: 'Identify which dimension is the perpendicular height (not the slant side).', working: 'b = 11,  h = 6' },
        { text: 'Multiply.', working: 'A = 11 × 6 = 66' },
        { text: 'Attach the squared unit (area).', working: '→ 66 cm²' },
      ],
    },
    {
      prompt: 'Find the area of a triangle with base 14 m and perpendicular height 9 m.',
      method: 'Use the half-base-times-height formula.',
      answer: '63 m²',
      formula: 'A  =  ½ × b × h',
      steps: [
        { text: 'State the formula.', working: 'A = ½ b h' },
        { text: 'Substitute.', working: 'A = ½ × 14 × 9' },
        { text: 'Halve the base first to simplify.', working: '½ × 14 = 7' },
        { text: 'Multiply.', working: 'A = 7 × 9 = 63 m²' },
      ],
    },
    {
      prompt: 'Find the surface area of a cuboid 5 cm × 4 cm × 3 cm.',
      method: 'A cuboid has 3 pairs of identical faces. Find the area of each unique face and double the sum.',
      answer: '94 cm²',
      formula: 'SA  =  2(lw + lh + wh)',
      steps: [
        { text: 'Calculate the three distinct face areas.', working: 'lw = 5×4 = 20,  lh = 5×3 = 15,  wh = 4×3 = 12' },
        { text: 'Add the three face areas.', working: '20 + 15 + 12 = 47' },
        { text: 'Double the sum (each face has a matching pair).', working: '2 × 47 = 94' },
        { text: 'Attach units.', working: '→ 94 cm²' },
      ],
    },
    {
      prompt: 'Find the volume of a prism with cross-sectional area 18 cm² and length 7 cm.',
      method: 'Volume of any prism is cross-section area × length.',
      answer: '126 cm³',
      formula: 'V  =  A_cross × ℓ',
      steps: [
        { text: 'State the formula.', working: 'V = A × ℓ' },
        { text: 'Substitute.', working: 'V = 18 × 7' },
        { text: 'Multiply.', working: 'V = 126' },
        { text: 'Attach a cubic unit (volume is three-dimensional).', working: '→ 126 cm³' },
      ],
    },
    {
      prompt: 'Convert 3.5 litres to cm³.',
      method: 'Use the equivalence 1 litre = 1000 cm³.',
      answer: '3 500 cm³',
      formula: '1 L  =  1 000 cm³  =  1 dm³',
      steps: [
        { text: 'State the conversion factor.', working: '1 L = 1000 cm³' },
        { text: 'Multiply both sides by 3.5.', working: '3.5 × 1000 = 3500' },
        { text: 'Attach the unit.', working: '→ 3 500 cm³' },
      ],
    },
  ],

  'data-lab': [
    {
      prompt: 'Find the mean of 6, 8, 8, 10, 13.',
      method: 'Add the values, then divide by the number of values.',
      answer: 'Mean = 9',
      formula: 'mean  =  (sum of values)  ÷  (how many values)',
      steps: [
        { text: 'Sum all values.', working: '6 + 8 + 8 + 10 + 13 = 45' },
        { text: 'Count the values.', working: 'n = 5' },
        { text: 'Divide.', working: '45 ÷ 5 = 9' },
      ],
    },
    {
      prompt: 'Find the median of 4, 11, 3, 9, 7.',
      method: 'Order the data first, then choose the middle value.',
      answer: 'Median = 7',
      formula: 'For n odd:  median is the value at position (n+1)/2',
      steps: [
        { text: 'Order the values from smallest to largest.', working: '3, 4, 7, 9, 11' },
        { text: 'Count the values.', working: 'n = 5  →  middle position = 3' },
        { text: 'Read off the value at the middle position.', working: '→ 7' },
      ],
    },
    {
      prompt: 'Find the mode of 2, 5, 5, 6, 9, 9, 9.',
      method: 'The mode is the value that appears most frequently.',
      answer: 'Mode = 9',
      steps: [
        { text: 'Tally the frequency of each value.', working: '2 ×1,  5 ×2,  6 ×1,  9 ×3' },
        { text: 'Identify the value with the highest frequency.', working: '9 occurs 3 times' },
        { text: 'State the mode.', working: '→ 9' },
      ],
    },
    {
      prompt: 'Improve this survey question: “Everyone loves homework, right?”',
      method: 'A good survey question is neutral, single-issue, and offers balanced response options.',
      answer: '“How useful do you find homework?  Very useful / useful / not useful”',
      steps: [
        { text: 'Identify the bias. The original assumes the answer (“Everyone loves…”).' },
        { text: 'Rewrite as a neutral question with no leading language.' },
        { text: 'Offer balanced response options instead of yes/no.' },
        { text: 'Check the question asks about ONE idea only.' },
      ],
    },
    {
      prompt: 'Class A has mean 74 and range 6. Class B has mean 74 and range 22. Compare.',
      method: 'Compare the centre (mean) first, then the spread (range).',
      answer: 'Same average, but Class A is far more consistent (smaller spread)',
      formula: 'centre  →  spread  →  conclusion',
      steps: [
        { text: 'Compare the centres.', working: 'mean A = mean B = 74' },
        { text: 'Compare the spreads.', working: 'range A = 6,   range B = 22' },
        { text: 'Conclude: same typical value, but Class A has scores clustered tightly together while Class B is more variable.' },
      ],
    },
  ],

  'probability-spinner': [
    {
      prompt: 'Find P(rolling a number greater than 4) on a fair six-sided die.',
      method: 'Probability is favourable outcomes divided by total outcomes for a fair sample space.',
      answer: '1/3',
      formula: 'P(event)  =  (favourable outcomes)  ÷  (total outcomes)',
      steps: [
        { text: 'List the favourable outcomes.', working: '5 and 6  →  2 outcomes' },
        { text: 'List the total possible outcomes.', working: '{1,2,3,4,5,6}  →  6 outcomes' },
        { text: 'Form the fraction.', working: 'P = 2/6' },
        { text: 'Simplify.', working: '= 1/3' },
      ],
    },
    {
      prompt: 'A bag has 4 red, 3 blue and 5 green counters. Find P(blue).',
      method: 'Add to find the total, then take favourable over total.',
      answer: '1/4',
      steps: [
        { text: 'Find the total number of counters.', working: '4 + 3 + 5 = 12' },
        { text: 'Take favourable over total.', working: 'P(blue) = 3/12' },
        { text: 'Simplify by dividing numerator and denominator by 3.', working: '= 1/4' },
      ],
    },
    {
      prompt: 'If P(win) = 0.28, find P(not win).',
      method: 'Use the complement rule — probabilities of complementary events add to 1.',
      answer: '0.72',
      formula: 'P(not A)  =  1  −  P(A)',
      steps: [
        { text: 'State the complement rule.', working: 'P(A) + P(A′) = 1' },
        { text: 'Rearrange to isolate P(not win).', working: 'P(not win) = 1 − P(win)' },
        { text: 'Substitute and subtract.', working: '= 1 − 0.28 = 0.72' },
      ],
    },
    {
      prompt: 'A spinner lands on gold 16 times in 80 spins. Estimate P(gold).',
      method: 'Use experimental probability — observed frequency divided by number of trials.',
      answer: '0.2  (or 1/5, or 20 %)',
      formula: 'P_experimental  =  (times event happened)  ÷  (total trials)',
      steps: [
        { text: 'Identify the observed frequency.', working: 'gold lands 16 times' },
        { text: 'Identify the total trials.', working: '80 spins' },
        { text: 'Divide.', working: '16 ÷ 80 = 0.2' },
        { text: 'Express in any of the equivalent forms.', working: '0.2  =  1/5  =  20 %' },
      ],
    },
    {
      prompt: 'If P(blue) = 0.35 on a spinner, predict the number of blue outcomes in 200 trials.',
      method: 'Use expected frequency — multiply probability by the number of trials.',
      answer: '70 blue outcomes',
      formula: 'expected count  =  P(event) × N',
      steps: [
        { text: 'State the formula.', working: 'expected = P × N' },
        { text: 'Substitute.', working: 'expected = 0.35 × 200' },
        { text: 'Compute.', working: '= 70' },
        { text: 'Note: actual results will vary around this expected value due to randomness.' },
      ],
    },
  ],
};

const exerciseCopy: Record<AnimationMode, Omit<ConceptExercise, 'label'>[]> = {
  'number-line': [
    { prompt: 'Place -3/4, -1.2, 0.05 and 1/2 on a number line.', successCheck: 'Values are ordered from least to greatest with a sensible scale.' },
    { prompt: 'Round 54,891 to the nearest thousand and justify the decision digit.', successCheck: 'Answer includes 55,000 and references the hundreds digit.' },
    { prompt: 'Create a temperature story for -5 + 11 - 8.', successCheck: 'Story and calculation both end at -2.' },
    { prompt: 'Graph x < 3.5 and list three possible values.', successCheck: 'Open circle at 3.5, ray left, and all sample values are less than 3.5.' },
    { prompt: 'Estimate 202 x 49, then calculate and compare.', successCheck: 'Estimate is close to 200 x 50 and comparison is reasonable.' },
  ],
  'percentage-bars': [
    { prompt: 'Convert 17/25 to a percentage.', successCheck: 'Equivalent denominator or decimal method gives 68%.' },
    { prompt: 'Find 12.5% of 640 AED.', successCheck: 'Answer is 80 AED.' },
    { prompt: 'Increase 96 by 15%.', successCheck: 'Answer is 110.4.' },
    { prompt: 'After a 30% increase, a value is 195. Find the original.', successCheck: 'Original is 150.' },
    { prompt: 'Design one hundred-grid that shows 0.42, 42% and 21/50.', successCheck: 'All three representations match the same shaded amount.' },
  ],
  'ratio-mixer': [
    { prompt: 'Share 126 in the ratio 4:5.', successCheck: 'Shares are 56 and 70.' },
    { prompt: 'Simplify 45:60:75.', successCheck: 'Answer is 3:4:5.' },
    { prompt: 'Scale a 3:2 juice mix to make 2.5 litres.', successCheck: 'Parts total 5; shares are 1.5 L and 1.0 L.' },
    { prompt: 'Compare 500 g for 18 AED with 750 g for 24 AED.', successCheck: 'Unit prices are compared consistently.' },
    { prompt: 'Draw a 1:100 scale plan for a 6 m by 4 m room.', successCheck: 'Drawing dimensions are 6 cm by 4 cm.' },
  ],
  'algebra-tiles': [
    { prompt: 'Find the nth term of 8, 13, 18, 23, ...', successCheck: 'Rule is 5n + 3.' },
    { prompt: 'Simplify 4a + 9b - a - 3b.', successCheck: 'Answer is 3a + 6b.' },
    { prompt: 'Expand and simplify 2(x + 7) + 3x.', successCheck: 'Answer is 5x + 14.' },
    { prompt: 'Factorise 15x - 25.', successCheck: 'Answer is 5(3x - 5).' },
    { prompt: 'Write an expression for three fewer than twice a number.', successCheck: 'Expression is 2n - 3 or equivalent.' },
  ],
  'equation-balance': [
    { prompt: 'Solve 7x - 5 = 44.', successCheck: 'x = 7.' },
    { prompt: 'Solve 2(x + 9) = 30.', successCheck: 'x = 6.' },
    { prompt: 'Solve 6x + 1 = 3x + 19.', successCheck: 'x = 6.' },
    { prompt: 'Rearrange A = bh to make h the subject.', successCheck: 'h = A / b.' },
    { prompt: 'Graph the solution to x + 4 >= 1.', successCheck: 'x >= -3 with a closed circle at -3.' },
  ],
  'coordinate-grid': [
    { prompt: 'Plot B(2, -5) and name its quadrant.', successCheck: 'Point is in Quadrant IV.' },
    { prompt: 'Complete a table for y = -x + 4 when x = -2, 0, 2, 4.', successCheck: 'y-values are 6, 4, 2, 0.' },
    { prompt: 'Find the gradient between (-2, 1) and (4, 13).', successCheck: 'Gradient is 2.' },
    { prompt: 'Write the cost rule for 12 AED entry plus 5 AED per game.', successCheck: 'C = 5g + 12.' },
    { prompt: 'Sketch y = 2x - 3 using at least three points.', successCheck: 'Points satisfy the rule and form a straight line.' },
  ],
  'angle-lab': [
    { prompt: 'Find the missing angle on a straight line with 42 degrees.', successCheck: 'Answer is 138 degrees.' },
    { prompt: 'Find the third angle in a triangle with 39 degrees and 88 degrees.', successCheck: 'Answer is 53 degrees.' },
    { prompt: 'Find each interior angle of a regular hexagon.', successCheck: 'Answer is 120 degrees.' },
    { prompt: 'Write 35 degrees clockwise from north as a three-digit bearing.', successCheck: 'Bearing is 035 degrees.' },
    { prompt: 'Create one angle proof using parallel lines and label each reason.', successCheck: 'Every angle calculation has a named geometric reason.' },
  ],
  'circle-lab': [
    { prompt: 'Find the radius when diameter is 26 cm.', successCheck: 'Radius is 13 cm.' },
    { prompt: 'Find circumference when radius is 9 cm.', successCheck: 'Answer is 18 pi cm.' },
    { prompt: 'Find area when diameter is 10 m.', successCheck: 'Radius is 5 m; area is 25 pi m^2.' },
    { prompt: 'Find the perimeter of a semicircle with radius 7 cm including the diameter.', successCheck: 'Answer is 7 pi + 14 cm.' },
    { prompt: 'Design a quadrant logo and calculate its area for radius 12 cm.', successCheck: 'Area is 36 pi cm^2.' },
  ],
  'construction-compass': [
    { prompt: 'Check whether 3 cm, 4 cm and 8 cm can form a triangle.', successCheck: 'No, because 3 + 4 is not greater than 8.' },
    { prompt: 'Write the construction steps for sides 6 cm, 7 cm and 8 cm.', successCheck: 'Steps include base, two arcs and joining the arc intersection.' },
    { prompt: 'Construct and explain a perpendicular bisector of a 10 cm segment.', successCheck: 'Explanation includes midpoint, 90 degrees and equal distance.' },
    { prompt: 'Identify whether two 4 cm radius circles are congruent and explain.', successCheck: 'Yes, same radius gives same size and shape.' },
    { prompt: 'Create a compass-only symmetry badge using at least two bisectors.', successCheck: 'Construction marks and symmetry lines are visible.' },
  ],
  'solid-builder': [
    { prompt: 'Find the area of a trapezium with parallel sides 8 cm and 14 cm, height 5 cm.', successCheck: 'Answer is 55 cm^2.' },
    { prompt: 'Find the area of a compound shape made from a 10 x 6 rectangle and a 4 x 3 rectangle.', successCheck: 'Answer is 72 square units if rectangles do not overlap.' },
    { prompt: 'Find the surface area of a cube with side 7 cm.', successCheck: 'Answer is 294 cm^2.' },
    { prompt: 'Find the volume of a cuboid 8 cm by 5 cm by 11 cm.', successCheck: 'Answer is 440 cm^3.' },
    { prompt: 'Convert 2 m^3 to litres.', successCheck: 'Answer is 2000 litres.' },
  ],
  'data-lab': [
    { prompt: 'Design an unbiased question about EIS study habits.', successCheck: 'Question avoids leading language and asks one idea.' },
    { prompt: 'Find the mean, median and mode of 5, 7, 7, 12, 14.', successCheck: 'Mean is 9, median is 7, mode is 7.' },
    { prompt: 'Create a frequency table for 1, 2, 2, 3, 3, 3, 4.', successCheck: 'Frequencies are 1, 2, 3, 1.' },
    { prompt: 'Compare two data sets with the same median but different ranges.', successCheck: 'Conclusion mentions both centre and spread.' },
    { prompt: 'Write one claim that is supported by a graph and one that is not.', successCheck: 'Supported claim matches evidence; unsupported claim explains missing evidence.' },
  ],
  'probability-spinner': [
    { prompt: 'Place impossible, unlikely, even chance, likely and certain on a probability scale.', successCheck: 'Order runs correctly from 0 to 1.' },
    { prompt: 'Find P(red) for a spinner with 2 red, 3 blue and 5 green equal sectors.', successCheck: 'Answer is 1/5.' },
    { prompt: 'If P(absent) = 0.06, find P(present).', successCheck: 'Answer is 0.94.' },
    { prompt: 'A die lands on 6 twelve times in 90 rolls. Estimate P(6).', successCheck: 'Answer is 12/90 = 2/15.' },
    { prompt: 'Design a fair four-prize spinner and state each probability.', successCheck: 'Probabilities total 1 and match the sector design.' },
  ],
};

export function getConceptResearchPack(lesson: CourseLesson, chapter: CourseChapter): ConceptResearchPack {
  // The first example is taken from the lesson's authored workedExample so that
  // textbook-aligned content always appears first. The remaining four come from
  // the topic-level exampleCopy, which already carries full step-by-step working.
  const textbookSteps: WorkedStep[] = lesson.workedExample.steps.map((step) => ({ text: step }));
  const examples: ConceptExample[] = [
    {
      label: 'Textbook example',
      prompt: lesson.workedExample.prompt,
      method: lesson.workedExample.steps.join(' '),
      answer: lesson.workedExample.answer,
      steps: textbookSteps,
    },
    ...exampleCopy[lesson.animation].slice(1).map((example, index) => ({
      ...example,
      label: `Example ${index + 2}`,
    })),
  ].slice(0, 5);

  return {
    topic: `${chapter.title}: ${lesson.title}`,
    researchNote,
    visualStrategies: visualStrategyCopy[lesson.animation],
    examples,
    exercises: exerciseCopy[lesson.animation].map((exercise, index) => ({
      ...exercise,
      label: `Exercise ${index + 1}`,
    })),
  };
}
