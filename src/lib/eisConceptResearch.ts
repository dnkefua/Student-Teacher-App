import { AnimationMode, CourseChapter, CourseLesson } from './eisMypMathCourse';

export type ConceptVisualStrategy = {
  title: string;
  method: string;
  classroomMove: string;
  animationCue: string;
};

export type ConceptExample = {
  label: string;
  prompt: string;
  method: string;
  answer: string;
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
    { prompt: 'Order -2.5, -1/4, 0.6, and -3 from smallest to largest.', method: 'Place each value on a shared number line, converting -1/4 to -0.25 for comparison.', answer: '-3, -2.5, -1/4, 0.6' },
    { prompt: 'Round 8,746 to the nearest hundred.', method: 'Find the hundreds digit, then check the tens digit to decide whether to round up.', answer: '8,700' },
    { prompt: 'A score changes by -6, +14, then -3. What is the final change?', method: 'Start at 0 on the number line and move left, right, then left.', answer: '+5' },
    { prompt: 'Solve x >= -1 and show the solution set.', method: 'Use a closed circle at -1 and shade to the right because all larger values work.', answer: 'All values greater than or equal to -1' },
    { prompt: 'Estimate 39.8 x 21 before calculating.', method: 'Round to 40 x 20 to get a benchmark.', answer: 'About 800' },
  ],
  'percentage-bars': [
    { prompt: 'Write 3/8 as a percentage.', method: 'Convert to a decimal, then multiply by 100.', answer: '37.5%' },
    { prompt: 'Find 18% of 250 AED.', method: 'Use 0.18 x 250 or find 10%, 5%, 3% and add.', answer: '45 AED' },
    { prompt: 'A price rises from 80 AED to 92 AED. Find the percentage increase.', method: 'Find the change, divide by the original, then multiply by 100.', answer: '15%' },
    { prompt: 'After a 20% discount, a bag costs 96 AED. Find the original price.', method: '96 AED is 80% of the original, so divide by 0.8.', answer: '120 AED' },
    { prompt: 'Compare 7/20 and 32%. Which is larger?', method: 'Convert 7/20 to 35% using an equivalent denominator of 100.', answer: '7/20 is larger' },
  ],
  'ratio-mixer': [
    { prompt: 'Share 84 AED in the ratio 2:5.', method: 'There are 7 parts, so one part is 12 AED.', answer: '24 AED and 60 AED' },
    { prompt: 'Simplify 36:48.', method: 'Divide both parts by the greatest common factor, 12.', answer: '3:4' },
    { prompt: 'A recipe has rice:water = 2:5. How much water is needed for 300 g rice?', method: 'Scale 2 parts to 300 g, so one part is 150 g.', answer: '750 g or ml of water' },
    { prompt: 'Which is better value: 4 pens for 18 AED or 6 pens for 24 AED?', method: 'Find each unit price.', answer: '6 pens for 24 AED, because each pen is 4 AED' },
    { prompt: 'A drawing uses scale 1:250. A wall is 6 cm on the plan. Find the real length.', method: 'Multiply the drawing length by 250.', answer: '1500 cm, or 15 m' },
  ],
  'algebra-tiles': [
    { prompt: 'Find the nth term for 5, 9, 13, 17, ...', method: 'The common difference is 4, so use 4n and adjust to match term 1.', answer: '4n + 1' },
    { prompt: 'Simplify 6x - 2y + 3x + 7y.', method: 'Collect x terms and y terms separately.', answer: '9x + 5y' },
    { prompt: 'Expand 3(2a - 5).', method: 'Multiply every term in the bracket by 3.', answer: '6a - 15' },
    { prompt: 'Factorise 12m + 18.', method: 'Find the greatest common factor and place the remaining terms in brackets.', answer: '6(2m + 3)' },
    { prompt: 'A club charges 15 AED plus 4 AED per activity. Write the cost for n activities.', method: 'Fixed charge plus variable charge.', answer: '15 + 4n' },
  ],
  'equation-balance': [
    { prompt: 'Solve 4x + 9 = 33.', method: 'Subtract 9 from both sides, then divide by 4.', answer: 'x = 6' },
    { prompt: 'Solve 3(x - 2) = 24.', method: 'Divide by 3 first, then add 2.', answer: 'x = 10' },
    { prompt: 'Solve 5x - 4 = 2x + 11.', method: 'Move x terms to one side and constants to the other.', answer: 'x = 5' },
    { prompt: 'Use A = lw when l = 12 and w = 7.', method: 'Substitute each value into the formula.', answer: 'A = 84' },
    { prompt: 'Solve 2x + 5 < 17.', method: 'Subtract 5 and divide by 2, keeping the inequality direction.', answer: 'x < 6' },
  ],
  'coordinate-grid': [
    { prompt: 'Plot A(-3, 4) and describe its quadrant.', method: 'Move left 3 from the origin, then up 4.', answer: 'Quadrant II' },
    { prompt: 'Complete y = 2x + 1 for x = -1, 0, 1, 2.', method: 'Substitute each x-value into the rule.', answer: 'y = -1, 1, 3, 5' },
    { prompt: 'Find the gradient between (1, 3) and (5, 11).', method: 'Gradient is rise over run: (11 - 3) / (5 - 1).', answer: '2' },
    { prompt: 'A taxi costs 8 AED plus 3 AED per km. Write the graph rule.', method: 'Fixed start is the intercept; per km cost is the gradient.', answer: 'C = 3k + 8' },
    { prompt: 'Find where y = x + 2 and y = 6 meet by inspection.', method: 'Set x + 2 equal to 6.', answer: '(4, 6)' },
  ],
  'angle-lab': [
    { prompt: 'Two angles on a straight line are 63 degrees and x. Find x.', method: 'Angles on a straight line add to 180 degrees.', answer: '117 degrees' },
    { prompt: 'A triangle has angles 48 degrees and 67 degrees. Find the third angle.', method: 'Triangle angles add to 180 degrees.', answer: '65 degrees' },
    { prompt: 'Find each exterior angle of a regular octagon.', method: 'Exterior angles of any polygon sum to 360 degrees.', answer: '45 degrees' },
    { prompt: 'A bearing is 075 degrees. Describe the direction.', method: 'Measure clockwise from north.', answer: '75 degrees clockwise from north' },
    { prompt: 'Parallel lines have an alternate angle of 38 degrees. Find the matching alternate angle.', method: 'Alternate angles are equal when lines are parallel.', answer: '38 degrees' },
  ],
  'circle-lab': [
    { prompt: 'A circle has radius 7 cm. Find the diameter.', method: 'Diameter is twice the radius.', answer: '14 cm' },
    { prompt: 'Find the circumference when diameter is 12 cm.', method: 'Use C = pi d.', answer: '12 pi cm, about 37.7 cm' },
    { prompt: 'Find the area when radius is 6 m.', method: 'Use A = pi r squared.', answer: '36 pi m^2, about 113.1 m^2' },
    { prompt: 'Find the area of a semicircle with radius 5 cm.', method: 'Find full circle area, then halve it.', answer: '12.5 pi cm^2, about 39.3 cm^2' },
    { prompt: 'Find the arc length of a quadrant with radius 8 cm.', method: 'Take one quarter of the full circumference.', answer: '4 pi cm, about 12.6 cm' },
  ],
  'construction-compass': [
    { prompt: 'Can sides 4 cm, 6 cm and 9 cm form a triangle?', method: 'Check whether the two shorter sides add to more than the longest side.', answer: 'Yes, because 4 + 6 > 9' },
    { prompt: 'Construct a triangle with sides 5 cm, 5 cm and 8 cm.', method: 'Draw the base, then use equal compass arcs from both endpoints.', answer: 'An isosceles triangle with base 8 cm' },
    { prompt: 'What does a perpendicular bisector guarantee?', method: 'Use the equal-distance property from both endpoints.', answer: 'Every point on it is equal distance from the segment endpoints' },
    { prompt: 'Are two rectangles 6 cm by 4 cm congruent if one is rotated?', method: 'Rotation preserves size and shape.', answer: 'Yes' },
    { prompt: 'Construct an angle bisector for a 70 degree angle. What is each half?', method: 'A bisector splits an angle into two equal parts.', answer: '35 degrees each' },
  ],
  'solid-builder': [
    { prompt: 'Find the area of a parallelogram with base 11 cm and height 6 cm.', method: 'Use base times perpendicular height.', answer: '66 cm^2' },
    { prompt: 'Find the area of a triangle with base 14 m and height 9 m.', method: 'Use one half times base times height.', answer: '63 m^2' },
    { prompt: 'Find the surface area of a cuboid 5 cm by 4 cm by 3 cm.', method: 'Add the areas of the three face pairs: 2(lw + lh + wh).', answer: '94 cm^2' },
    { prompt: 'Find the volume of a prism with cross-section area 18 cm^2 and length 7 cm.', method: 'Multiply cross-section area by length.', answer: '126 cm^3' },
    { prompt: 'Convert 3.5 litres to cm^3.', method: 'Use 1 litre = 1000 cm^3.', answer: '3500 cm^3' },
  ],
  'data-lab': [
    { prompt: 'Find the mean of 6, 8, 8, 10, 13.', method: 'Add the values and divide by the number of values.', answer: '9' },
    { prompt: 'Find the median of 4, 11, 3, 9, 7.', method: 'Order the data and choose the middle value.', answer: '7' },
    { prompt: 'Find the mode of 2, 5, 5, 6, 9, 9, 9.', method: 'Identify the value with greatest frequency.', answer: '9' },
    { prompt: 'Improve this survey question: "Everyone loves homework, right?"', method: 'Remove leading language and ask one balanced question.', answer: 'How useful do you find homework? Very useful / useful / not useful' },
    { prompt: 'Class A has mean 74 and range 6. Class B has mean 74 and range 22. Compare.', method: 'Compare centre first, then spread.', answer: 'Same average, but Class A is more consistent' },
  ],
  'probability-spinner': [
    { prompt: 'Find P(rolling a number greater than 4 on a fair die).', method: 'Count favourable outcomes 5 and 6 out of 6 total outcomes.', answer: '2/6 = 1/3' },
    { prompt: 'A bag has 4 red, 3 blue and 5 green counters. Find P(blue).', method: 'Use favourable outcomes over total outcomes.', answer: '3/12 = 1/4' },
    { prompt: 'If P(win) = 0.28, find P(not win).', method: 'Use the complement rule 1 - P(win).', answer: '0.72' },
    { prompt: 'A spinner lands on gold 16 times in 80 spins. Estimate P(gold).', method: 'Use experimental probability: frequency divided by trials.', answer: '0.2' },
    { prompt: 'If P(blue) = 0.35, predict blue outcomes in 200 trials.', method: 'Multiply probability by number of trials.', answer: '70 blue outcomes' },
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
  const examples: ConceptExample[] = [
    {
      label: 'Textbook-style worked model',
      prompt: lesson.workedExample.prompt,
      method: lesson.workedExample.steps.join(' '),
      answer: lesson.workedExample.answer,
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
