import { Example, PracticeQuestion } from '../types';

export const unit3Examples: Example[] = [
  {
    id: "u3-ex1",
    title: "3.1: Volume of a Rectangular Prism (Jebel Ali)",
    problem: "A standard shipping container at Jebel Ali Port has a length of 12 meters, a width of 2.5 meters, and a height of 2.5 meters. Calculate its volume.",
    context: "Applying geometric formulas to real-world structures in the UAE.",
    method1Steps: [
      "Find the area of the base (length × width).\\n12 × 2.5 = 30",
      "Multiply by height.\\n30 × 2.5 = 75 m³"
    ],
    method2Name: "Direct Formula",
    method2Steps: [
      "State the formula for volume of a rectangular prism.\\nV = l × w × h",
      "Substitute known values.\\nV = 12 × 2.5 × 2.5",
      "Calculate final value.\\nV = 75 cubic meters."
    ]
  },
  {
    id: "u3-ex2",
    title: "3.1: Surface Area of a Rectangular Prism",
    problem: "Calculate the total surface area of the same shipping container (12m x 2.5m x 2.5m) to determine how much rust-proof paint is needed.",
    context: "Surface area informs material requirements like paint.",
    method1Steps: [
      "Calculate top and bottom face areas.\\n2 × (12 × 2.5) = 60",
      "Calculate front and back areas.\\n2 × (12 × 2.5) = 60",
      "Calculate side areas.\\n2 × (2.5 × 2.5) = 12.5",
      "Add them together.\\n60 + 60 + 12.5 = 132.5 m²."
    ],
    method2Name: "Standard Formula",
    method2Steps: [
      "State the surface area formula.\\nSA = 2(lw) + 2(lh) + 2(wh)",
      "Substitute values.\\nSA = 2(30) + 2(30) + 2(6.25)",
      "Calculate sums.\\nSA = 60 + 60 + 12.5 = 132.5 m²."
    ]
  },
  {
    id: "u3-ex3",
    title: "3.1: Volume of a Cylinder (DEWA Water Tank)",
    problem: "A cylindrical water tank on top of a villa has a radius of 1.5 meters and a height of 2 meters. Find the volume of water it can hold (use π ≈ 3.14).",
    context: "Calculating cylinder volumes for household tanks.",
    method1Steps: [
      "State the formula for the volume of a cylinder.\\nV = πr²h",
      "Substitute the values.\\nV = 3.14 × (1.5)² × 2",
      "Calculate final volume.\\nV = 3.14 × 2.25 × 2 = 14.13 m³."
    ],
    method2Name: "Step-by-Step Parts",
    method2Steps: [
      "Find base area first.\\nArea = 3.14 × 1.5² = 7.065 m²",
      "Multiply base area by height.\\n7.065 × 2 = 14.13 m³"
    ]
  },
  {
    id: "u3-ex4",
    title: "3.1: Identifying Nets",
    problem: "What 3D solid is formed by a net consisting of two identical circles and one rectangle?",
    context: "Moving between two-dimensional nets and three-dimensional objects.",
    method1Steps: [
      "Visualize folding the rectangle into a curved tube.",
      "Visualize the two circles capping the ends.",
      "Identify the shape:\\nA Cylinder."
    ],
    method2Name: "Feature Matching",
    method2Steps: [
      "Identify solid with 2 circular faces.\\nCylinders have 2 parallel circular bases.",
      "Identify the curved surface.\\nThe rectangle wraps to become the curved face."
    ]
  },
  {
    id: "u3-ex5",
    title: "3.1: Surface Area of a Cube",
    problem: "An art installation at Alserkal Avenue features a giant perfect cube with a side length of 4 meters. Calculate its total surface area.",
    context: "Surface area of simple solids with identical faces.",
    method1Steps: [
      "Calculate the area of one square face.\\nA = s² = 4 × 4 = 16 m².",
      "A cube has 6 identical faces. Multiply by 6.\\nSA = 6 × 16 = 96 m²."
    ],
    method2Name: "Formula Application",
    method2Steps: [
      "State the formula for cube surface area.\\nSA = 6s²",
      "Substitute s = 4.\\nSA = 6(4)²",
      "Calculate.\\nSA = 6(16) = 96 m²."
    ]
  },
  {
    id: "u3-ex6",
    title: "3.2: Translating a Shape",
    problem: "A triangle vertices are A(1, 2), B(3, 5), and C(4, 2). Translate the triangle 3 units left and 2 units down. Find the new coordinates of A'.",
    context: "Translations shift shapes without altering size or orientation.",
    method1Steps: [
      "To shift left 3 units, subtract 3 from the x-coordinate of A.\\n1 - 3 = -2",
      "To shift down 2 units, subtract 2 from the y-coordinate of A.\\n2 - 2 = 0",
      "Write the new coordinates.\\nA'(-2, 0)"
    ],
    method2Name: "Vector Addition",
    method2Steps: [
      "Write the translation as a vector.\\nT = <-3, -2>",
      "Add the vector to coordinate A(1, 2).\\nA' = (1 - 3, 2 - 2)",
      "Calculate.\\nA'(-2, 0)"
    ]
  },
  {
    id: "u3-ex7",
    title: "3.2: Reflecting a Shape Across the Y-Axis",
    problem: "Find the coordinates of point P(4, 5) after a reflection across the y-axis.",
    context: "Reflections create mirror images across a line.",
    method1Steps: [
      "A reflection across the y-axis means the distance from the y-axis stays the same, but on the opposite side.",
      "Keep the y-coordinate the same (5).",
      "Multiply the x-coordinate by -1.\\nx = 4 × -1 = -4.",
      "Write new coordinates.\\nP'(-4, 5)"
    ]
  },
  {
    id: "u3-ex8",
    title: "3.2: Reflecting a Shape Across the X-Axis",
    problem: "What is the new coordinate of point P(-3, -7) when reflected across the x-axis?",
    context: "A reflection across the x-axis flips the y-coordinate.",
    method1Steps: [
      "Keep the x-coordinate the same (-3).",
      "Multiply the y-coordinate by -1.\\ny = -7 × -1 = 7.",
      "Write new coordinates.\\nP'(-3, 7)"
    ]
  },
  {
    id: "u3-ex9",
    title: "3.2: Rotating 90° Clockwise",
    problem: "Rotate the point K(2, 6) 90° clockwise around the origin. What are the new coordinates?",
    context: "Rotations turn shapes around a central point.",
    method1Steps: [
      "Rule for 90° clockwise: Swap x and y, then multiply the new y by -1. (x, y) → (y, -x)",
      "Swap 2 and 6 to get (6, 2).",
      "Multiply the new y by -1 to get (6, -2).",
      "Write new coordinates.\\nK'(6, -2)"
    ]
  },
  {
    id: "u3-ex10",
    title: "3.2: Dilating from Origin",
    problem: "A square has a vertex at M(4, -2). What will the coordinates be after a dilation by a scale factor of 3 from the origin?",
    context: "Dilations resize shapes by multiplying coordinates.",
    method1Steps: [
      "Multiply both the x and y coordinates by the scale factor (3).",
      "x = 4 × 3 = 12",
      "y = -2 × 3 = -6",
      "Write new coordinates.\\nM'(12, -6)"
    ]
  }
];

export const unit3Practice: PracticeQuestion[] = [
  {
    id: 1,
    question: "Calculate the volume of a shoebox that is 30 cm long, 20 cm wide, and 12 cm high. (in cm³)",
    answerFullWorking: "Volume = l × w × h\nV = 30 × 20 × 12 = 7200\nVolume = 7200 cm³.",
    type: 'free-text',
    interactiveAnswer: '7200'
  },
  {
    id: 2,
    question: "Find the surface area of a cube with a side length of 5 cm. (in cm²)",
    answerFullWorking: "Area of one face = 5 × 5 = 25 cm²\nTotal Surface Area = 6 × 25 = 150 cm².",
    type: 'multiple-choice',
    interactiveOptions: ['25', '125', '150', '300'],
    interactiveAnswer: '150'
  },
  {
    id: 3,
    question: "A soda can has a radius of 3 cm and a height of 10 cm. Calculate its volume. (Use π = 3.14)",
    answerFullWorking: "V = πr²h\nV = 3.14 × (3)² × 10\nV = 3.14 × 90 = 282.6 cm³.",
    type: 'multiple-choice',
    interactiveOptions: ['94.2', '188.4', '282.6', '88.4'],
    interactiveAnswer: '282.6'
  },
  {
    id: 4,
    question: "What 2D shapes make up the net of a square-based pyramid?",
    answerFullWorking: "A central square with 4 identical triangles attached to each side, forming a 4-pointed star.",
    type: 'multiple-choice',
    interactiveOptions: ['1 square, 3 triangles', '1 square, 4 triangles', '2 squares, 4 triangles', '4 squares, 1 triangle'],
    interactiveAnswer: '1 square, 4 triangles'
  },
  {
    id: 5,
    question: "A rectangular pool has a volume of 200 cubic meters. Length is 10m, width is 5m. What is depth (h) in meters?",
    answerFullWorking: "V = l × w × h\n200 = 10 × 5 × h\nh = 200 ÷ 50 = 4m.",
    type: 'free-text',
    interactiveAnswer: '4'
  },
  {
    id: 6,
    question: "Point P(-1, 4) is translated 3 units right and 5 units up. Find P'.",
    answerFullWorking: "x = -1 + 3 = 2\ny = 4 + 5 = 9\nP'(2, 9)",
    type: 'free-text',
    interactiveAnswer: '(2, 9)'
  },
  {
    id: 7,
    question: "Reflect the point Q(-3, -6) across the y-axis.",
    answerFullWorking: "y-axis reflection means x becomes opposite, y stays same.\nx = -(-3) = 3\ny = -6\nQ'(3, -6)",
    type: 'free-text',
    interactiveAnswer: '(3, -6)'
  },
  {
    id: 8,
    question: "What is the sum of the interior angles of a pentagon?",
    answerFullWorking: "Sum = (n - 2) × 180\nSum = (5 - 2) × 180 = 3 × 180 = 540 degrees.",
    type: 'free-text',
    interactiveAnswer: '540'
  },
  {
    id: 9,
    question: "A square has side lengths of 3 cm. Dilation scale factor 2. New perimeter?",
    answerFullWorking: "Original perimeter = 12 cm\nNew perimeter = 12 × 2 = 24 cm.",
    type: 'free-text',
    interactiveAnswer: '24'
  },
  {
    id: 10,
    question: "A shape moves from Quadrant I to Quadrant II, but its orientation is backwards.",
    answerFullWorking: "Moving across y-axis and flipping backwards indicates a Reflection across the y-axis.",
    type: 'multiple-choice',
    interactiveOptions: ['Translation', 'Rotation', 'Reflection across x-axis', 'Reflection across y-axis'],
    interactiveAnswer: 'Reflection across y-axis'
  }
];

export const unit3Assessment: any = {
  criteriaA: [
    {
      id: "u3-ca1",
      question: "Calculate the volume of a rectangular pool with a length of 25m, width of 10m, and depth of 2m.",
      solution: "V = 25 × 10 × 2 = 500 m³."
    },
    {
      id: "u3-ca2",
      question: "Calculate the total surface area of a cube with a side length of 6cm.",
      solution: "SA = 6 × (6 × 6) = 216 cm²."
    }
  ],
  criteriaB: [
    {
      id: "u3-cb1",
      question: "Investigation: Calculate the volume of a cube with side length 1cm, 2cm, and 3cm. What is the pattern? If you double the side length of a cube, by what factor does the volume increase?",
      solution: "Sides: 1cm -> v=1³. 2cm -> v=2³=8. 3cm -> v=3³=27.\nDoubling the side length increases volume by a factor of 8 (2³)."
    }
  ],
  criteriaC: [
    {
      id: "u3-cc1",
      question: "Draw an L-shape on a Cartesian plane. Write a set of precise geometric instructions (using proper terminology like translation, reflection, coordinates) to guide a classmate in moving your shape.",
      solution: "Provide starting coordinates, followed by translation vectors T(x, y), and axis reflection instructions."
    }
  ],
  criteriaD: [
    {
      id: "u3-cd1",
      question: "The Louvre Abu Dhabi Dome: Imagine a simplified cylindrical exhibition room under the dome. The room has a diameter of 20 meters and a height of 8 meters.",
      solution: "1. Volume = 3.14 × 100 × 8 = 2512 m³.\n2. CSA = 2 × 3.14 × 10 × 8 = 502.4 m².\n3. Paint cans = 502.4 / 15 = 34 cans. Cost = 34 × 120 = 4080 AED."
    }
  ]
};
