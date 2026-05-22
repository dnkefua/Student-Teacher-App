import { Example, PracticeQuestion } from '../types';

export const unit4Examples: Example[] = [
  {
    id: "u4-ex1",
    title: "4.1: Finding the Mean (Average)",
    problem: "A student's scores on 5 math quizzes are 85, 90, 75, 95, and 80. Find the mean score.",
    context: "Finding the Mean (Average) to represent typical central tendency.",
    method1Steps: [
      "Add all the values together.\\n85 + 90 + 75 + 95 + 80 = 425",
      "Divide the sum by the number of values (5).\\nMean = 425 / 5",
      "Calculate the result.\\nMean = 85"
    ],
    method2Name: "Balance Method",
    method2Steps: [
      "Estimate a central value, e.g., 85.",
      "Calculate deviations: 0, +5, -10, +10, -5",
      "Sum of deviations = 0.",
      "Since deviations balance nicely to 0, 85 is the exact mean."
    ]
  },
  {
    id: "u4-ex2",
    title: "4.1: Finding the Median",
    problem: "Find the median of the following daily temperatures in Dubai: 38, 41, 39, 45, 40, 42, 39.",
    context: "Finding the Median, which is less sensitive to outliers.",
    method1Steps: [
      "Order the data from lowest to highest.\\n38, 39, 39, 40, 41, 42, 45",
      "Count to find the exact middle value.",
      "The 4th number is the middle. The median is 40°C."
    ],
    method2Name: "Cross-Off Method",
    method2Steps: [
      "Order the data.\\n38, 39, 39, 40, 41, 42, 45",
      "Cross off lowest and highest pairs successively.",
      "38 and 45 -> 39 and 42 -> 39 and 41.",
      "40 remains as the median."
    ]
  },
  {
    id: "u4-ex3",
    title: "4.1: Identifying Outliers & Range",
    problem: "A runner's 5km times (in minutes) are: 22, 24, 23, 22, 45, 25. Find the range and identify any outliers.",
    context: "Calculating the Range and Identifying Outliers.",
    method1Steps: [
      "Order the data: 22, 22, 23, 24, 25, 45.",
      "Range = Maximum - Minimum.\\nRange = 45 - 22 = 23 minutes.",
      "Identify the outlier.\\nThe time of 45 minutes is significantly separated. 45 is the outlier."
    ],
    method2Name: "Visual Scatter",
    method2Steps: [
      "Graph the points on a number line.",
      "Observe the cluster between 22 and 25.",
      "Observe 45 far to the right, marking it as an outlier."
    ]
  },
  {
    id: "u4-ex4",
    title: "4.1: Finding the Mode",
    problem: "In a class survey, students chose their favorite sport: Football, Cricket, Basketball, Football, Tennis, Football, Cricket. What is the mode?",
    context: "The mode is the value that appears most often in a categorical or numerical dataset.",
    method1Steps: [
      "List the frequency of each category.",
      "Football: 3, Cricket: 2, Basketball: 1, Tennis: 1.",
      "Identify the highest frequency.",
      "Mode = Football."
    ],
    method2Name: "Tally Chart",
    method2Steps: [
      "Draw a table with each sport.",
      "Make a tally mark each time the sport appears.",
      "The sport with the tallest tally column is the mode (Football)."
    ]
  },
  {
    id: "u4-ex5",
    title: "4.1: Mean from a Frequency Table",
    problem: "A survey of pets per household shows: 0 pets (4 homes), 1 pet (5 homes), 2 pets (1 home). Find the mean number of pets.",
    context: "Calculating the mean when data is grouped into a frequency table.",
    method1Steps: [
      "Multiply each value by its frequency.\\n(0×4)=0, (1×5)=5, (2×1)=2.",
      "Sum the total values: \\n0 + 5 + 2 = 7 total pets.",
      "Sum the total frequency: \\n4 + 5 + 1 = 10 homes.",
      "Divide total value by total frequency. \\n7 / 10 = 0.7 pets per household."
    ]
  },
  {
    id: "u4-ex6",
    title: "4.2: Theoretical Probability",
    problem: "What is the probability of rolling a number greater than 4 on a standard six-sided die?",
    context: "Theoretical Probability.",
    method1Steps: [
      "Identify total possible outcomes: 6 (1, 2, 3, 4, 5, 6).",
      "Identify successful outcomes: 2 (rolling a 5 or a 6).",
      "Write probability as a fraction.\\nP(>4) = 2/6",
      "Simplify to 1/3."
    ],
    method2Name: "Percentage Conversion",
    method2Steps: [
      "Find probability fraction: 2/6.",
      "Convert to decimal: 0.333...",
      "Result is 33.3%."
    ]
  },
  {
    id: "u4-ex7",
    title: "4.2: Independent Events (Coin & Die)",
    problem: "You flip a coin and roll a six-sided die. What is the probability of getting \"Tails\" AND a \"3\"?",
    context: "Independent Events.",
    method1Steps: [
      "Find probability of Tails:\\nP(Tails) = 1/2.",
      "Find probability of rolling 3:\\nP(3) = 1/6.",
      "Multiply independent probabilities together.\\n(1/2) × (1/6) = 1/12."
    ],
    method2Name: "Tree Diagram / Grid",
    method2Steps: [
      "Draw a grid with Coin (H, T) vs Die (1-6).",
      "Count total cells = 12.",
      "Count successful cell (T,3) = 1.",
      "Probability = 1/12."
    ]
  },
  {
    id: "u4-ex8",
    title: "4.2: Experimental Probability",
    problem: "A factory produces 500 lightbulbs and finds that 15 are defective. What is the experimental probability that the next lightbulb produced will be defective?",
    context: "Experimental probability relies on actual trials or historical data.",
    method1Steps: [
      "Identify the number of successful events (defective bulbs) = 15.",
      "Identify the total number of trials (total bulbs) = 500.",
      "Write as a fraction: \\nP(defective) = 15 / 500.",
      "Simplify the fraction: \\n3 / 100 or 3%."
    ]
  },
  {
    id: "u4-ex9",
    title: "4.2: Mutually Exclusive Events",
    problem: "You have a bag of 10 marbles: 5 red, 3 blue, and 2 green. What is the probability of picking a marble that is EITHER red OR green?",
    context: "Mutually exclusive events cannot happen at the same time. We add their probabilities.",
    method1Steps: [
      "Find P(Red) = 5/10.",
      "Find P(Green) = 2/10.",
      "Since a marble cannot be both red and green, add the probabilities.",
      "P(Red or Green) = 5/10 + 2/10 = 7/10."
    ]
  },
  {
    id: "u4-ex10",
    title: "4.2: Sample Spaces",
    problem: "List the sample space for flipping two coins. What is the probability of getting exactly one Head?",
    context: "Systematically listing the sample space helps visualize all possible combinations.",
    method1Steps: [
      "List all distinct outcomes pairs: \\n(H, H), (H, T), (T, H), (T, T).",
      "Count the total outcomes: \\nTotal = 4.",
      "Count the outcomes with exactly one Head: \\n(H, T) and (T, H) = 2 outcomes.",
      "Write probability as a fraction: \\n2/4 = 1/2."
    ]
  }
];

export const unit4Practice: PracticeQuestion[] = [
  {
    id: 1,
    question: "Calculate the mean of the dataset: 12, 18, 20, 14, 16.",
    answerFullWorking: "Sum = 12 + 18 + 20 + 14 + 16 = 80\nCount = 5\nMean = 80 / 5 = 16",
    type: 'free-text',
    interactiveAnswer: '16'
  },
  {
    id: 2,
    question: "Find the median of the dataset: 5, 1, 9, 3, 7, 2.",
    answerFullWorking: "Ordered: 1, 2, 3, 5, 7, 9\nMiddle numbers: 3 & 5\nMedian = (3 + 5) / 2 = 4",
    type: 'multiple-choice',
    interactiveOptions: ['3', '4', '4.5', '5'],
    interactiveAnswer: '4'
  },
  {
    id: 3,
    question: "Find the mode of the dataset: 7, 8, 8, 9, 10, 10, 10, 12.",
    answerFullWorking: "The number 10 appears 3 times. Mode = 10",
    type: 'free-text',
    interactiveAnswer: '10'
  },
  {
    id: 4,
    question: "A batsman has a mean score of 40 runs across 4 matches. First 3 scores: 30, 50, 20. 4th score?",
    answerFullWorking: "Total needed = 40 × 4 = 160\nTotal so far = 30 + 50 + 20 = 100\n4th score = 160 - 100 = 60 runs",
    type: 'multiple-choice',
    interactiveOptions: ['30', '40', '50', '60'],
    interactiveAnswer: '60'
  },
  {
    id: 5,
    question: "Identify the outlier in rents (thousands): 80, 85, 82, 90, 88, 250, 81.",
    answerFullWorking: "Ordered = 80, 81, 82, 85, 88, 90, 250. 250 is extremely detached. Outlier = 250",
    type: 'free-text',
    interactiveAnswer: '250'
  },
  {
    id: 6,
    question: "Find the median of: 4, 6, 8, 10.",
    answerFullWorking: "Mean of 6 and 8 = (6 + 8) / 2 = 7",
    type: 'free-text',
    interactiveAnswer: '7'
  },
  {
    id: 7,
    question: "What is the probability of picking a Red card from a 52-card deck?",
    answerFullWorking: "Red cards = 26. P(Red) = 26/52 = 1/2 or 50%",
    type: 'multiple-choice',
    interactiveOptions: ['1/4', '1/3', '1/2', '1/13'],
    interactiveAnswer: '1/2'
  },
  {
    id: 8,
    question: "A bag has 3 blue, 4 red, 3 green marbles. Probability of picking blue?",
    answerFullWorking: "Total = 10. Blue = 3. P(Blue) = 3/10 or 30%",
    type: 'multiple-choice',
    interactiveOptions: ['3/10', '4/10', '1/3', '3/7'],
    interactiveAnswer: '3/10'
  },
  {
    id: 9,
    question: "Probability of flipping \"Heads\" three times in a row?",
    answerFullWorking: "P = 1/2 × 1/2 × 1/2 = 1/8",
    type: 'multiple-choice',
    interactiveOptions: ['1/2', '1/4', '1/6', '1/8'],
    interactiveAnswer: '1/8'
  },
  {
    id: 10,
    question: "What type of correlation would you expect between \"Age of a car\" and \"Value of the car\"?",
    answerFullWorking: "As age increases, value decreases. Negative correlation.",
    type: 'multiple-choice',
    interactiveOptions: ['Positive correlation', 'Negative correlation', 'No correlation', 'Perfect correlation'],
    interactiveAnswer: 'Negative correlation'
  }
];

export const unit4Assessment: any = {
  criteriaA: [
    {
      id: "u4-ca1",
      question: "Calculate the mean, median, and mode for this dataset: 2, 4, 4, 6, 8, 12.",
      solution: "Mean = 36/6 = 6. Median = (4+6)/2 = 5. Mode = 4."
    },
    {
      id: "u4-ca2",
      question: "Calculate the probability of rolling a prime number (2, 3, or 5) on a standard 6-sided die.",
      solution: "P(Prime) = 3/6 = 1/2"
    }
  ],
  criteriaB: [
    {
      id: "u4-cb1",
      question: "Investigation: Roll two six-sided dice and add the scores together. List combinations that make 7 vs 12. Why is 7 more common?",
      solution: "Sum 7: (1,6)(6,1)(2,5)(5,2)(3,4)(4,3). Sum 12: (6,6). 7 is more common as there are more ways (6) vs (1)."
    }
  ],
  criteriaC: [
    {
      id: "u4-cc1",
      question: "Create a frequency table for the data: 0, 1, 1, 2, 0, 3, 1, 2, 4, 1, 0, 2, 1 representing siblings.",
      solution: "0: 3\n1: 5\n2: 3\n3: 1\n4: 1"
    }
  ],
  criteriaD: [
    {
      id: "u4-cd1",
      question: "The Dubai Metro Survey: You ask 20 people at Burjuman on a Monday morning to rate the Metro. Wait times: 2, 4, 3, 15, 2, 3.",
      solution: "1. Bias: 1 station, 1 time.\n2. Method: Stratified random.\n3. Mean w/ outlier: 4.83. Mean w/o outlier: 2.8. Without represents typical better."
    }
  ]
};
