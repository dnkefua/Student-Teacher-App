import { ConceptDef } from '../types';

/**
 * Grade 8 MYP Maths "Learn" concepts.
 *
 * Each unit holds detailed teaching paragraphs, key ideas, vocabulary and
 * worked formulas — the same shape Science and English use. Lets a
 * student read the material end-to-end without needing the textbook.
 *
 * Unit map:
 *   unit1  Numerical & Abstract Reasoning   — number, ratio, algebra, equations
 *   unit2  Thinking with Models             — functions, linear & quadratic
 *   unit3  Spatial Reasoning                — shape, area, volume, transformations
 *   unit4  Reasoning with Data              — statistics, probability
 */

export const mathTheoryData: Record<string, ConceptDef[]> = {
  unit1: [
    {
      title: 'Number Sense, Operations & Percentages',
      description:
        'Numbers describe quantity. Knowing how to compare, scale and operate on them — and how to move fluently between fractions, decimals and percentages — is the foundation of every later topic.',
      paragraphs: [
        'A real number can be written in many equivalent forms. 0.5, 1/2 and 50% all describe the same quantity. Strong number sense means being able to switch between these forms quickly so you can pick the easiest one for the calculation in front of you.',
        'PERCENTAGES are just fractions with a denominator of 100. "32 %" means 32 out of every 100. To find x % of N you multiply N by the decimal form: 0.32 × N. To find what percentage one number is of another you divide and multiply by 100.',
        'PERCENTAGE CHANGE compares the change in a value to the ORIGINAL value, not the new one. A price that rose from £80 to £92 has changed by £12, so the increase is 12 ÷ 80 = 0.15 = 15 %. The same fraction expressed as percentage gives the same answer whether the change was a rise (+15 %) or a fall (−15 %).',
        'A REVERSE PERCENTAGE recovers the original amount after a change. If a bag costs £96 after a 20 % discount, the £96 represents 100 − 20 = 80 % of the original. Divide by 0.8 to get £120.',
      ],
      keyIdeas: [
        'Fraction → decimal → percentage are three views of the same quantity.',
        'x % of N  =  (x ÷ 100) × N',
        'Percentage change  =  (change ÷ original) × 100',
        'Reverse percentage: divide the new amount by the multiplier.',
      ],
      vocabulary: [
        { term: 'Multiplier', definition: 'The decimal you multiply by to apply a percentage change.', example: '+25 % uses ×1.25;  −20 % uses ×0.8.' },
        { term: 'Reciprocal', definition: 'The number that, when multiplied by the original, gives 1.', example: 'Reciprocal of 5 is 1/5.' },
        { term: 'Significant figures', definition: 'Digits that carry meaningful information about precision.', example: '0.04830 has 4 s.f.' },
      ],
      formulas: [
        {
          name: 'Percentage of an amount',
          equation: 'x % of N  =  (x ÷ 100) × N',
          explanation: 'Convert the percentage to a decimal multiplier, then multiply the whole amount by it.',
          stepByStep: [
            'Step 1: Write x % as the decimal x ÷ 100.',
            'Step 2: Multiply the whole amount N by that decimal.',
            'Step 3: Attach the correct unit (AED, kg, etc.).',
          ],
        },
        {
          name: 'Percentage change',
          equation: '% change  =  ((new − original) ÷ original) × 100',
          explanation: 'Always divide by the ORIGINAL value. Positive = increase; negative = decrease.',
          stepByStep: [
            'Step 1: Find the change (new − original).',
            'Step 2: Divide by the original value.',
            'Step 3: Multiply by 100. Mark the answer + for rise or − for fall.',
          ],
        },
      ],
    },
    {
      title: 'Ratio, Proportion & Algebra Basics',
      description:
        'Ratios compare quantities. Proportion uses that comparison to scale up or down. Algebra packages all of this into letters so we can describe relationships without committing to specific numbers.',
      paragraphs: [
        'A RATIO a : b says "for every a of one thing, there are b of another". Sharing 84 AED in the ratio 2 : 5 means there are 2 + 5 = 7 equal shares; one share is 84 ÷ 7 = 12 AED, so the split is 24 AED and 60 AED.',
        'A PROPORTION says two ratios are equal. If 4 pens cost 18 AED, then 6 pens at the same rate must cost (6 × 18) ÷ 4 = 27 AED. The unit rate (one pen for 4.50 AED) is the bridge between any two proportional amounts.',
        'ALGEBRA replaces numbers with letters. A LIKE-TERM in algebra means the variables match exactly — 3x and 5x are like terms (both have x), so they combine to 8x; 3x and 5y are NOT like terms because the variables differ. Constants combine with constants.',
        'The DISTRIBUTIVE LAW unpacks brackets: k(a + b) = ka + kb. To FACTORISE you reverse the law — find the highest common factor of every term and write it outside a bracket.',
      ],
      keyIdeas: [
        'Ratio a : b  →  one part  =  total ÷ (a + b).',
        'Unit rate is the cleanest way to compare two offers.',
        'Like terms have identical variables — combine them by adding coefficients.',
        'Distributive law: k(a + b) = ka + kb.  Factorising is just the law in reverse.',
      ],
      vocabulary: [
        { term: 'Variable', definition: 'A letter that stands for an unknown or changing value.', example: 'x in 2x + 5.' },
        { term: 'Coefficient', definition: 'The number multiplying a variable.', example: '3 in 3x.' },
        { term: 'Constant', definition: 'A number with no variable.', example: '7 in 2x + 7.' },
      ],
      formulas: [
        {
          name: 'Sharing in a ratio',
          equation: 'one part  =  total  ÷  (a + b)',
          explanation: 'Find the size of one part, then multiply by each share of the ratio.',
          stepByStep: [
            'Step 1: Add the parts of the ratio (a + b).',
            'Step 2: Divide the total by that sum to find one part.',
            'Step 3: Multiply by each share to get the individual amounts.',
          ],
        },
      ],
    },
    {
      title: 'Solving Equations & Inequalities',
      description:
        'An equation is a balance. Whatever you do to one side you must do to the other so the balance is maintained. Inequalities behave the same way, with one extra rule about sign-flipping.',
      paragraphs: [
        'To SOLVE an equation, undo the operations in the reverse order they were applied (reverse BIDMAS). For 4x + 9 = 33, subtract 9 first (giving 4x = 24), then divide by 4 (giving x = 6). Always check by substituting the answer back into the original.',
        'When variables appear on BOTH SIDES — for example 5x − 4 = 2x + 11 — collect the variable terms on one side and the constants on the other. Subtract 2x to get 3x − 4 = 11, then add 4 to get 3x = 15, then divide to get x = 5.',
        'An INEQUALITY is solved the same way, but with one warning: multiplying or dividing both sides by a NEGATIVE number FLIPS the inequality sign. So if you have −2x > 6, dividing by −2 gives x < −3 (the > flipped to <). Adding, subtracting, or multiplying/dividing by a positive does NOT flip the sign.',
        'SUBSTITUTION is the reverse of solving — you already know the values of the variables and you plug them in. Use it to check a solution, or to evaluate a formula like A = lw for a given length and width.',
      ],
      keyIdeas: [
        'Whatever you do to one side, do to the other.',
        'Reverse BIDMAS — undo +/− first, then ×/÷.',
        'Multiplying/dividing an inequality by a negative FLIPS the sign.',
        'Check by substituting your answer back into the original.',
      ],
      vocabulary: [
        { term: 'Equation', definition: 'A statement that two expressions are equal.', example: '2x + 5 = 11' },
        { term: 'Inequality', definition: 'A statement that one expression is greater or less than another.', example: 'x < 6' },
        { term: 'Solution', definition: 'A value of the variable that makes the equation / inequality true.' },
      ],
      formulas: [
        {
          name: 'Two-step linear equation',
          equation: 'ax + b  =  c    ⇒    x  =  (c − b) ÷ a',
          explanation: 'Subtract b from both sides, then divide both sides by a.',
          stepByStep: [
            'Step 1: Subtract the constant b from both sides.',
            'Step 2: Divide both sides by the coefficient a.',
            'Step 3: Check by substituting x back into the original.',
          ],
        },
      ],
    },
  ],

  unit2: [
    {
      title: 'Representation & Shape of Functions',
      description:
        'A function is a rule that takes an input and gives back exactly one output. The same function can be represented as a table of values, a rule like y = 2x + 1, or a graph — three views of the same relationship.',
      paragraphs: [
        'A function takes an input (often called x) and produces a single output (often called y). The same function can be expressed three ways: a TABLE of paired values, an EQUATION (y = 2x + 1), or a GRAPH plotted on a coordinate grid. Switching between these representations is the heart of MYP "Thinking with Models".',
        'To TABULATE a function, pick a few x values and substitute each one into the rule to find the matching y. For y = 2x + 1: x = −1 gives y = −1; x = 0 gives y = 1; x = 1 gives y = 3; x = 2 gives y = 5.',
        'PLOTTING the table on a grid gives the GRAPH. Each (x, y) pair becomes a point; joining them reveals the SHAPE of the function — a straight line for linear rules, a curve for quadratic or exponential ones.',
        'The DOMAIN is the set of allowed x-values (often all real numbers). The RANGE is the set of resulting y-values. A graph that reaches every horizontal line on the page has a range of "all reals"; a parabola y = x² has range y ≥ 0 because squaring is never negative.',
      ],
      keyIdeas: [
        'Three views of one function: table, equation, graph.',
        'Substitute x into the rule → get y → plot the pair → join the points.',
        'Domain = allowed inputs; Range = resulting outputs.',
        'Shape of the graph tells you the family of function (line, parabola, exponential).',
      ],
      vocabulary: [
        { term: 'Function', definition: 'A rule assigning to each input exactly one output.' },
        { term: 'Domain', definition: 'The set of allowed input values for the function.' },
        { term: 'Range', definition: 'The set of output values the function can produce.' },
      ],
      formulas: [
        {
          name: 'Tabulating a function',
          equation: 'Pick x values  →  substitute into the rule  →  list (x, y)',
          explanation: 'Three to five well-chosen x values are usually enough to reveal the shape.',
          stepByStep: [
            'Step 1: Choose a tidy set of x values — typically −2, −1, 0, 1, 2.',
            'Step 2: Substitute each x into the rule to find y.',
            'Step 3: Write the pairs as a table.',
            'Step 4: Plot each (x, y) on the grid and join with a smooth curve or straight line.',
          ],
        },
      ],
    },
    {
      title: 'Linear Functions: Gradient & Intercept',
      description:
        'A LINEAR function has a constant rate of change. Its graph is a straight line. Every linear function fits the rule y = mx + c — where m is the gradient and c is the y-intercept.',
      paragraphs: [
        'A LINEAR function changes by the SAME amount each step. y = 2x + 1: every time x increases by 1, y increases by 2. That fixed rate of change is the GRADIENT (m). The line crosses the y-axis at the point where x = 0 — that y-value is the y-INTERCEPT (c).',
        'To find the gradient between two points (x₁, y₁) and (x₂, y₂), divide the change in y by the change in x: m = (y₂ − y₁) ÷ (x₂ − x₁). This is "rise over run". A positive gradient slopes up to the right; a negative gradient slopes down.',
        'Real-world problems often hide a linear function. "A taxi charges 8 AED plus 3 AED per km" — the 8 AED is the constant (y-intercept) and 3 AED per km is the gradient. The cost rule is C = 3k + 8.',
      ],
      keyIdeas: [
        'Equation of a straight line:  y = mx + c.',
        'Gradient m = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁).',
        'y-intercept c is the value of y when x = 0.',
        'Positive gradient → up; negative → down; zero → horizontal.',
      ],
      vocabulary: [
        { term: 'Gradient', definition: 'The constant rate of change of a linear function — rise over run.' },
        { term: 'y-intercept', definition: 'The y-value where the line crosses the y-axis.', example: '3 in y = 2x + 3.' },
        { term: 'Parallel lines', definition: 'Lines with the SAME gradient. They never meet.' },
      ],
      formulas: [
        {
          name: 'Gradient between two points',
          equation: 'm  =  (y₂ − y₁) ÷ (x₂ − x₁)',
          explanation: 'Rise over run. The order of the points doesn\'t matter as long as you subtract consistently top-to-bottom in numerator and denominator.',
          stepByStep: [
            'Step 1: Label your two points (x₁, y₁) and (x₂, y₂).',
            'Step 2: Calculate the change in y (y₂ − y₁) — the rise.',
            'Step 3: Calculate the change in x (x₂ − x₁) — the run.',
            'Step 4: Divide rise by run.',
          ],
        },
      ],
    },
  ],

  unit3: [
    {
      title: 'Visualising 3D Shapes & Surface Area',
      description:
        'Three-dimensional shapes can be unfolded onto a flat NET. Once a 3D shape is flat, its SURFACE AREA is just the sum of the areas of every face. Volume measures how much space the shape encloses.',
      paragraphs: [
        'A POLYHEDRON is a solid with flat faces. A cuboid has 6 rectangular faces, 12 edges and 8 vertices. A prism has two identical end-faces (the cross-section) joined by rectangles. A pyramid has a polygon base and triangular faces meeting at one apex.',
        'A NET is the 2D pattern you get by unfolding a 3D shape. The net of a cube is six identical squares in a cross or T arrangement. Once flat, the SURFACE AREA is the sum of the areas of every face — no shape changes, no overlap.',
        'For a CUBOID with sides l, w and h, the three distinct face pairs have areas l × w, l × h and w × h. Surface area is twice that sum: SA = 2(lw + lh + wh).',
        'VOLUME measures how much space a shape encloses. For any PRISM (a shape with a uniform cross-section), V = cross-section area × length. So a triangular prism with cross-section 18 cm² and length 7 cm has volume 18 × 7 = 126 cm³.',
      ],
      keyIdeas: [
        'Net = the 2D pattern that folds into the 3D shape.',
        'Surface area = sum of the area of every face.',
        'Cuboid SA = 2(lw + lh + wh).',
        'Volume of any prism = cross-section area × length.',
      ],
      vocabulary: [
        { term: 'Face', definition: 'A flat side of a 3D shape.' },
        { term: 'Edge', definition: 'A line where two faces meet.' },
        { term: 'Vertex', definition: 'A corner where edges meet.' },
        { term: 'Cross-section', definition: 'The 2D shape you see when you slice through a prism perpendicular to its length.' },
      ],
      formulas: [
        {
          name: 'Cuboid surface area',
          equation: 'SA  =  2(lw + lh + wh)',
          explanation: 'Add the three unique face areas and double the result.',
          stepByStep: [
            'Step 1: Calculate the three unique face areas: lw, lh and wh.',
            'Step 2: Add them.',
            'Step 3: Multiply the sum by 2 (each face has a matching pair on the opposite side).',
            'Step 4: Attach a squared unit (cm², m², etc.).',
          ],
        },
        {
          name: 'Prism volume',
          equation: 'V  =  A_cross × ℓ',
          explanation: 'Volume of any prism is cross-section area times length.',
          stepByStep: [
            'Step 1: Identify the cross-section and find its area.',
            'Step 2: Multiply by the length of the prism.',
            'Step 3: Attach a cubic unit (cm³, m³).',
          ],
        },
      ],
    },
    {
      title: 'Transformations: Reflection, Rotation, Translation, Dilation',
      description:
        'A TRANSFORMATION moves or changes a shape on the plane. Reflection, rotation and translation preserve size — they are rigid transformations. Dilation (enlargement) changes size by a scale factor.',
      paragraphs: [
        'REFLECTION flips a shape over a mirror line. Every point of the new shape is the same distance from the line as the original, but on the opposite side. The line can be horizontal, vertical or sloped.',
        'ROTATION turns a shape around a fixed point by a given angle. The original and the rotated image are CONGRUENT — same shape, same size. Rotation through 90°, 180° or 270° is common.',
        'TRANSLATION slides a shape with no turning. Describe a translation by how far it goes horizontally (Δx) and vertically (Δy). The shape stays congruent.',
        'DILATION (sometimes called enlargement) scales a shape by a factor k from a centre point. If k > 1 the shape gets BIGGER; if 0 < k < 1 it shrinks. Lengths multiply by k; areas multiply by k².',
      ],
      keyIdeas: [
        'Reflection, rotation, translation are RIGID — size & shape preserved.',
        'Dilation changes size by scale factor k — lengths × k, areas × k².',
        'Two shapes are CONGRUENT if one fits exactly on the other.',
        'They are SIMILAR if they have the same angles but different sizes.',
      ],
      vocabulary: [
        { term: 'Congruent', definition: 'Same shape AND same size.' },
        { term: 'Similar', definition: 'Same shape but possibly different size (one is a dilation of the other).' },
        { term: 'Scale factor', definition: 'The multiplier by which a shape is dilated.' },
      ],
    },
  ],

  unit4: [
    {
      title: 'Measures of Central Tendency & Spread',
      description:
        'A data set is often too big to look at in one go. We summarise it with a measure of CENTRE (where the data is) and a measure of SPREAD (how varied it is).',
      paragraphs: [
        'The MEAN is the arithmetic average — add every value and divide by how many there are. It is sensitive to extreme values (outliers can pull the mean up or down a lot).',
        'The MEDIAN is the middle value when the data is in order. For an even number of values, take the average of the two middle values. Median is RESISTANT to outliers — one extreme value barely changes it.',
        'The MODE is the most-frequent value. A set can have no mode, one mode, or several modes. Mode is most useful for categorical data ("most popular ice-cream flavour").',
        'The RANGE measures spread: largest − smallest. Two data sets with the same mean can have very different ranges, so always report a measure of centre AND a measure of spread together.',
      ],
      keyIdeas: [
        'Mean = sum ÷ count.  Easily skewed by outliers.',
        'Median = middle value in order. Resistant to outliers.',
        'Mode = most frequent value. Best for categorical data.',
        'Range = max − min.  Report centre AND spread together.',
      ],
      vocabulary: [
        { term: 'Outlier', definition: 'A value far from the rest of the data.' },
        { term: 'Skew', definition: 'When the data is not symmetric — one tail is longer than the other.' },
        { term: 'Frequency', definition: 'How often a value appears.' },
      ],
      formulas: [
        {
          name: 'Mean',
          equation: 'mean  =  Σ values  ÷  n',
          explanation: 'Add every value and divide by how many there are.',
          stepByStep: [
            'Step 1: Add all values.',
            'Step 2: Count how many values there are.',
            'Step 3: Divide the sum by the count.',
          ],
        },
      ],
    },
    {
      title: 'Probability — Theoretical vs Experimental',
      description:
        'Probability measures how likely an event is, on a scale from 0 (impossible) to 1 (certain). THEORETICAL probability uses counting; EXPERIMENTAL probability uses observed data.',
      paragraphs: [
        'For a fair sample space (every outcome equally likely), P(event) = favourable outcomes ÷ total outcomes. Rolling more than 4 on a fair die has 2 favourable outcomes (5 or 6) and 6 total outcomes, so P = 2/6 = 1/3.',
        'The COMPLEMENT of event A is "A does NOT happen". Probabilities of A and its complement always add to 1. If P(rain) = 0.35 then P(no rain) = 0.65.',
        'EXPERIMENTAL probability uses real observations. If a spinner landed on gold 16 times in 80 spins, P(gold) ≈ 16 ÷ 80 = 0.2. With enough trials, experimental probability gets very close to theoretical — a key result called the law of large numbers.',
        'For INDEPENDENT events (one doesn\'t affect the other), multiply: P(A and B) = P(A) × P(B). Rolling two sixes in a row on a fair die is 1/6 × 1/6 = 1/36.',
      ],
      keyIdeas: [
        'Probability is between 0 (impossible) and 1 (certain).',
        'P(event) = favourable ÷ total  for a fair sample space.',
        'P(not A) = 1 − P(A).',
        'For independent events: P(A and B) = P(A) × P(B).',
      ],
      vocabulary: [
        { term: 'Sample space', definition: 'The set of all possible outcomes of an experiment.' },
        { term: 'Independent', definition: 'Two events where one doesn\'t affect the other.' },
        { term: 'Mutually exclusive', definition: 'Two events that cannot happen at the same time.' },
      ],
      formulas: [
        {
          name: 'Theoretical probability',
          equation: 'P(event)  =  favourable outcomes  ÷  total outcomes',
          explanation: 'Only valid when every outcome is equally likely.',
          stepByStep: [
            'Step 1: List or count the favourable outcomes.',
            'Step 2: List or count the total possible outcomes.',
            'Step 3: Write the ratio favourable / total.',
            'Step 4: Simplify the fraction.',
          ],
        },
      ],
    },
  ],
};
