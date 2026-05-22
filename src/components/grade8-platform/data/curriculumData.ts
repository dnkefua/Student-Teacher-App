import { Example, PracticeQuestion } from '../types';

export const examplesData: Example[] = [
  {
    id: 'ex1',
    title: 'Calculating VAT (Value Added Tax)',
    problem: 'A new smartphone at the Dubai Mall costs 3500 AED before tax. Calculate the total cost including the 5% UAE VAT.',
    context: 'VAT (Value Added Tax) is a consumption tax placed on a product whenever value is added at each stage of the supply chain, from production to the point of sale. In the UAE, the standard VAT rate is 5% on goods and services. Understanding VAT is essential for budgeting and making informed purchasing decisions.',
    method1Steps: [
      '**Step 1:** Identify the components. Original Price = 3500 AED, VAT Rate = 5%.',
      '**Step 2:** Calculate the VAT amount by finding 5% of 3500. \\n VAT = (5 / 100) × 3500 = 0.05 × 3500 = 175 AED.',
      '**Step 3:** Add the VAT to the original price to find the total sum you have to pay. \\n Total = 3500 + 175 = 3675 AED.'
    ],
    method2Name: 'The Multiplier Method',
    method2Steps: [
      '**Step 1:** Understand that the final price is 100% of the original cost PLUS the 5% tax. So the final price is 105% of the original cost.',
      '**Step 2:** Convert 105% to a decimal multiplier by dividing by 100. \\n Multiplier = 105 / 100 = 1.05.',
      '**Step 3:** Multiply the original price by the multiplier to get the final total in one step. \\n Total = 3500 × 1.05 = 3675 AED.'
    ]
  },
  {
    id: 'ex2',
    title: 'Currency Conversion',
    problem: 'You are traveling to Oman for the weekend. You want to convert 850 AED to Omani Rials (OMR). If the exchange rate is 1 AED = 0.105 OMR, how much will you receive?',
    context: 'When traveling internationally, we use an exchange rate to figure out how much our home currency is worth in the destination currency. Markets fluctuate constantly, so exchange rates change daily. Currency conversion is a direct application of proportional reasoning.',
    method1Steps: [
      '**Step 1:** Set up the proportion directly from the given rate: \\n 1 AED = 0.105 OMR.',
      '**Step 2:** Multiply your total amount of AED by the exchange rate value. \\n 850 × 0.105 OMR/AED.',
      '**Step 3:** State the final answer clearly. \\n 850 × 0.105 = 89.25 OMR.'
    ],
    method2Name: 'Using a Ratio Table',
    method2Steps: [
      '**Step 1:** Set up a two-column table for AED and OMR.',
      '**Step 2:** Enter the known rate: AED = 1, OMR = 0.105.',
      '**Step 3:** In the AED column, to get from 1 to 850, we multiply by 850. To maintain proportionality, apply the same operation to the OMR column. \\n 0.105 × 850 = 89.25 OMR.'
    ]
  },
  {
    id: 'ex3',
    title: 'Calculating Discounts',
    problem: 'During the Dubai Shopping Festival, a jacket originally priced at 450 AED is on sale for 20% off. What is the sale price?',
    context: 'A discount is a reduction in the regular price of an item or service. Retailers use discounts to move inventory or attract customers. Calculating discounts confidently ensures you know exactly how much you are saving.',
    method1Steps: [
      '**Step 1:** Calculate the discount amount by finding 20% of the original price. \\n Discount = (20 / 100) × 450 = 90 AED.',
      '**Step 2:** Subtract the calculated discount from the original price to find the sale amount. \\n Sale Price = 450 - 90 = 360 AED.'
    ],
    method2Name: 'Paying Percentage (Remaining Value)',
    method2Steps: [
      '**Step 1:** If you are receiving 20% off, determine what percentage you are ACTUALLY paying. \\n 100% - 20% = 80%.',
      '**Step 2:** Convert 80% to a decimal multiplier. \\n 80 / 100 = 0.80.',
      '**Step 3:** Multiply the original price by the multiplier to find the sale price instantly. \\n 450 × 0.80 = 360 AED.'
    ]
  },
  {
    id: 'ex4',
    title: 'Sharing in a Ratio',
    problem: "Two business partners, Ahmed and Sarah, invest in a startup. They agree to split the first month's profit of 12,000 AED in a ratio of 3:5. How much does each partner receive?",
    context: 'Ratios allow us to compare relative quantities. In a business, splitting profits according to proportional investment (or agreed terms) rather than an even 50/50 split is extremely common.',
    method1Steps: [
      '**Step 1:** Find the total number of parts in the given ratio by adding them. \\n Total Parts = 3 + 5 = 8 parts.',
      '**Step 2:** Find the monetary value of one single part by dividing the total profit by the total number of parts. \\n One Part = 12000 / 8 = 1500 AED.',
      "**Step 3:** Multiply the value of one part by the number of parts each partner owns.\\n Ahmed's share: 3 × 1500 = 4500 AED. \\n Sarah's share: 5 × 1500 = 7500 AED."
    ],
    method2Name: 'Fractional Shares Approach',
    method2Steps: [
      '**Step 1:** Convert the ratio components into fractions of the whole total. Total parts = 8.\\n Ahmed gets 3/8 of the total. Sarah gets 5/8 of the total.',
      '**Step 2:** Multiply each fraction by the total profit.',
      '**Step 3:** Evaluate. \\n Ahmed = (3/8) × 12000 = 4500 AED. \\n Sarah = (5/8) × 12000 = 7500 AED.'
    ]
  },
  {
    id: 'ex5',
    title: 'Percentage Increase',
    problem: "A family's annual apartment rent in Jumeirah increased from 140,000 AED to 147,000 AED. What is the percentage increase?",
    context: 'Percentage increase or decrease (percent change) shows how a value has shifted relative to its original starting point. This is an essential skill to track economic metrics like inflation, rent hikes, or investment growth.',
    method1Steps: [
      '**Step 1:** Calculate the absolute increase in price (the difference). \\n 147000 - 140000 = 7000 AED.',
      '**Step 2:** Divide the increase difference by the ORIGINAL (starting) price. \\n 7000 / 140000 = 0.05.',
      '**Step 3:** Convert this decimal to a percentage by multiplying by 100. \\n 0.05 × 100 = 5% increase.'
    ],
    method2Name: 'Direct Multiplier Ratio',
    method2Steps: [
      '**Step 1:** Divide the NEW value by the ORIGINAL value. \\n 147000 / 140000 = 1.05.',
      '**Step 2:** Convert this decimal multiplier to a percentage. \\n 1.05 × 100 = 105%.',
      '**Step 3:** The original amount represents 100%. Therefore, subtract 100% from the result to find the pure increase. \\n 105% - 100% = 5% increase.'
    ]
  },
  // Subtopic 1.2: Algebraic Expressions and Linear Equations
  {
    id: 'ex6',
    title: 'Writing an Expression (The Nol Card)',
    problem: 'You start with 50 AED on your Dubai Metro Nol card. Every zone-one trip costs 3.50 AED. Write an algebraic expression for your remaining balance after x trips.',
    context: 'Using variables to model real-life situations bridges the gap between arithmetic and algebra.',
    method1Steps: [
      '**Step 1:** Identify the starting amount: 50.',
      '**Step 2:** Identify the rate of change: Subtracting 3.50 for every trip (x).',
      '**Step 3:** Combine to form the expression. \\n Balance = 50 - 3.50x'
    ]
  },
  {
    id: 'ex7',
    title: 'Simplifying Expressions (Collecting Like Terms)',
    problem: 'A local cafe receives a fruit delivery. Simplify the expression representing the inventory: 5a + 3b + 2a - b (where a is apples and b is bananas).',
    context: 'Simplifying expressions by grouping like terms makes algebra easier to manage.',
    method1Steps: [
      '**Step 1:** Group the "like terms" (terms with the same variable). \\n (5a + 2a) + (3b - b)',
      '**Step 2:** Perform the addition and subtraction for each group. \\n 7a + 2b'
    ]
  },
  {
    id: 'ex8',
    title: 'Solving a One-Step Equation',
    problem: 'The temperature in Dubai increased by 12°C from the morning to reach a high of 41°C in the afternoon. What was the morning temperature (t)?',
    context: 'Solving an equation involves finding the unknown value by performing inverse operations.',
    method1Steps: [
      '**Step 1:** Write the equation. \\n t + 12 = 41',
      '**Step 2:** Perform the inverse operation (subtract 12 from both sides). \\n t = 41 - 12',
      '**Step 3:** Solve. \\n t = 29°C'
    ]
  },
  {
    id: 'ex9',
    title: 'Solving a Two-Step Equation (Careem Ride)',
    problem: 'A Careem ride has a base fare of 12 AED, plus 3 AED for every kilometer (k). If your total fare from Jumeirah to Downtown was 45 AED, how many kilometers did you travel?',
    context: 'Two-step equations require isolating the variable term first, then solving for the variable.',
    method1Steps: [
      '**Step 1:** Write the equation. \\n 3k + 12 = 45',
      '**Step 2:** Isolate the variable term by subtracting 12 from both sides. \\n 3k = 45 - 12 \\n 3k = 33',
      '**Step 3:** Divide both sides by 3 to find k. \\n k = 11 km'
    ],
    method2Name: 'Working Backwards (Inverse Flowchart)',
    method2Steps: [
      '**Step 1:** Start with the final total fare: 45.',
      '**Step 2:** Reverse the fixed base fare by subtracting it: 45 - 12 = 33.',
      '**Step 3:** Reverse the per-kilometer multiplication by dividing: 33 / 3 = 11 km.'
    ]
  },
  {
    id: 'ex10',
    title: 'Expanding Brackets (Distributive Property)',
    problem: 'A rectangular swimming pool has a width of x meters and a length of (x + 5) meters. Expand the expression for the area if the width is multiplied by the length: x(x + 5).',
    context: 'The distributive property is used to expand brackets by multiplying the term outside by each term inside.',
    method1Steps: [
      '**Step 1:** Multiply the term outside the bracket by the first term inside. \\n x × x = x²',
      '**Step 2:** Multiply the term outside the bracket by the second term inside. \\n x × 5 = 5x',
      '**Step 3:** Combine the terms. \\n Area = x² + 5x'
    ]
  },
  // Subtopic 1.3: Number Sense, Estimation, and Accuracy
  {
    id: 'ex11',
    title: 'Rounding to Decimal Places',
    problem: 'The exchange rate from AED to Euros is calculated as 0.25164. Round this number to 2 decimal places.',
    context: 'Rounding to a specific number of decimal places determines precision.',
    method1Steps: [
      '**Step 1:** Identify the second decimal place (the hundredths digit): 0.25164.',
      '**Step 2:** Look at the digit immediately to the right (the 1).',
      '**Step 3:** Because 1 is less than 5, keep the 5 the same. \\n Answer = 0.25'
    ]
  },
  {
    id: 'ex12',
    title: 'Rounding to Significant Figures',
    problem: 'The population of the UAE is approximately 9,282,410. Round this number to 2 significant figures.',
    context: 'Significant figures help understand the magnitude and precision of large or small numbers.',
    method1Steps: [
      '**Step 1:** Identify the first two significant figures (the first two non-zero digits from the left): 9,282,410.',
      '**Step 2:** Look at the next digit to the right (the 8).',
      '**Step 3:** Because 8 is 5 or greater, round the 2 up to a 3. Replace the rest with zeros. \\n Answer = 9,300,000'
    ]
  },
  {
    id: 'ex13',
    title: 'Estimation',
    problem: 'Estimate the total cost of 4.8 kg of dates that cost 21.50 AED per kg by rounding each number to 1 significant figure.',
    context: 'Estimation provides a quick, approximate answer by rounding numbers before calculating.',
    method1Steps: [
      '**Step 1:** Round 4.8 to 1 sig fig → 5.',
      '**Step 2:** Round 21.50 to 1 sig fig → 20.',
      '**Step 3:** Multiply the rounded numbers. \\n 5 × 20 = 100 AED'
    ]
  },
  {
    id: 'ex14',
    title: 'Lowest Common Multiple (LCM)',
    problem: 'RTA Bus A leaves the station every 12 minutes. Bus B leaves every 15 minutes. If they both leave at 8:00 AM, how many minutes will pass before they leave at the same time again?',
    context: 'The LCM helps find synchronized cycles or repetitive events.',
    method1Steps: [
      '**Step 1:** List the multiples of 12: 12, 24, 36, 48, 60, 72...',
      '**Step 2:** List the multiples of 15: 15, 30, 45, 60, 75...',
      '**Step 3:** Identify the lowest number that appears in both lists. \\n LCM = 60 minutes (They will leave together again at 9:00 AM).'
    ],
    method2Name: 'Prime Factorization Method',
    method2Steps: [
      '**Step 1:** Find the prime factors of 12 (2 × 2 × 3) and 15 (3 × 5).',
      '**Step 2:** Identify the highest power of each prime factor present (2², 3¹, 5¹).',
      '**Step 3:** Multiply these highest powers together: 4 × 3 × 5 = 60 minutes.'
    ]
  },
  {
    id: 'ex15',
    title: 'Operations with Negative Numbers',
    problem: 'In January, the temperature at Jebel Jais dropped to -2°C overnight. By midday, it had risen by 15°C. What was the midday temperature?',
    context: 'Negative numbers are used to represent values below zero, such as temperature, debt, or depth.',
    method1Steps: [
      '**Step 1:** Set up the calculation: Start at -2 and add 15. \\n -2 + 15',
      '**Step 2:** Calculate the difference. (Think of it as 15 - 2). \\n Answer = 13°C'
    ]
  }
];

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 1,
    question: 'A meal at a restaurant costs 240 AED before tax. Calculate the final bill after adding the 5% VAT.',
    hint: 'Use the multiplier method: multiply by 1.05.',
    answerFullWorking: 'Method 1 (Multiplier):\\nFinal Bill = 240 × 1.05\\nFinal Bill = 252 AED\\n\\nMethod 2 (Standard):\\n5% of 240 = 12\\nTotal = 240 + 12\\nTotal = 252 AED',
    type: 'free-text',
    interactiveAnswer: '252'
  },
  {
    id: 2,
    question: 'A laptop is priced at 4200 AED. If a student discount of 15% is applied, what is the new price?',
    hint: 'If you get 15% off, you are paying 85% of the original price.',
    answerFullWorking: 'Method 1 (Paying Percentage):\\nSale Price = 4200 × 0.85\\nSale Price = 3570 AED\\n\\nMethod 2 (Standard):\\n15% of 4200 = 630\\nSale Price = 4200 - 630\\nSale Price = 3570 AED',
    type: 'free-text',
    interactiveAnswer: '3570'
  },
  {
    id: 3,
    question: 'A recipe for traditional Arabic coffee requires coffee beans and cardamom in a ratio of 4:1. If you use 200 grams of coffee beans, how many grams of cardamom do you need?',
    hint: 'The "4" parts corresponds to 200g. Find out what "1" part equals.',
    answerFullWorking: '4 parts = 200g\\n1 part = 200 / 4\\n1 part = 50g\\n\\nSince cardamom is 1 part:\\nCardamom required = 50g',
    type: 'free-text',
    interactiveAnswer: '50'
  },
  {
    id: 4,
    question: 'Convert 150 US Dollars (USD) to AED. (Assume the exchange rate is 1 USD = 3.67 AED).',
    hint: 'Multiply the USD amount by the AED rate.',
    answerFullWorking: '1 USD = 3.67 AED\\nAmount in AED = 150 × 3.67\\nAmount in AED = 550.50 AED',
    type: 'free-text',
    interactiveAnswer: '550.50'
  },
  {
    id: 5,
    question: 'A car purchased for 80,000 AED is sold three years later for 56,000 AED. What is the percentage decrease in value?',
    hint: 'Find the absolute decrease first, then divide by the ORIGINAL price.',
    answerFullWorking: 'Decrease = 80000 - 56000\\nDecrease = 24000 AED\\n\\nPercentage Decrease = (24000 / 80000) × 100\\nPercentage Decrease = 0.3 × 100\\nPercentage Decrease = 30% decrease',
    type: 'multiple-choice',
    interactiveOptions: ['20%', '24%', '30%', '40%'],
    interactiveAnswer: '30%'
  },
  {
    id: 6,
    question: 'A prize fund of 5000 AED is split between three competition winners in the ratio 5:3:2. Calculate the amount the first-place winner receives.',
    hint: 'Calculate total parts first (5+3+2). Find the value of one part.',
    answerFullWorking: 'Total parts = 5 + 3 + 2\\nTotal parts = 10 parts\\n\\nOne part = 5000 / 10\\nOne part = 500 AED\\n\\nFirst-place receives 5 parts:\\nFirst-place = 5 × 500\\nFirst-place = 2500 AED'
  },
  {
    id: 7,
    question: 'If you drive from Dubai to Abu Dhabi (a distance of 140 km) in 1.5 hours, what is your average speed in km/h?',
    hint: 'Speed equals Distance divided by Time.',
    answerFullWorking: 'Average Speed = Distance / Time\\nAverage Speed = 140 / 1.5\\nAverage Speed = 93.33 km/h (recurring)'
  },
  {
    id: 8,
    question: '45 out of 60 students in Grade 8 participate in after-school sports. What percentage of the students is this?',
    hint: 'Write as a fraction first (45/60), then convert to a percentage.',
    answerFullWorking: 'Fraction = 45/60\\nSimplify to 3/4\\nPercentage = (3/4) × 100\\nPercentage = 75%'
  },
  {
    id: 9,
    question: 'A television costs 2100 AED AFTER a 5% VAT has been added. What was the original price before the tax?',
    hint: 'This is reverse percentage. 2100 AED represents 105%.',
    answerFullWorking: 'Since price includes tax, 105% = 2100 AED\\n\\nTo find 100% (original price):\\nOriginal Price = 2100 / 1.05\\nOriginal Price = 2000 AED'
  },
  {
    id: 10,
    question: 'The angles of a triangle are in the ratio 1:2:3. Calculate the size of the largest angle. (Hint: Angles in a triangle add up to 180°).',
    hint: 'Total parts = 1+2+3. Share 180 degrees among the parts.',
    answerFullWorking: 'Total parts = 1 + 2 + 3\\nTotal parts = 6 parts\\n\\nOne part = 180 / 6 = 30°\\n\\nThe largest angle has 3 parts:\\n3 × 30°\\n= 90°'
  },
  // Subtopic 1.2 Questions
  {
    id: 11,
    question: 'A movie ticket at Roxy Cinemas costs 45 AED. Write an expression for the cost of y tickets.',
    answerFullWorking: 'Cost per ticket = 45\\nNumber of tickets = y\\nTotal cost = 45y',
    type: 'free-text',
    interactiveAnswer: '45y'
  },
  {
    id: 12,
    question: 'Simplify: 4x + 7y - 2x + y.',
    answerFullWorking: '(4x - 2x) + (7y + y)\\n= 2x + 8y',
    type: 'free-text',
    interactiveAnswer: '2x+8y'
  },
  {
    id: 13,
    question: 'Simplify: 8m - 3n - 5m + 6n.',
    answerFullWorking: '(8m - 5m) + (-3n + 6n)\\n= 3m + 3n',
    type: 'free-text',
    interactiveAnswer: '3m+3n'
  },
  {
    id: 14,
    question: 'Expand: 3(2a + 4).',
    answerFullWorking: '3 × 2a + 3 × 4\\n= 6a + 12',
    type: 'multiple-choice',
    interactiveOptions: ['6a + 4', '2a + 12', '6a + 12', '6a + 7'],
    interactiveAnswer: '6a + 12'
  },
  {
    id: 15,
    question: 'Expand: -2(y - 6).',
    answerFullWorking: '-2 × y + -2 × -6\\n= -2y + 12',
    type: 'free-text',
    interactiveAnswer: '-2y+12'
  },
  {
    id: 16,
    question: 'Solve for x: x - 18 = 24.',
    answerFullWorking: 'x - 18 = 24\\nx = 24 + 18\\nx = 42'
  },
  {
    id: 17,
    question: 'Solve for y: 5y = 60.',
    answerFullWorking: '5y = 60\\ny = 60 / 5\\ny = 12'
  },
  {
    id: 18,
    question: 'Solve for m: 2m + 8 = 20.',
    answerFullWorking: '2m + 8 = 20\\n2m = 20 - 8\\n2m = 12\\nm = 12 / 2\\nm = 6'
  },
  {
    id: 19,
    question: 'You buy a notebook for 15 AED and 4 identical pens. The total cost is 47 AED. Write and solve an equation to find the cost of one pen (p).',
    answerFullWorking: 'Equation: 4p + 15 = 47\\n4p = 47 - 15\\n4p = 32\\np = 32 / 4\\np = 8 AED'
  },
  {
    id: 20,
    question: 'The perimeter of a square is 64 cm. Write an equation using s for the side length, and solve for s.',
    answerFullWorking: 'A square has 4 equal sides.\\nEquation: 4s = 64\\ns = 64 / 4\\ns = 16 cm'
  },
  // Subtopic 1.3 Questions
  {
    id: 21,
    question: 'Round the number 14.896 to 2 decimal places.',
    answerFullWorking: 'Second decimal place is 9.\\nNext digit is 6 (which is ≥ 5).\\nRound 9 up to 10 (carry over).\\nAnswer = 14.90',
    type: 'free-text',
    interactiveAnswer: '14.90'
  },
  {
    id: 22,
    question: 'Round the measurement 0.0452 meters to 1 decimal place.',
    answerFullWorking: 'First decimal place is 0.\\nNext digit is 4 (which is < 5).\\nAnswer = 0.0 meters',
    type: 'free-text',
    interactiveAnswer: '0.0'
  },
  {
    id: 23,
    question: 'Round the Burj Khalifa\'s height (829.8 meters) to 2 significant figures.',
    answerFullWorking: 'First two sig figs: 82...\\nNext digit is 9 (which is ≥ 5).\\nRound 2 up to 3.\\nAnswer = 830 meters',
    type: 'free-text',
    interactiveAnswer: '830'
  },
  {
    id: 24,
    question: 'Round the number 0.00456 to 1 significant figure.',
    answerFullWorking: 'First sig fig is 4.\\nNext digit is 5 (which is ≥ 5).\\nRound 4 up to 5.\\nAnswer = 0.005',
    type: 'multiple-choice',
    interactiveOptions: ['0.004', '0.0046', '0.005', '0.01'],
    interactiveAnswer: '0.005'
  },
  {
    id: 25,
    question: 'Estimate the answer to 9.8 × 3.2 by rounding to the nearest whole number.',
    answerFullWorking: 'Round 9.8 to 10.\\nRound 3.2 to 3.\\n10 × 3 = 30',
    type: 'free-text',
    interactiveAnswer: '30'
  },
  {
    id: 26,
    question: 'Estimate the area of a room that measures 5.1m by 7.9m.',
    answerFullWorking: 'Round 5.1 to 5.\\nRound 7.9 to 8.\\nArea = 5 × 8 = 40 m²'
  },
  {
    id: 27,
    question: 'Two lighthouses flash their lights. One flashes every 8 seconds, the other every 10 seconds. Find the LCM to determine when they flash together.',
    answerFullWorking: 'Multiples of 8: 8, 16, 24, 32, 40...\\nMultiples of 10: 10, 20, 30, 40...\\nLCM = 40 seconds'
  },
  {
    id: 28,
    question: 'A teacher has 24 pencils and 36 erasers. What is the greatest number of identical student kits she can make with no items left over?',
    answerFullWorking: 'Find the Highest Common Factor (HCF) of 24 and 36.\\nFactors of 24: 1, 2, 3, 4, 6, 8, 12, 24\\nFactors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36\\nHCF = 12 kits'
  },
  {
    id: 29,
    question: 'Evaluate: -8 + (-5).',
    answerFullWorking: '-8 + (-5)\\n= -8 - 5\\n= -13'
  },
  {
    id: 30,
    question: 'The balance in a bank account is -150 AED. A deposit of 400 AED is made. What is the new balance?',
    answerFullWorking: 'Starting balance: -150\\nDeposit: +400\\nNew balance = -150 + 400\\n= 250 AED'
  }
];
