import { Example, PracticeQuestion } from '../types';

export const unit2Examples: Example[] = [
  // 2.1 Examples
  {
    id: 'u2-ex1',
    title: '2.1: Creating a Function from a Scenario',
    problem: 'A standard Dubai Taxi has a flag-fall (starting) fare of 12 AED and charges 2.50 AED for every kilometer traveled. Write a function representing the total cost (y) for a journey of x kilometers.',
    context: 'Translating real-world scenarios into algebraic equations allows us to quickly predict outcomes and model reality.',
    method1Steps: [
      '**Step 1:** Identify the constant (y-intercept/starting value).\\n Constant = 12.',
      '**Step 2:** Identify the rate of change (gradient/slope).\\n Rate = 2.50 per km.',
      '**Step 3:** Write the equation in the form y = mx + c.\\n y = 2.50x + 12'
    ],
    method2Name: 'Using a Table to Find Pattern',
    method2Steps: [
      '**Step 1:** Dist = 0km, Cost = 12 AED.\\nDist = 1km, Cost = 12 + 2.50 = 14.50 AED.',
      '**Step 2:** Notice the cost increases by 2.50 for each 1km.',
      '**Step 3:** The base is 12, so y = 12 + 2.50x.'
    ]
  },
  {
    id: 'u2-ex2',
    title: '2.1: Generating a Table of Values',
    problem: 'Using the taxi function y = 2.50x + 12, create a table of values for distances of 0, 2, 4, and 6 kilometers.',
    context: 'A table of values helps visualize the relationship before graphing.',
    method1Steps: [
      '**Step 1:** Substitute x = 0:\\n y = 2.50(0) + 12 = 12.',
      '**Step 2:** Substitute x = 2:\\n y = 2.50(2) + 12 = 17.',
      '**Step 3:** Substitute x = 4:\\n y = 2.50(4) + 12 = 22.',
      '**Step 4:** Substitute x = 6:\\n y = 2.50(6) + 12 = 27.'
    ],
    method2Name: 'Constant Difference Method',
    method2Steps: [
      '**Step 1:** Calculate first value for x = 0 (y = 12).',
      '**Step 2:** The x values increase by 2 each time. Gradient is 2.50 per unit.',
      '**Step 3:** The y increase will be 2.50 * 2 = 5 for every step.\\n12 + 5 = 17\\n17 + 5 = 22\\n22 + 5 = 27.'
    ]
  },
  {
    id: 'u2-ex3',
    title: '2.1: Plotting Coordinates on a Cartesian Plane',
    problem: 'Plot the coordinate A(-3, 4) on a number plane.',
    context: 'Graphing allows us to visually see the relationship represented by our models.',
    interactiveUrl: 'https://phet.colorado.edu/sims/html/graphing-lines/latest/graphing-lines_en.html',
    method1Steps: [
      '**Step 1:** Start at the origin (0,0).',
      '**Step 2:** The x-coordinate is -3.\\n Move 3 units to the left along the x-axis.',
      '**Step 3:** The y-coordinate is 4.\\n Move 4 units up parallel to the y-axis. Mark the point and label it A.'
    ],
    method2Name: 'Intersecting Grid Lines',
    method2Steps: [
      '**Step 1:** Identify the line x = -3 on the grid (vertical line).',
      '**Step 2:** Identify the line y = 4 on the grid (horizontal line).',
      '**Step 3:** Place a point exactly at the intersection of these two lines.'
    ]
  },
  {
    id: 'u2-ex4',
    title: '2.1: Calculating the Gradient (Slope)',
    problem: 'A car is traveling on Sheikh Zayed Road at a constant speed. The distance-time graph passes through the points (2 hours, 200 km) and (5 hours, 500 km). Calculate the gradient to find the speed.',
    context: 'The gradient of a distance-time graph represents speed (rate of change).',
    method1Steps: [
      '**Step 1:** Use the gradient formula:\\n m = (y2 - y1) / (x2 - x1)',
      '**Step 2:** Substitute the coordinates:\\n m = (500 - 200) / (5 - 2)',
      '**Step 3:** Solve:\\n m = 300 / 3 = 100.\\n The gradient is 100 (speed is 100 km/h).'
    ],
    method2Name: 'Rise over Run Graphically',
    method2Steps: [
      '**Step 1:** From (2, 200) to (5, 500), find the vertical rise:\\n 500 - 200 = 300 km.',
      '**Step 2:** Find the horizontal run:\\n 5 - 2 = 3 hours.',
      '**Step 3:** Gradient = Rise / Run\\n = 300 / 3 = 100 km/h.'
    ]
  },
  {
    id: 'u2-ex5',
    title: '2.1: Finding the y-intercept from a Graph',
    problem: 'Look at a graph of a function. The straight line crosses the vertical y-axis at the coordinate (0, -5). What is the y-intercept (c) for the equation y = mx + c?',
    context: 'The y-intercept represents the starting value or initial condition of a function (when x = 0).',
    method1Steps: [
      '**Step 1:** Identify the point where the line intersects the y-axis.\\n Point = (0, -5)',
      '**Step 2:** Extract the y-value of that coordinate.\\n y-value = -5',
      '**Step 3:** The y-intercept c = -5.'
    ],
    method2Name: 'Algebraic Substitution',
    method2Steps: [
      '**Step 1:** We know the line passes through (0, -5).',
      '**Step 2:** Substitute x = 0 and y = -5 into y = mx + c.',
      '**Step 3:** -5 = m(0) + c -> -5 = c.'
    ]
  },
  // 2.2 Examples
  {
    id: 'u2-ex6',
    title: '2.2: Algorithmic Flowcharts (Salik Tolls)',
    problem: 'An algorithm dictates: Input starting balance B. IF passing a Salik gate, subtract 4 AED. IF balance < 0, output "Recharge". ELSE output new balance. If a driver starts with 15 AED and passes 4 gates, what is the output?',
    context: 'Algorithms are step-by-step instructions. We can trace them to see how systems behave under certain inputs.',
    method1Steps: [
      '**Step 1:** Calculate total deduction:\\n 4 gates * 4 AED = 16 AED.',
      '**Step 2:** Subtract from balance:\\n 15 - 16 = -1.',
      '**Step 3:** Evaluate the IF condition:\\n Is -1 < 0? Yes.',
      '**Step 4:** Output is "Recharge".'
    ],
    method2Name: 'Iterative Tracing',
    method2Steps: [
      '**Step 1:** Gate 1: 15 - 4 = 11. (11 >= 0)',
      '**Step 2:** Gate 2: 11 - 4 = 7. (7 >= 0)',
      '**Step 3:** Gate 3: 7 - 4 = 3. (3 >= 0)',
      '**Step 4:** Gate 4: 3 - 4 = -1. (-1 < 0) -> "Recharge".'
    ]
  },
  {
    id: 'u2-ex7',
    title: '2.2: Transformations of Functions (Translating the Y-intercept)',
    problem: 'The base fare for a Dubai Taxi increases from 12 AED to 15 AED, but the per-km rate stays at 2.50 AED. How does the graph of y = 2.50x + 12 change to become y = 2.50x + 15?',
    context: 'Changing the constant (c) shifts the entire graph vertically without changing its slope.',
    method1Steps: [
      '**Step 1:** Compare the slopes (2.50).\\n They are identical, meaning the lines are parallel.',
      '**Step 2:** Compare the y-intercepts (12 vs 15).',
      '**Step 3:** Describe the transformation:\\n The graph is translated (shifted) vertically upwards by 3 units.'
    ],
    method2Name: 'Evaluating Specific Points',
    method2Steps: [
      '**Step 1:** At x = 0, old y was 12.\\n New y is 15 (Up 3).',
      '**Step 2:** At x = 2, old y was 17.\\n New y is 2.50(2)+15 = 20 (Up 3).',
      '**Step 3:** Since every point moves up 3 units, it is a vertical translation +3.'
    ]
  },
  {
    id: 'u2-ex8',
    title: '2.2: Transformations of Functions (Changing the Gradient)',
    problem: 'You switch to a premium "Hala Max" taxi where the base fare is still 12 AED, but it costs 3.50 AED per km. How does the graph of y = 3.50x + 12 compare to the original y = 2.50x + 12?',
    context: 'Changing the rate of change affects how steep the graph is.',
    method1Steps: [
      '**Step 1:** The y-intercepts are the same.\\n Both lines start at the same point on the y-axis (0, 12).',
      '**Step 2:** The gradient has increased from 2.50 to 3.50.',
      '**Step 3:** Describe the transformation:\\n The graph becomes steeper.'
    ],
    method2Name: 'Graphical Rotation',
    method2Steps: [
      '**Step 1:** Identify the pivot point.\\n Since they share (0,12), the graph pivots around the y-intercept.',
      '**Step 2:** The new line rises faster for each unit of x.',
      '**Step 3:** The line has rotated anti-clockwise (steeper positive slope) around (0,12).'
    ]
  },
  {
    id: 'u2-ex9',
    title: '2.2: Comparing Two Models (Break-even Point)',
    problem: 'Mobile Plan A costs 50 AED/month plus 10 AED per GB of data (y = 10x + 50). Plan B costs 100 AED/month but offers unlimited data (y = 100). At how many GB (x) are the plans equal in cost?',
    context: 'Finding the intersection of two functions tells us when the systems produce the exact same outcome.',
    method1Steps: [
      '**Step 1:** Set the two equations equal to each other.\\n 10x + 50 = 100',
      '**Step 2:** Solve for x.\\n 10x = 50\\n x = 5',
      '**Step 3:** The plans cost the same when you use exactly 5 GB of data.'
    ],
    method2Name: 'Logical Deduction',
    method2Steps: [
      '**Step 1:** Plan B costs 50 AED more as a base cost (100 - 50 = 50).',
      '**Step 2:** Plan A charges 10 AED per GB.',
      '**Step 3:** To make up the 50 AED difference, you need 50 / 10 = 5 GB.'
    ]
  },
  {
    id: 'u2-ex10',
    title: '2.2: Limitations of Models',
    problem: 'You model a 100km drive from Dubai to Abu Dhabi using the equation y = 120x (where y is distance and x is time in hours at 120km/h). According to the model, it takes 0.83 hours. What is a limitation of this model?',
    context: 'Mathematical models are simplifications of reality. We must understand where they break down.',
    method1Steps: [
      '**Step 1:** Analyze the assumptions of the formula.\\n It assumes a constant speed of 120km/h for the entire journey.',
      '**Step 2:** Apply real-world context.\\n Cars must accelerate, decelerate, stop at traffic lights, and navigate traffic.',
      '**Step 3:** State the limitation:\\n The model does not account for traffic, speed limits in residential areas, or starting/stopping, making the actual journey time longer than the theoretical model.'
    ],
    method2Name: 'Graphing the Reality',
    method2Steps: [
      '**Step 1:** Plot the theoretical model: a perfect straight line.',
      '**Step 2:** Plot the reality: horizontal segments for stopping, curved for accelerating.',
      '**Step 3:** Compare: The real graph would be wavy and sit below the theoretical straight line, showing the model is overly optimistic.'
    ]
  }
];

export const unit2Practice: PracticeQuestion[] = [
  {
    id: 1,
    question: '2.1: A gym in Jumeirah charges a 200 AED joining fee and 350 AED per month (x). Write the function for the total cost (y).',
    hint: 'Joining fee is the y-intercept. Monthly fee is the slope.',
    answerFullWorking: 'y = mx + c\\nm = 350 (rate of change)\\nc = 200 (starting value)\\n\\ny = 350x + 200',
    type: 'free-text',
    interactiveAnswer: 'y=350x+200'
  },
  {
    id: 2,
    question: '2.1: Given the function y = 3x - 4, calculate y when x = 3.',
    hint: 'Substitute x=3 into the equation.',
    answerFullWorking: 'y = 3(3) - 4\\ny = 5',
    type: 'multiple-choice',
    interactiveOptions: ['-1', '2', '5', '8'],
    interactiveAnswer: '5'
  },
  {
    id: 3,
    question: '2.1: Identify the quadrant (I, II, III, or IV) where the point (-5, -7) is located.',
    hint: 'Both x and y are negative.',
    answerFullWorking: 'x is negative (left)\\ny is negative (down)\\n\\nPoint is in Quadrant III.',
    type: 'multiple-choice',
    interactiveOptions: ['I', 'II', 'III', 'IV'],
    interactiveAnswer: 'III'
  },
  {
    id: 4,
    question: '2.1: Find the gradient of the line passing through (1, 4) and (3, 12).',
    hint: 'Use the formula m = (y2 - y1) / (x2 - x1).',
    answerFullWorking: 'm = (y2 - y1) / (x2 - x1)\\nm = (12 - 4) / (3 - 1)\\nm = 8 / 2\\nm = 4',
    type: 'free-text',
    interactiveAnswer: '4'
  },
  {
    id: 5,
    question: '2.1: Find the gradient of the line passing through (-2, 5) and (4, -7).',
    hint: 'Watch out for double negatives when subtracting!',
    answerFullWorking: 'm = (y2 - y1) / (x2 - x1)\\nm = (-7 - 5) / (4 - (-2))\\nm = -12 / 6\\nm = -2',
    type: 'free-text',
    interactiveAnswer: '-2'
  },
  {
    id: 6,
    question: '2.1: The equation y = -50x + 1000 models the amount of water left in a tank after x minutes. What does the 1000 represent?',
    hint: 'What happens when x = 0 (before time starts passing)?',
    answerFullWorking: 'When x = 0, y = 1000.\\nThis is the y-intercept.\\n\\nIt represents the initial amount of water in the tank before it started draining.'
  },
  {
    id: 7,
    question: '2.1: If y = -2x + 10, find y when x = 5.5.',
    hint: 'Substitute 5.5 for x.',
    answerFullWorking: 'y = -2(5.5) + 10\\ny = -11 + 10\\ny = -1'
  },
  {
    id: 8,
    question: '2.1: If y = 4x + 2, find the value of x when y = 22.',
    hint: 'Substitute 22 for y and solve the equation backwards.',
    answerFullWorking: '22 = 4x + 2\\n22 - 2 = 4x\\n20 = 4x\\nx = 5'
  },
  {
    id: 9,
    question: '2.1: Line A is y = 4x + 1. Line B is y = 0.5x + 10. Which is steeper?',
    hint: 'The steepness is determined by the gradient (m).',
    answerFullWorking: 'Gradient of A = 4\\nGradient of B = 0.5\\n\\n4 is greater than 0.5.\\nLine A is steeper.'
  },
  {
    id: 10,
    question: '2.2: An algorithm takes an input number (x), multiplies it by 3, and then subtracts 5. Write this as an algebraic function y = ...',
    hint: 'Follow the operations in order.',
    answerFullWorking: 'Input: x\\nMultiply by 3: 3x\\nSubtract 5: 3x - 5\\n\\nEquation: y = 3x - 5',
    type: 'free-text',
    interactiveAnswer: 'y=3x-5'
  },
  {
    id: 11,
    question: '2.2: A function y = 4x is translated down by 7 units. What is the new equation?',
    hint: 'Subtract 7 from the constant at the end of the equation.',
    answerFullWorking: 'Original: y = 4x\\nTranslation down 7:\\n\\nNew Equation: y = 4x - 7',
    type: 'free-text',
    interactiveAnswer: 'y=4x-7'
  },
  {
    id: 12,
    question: '2.2: Which function represents a faster rate of water filling a pool: y = 50x + 10 or y = 40x + 100? Explain.',
    hint: 'Look for the largest positive rate of change (m).',
    answerFullWorking: 'Compare gradients (slopes):\\nFunction 1: rate = 50\\nFunction 2: rate = 40\\n\\ny = 50x + 10 represents a faster rate because its gradient is larger, meaning it fills more water per unit of time.',
    type: 'multiple-choice',
    interactiveOptions: ['y = 40x + 100', 'y = 50x + 10', 'Both are the same', 'Cannot determine'],
    interactiveAnswer: 'y = 50x + 10'
  },
  {
    id: 13,
    question: '2.2: Solve to find where the lines y = 2x + 10 and y = 4x + 2 intersect.',
    hint: 'Set 2x + 10 equal to 4x + 2 and solve.',
    answerFullWorking: '2x + 10 = 4x + 2\\n10 - 2 = 4x - 2x\\n8 = 2x\\nx = 4\\n\\nFind y:\\ny = 2(4) + 10 = 18\\n\\nIntersection: (4, 18)',
    type: 'free-text',
    interactiveAnswer: '(4, 18)'
  },
  {
    id: 14,
    question: '2.2: Gym A charges 100 AED/month. Gym B charges 400 AED upfront for the year. After how many months is Gym B cheaper?',
    hint: 'Write equations: Gym A is y = 100x. Gym B is y = 400. Find when they are equal.',
    answerFullWorking: 'Gym A: y = 100x\\nGym B: y = 400\\n\\n100x = 400\\nx = 4 months\\n\\nAt 4 months, they are equal.\\nAfter 4 months (e.g. month 5), Gym B is cheaper.',
    type: 'free-text',
    interactiveAnswer: '5'
  },
  {
    id: 15,
    question: '2.2: You model plant growth predicting a plant will grow 2cm every week forever. What is the limitation?',
    hint: 'Think biologically. Do plants grow forever?',
    answerFullWorking: 'Plants eventually reach maturity and stop growing.\\nA linear model stretching infinitely into the future does not account for a maximum height.'
  },
  {
    id: 16,
    question: '2.2: Flowchart Logic: If X > 85, print "A". IF X > 70, print "B". ELSE print "C". What will print if X = 75?',
    hint: 'Test the conditions one by one.',
    answerFullWorking: 'Is 75 > 85? No.\\nIs 75 > 70? Yes.\\n\\nOutput will print: "B"'
  },
  {
    id: 17,
    question: '2.2: Cost of buying x coffees is y = 20x. If the cafe adds a fixed 5 AED delivery fee, how does the graph change?',
    hint: 'The slope stays the same, but the starting position shifts.',
    answerFullWorking: 'New equation: y = 20x + 5\\n\\nThe graph will translate vertically upwards by 5 units.'
  },
  {
    id: 18,
    question: '2.2: Match the scenario to graph type: A) Car parked. B) Car steady speed. C) Car accelerating.',
    hint: 'Parked = distance not changing. Steady = straight line. Accelerating = curving.',
    answerFullWorking: 'A) Parked: Horizontal line (zero gradient)\\nB) Steady speed: Straight diagonal line (constant gradient)\\nC) Accelerating: Upward curve (increasing gradient)'
  }
];
