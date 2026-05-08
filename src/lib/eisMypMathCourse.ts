export type AnimationMode =
  | 'number-line'
  | 'percentage-bars'
  | 'ratio-mixer'
  | 'algebra-tiles'
  | 'equation-balance'
  | 'coordinate-grid'
  | 'angle-lab'
  | 'circle-lab'
  | 'construction-compass'
  | 'solid-builder'
  | 'data-lab'
  | 'probability-spinner';

export type CourseLesson = {
  id: string;
  title: string;
  textbookSection: string;
  inquiry: string;
  objectives: string[];
  explanation: string;
  animation: AnimationMode;
  workedExample: {
    prompt: string;
    steps: string[];
    answer: string;
  };
  exercises: {
    fluency: string[];
    reasoning: string[];
    extension: string;
  };
};

export type CourseChapter = {
  id: string;
  chapter: string;
  title: string;
  textbookStart: string;
  globalContext: string;
  statementOfInquiry: string;
  project: string;
  lessons: CourseLesson[];
};

const fluency = (...items: string[]) => items;
const reasoning = (...items: string[]) => items;

export const eisMypMathCourse: CourseChapter[] = [
  {
    id: 'ch1-review',
    chapter: 'Chapter 1',
    title: 'Year 1 Review',
    textbookStart: 'Page 1',
    globalContext: 'Orientation in space and time',
    statementOfInquiry: 'Reviewing number, geometry, measure, algebra and statistics gives learners the tools to communicate mathematical thinking clearly.',
    project: 'Create a personal maths diagnostic map showing three strengths, two revision targets and one growth strategy.',
    lessons: [
      {
        id: 'review-number-basics',
        title: 'Number Basics and Place Value',
        textbookSection: '1.1 Number basics',
        inquiry: 'How does place value help us read, compare and estimate large and small quantities?',
        objectives: ['Read and compare natural numbers and decimals.', 'Round numbers to suitable accuracy.', 'Use estimation to check answers.'],
        explanation: 'Students rebuild number sense by zooming from millions down to thousandths, using place-value columns and estimation checks.',
        animation: 'number-line',
        workedExample: {
          prompt: 'Round 48,736 to the nearest thousand and explain why.',
          steps: ['Find the thousands digit: 8.', 'Check the hundreds digit: 7.', 'Because 7 is at least 5, round 48,000 up to 49,000.'],
          answer: '49,000',
        },
        exercises: {
          fluency: fluency('Round 7,486 to the nearest hundred.', 'Write 0.407 in words.', 'Order 3.04, 3.4, 3.004 and 3.44 from smallest to largest.'),
          reasoning: reasoning('A student says 5.20 is larger than 5.2 because it has more digits. Explain the error.', 'Estimate 49.8 x 21 and explain whether 1045.8 is reasonable.'),
          extension: 'Design a place-value puzzle where the answer is 62,408. Include at least four clues.',
        },
      },
      {
        id: 'review-integers-decimals-fractions',
        title: 'Integers, Decimals and Fractions',
        textbookSection: '1.3-1.5 Integers, decimals and fractions',
        inquiry: 'How do different number forms represent the same quantity?',
        objectives: ['Calculate with integers.', 'Convert between fractions and decimals.', 'Compare rational numbers on a number line.'],
        explanation: 'Integer movement, decimal grids and fraction strips show that rational numbers can be represented visually before calculation.',
        animation: 'number-line',
        workedExample: {
          prompt: 'Calculate -7 + 12 - 9.',
          steps: ['Start at -7.', 'Move 12 right to 5.', 'Move 9 left to -4.'],
          answer: '-4',
        },
        exercises: {
          fluency: fluency('Calculate -8 + 15.', 'Convert 3/8 to a decimal.', 'Place -1.5, -1/2 and 0.25 on a number line.'),
          reasoning: reasoning('Explain why -3 is greater than -8.', 'Which is larger, 5/12 or 0.45? Show your method.'),
          extension: 'Create a real-life temperature story that matches -4 + 9 - 13.',
        },
      },
      {
        id: 'review-probability-geometry-measure',
        title: 'Probability, Geometry and Measure Review',
        textbookSection: '1.6-1.9 Probability, geometry and measure',
        inquiry: 'How can diagrams make chance, shape and measurement easier to reason about?',
        objectives: ['Use basic probability language.', 'Identify common shapes and angle facts.', 'Convert between metric units.'],
        explanation: 'The lesson rotates between probability scales, angle visuals and unit conversion ladders to refresh key Year 1 foundations.',
        animation: 'probability-spinner',
        workedExample: {
          prompt: 'A bag has 3 red counters and 5 blue counters. What is P(red)?',
          steps: ['Count favourable outcomes: 3 red.', 'Count total outcomes: 8 counters.', 'Write probability as favourable / total.'],
          answer: '3/8',
        },
        exercises: {
          fluency: fluency('Convert 3.4 m to cm.', 'Find the probability of rolling a 6 on a fair die.', 'Name a quadrilateral with exactly one pair of parallel sides.'),
          reasoning: reasoning('Explain why probability cannot be 1.4.', 'A rectangle is 8 cm by 5 cm. Compare its perimeter and area.'),
          extension: 'Build a mini poster connecting one probability fact, one geometry fact and one measurement conversion.',
        },
      },
      {
        id: 'review-patterns-statistics-venn',
        title: 'Patterns, Statistics and Venn Diagrams',
        textbookSection: '1.10-1.13 Patterns, statistics and Venn diagrams',
        inquiry: 'How do patterns and diagrams organise information?',
        objectives: ['Continue number patterns.', 'Read simple statistical displays.', 'Solve two-set Venn diagram problems.'],
        explanation: 'Students use animated counters that move between Venn regions, then connect pattern rules to simple algebraic thinking.',
        animation: 'data-lab',
        workedExample: {
          prompt: 'In a class, 12 students play football, 9 play basketball and 5 play both. How many play at least one?',
          steps: ['Add both groups: 12 + 9 = 21.', 'Subtract the overlap once: 21 - 5 = 16.'],
          answer: '16 students',
        },
        exercises: {
          fluency: fluency('Continue 4, 7, 10, 13, ...', 'Find the mode of 4, 7, 4, 9, 7, 4.', 'Draw a Venn diagram for multiples of 2 and multiples of 3 from 1 to 12.'),
          reasoning: reasoning('Why do we subtract the overlap in a Venn diagram?', 'Describe the rule for 5, 11, 17, 23 using words and algebra.'),
          extension: 'Survey ten classmates and display the result with a Venn diagram and one statistic.',
        },
      },
    ],
  },
  {
    id: 'ch2-percentages-ratio-rates',
    chapter: 'Chapter 2',
    title: 'Percentages, Ratio and Rates',
    textbookStart: 'Page 57',
    globalContext: 'Globalisation and sustainability',
    statementOfInquiry: 'Equivalent representations help us compare, scale and interpret quantities in real situations.',
    project: 'Design a sustainable school-canteen price comparison using percentages, ratios and rates.',
    lessons: [
      {
        id: 'percent-conversions',
        title: 'Converting Fractions, Decimals and Percentages',
        textbookSection: '2.1 Review of percentages',
        inquiry: 'Why are percentages useful for comparing different totals?',
        objectives: ['Convert fractions to percentages.', 'Convert decimals to percentages.', 'Find one quantity as a percentage of another.'],
        explanation: 'A hundred-square animation shades equivalent fractions, decimals and percentages so students see one quantity in three languages.',
        animation: 'percentage-bars',
        workedExample: {
          prompt: 'Write 0.375 as a percentage.',
          steps: ['Multiply the decimal by 100.', '0.375 x 100 = 37.5.'],
          answer: '37.5%',
        },
        exercises: {
          fluency: fluency('Write 3/5 as a percentage.', 'Write 0.08 as a percentage.', 'Write 45% as a decimal.'),
          reasoning: reasoning('Which is larger: 7/20 or 32%? Explain.', 'A quiz score is 18 out of 24. Convert it to a percentage.'),
          extension: 'Create three equivalent cards for the same value: fraction, decimal and percentage.',
        },
      },
      {
        id: 'percentage-change',
        title: 'Percentage Change and Reverse Percentages',
        textbookSection: '2.2-2.3 Percentage change and finding a quantity',
        inquiry: 'How do percentage changes describe growth and reduction?',
        objectives: ['Calculate percentage increase.', 'Calculate percentage decrease.', 'Find the original value when a percentage is known.'],
        explanation: 'A price tag animation grows and shrinks by percentage multipliers, making increase and discount calculations visible.',
        animation: 'percentage-bars',
        workedExample: {
          prompt: 'A 240 AED jacket is reduced by 15%. Find the sale price.',
          steps: ['Find 15% of 240: 0.15 x 240 = 36.', 'Subtract the discount: 240 - 36 = 204.'],
          answer: '204 AED',
        },
        exercises: {
          fluency: fluency('Increase 80 by 25%.', 'Decrease 150 by 12%.', 'A value after a 10% increase is 55. Find the original.'),
          reasoning: reasoning('Explain why a 20% decrease followed by 20% increase does not return to the original.', 'Compare multiplier methods for 8% increase and 8% decrease.'),
          extension: 'Build a shopping discount challenge with three items and a final total.',
        },
      },
      {
        id: 'ratio-sharing',
        title: 'Ratio, Equivalent Ratios and Sharing',
        textbookSection: '2.4-2.7 Ratio and dividing a quantity',
        inquiry: 'How can ratio describe fair sharing and mixtures?',
        objectives: ['Simplify ratios.', 'Find equivalent ratios.', 'Divide a quantity in a given ratio.'],
        explanation: 'A ratio mixer fills two containers in linked parts, showing how total parts determine each share.',
        animation: 'ratio-mixer',
        workedExample: {
          prompt: 'Divide 72 AED in the ratio 5:4.',
          steps: ['Total parts: 5 + 4 = 9.', 'One part: 72 / 9 = 8.', 'Shares: 5 x 8 = 40 and 4 x 8 = 32.'],
          answer: '40 AED and 32 AED',
        },
        exercises: {
          fluency: fluency('Simplify 18:24.', 'Find an equivalent ratio to 3:7 with total 50.', 'Share 96 in the ratio 1:3.'),
          reasoning: reasoning('A recipe uses rice:water = 2:5. How much water for 180 g rice?', 'Explain the difference between 3:2 and 3/2.'),
          extension: 'Design a mocktail recipe using three ingredients in ratio form and scale it for 24 students.',
        },
      },
      {
        id: 'rates-scale',
        title: 'Rates, Applications and Scale Drawing',
        textbookSection: '2.8-2.10 Rates, applications and scale drawing',
        inquiry: 'How do rates and scale connect models to real life?',
        objectives: ['Calculate rates such as speed and unit price.', 'Compare rates.', 'Use scale factors in drawings.'],
        explanation: 'A moving marker and scale ruler animate how distance, time and map scale transform into real-world quantities.',
        animation: 'coordinate-grid',
        workedExample: {
          prompt: 'A cyclist travels 18 km in 45 minutes. Find the speed in km/h.',
          steps: ['45 minutes = 0.75 hours.', 'Speed = distance / time.', '18 / 0.75 = 24.'],
          answer: '24 km/h',
        },
        exercises: {
          fluency: fluency('Find the unit price for 6 notebooks costing 42 AED.', 'Convert 1:200 scale if a room is 4 cm on the drawing.', 'Find speed for 150 m in 25 s.'),
          reasoning: reasoning('Two taxis charge different fixed and per-km costs. Explain how to compare them.', 'Why must units be consistent before calculating a rate?'),
          extension: 'Draw a scale plan of an EIS classroom zone and label three real dimensions.',
        },
      },
    ],
  },
  {
    id: 'ch3-patterns-algebra',
    chapter: 'Chapter 3',
    title: 'Patterns and Algebra',
    textbookStart: 'Page 95',
    globalContext: 'Scientific and technical innovation',
    statementOfInquiry: 'Patterns can be represented symbolically to describe relationships and predict unknown values.',
    project: 'Create an animated pattern machine that turns input positions into algebraic outputs.',
    lessons: [
      {
        id: 'patterns-rules',
        title: 'Number Patterns, Algebra Patterns and Puzzles',
        textbookSection: '3.1 Patterns and puzzles',
        inquiry: 'How can we describe a pattern so it works for every term?',
        objectives: ['Recognise arithmetic patterns.', 'Describe nth-term rules in words.', 'Use simple algebra for pattern generalisation.'],
        explanation: 'Tiles grow term by term, then collapse into a rule so students see why algebra predicts far-away terms.',
        animation: 'algebra-tiles',
        workedExample: {
          prompt: 'Find the 10th term of 4, 7, 10, 13, ...',
          steps: ['The pattern increases by 3.', 'Term rule: 3n + 1.', 'For n = 10: 3(10) + 1 = 31.'],
          answer: '31',
        },
        exercises: {
          fluency: fluency('Continue 6, 10, 14, 18.', 'Find the rule for 2, 5, 8, 11.', 'Use n = 12 in 4n - 1.'),
          reasoning: reasoning('How do you know whether a sequence is arithmetic?', 'A pattern starts at 5 and grows by 4. Explain its nth term.'),
          extension: 'Build a visual tile pattern and write its nth-term rule.',
        },
      },
      {
        id: 'operations-variables',
        title: 'Operations with Variables and Index Notation',
        textbookSection: '3.2 Operations with variables',
        inquiry: 'When do algebra terms combine, multiply or stay separate?',
        objectives: ['Add and subtract like terms.', 'Multiply and divide variables.', 'Use index notation with variables.'],
        explanation: 'Algebra tiles and power cubes distinguish like-term addition from multiplication, reducing the classic exponent mistake.',
        animation: 'algebra-tiles',
        workedExample: {
          prompt: 'Simplify 3a + 5a - 2b + 4b.',
          steps: ['Group like terms: 3a + 5a and -2b + 4b.', 'Add coefficients: 8a and 2b.'],
          answer: '8a + 2b',
        },
        exercises: {
          fluency: fluency('Simplify 7x - 2x + 4y.', 'Simplify 3p x 5p.', 'Write m x m x m x n in index form.'),
          reasoning: reasoning('Explain why 2x + 3y cannot be simplified to 5xy.', 'Compare x^2 + x^2 with x^2 x x^2.'),
          extension: 'Create a sorting activity for like terms and unlike terms.',
        },
      },
      {
        id: 'expressions-expand-factorise',
        title: 'Expanding, Factorising and Forming Expressions',
        textbookSection: '3.3 Algebraic expressions',
        inquiry: 'How can the same relationship be written in different but equivalent forms?',
        objectives: ['Expand single brackets.', 'Factorise using common factors.', 'Form expressions from contexts.'],
        explanation: 'A bracket machine distributes multipliers across every term, then reverses into factorisation mode.',
        animation: 'algebra-tiles',
        workedExample: {
          prompt: 'Expand and simplify 4(x + 3) - 2x.',
          steps: ['Expand: 4x + 12 - 2x.', 'Collect like terms: 2x + 12.'],
          answer: '2x + 12',
        },
        exercises: {
          fluency: fluency('Expand 5(y - 2).', 'Factorise 6x + 18.', 'Write an expression for 3 more than twice n.'),
          reasoning: reasoning('How can you check that factorisation is correct?', 'Explain why 3(x + 4) is not 3x + 4.'),
          extension: 'Write a real-world expression for a phone plan, then simplify it.',
        },
      },
    ],
  },
  {
    id: 'ch4-equations-inequalities-formulae',
    chapter: 'Chapter 4',
    title: 'Equations, Inequalities and Formulae',
    textbookStart: 'Page 129',
    globalContext: 'Personal and cultural expression',
    statementOfInquiry: 'Mathematical relationships can be solved, compared and rearranged to model unknown values.',
    project: 'Design an escape-room equation sequence with equality and inequality locks.',
    lessons: [
      {
        id: 'solving-equations',
        title: 'Inverse Operations and Equations',
        textbookSection: '4.1 Solving equations',
        inquiry: 'How does balance help us solve for an unknown?',
        objectives: ['Solve one-step equations.', 'Solve two-step equations.', 'Solve equations with brackets and unknowns on both sides.'],
        explanation: 'A balance scale shows that every inverse operation must happen to both sides of the equation.',
        animation: 'equation-balance',
        workedExample: {
          prompt: 'Solve 5x - 7 = 28.',
          steps: ['Add 7 to both sides: 5x = 35.', 'Divide both sides by 5.'],
          answer: 'x = 7',
        },
        exercises: {
          fluency: fluency('Solve x + 9 = 21.', 'Solve 3x - 4 = 20.', 'Solve 2(x + 5) = 34.'),
          reasoning: reasoning('Explain why checking a solution is useful.', 'Solve 4x + 3 = 2x + 15 and justify each step.'),
          extension: 'Build a three-lock equation puzzle where each answer opens the next equation.',
        },
      },
      {
        id: 'inequalities',
        title: 'Interpreting, Graphing and Solving Inequalities',
        textbookSection: '4.2 Inequalities',
        inquiry: 'How do inequalities describe a range of possible answers?',
        objectives: ['Graph inequalities on a number line.', 'Solve simple inequalities.', 'Interpret solution sets in context.'],
        explanation: 'A glowing number-line ray expands from the boundary point, using open and closed circles to show inclusion.',
        animation: 'number-line',
        workedExample: {
          prompt: 'Solve 2x + 3 < 11.',
          steps: ['Subtract 3: 2x < 8.', 'Divide by 2: x < 4.'],
          answer: 'x < 4',
        },
        exercises: {
          fluency: fluency('Graph x >= -2.', 'Solve x - 5 > 8.', 'Solve 3x <= 18.'),
          reasoning: reasoning('What is the difference between < and <= on a graph?', 'Give three possible values for x if x > -1.5.'),
          extension: 'Write an inequality that represents a real EIS school rule or limit.',
        },
      },
      {
        id: 'formulae',
        title: 'Using and Constructing Formulae',
        textbookSection: '4.3 Formulae',
        inquiry: 'How do formulae compress relationships into reusable tools?',
        objectives: ['Substitute values into formulae.', 'Construct formulae from situations.', 'Rearrange simple formulae.'],
        explanation: 'Formula variables become interactive controls, letting students see how changing one variable affects the output.',
        animation: 'equation-balance',
        workedExample: {
          prompt: 'Use A = lw to find A when l = 9 and w = 4.',
          steps: ['Substitute l = 9 and w = 4.', 'A = 9 x 4.'],
          answer: 'A = 36',
        },
        exercises: {
          fluency: fluency('Use v = u + at where u=2, a=3, t=4.', 'Rearrange A = bh to make h the subject.', 'Construct a formula for total cost with a fixed fee of 10 AED plus 3 AED per item.'),
          reasoning: reasoning('Why is substitution easier after writing the formula first?', 'Explain the difference between an equation and a formula.'),
          extension: 'Create a formula that models reward points in a NeuroQuest game.',
        },
      },
    ],
  },
  {
    id: 'ch5-number-plane-graphs',
    chapter: 'Chapter 5',
    title: 'The Number Plane and Linear Graphs',
    textbookStart: 'Page 161',
    globalContext: 'Orientation in space and time',
    statementOfInquiry: 'Coordinates and graphs represent movement, constraints and relationships in two dimensions.',
    project: 'Create a coordinate-map mission through the EIS campus using linear graph clues.',
    lessons: [
      {
        id: 'coordinates-plane',
        title: 'Coordinates and the Cartesian Plane',
        textbookSection: '5.1 Coordinates',
        inquiry: 'How can two numbers locate a point exactly?',
        objectives: ['Plot ordered pairs.', 'Read coordinates in all four quadrants.', 'Use grids to describe positions.'],
        explanation: 'A 3D marker lands on coordinate points while x and y axes light up in sequence.',
        animation: 'coordinate-grid',
        workedExample: {
          prompt: 'Plot A(-3, 4).',
          steps: ['Move 3 units left from the origin.', 'Move 4 units up.', 'Mark the point.'],
          answer: 'A is in Quadrant II.',
        },
        exercises: {
          fluency: fluency('Plot (2, -5).', 'Name the quadrant for (-4, -1).', 'Read the coordinate of a point 6 right and 3 up.'),
          reasoning: reasoning('Why does order matter in (x, y)?', 'Describe a path from (-2, 1) to (4, -3).'),
          extension: 'Draw a simple EIS map using at least eight coordinate points.',
        },
      },
      {
        id: 'parallel-axis-lines',
        title: 'Horizontal and Vertical Lines',
        textbookSection: '5.2 Lines parallel to the axes',
        inquiry: 'What stays constant on horizontal and vertical lines?',
        objectives: ['Recognise x = a and y = b lines.', 'Draw horizontal and vertical lines.', 'Connect equations to graph position.'],
        explanation: 'Coordinate planes sweep a vertical laser for x = a and a horizontal laser for y = b.',
        animation: 'coordinate-grid',
        workedExample: {
          prompt: 'Describe the line y = -2.',
          steps: ['The y-coordinate is always -2.', 'The line is horizontal through -2 on the y-axis.'],
          answer: 'A horizontal line at y = -2.',
        },
        exercises: {
          fluency: fluency('Draw x = 3.', 'Draw y = 5.', 'State the equation of the vertical line through (-4, 2).'),
          reasoning: reasoning('Why is x = 2 vertical rather than horizontal?', 'Find where x = -1 and y = 4 intersect.'),
          extension: 'Create a coordinate-grid logo using only horizontal and vertical line equations.',
        },
      },
      {
        id: 'travel-graphs',
        title: 'Line Graphs and Travel Graphs',
        textbookSection: '5.3 Line graphs and travel graphs',
        inquiry: 'How does graph shape describe motion?',
        objectives: ['Interpret distance-time graphs.', 'Identify stationary periods.', 'Compare speeds using gradient.'],
        explanation: 'A moving runner traces a distance-time graph, pausing when the graph is horizontal and speeding up when it steepens.',
        animation: 'coordinate-grid',
        workedExample: {
          prompt: 'A graph rises from 0 m to 120 m in 20 s. Find the speed.',
          steps: ['Use speed = distance / time.', '120 / 20 = 6.'],
          answer: '6 m/s',
        },
        exercises: {
          fluency: fluency('Find speed for 200 m in 40 s.', 'Describe a horizontal section on a distance-time graph.', 'Which line is faster: 50 m in 10 s or 50 m in 25 s?'),
          reasoning: reasoning('Why does a steeper distance-time graph mean faster speed?', 'Sketch a journey with walking, stopping and running.'),
          extension: 'Record a 30-second movement and sketch its distance-time graph.',
        },
      },
      {
        id: 'linear-equations-graphs',
        title: 'Linear Equations in One and Two Variables',
        textbookSection: '5.4-5.5 Straight-line graphs',
        inquiry: 'How can a line show all solutions to an equation?',
        objectives: ['Generate coordinate pairs from a linear equation.', 'Draw straight-line graphs.', 'Interpret equations of the form Ax + By = C.'],
        explanation: 'A table of values feeds points onto the grid; the points connect into a line that represents all solutions.',
        animation: 'coordinate-grid',
        workedExample: {
          prompt: 'Find three points on y = 2x + 1.',
          steps: ['Use x = 0, 1, 2.', 'Calculate y = 1, 3, 5.', 'Write points (0,1), (1,3), (2,5).'],
          answer: '(0,1), (1,3), (2,5)',
        },
        exercises: {
          fluency: fluency('Complete a table for y = x - 4.', 'Plot y = 3x.', 'Find x-intercept of x + y = 6.'),
          reasoning: reasoning('Why do two points determine a straight line?', 'Explain what the point (2, 5) means for y = 2x + 1.'),
          extension: 'Create a coordinate art line drawing using at least four linear equations.',
        },
      },
    ],
  },
  {
    id: 'ch6-geometry-reasoning',
    chapter: 'Chapter 6',
    title: 'Reasoning in Geometry',
    textbookStart: 'Page 191',
    globalContext: 'Identities and relationships',
    statementOfInquiry: 'Geometric facts help us justify relationships and communicate logical proof.',
    project: 'Build a geometry proof gallery using angle facts from real school architecture.',
    lessons: [
      {
        id: 'adjacent-angles-point',
        title: 'Adjacent Angles and Angles at a Point',
        textbookSection: '6.1 Adjacent angles',
        inquiry: 'How do angle relationships let us find unknown values without measuring?',
        objectives: ['Use angles on a straight line.', 'Use angles at a point.', 'Write reasons for angle calculations.'],
        explanation: 'Angle sectors rotate and snap together to show 180 degrees on a line and 360 degrees around a point.',
        animation: 'angle-lab',
        workedExample: {
          prompt: 'Angles around a point are 80°, 140° and x. Find x.',
          steps: ['Angles around a point total 360°.', 'x = 360 - 80 - 140.'],
          answer: '140°',
        },
        exercises: {
          fluency: fluency('Find x if x + 65° = 180°.', 'Find x if 90°, 120° and x are around a point.', 'Name the reason for angles on a straight line.'),
          reasoning: reasoning('Why is measuring not enough in proof?', 'A student says vertically opposite angles add to 180°. Correct them.'),
          extension: 'Photograph or sketch an angle relationship in the classroom and annotate it.',
        },
      },
      {
        id: 'parallel-lines',
        title: 'Angles and Parallel Lines',
        textbookSection: '6.2 Angles and parallel lines',
        inquiry: 'How do parallel lines create repeated angle patterns?',
        objectives: ['Identify corresponding angles.', 'Identify alternate angles.', 'Use co-interior angle facts.'],
        explanation: 'A transversal sweeps across two glowing parallel rails, highlighting equal and supplementary angle pairs.',
        animation: 'angle-lab',
        workedExample: {
          prompt: 'Two parallel lines are crossed by a transversal. An alternate angle is 68°. Find its pair.',
          steps: ['Alternate angles between parallel lines are equal.'],
          answer: '68°',
        },
        exercises: {
          fluency: fluency('Find a corresponding angle to 112°.', 'Find a co-interior pair if one angle is 73°.', 'Identify alternate interior angles in a diagram.'),
          reasoning: reasoning('Explain how you know two lines are parallel from angle facts.', 'Compare alternate and corresponding angles.'),
          extension: 'Design a parallel-line maze where angle facts unlock doors.',
        },
      },
      {
        id: 'triangles-quadrilaterals',
        title: 'Angles in Triangles and Quadrilaterals',
        textbookSection: '6.3-6.4 Triangles and quadrilaterals',
        inquiry: 'How do polygons preserve angle totals?',
        objectives: ['Use triangle angle sum.', 'Use exterior angles.', 'Use quadrilateral angle sum.'],
        explanation: 'Triangle corners tear off and rearrange into a straight line, then quadrilaterals split into two triangles.',
        animation: 'angle-lab',
        workedExample: {
          prompt: 'A triangle has angles 47° and 68°. Find the third angle.',
          steps: ['Triangle angles total 180°.', '180 - 47 - 68 = 65.'],
          answer: '65°',
        },
        exercises: {
          fluency: fluency('Find the missing angle in a triangle with 55° and 73°.', 'Find the fourth angle in a quadrilateral with 90°, 105° and 80°.', 'Find an exterior angle next to 126°.'),
          reasoning: reasoning('Why does a quadrilateral total 360°?', 'Explain the exterior angle of a triangle using a straight line.'),
          extension: 'Create a mini proof showing triangle angle sum using a drawing.',
        },
      },
    ],
  },
  {
    id: 'ch7-circles',
    chapter: 'Chapter 7',
    title: 'Circles',
    textbookStart: 'Page 239',
    globalContext: 'Scientific and technical innovation',
    statementOfInquiry: 'Circular relationships model repeated motion, design and measurement in the world around us.',
    project: 'Design a circular feature for a school garden using circumference and area constraints.',
    lessons: [
      {
        id: 'circle-parts',
        title: 'Parts of a Circle',
        textbookSection: '7.1 Parts of a circle',
        inquiry: 'How do circle parts help us describe circular objects precisely?',
        objectives: ['Identify radius, diameter, chord, arc and sector.', 'Connect radius and diameter.', 'Use correct circle vocabulary.'],
        explanation: 'A glowing circle reveals one part at a time, with labels orbiting into position.',
        animation: 'circle-lab',
        workedExample: {
          prompt: 'If the radius is 6 cm, find the diameter.',
          steps: ['Diameter is twice the radius.', '2 x 6 = 12.'],
          answer: '12 cm',
        },
        exercises: {
          fluency: fluency('Name the line from centre to edge.', 'Find radius if diameter is 18 cm.', 'Identify a sector in a diagram.'),
          reasoning: reasoning('Why is every radius in the same circle equal?', 'Compare chord and diameter.'),
          extension: 'Create a labelled circle diagram for a sports field or wheel.',
        },
      },
      {
        id: 'circumference-area',
        title: 'Circumference and Area of a Circle',
        textbookSection: '7.2-7.3 Circumference and area',
        inquiry: 'Why does pi appear whenever we measure circles?',
        objectives: ['Calculate circumference.', 'Calculate area.', 'Choose the correct formula for a context.'],
        explanation: 'The circumference unwraps into a straight strip while area sectors rearrange into an almost-rectangle.',
        animation: 'circle-lab',
        workedExample: {
          prompt: 'Find the area of a circle with radius 5 cm.',
          steps: ['Use A = pi r^2.', 'A = pi x 5^2 = 25pi.', 'Approximate if needed.'],
          answer: '25pi cm^2, about 78.5 cm^2',
        },
        exercises: {
          fluency: fluency('Find circumference when d = 14 cm.', 'Find area when r = 3 m.', 'Find diameter when circumference is 20pi cm.'),
          reasoning: reasoning('How do you decide whether to use radius or diameter?', 'Explain why area units are squared but circumference units are not.'),
          extension: 'Estimate the area and perimeter of a circular object in the classroom.',
        },
      },
      {
        id: 'semicircles-quadrants',
        title: 'Semicircles and Quadrants',
        textbookSection: '7.4 Semicircles and quadrants',
        inquiry: 'How do parts of circles combine with straight edges?',
        objectives: ['Calculate area of semicircles and quadrants.', 'Calculate perimeter of compound circular shapes.', 'Combine circular and straight lengths.'],
        explanation: 'Circle pieces snap into half and quarter models, then attach straight boundary segments for perimeter.',
        animation: 'circle-lab',
        workedExample: {
          prompt: 'Find the area of a semicircle with radius 4 cm.',
          steps: ['Full circle area is pi x 4^2 = 16pi.', 'Half is 8pi.'],
          answer: '8pi cm^2',
        },
        exercises: {
          fluency: fluency('Find area of a quadrant with r = 8 cm.', 'Find arc length of a semicircle with d = 10 cm.', 'Find perimeter of a semicircle with r = 6 cm including the diameter.'),
          reasoning: reasoning('Why does semicircle perimeter include the diameter?', 'Explain the difference between arc length and area.'),
          extension: 'Design a logo using semicircles and quadrants, then calculate one area.',
        },
      },
    ],
  },
  {
    id: 'ch8-congruence-construction',
    chapter: 'Chapter 8',
    title: 'Congruent Shapes and Constructions',
    textbookStart: 'Page 269',
    globalContext: 'Personal and cultural expression',
    statementOfInquiry: 'Precision in construction helps us reproduce shapes and justify congruence.',
    project: 'Create a geometric art tile using compass-and-straightedge construction rules.',
    lessons: [
      {
        id: 'congruent-shapes',
        title: 'Congruent Shapes',
        textbookSection: '8.1 Congruent shapes',
        inquiry: 'What makes two shapes exactly the same?',
        objectives: ['Identify congruent figures.', 'Match corresponding sides and angles.', 'Distinguish congruence from similarity.'],
        explanation: 'Shapes slide, rotate and flip in 3D space to show that orientation can change while size and shape stay fixed.',
        animation: 'construction-compass',
        workedExample: {
          prompt: 'Two triangles have side lengths 5 cm, 7 cm, 9 cm and 5 cm, 7 cm, 9 cm. Are they congruent?',
          steps: ['All three corresponding sides match.', 'SSS congruence applies.'],
          answer: 'Yes, the triangles are congruent.',
        },
        exercises: {
          fluency: fluency('Identify congruent rectangles from dimensions.', 'Match corresponding sides in two labelled triangles.', 'State whether two circles of radius 4 cm are congruent.'),
          reasoning: reasoning('Can mirror images be congruent? Explain.', 'How is congruent different from similar?'),
          extension: 'Find two congruent shapes in a pattern and justify your choice.',
        },
      },
      {
        id: 'triangle-construction',
        title: 'Constructing Triangles',
        textbookSection: '8.2.1 Constructing triangles',
        inquiry: 'How can exact measurements create a unique shape?',
        objectives: ['Construct triangles from side lengths.', 'Use compass arcs accurately.', 'Check construction constraints.'],
        explanation: 'Compass arcs sweep across the screen until the intersection point locks the triangle into place.',
        animation: 'construction-compass',
        workedExample: {
          prompt: 'Construct a triangle with sides 5 cm, 6 cm and 7 cm.',
          steps: ['Draw a 7 cm base.', 'Draw a 5 cm arc from one endpoint.', 'Draw a 6 cm arc from the other endpoint.', 'Join the intersection to both endpoints.'],
          answer: 'A triangle with side lengths 5 cm, 6 cm and 7 cm.',
        },
        exercises: {
          fluency: fluency('Construct sides 4 cm, 5 cm, 6 cm.', 'Construct sides 6 cm, 6 cm, 8 cm.', 'Check whether 2 cm, 3 cm, 8 cm can form a triangle.'),
          reasoning: reasoning('Why do arcs locate the third vertex?', 'Explain the triangle inequality using construction.'),
          extension: 'Create a construction challenge for a partner and write success criteria.',
        },
      },
      {
        id: 'bisectors',
        title: 'Angle Bisectors and Perpendicular Bisectors',
        textbookSection: '8.2.2-8.2.3 Bisectors',
        inquiry: 'How can equal distance define a line or angle split?',
        objectives: ['Construct angle bisectors.', 'Construct perpendicular bisectors.', 'Explain equal-distance properties.'],
        explanation: 'A compass animation shows symmetrical arcs meeting to create exact bisectors without measuring.',
        animation: 'construction-compass',
        workedExample: {
          prompt: 'What does a perpendicular bisector do to a line segment?',
          steps: ['It crosses at 90 degrees.', 'It passes through the midpoint.', 'Every point on it is equal distance from the endpoints.'],
          answer: 'It cuts the segment into two equal halves at right angles.',
        },
        exercises: {
          fluency: fluency('Construct the perpendicular bisector of a 9 cm segment.', 'Construct the angle bisector of a 70° angle.', 'State the equal-distance property of a perpendicular bisector.'),
          reasoning: reasoning('Why should compass width stay fixed during construction?', 'How can bisectors help locate a centre point?'),
          extension: 'Use bisectors to design a symmetrical badge.',
        },
      },
    ],
  },
  {
    id: 'ch9-area-volume',
    chapter: 'Chapter 9',
    title: 'Area and Volume',
    textbookStart: 'Page 293',
    globalContext: 'Scientific and technical innovation',
    statementOfInquiry: 'Measurement models help us design, compare and optimise spaces and objects.',
    project: 'Design a premium 3D study pod for EIS and calculate material area and usable volume.',
    lessons: [
      {
        id: 'areas-2d',
        title: 'Areas of 2D Shapes',
        textbookSection: '9.1 Areas of 2D shapes',
        inquiry: 'How can shapes be decomposed into measurable parts?',
        objectives: ['Calculate area of rectangles, triangles and parallelograms.', 'Find area of compound shapes.', 'Choose appropriate units.'],
        explanation: '2D shapes split and rearrange into rectangles, making each area formula feel like a transformation.',
        animation: 'solid-builder',
        workedExample: {
          prompt: 'Find the area of a triangle with base 12 cm and height 7 cm.',
          steps: ['Use A = 1/2 x base x height.', 'A = 1/2 x 12 x 7 = 42.'],
          answer: '42 cm^2',
        },
        exercises: {
          fluency: fluency('Find area of a parallelogram with base 9 m and height 4 m.', 'Find area of a rectangle 8 cm by 13 cm.', 'Find area of a triangle base 10 cm height 6 cm.'),
          reasoning: reasoning('Why must triangle height be perpendicular?', 'Explain how to find compound area by splitting.'),
          extension: 'Create a compound floor-plan area problem for an EIS classroom.',
        },
      },
      {
        id: '3d-shapes-surface-area',
        title: '3D Shapes and Surface Area',
        textbookSection: '9.2-9.3 3D shapes and surface area',
        inquiry: 'How does a 3D object unfold into measurable faces?',
        objectives: ['Identify prisms and nets.', 'Calculate surface area.', 'Connect nets to 3D solids.'],
        explanation: 'A prism unfolds into a net, and each face lights up as it is added to the total surface area.',
        animation: 'solid-builder',
        workedExample: {
          prompt: 'Find surface area of a cuboid 8 cm by 5 cm by 3 cm.',
          steps: ['Use 2(lw + lh + wh).', '2(40 + 24 + 15) = 158.'],
          answer: '158 cm^2',
        },
        exercises: {
          fluency: fluency('Find surface area of a cube with side 6 cm.', 'Sketch a net for a triangular prism.', 'Find surface area of a cuboid 4 x 7 x 9.'),
          reasoning: reasoning('Why are there pairs of equal faces on a cuboid?', 'How can a net help avoid missing faces?'),
          extension: 'Design packaging for a learning device and minimise surface area.',
        },
      },
      {
        id: 'volume-capacity',
        title: 'Volume, Area Units and Capacity',
        textbookSection: '9.4 Units of area, volume and capacity',
        inquiry: 'How do units change when measuring length, area and volume?',
        objectives: ['Calculate volume of cuboids and prisms.', 'Convert area and volume units.', 'Connect volume and capacity.'],
        explanation: 'Unit cubes fill solids layer by layer while unit labels transform from cm to cm^2 to cm^3.',
        animation: 'solid-builder',
        workedExample: {
          prompt: 'Find the volume of a cuboid 6 cm by 4 cm by 5 cm.',
          steps: ['Use V = length x width x height.', '6 x 4 x 5 = 120.'],
          answer: '120 cm^3',
        },
        exercises: {
          fluency: fluency('Find volume of a 10 cm by 3 cm by 2 cm prism.', 'Convert 2 litres to cm^3.', 'Convert 1 m^2 to cm^2.'),
          reasoning: reasoning('Why is 1 m^2 not equal to 100 cm^2?', 'Explain the relationship between 1 litre and 1000 cm^3.'),
          extension: 'Estimate the capacity of a school water bottle and compare with calculated dimensions.',
        },
      },
    ],
  },
  {
    id: 'ch10-statistics',
    chapter: 'Chapter 10',
    title: 'Statistics',
    textbookStart: 'Page 333',
    globalContext: 'Fairness and development',
    statementOfInquiry: 'Data collection and analysis shape conclusions, comparisons and decisions.',
    project: 'Run a survey about student study habits and produce a fair statistical report.',
    lessons: [
      {
        id: 'collecting-data',
        title: 'Surveys, Questionnaires and Sampling',
        textbookSection: '10.1 Collecting data',
        inquiry: 'How does data quality affect conclusions?',
        objectives: ['Design unbiased survey questions.', 'Choose suitable sampling methods.', 'Identify sources of bias.'],
        explanation: 'A data pipeline animation filters raw responses through sample choice, question wording and quality checks.',
        animation: 'data-lab',
        workedExample: {
          prompt: 'Improve this question: “Do you agree that our amazing lunch is delicious?”',
          steps: ['Remove leading language.', 'Ask one clear thing.', 'Offer balanced responses.'],
          answer: 'How would you rate the school lunch? Excellent / Good / Fair / Poor',
        },
        exercises: {
          fluency: fluency('Write one unbiased survey question.', 'Name one sampling method.', 'Identify bias in a loaded question.'),
          reasoning: reasoning('Why might surveying only your friends be biased?', 'Explain when a sample is better than a census.'),
          extension: 'Design a five-question EIS student wellbeing survey with a sampling plan.',
        },
      },
      {
        id: 'averages-frequency',
        title: 'Averages and Frequency Tables',
        textbookSection: '10.2.1-10.2.2 Measures of central tendency',
        inquiry: 'How can one number summarise a whole data set?',
        objectives: ['Calculate mean, median and mode.', 'Use frequency tables.', 'Choose suitable averages.'],
        explanation: 'Data points stack into bars, then animate into mean balance, median centre and mode frequency highlights.',
        animation: 'data-lab',
        workedExample: {
          prompt: 'Find the mean of 4, 8, 8, 10, 15.',
          steps: ['Add values: 45.', 'Divide by 5 values.'],
          answer: '9',
        },
        exercises: {
          fluency: fluency('Find median of 3, 9, 10, 12, 20.', 'Find mode of 2, 5, 5, 8, 9.', 'Find mean of 6, 7, 11.'),
          reasoning: reasoning('When might median be better than mean?', 'Explain how a frequency table reduces repeated work.'),
          extension: 'Collect ten reaction times from a game and compare mean and median.',
        },
      },
      {
        id: 'compare-distributions',
        title: 'Comparing Distributions with Centre and Spread',
        textbookSection: '10.2.3-10.2.4 Comparing distributions',
        inquiry: 'How do centre and spread tell different stories about data?',
        objectives: ['Compare distributions using averages.', 'Use range as a measure of spread.', 'Write data-based conclusions.'],
        explanation: 'Two animated dot plots compress and spread, making centre and variability visible before interpretation.',
        animation: 'data-lab',
        workedExample: {
          prompt: 'Class A mean is 72 and range is 8. Class B mean is 72 and range is 26. Compare.',
          steps: ['Means are equal, so centre is similar.', 'Class B has larger range.', 'Class A scores are more consistent.'],
          answer: 'Same average, but Class A is more consistent.',
        },
        exercises: {
          fluency: fluency('Find range of 11, 14, 18, 22.', 'Compare medians 12 and 17.', 'Write one sentence comparing two means.'),
          reasoning: reasoning('Why is spread important when averages are equal?', 'What conclusion is unsafe without knowing sample size?'),
          extension: 'Compare two NeuroQuest score groups using average and range.',
        },
      },
    ],
  },
  {
    id: 'ch11-probability',
    chapter: 'Chapter 11',
    title: 'Probability',
    textbookStart: 'Page 369',
    globalContext: 'Scientific and technical innovation',
    statementOfInquiry: 'Probability models uncertainty and helps us evaluate predictions using evidence.',
    project: 'Design and test a fair learning-game reward spinner, then compare theoretical and experimental probability.',
    lessons: [
      {
        id: 'probability-basics',
        title: 'Language of Probability and Experiments',
        textbookSection: '11.1 The basics of probability',
        inquiry: 'How can uncertainty be described mathematically?',
        objectives: ['Use probability language.', 'Calculate simple probabilities.', 'Represent probabilities from 0 to 1.'],
        explanation: 'A probability scale lights up from impossible to certain while spinners and dice show equally likely outcomes.',
        animation: 'probability-spinner',
        workedExample: {
          prompt: 'Find P(rolling an even number on a fair die).',
          steps: ['Even outcomes: 2, 4, 6.', 'Total outcomes: 6.', 'Probability = 3/6 = 1/2.'],
          answer: '1/2',
        },
        exercises: {
          fluency: fluency('Find P(rolling a 5).', 'Place “unlikely” on a probability scale.', 'Find P(vowel) from letters A, B, C, D, E.'),
          reasoning: reasoning('Why must probabilities be between 0 and 1?', 'Explain equally likely outcomes.'),
          extension: 'Create a probability scale with five school-event examples.',
        },
      },
      {
        id: 'complementary-events',
        title: 'Complementary Events',
        textbookSection: '11.2.1 Complementary events',
        inquiry: 'How can the chance of “not happening” help us solve faster?',
        objectives: ['Identify complements.', 'Use P(not A) = 1 - P(A).', 'Solve probability problems using complements.'],
        explanation: 'A spinner section flips into its complement, showing that the full probability space totals 1.',
        animation: 'probability-spinner',
        workedExample: {
          prompt: 'If P(rain) = 0.35, find P(no rain).',
          steps: ['Rain and no rain are complements.', '1 - 0.35 = 0.65.'],
          answer: '0.65',
        },
        exercises: {
          fluency: fluency('If P(win)=0.2, find P(not win).', 'If P(late)=1/8, find P(not late).', 'A bag has 3 red and 7 blue. Find P(not red).'),
          reasoning: reasoning('When is using a complement easier?', 'Explain why an event and its complement total 1.'),
          extension: 'Write three school examples where the complement is easier to calculate.',
        },
      },
      {
        id: 'experimental-probability',
        title: 'Experimental Probability and Modelling from Data',
        textbookSection: '11.2.2-11.2.3 Experimental probability',
        inquiry: 'How does real data test a probability model?',
        objectives: ['Calculate experimental probability.', 'Compare experimental and theoretical probability.', 'Use data to model future outcomes.'],
        explanation: 'A simulated experiment runs many trials, and the experimental bar gradually stabilises near the theoretical value.',
        animation: 'probability-spinner',
        workedExample: {
          prompt: 'A spinner lands on blue 18 times in 60 spins. Estimate P(blue).',
          steps: ['Use experimental probability = frequency / trials.', '18 / 60 = 0.3.'],
          answer: '0.3',
        },
        exercises: {
          fluency: fluency('A coin lands heads 27 times in 50 flips. Estimate P(heads).', 'A die rolls 6 ten times in 80 rolls. Estimate P(6).', 'Predict blue outcomes in 200 spins if P(blue)=0.3.'),
          reasoning: reasoning('Why do experimental results vary?', 'Why do more trials usually improve the estimate?'),
          extension: 'Run a 50-trial classroom probability experiment and compare with theory.',
        },
      },
    ],
  },
];

export const allEISCourseLessons = eisMypMathCourse.flatMap((chapter) =>
  chapter.lessons.map((lesson) => ({ ...lesson, chapterId: chapter.id, chapterTitle: chapter.title }))
);
