export const glExams = [
  {
    id: "exam_1",
    title: "Mental Maths GL Style - Exam 1",
    totalTime: 90,
    questions: [
      { id: 1, text: "What is 45% of 200?", options: ["45", "90", "110", "100"], answer: "90", timeLimit: 5, answerFullWorking: "10% of 200 = 20\n40% = 80\n5% = 10\nTotal = 80 + 10 = 90" },
      { id: 2, text: "If x - 7 = 12, what is x?", options: ["5", "19", "21", "15"], answer: "19", timeLimit: 5, answerFullWorking: "x - 7 = 12\nx = 12 + 7\nx = 19" },
      { id: 3, text: "Calculate 15 × 6.", options: ["80", "90", "85", "95"], answer: "90", timeLimit: 5, answerFullWorking: "10 × 6 = 60\n5 × 6 = 30\n60 + 30 = 90" },
      { id: 4, text: "What is the square root of 144?", options: ["12", "14", "10", "16"], answer: "12", timeLimit: 5, answerFullWorking: "10 × 10 = 100\n12 × 12 = 144\nAnswer is 12" },
      { id: 5, text: "Solve: 3 + 4 × 5", options: ["35", "12", "23", "20"], answer: "23", timeLimit: 10, answerFullWorking: "Apply BIDMAS / BODMAS:\nMultiplication first: 4 × 5 = 20\nThen Addition: 3 + 20 = 23" },
      { id: 6, text: "What is the perimeter of a rectangle with sides 5cm and 8cm?", options: ["26cm", "13cm", "40cm", "20cm"], answer: "26cm", timeLimit: 10, answerFullWorking: "Perimeter = 2 × (Length + Width)\nPerimeter = 2 × (5 + 8)\nPerimeter = 2 × 13\nPerimeter = 26cm" },
      { id: 7, text: "Find the next number: 2, 5, 10, 17, ?", options: ["24", "26", "25", "27"], answer: "26", timeLimit: 10, answerFullWorking: "Differences between numbers:\n5 - 2 = 3\n10 - 5 = 5\n17 - 10 = 7\nNext difference = 9\n17 + 9 = 26" },
      { id: 8, text: "A train leaves at 08:45 and arrives at 09:20. How long is the journey?", options: ["35 mins", "25 mins", "45 mins", "30 mins"], answer: "35 mins", timeLimit: 15, answerFullWorking: "From 08:45 to 09:00 is 15 mins.\nFrom 09:00 to 09:20 is 20 mins.\nTotal time = 15 + 20 = 35 mins." },
      { id: 9, text: "What is 3/4 as a decimal?", options: ["0.34", "0.75", "0.80", "0.65"], answer: "0.75", timeLimit: 10, answerFullWorking: "1/4 = 0.25\n3/4 = 3 × 0.25\nAnswer = 0.75" },
      { id: 10, text: "If a shirt costs £20 and is reduced by 15%, what is the new price?", options: ["£15", "£17", "£18", "£16"], answer: "£17", timeLimit: 15, answerFullWorking: "10% of £20 = £2\n5% of £20 = £1\nTotal discount = £3\nNew price = £20 - £3 = £17" }
    ]
  },
  {
    id: "exam_2",
    title: "Mental Maths GL Style - Exam 2",
    totalTime: 90,
    questions: [
      { id: 1, text: "What is 1/5 of 60?", options: ["12", "15", "10", "18"], answer: "12", timeLimit: 5, answerFullWorking: "1/5 means divide by 5.\n60 ÷ 5 = 12." },
      { id: 2, text: "What is 7 cubed?", options: ["21", "49", "343", "243"], answer: "343", timeLimit: 5, answerFullWorking: "7³ = 7 × 7 × 7\n7 × 7 = 49\n49 × 7 = 343." },
      { id: 3, text: "Simplify: 2x + 5x - x", options: ["6x", "7x", "8x", "5x"], answer: "6x", timeLimit: 5, answerFullWorking: "2x + 5x = 7x\n7x - 1x = 6x." },
      { id: 4, text: "What is 10% of 350?", options: ["3.5", "35", "350", "30"], answer: "35", timeLimit: 5, answerFullWorking: "To find 10%, divide by 10.\n350 ÷ 10 = 35." },
      { id: 5, text: "What is the area of a triangle with base 10 and height 4?", options: ["40", "14", "20", "28"], answer: "20", timeLimit: 10, answerFullWorking: "Area = (base × height) ÷ 2\nArea = (10 × 4) ÷ 2\nArea = 40 ÷ 2 = 20." },
      { id: 6, text: "Add £3.45 and £2.55", options: ["£5.00", "£6.10", "£5.90", "£6.00"], answer: "£6.00", timeLimit: 10, answerFullWorking: "Pence: 45p + 55p = 100p = £1.00\nPounds: £3 + £2 = £5\nTotal = £5 + £1 = £6.00" },
      { id: 7, text: "How many lines of symmetry in a regular hexagon?", options: ["2", "4", "6", "8"], answer: "6", timeLimit: 10, answerFullWorking: "A regular polygon with 'n' sides has 'n' lines of symmetry.\nA hexagon has 6 sides.\nLines of symmetry = 6." },
      { id: 8, text: "Calculate 5% of £40", options: ["£2", "£4", "£1", "£5"], answer: "£2", timeLimit: 10, answerFullWorking: "10% of £40 = £4\n5% is half of 10%.\nHalf of £4 = £2." },
      { id: 9, text: "Find the mean of: 4, 7, 10, 3", options: ["6", "7", "5", "8"], answer: "6", timeLimit: 15, answerFullWorking: "Sum = 4 + 7 + 10 + 3 = 24\nCount = 4 numbers\nMean = 24 ÷ 4 = 6." },
      { id: 10, text: "Express 45 as a product of prime factors.", options: ["3² × 5", "5 × 9", "3 × 15", "3³ × 5"], answer: "3² × 5", timeLimit: 15, answerFullWorking: "45 = 9 × 5\n9 = 3 × 3\nSo 45 = 3 × 3 × 5\nIn index form: 3² × 5" }
    ]
  }
];
