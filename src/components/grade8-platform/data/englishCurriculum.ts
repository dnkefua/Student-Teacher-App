import { Example, PracticeQuestion } from '../types';

export const englishUnit1Examples: Example[] = [
  {
    id: "eng_u1_1",
    title: "1.2 Interactive Class Exercises: The AFOREST Scavenger Hunt",
    problem: "Analyzing persuasive techniques in a real-world advertisement.",
    context: "Advertising & Persuasion",
    method1Name: "Persuasive Techniques (AFOREST)",
    techniques: [
      { name: "Alliteration", description: "Repeating consonant sounds to make a phrase memorable.", color: "text-amber-500", excerpt: "Don't just dream it, **d**rive the **d**ream." },
      { name: "Facts", description: "Using demonstrable truths to build credibility.", color: "text-rose-500", excerpt: "Tested and proven to remove **99.9% of bacteria**." },
      { name: "Opinions", description: "Presenting beliefs as indisputable to sway the consumer.", color: "text-orange-500", excerpt: "Simply the **greatest smartphone ever created**." },
      { name: "Rhetorical questions", description: "Asking a question to make the audience think, rather than expecting an answer.", color: "text-indigo-500", excerpt: "**Are you ready to change your life today?**" },
      { name: "Emotive language", description: "Choosing words specifically to trigger an emotional response.", color: "text-emerald-500", excerpt: "Help these **desperate, starving** animals find a home." },
      { name: "Statistics", description: "Using numerical data to provide concrete evidence.", color: "text-cyan-500", excerpt: "**8 out of 10** dentists recommend this toothpaste." },
      { name: "Triplets", description: "Grouping adjectives or phrases in threes for rhythm and emphasis.", color: "text-fuchsia-500", excerpt: "It is **fast, reliable, and affordable**." }
    ],
    method2Name: "Layout Deconstruction",
    method2Steps: [
      "Analyze where the product is placed versus where the emotional hook is located.",
      "Identify the 'Rule of Thirds' implementation in the visual.",
      "Understand the flow of the eye across the copy from top-left to bottom-right."
    ]
  },
  {
    id: "eng_u1_2",
    title: "1.2 Target Audience Shift & Paragraph Practice",
    problem: "Take an advertisement for a luxury sports car (aimed at high-income adults).",
    context: "Visual Literacy & Target Demographics",
    method1Name: "Target Audience Adaptation",
    method1Steps: [
      "Rewrite the copy of the luxury sports car advertisement.",
      "Describe a new layout to sell the exact same car to a teenager who just got their license.",
      "Adjust language and emotional hooks accordingly."
    ],
    method2Name: "Formative Paragraph Practice",
    method2Steps: [
      "Write a PEE (Point, Evidence, Explain) paragraph.",
      "Analyze how a specific charity advertisement uses emotive language and stark lighting to persuade its audience."
    ]
  }
];

export const englishUnit1Practice: PracticeQuestion[] = [
  {
    id: 1,
    question: "What does the word **pioneer** mean as it is used in the phrase *'you pioneer a global movement'*?",
    answerFullWorking: "Look at how the word functions as a verb action performed by the buyer. Context clues point to switching to new technology and starting a \"global movement.\" To pioneer means to lead, initiate, or be among the first to start something new.",
    type: 'multiple-choice',
    interactiveOptions: ['to lead or initiate', 'to follow blindly', 'to block progress', 'to sit idly by'],
    interactiveAnswer: 'to lead or initiate'
  },
  {
    id: 2,
    question: "According to the text, what specific action must a consumer take to join the movement?",
    answerFullWorking: "Scan the text for the word \"movement.\" Locate the preceding action sentence: \"By switching to the new Eco-Drive hybrid system...\" The consumer must switch to the new Eco-Drive hybrid system.",
    type: 'multiple-choice',
    interactiveOptions: ['Burn more carbon', 'Switch to the new Eco-Drive hybrid system', 'Purchase any vehicle', 'Wait for a cleaner tomorrow'],
    interactiveAnswer: 'Switch to the new Eco-Drive hybrid system'
  },
  {
    id: 3,
    question: "Why does the author use the word **suffocating** to describe the carbon emissions?",
    answerFullWorking: "The adjective \"suffocating\" creates a sense of physical danger and distress. The author uses this emotive language to provoke fear and urgency, pushing the reader to buy the product to help fix the problem.",
    type: 'multiple-choice',
    interactiveOptions: ['To state a scientific fact', 'To describe the car interior', 'To provoke fear and urgency', 'To calm the reader down'],
    interactiveAnswer: 'To provoke fear and urgency'
  },
  {
    id: 4,
    question: "Identify the specific **AFOREST** technique used in the phrase: *'cleaner tomorrow is not a distant, unattainable dream.'*",
    answerFullWorking: "Look for repeating initial consonant sounds: cleaner tomorrow... distant... dream. The repetition of the \"d\" sound is an example of alliteration.",
    type: 'multiple-choice',
    interactiveOptions: ['Alliteration', 'Facts', 'Statistic', 'Emotive language'],
    interactiveAnswer: 'Alliteration'
  },
  {
    id: 5,
    question: "What is the purpose of the question: *'Why choose to sit idly by while the planet warms?'*",
    answerFullWorking: "This question does not expect a direct answer, making it a rhetorical question. It challenges the audience's conscience and persuades them to act.",
    type: 'multiple-choice',
    interactiveOptions: ['To request scientific data', 'To challenge the audience\'s conscience', 'To provide a statistic', 'To confuse the reader'],
    interactiveAnswer: 'To challenge the audience\'s conscience'
  }
];

export const englishUnit1Assessment: any = {
  title: "Advertising & Persuasion Assessment",
  description: "Formative Assessment: An analytical paragraph focusing on the language and layout of an advertisement. Summative Assessment (MYP Criteria C & D): The Campaign Pitch. Students work in groups to create and pitch an original advertising campaign for a new product or service. They must justify their choices of layout, persuasive language (AFOREST), and target audience appeal.",
  questions: [
    {
      id: 1,
      type: 'essay',
      question: "Write an analytical PEE (Point, Evidence, Explain) paragraph analyzing how a charity advertisement uses emotive language and stark lighting to persuade its audience."
    }
  ]
};

import { Asset } from '../types';

export const englishUnit2Examples: Example[] = [
  {
    id: "eng_u2_1",
    title: "2.2 The Character Matrix & Narrative Shift",
    problem: "Analyze characters and the impact of narrative viewpoint.",
    context: "Character & Perspective",
    method1Name: "Character Archetypes",
    techniques: [
      { name: "Protagonist", description: "The central character who drives the action forward.", color: "text-indigo-500", excerpt: "**Lyra** crept through the dark halls, knowing she was the only one who could stop the ritual." },
      { name: "Antagonist", description: "The character or force that opposes the protagonist.", color: "text-rose-500", excerpt: "**The towering general** stood blocking the only exit, a cruel smile playing on his lips." },
      { name: "Static Character", description: "A character who does not undergo any significant change in personality or perspective.", color: "text-slate-500", excerpt: "Just as he had for fifty years, **Mr. Henderson** simply grunted and returned to his newspaper." },
      { name: "Dynamic Character", description: "A character who undergoes a major internal change over the course of the narrative.", color: "text-emerald-500", excerpt: "Once she would have run, but now, **Elara** stood her ground, realizing she no longer feared the dark." }
    ],
    method2Name: "The Narrative Shift",
    method2Steps: [
      "Choose a pivotal scene from the novel.",
      "Rewrite it using an omniscient narrator instead of a limited narrator.",
      "Analyze how having access to everyone's internal thoughts changes the tension."
    ]
  },
  {
    id: "eng_u2_2",
    title: "2.2 Punctuation Upgrades & Tracking Theme",
    problem: "Enhance sentence structure and trace core ideas.",
    context: "Grammar & Thematic Analysis",
    method1Name: "Advanced Grammar",
    method1Steps: [
      "Take a paragraph of simple text.",
      "Rewrite it using at least one colon and two semi-colons.",
      "Combine short, choppy sentences into complex structures."
    ],
    method2Name: "Tracking Theme",
    method2Steps: [
      "Trace a recurring motif or core idea (e.g., isolation or perseverance) across three chapters.",
      "Write a short summary.",
      "Explain how the setting reinforces this theme."
    ]
  }
];

export const englishUnit2Practice: PracticeQuestion[] = [
  {
    id: 1,
    question: "What does the word **collective** imply about the gasp in the cafeteria?",
    answerFullWorking: "\"Collective\" relates to a group acting together. It implies that the reaction was simultaneous and shared by everyone watching.",
    type: 'multiple-choice',
    interactiveOptions: ['It was very quiet', 'It was simultaneous and shared by everyone', 'It was done by one person', 'It was an accident'],
    interactiveAnswer: 'It was simultaneous and shared by everyone'
  },
  {
    id: 2,
    question: "What physical action does the narrator take to shield himself from the stares?",
    answerFullWorking: "Locate the action verbs: \"I pulled my baseball cap lower... and stared straight at the floor tiles.\" The narrator pulls his cap down and looks directly at the floor.",
    type: 'multiple-choice',
    interactiveOptions: ['Runs out of the cafeteria', 'Pulls his cap down and looks at the floor', 'Stares back at the other students', 'Covers his ears with his hands'],
    interactiveAnswer: 'Pulls his cap down and looks at the floor'
  },
  {
    id: 3,
    question: "What does the narrator's interpretation of the word *'unique'* reveal about his mindset?",
    answerFullWorking: "Notice the contrast between protective language (\"unique\") and the raw insecurity felt by the child. It shows that the narrator is highly self-conscious and assumes his appearance terrifies others.",
    type: 'multiple-choice',
    interactiveOptions: ['He feels confident and special', 'He is highly self-conscious and insecure', 'He thinks the adults are very honest', 'He does not understand the word'],
    interactiveAnswer: 'He is highly self-conscious and insecure'
  },
  {
    id: 4,
    question: "Is this passage written by a first-person or a third-person limited narrator?",
    answerFullWorking: "Check the pronouns used (\"I\", \"my\", \"me\"). The story reveals only the narrator's thoughts directly, so it is a first-person narrator.",
    type: 'multiple-choice',
    interactiveOptions: ['First-person narrator', 'Third-person limited narrator', 'Omniscient narrator', 'Second-person narrator'],
    interactiveAnswer: 'First-person narrator'
  },
  {
    id: 5,
    question: "Which structural component of a narrative arc does an internal struggle at a new school typically fit into?",
    answerFullWorking: "This scene builds tension and introduces the main conflict. Therefore, this fits into the rising action phase of the plot.",
    type: 'multiple-choice',
    interactiveOptions: ['Climax', 'Falling Action', 'Rising Action', 'Resolution'],
    interactiveAnswer: 'Rising Action'
  }
];

export const englishUnit2Assessment: any = {
  title: "The Novel \u2013 Character & Perspective Assessment",
  description: "Formative Assessment: An analytical paragraph focusing on how the author uses characterization to introduce a theme. Summative Assessment (MYP Criteria C & D): Creative Writing Portfolio.",
  questions: [
    {
      id: 1,
      type: 'essay',
      question: "Creative Writing Portfolio: Draft a first-person descriptive account of a major turning point in a story, demonstrating mastery of internal monologue, sensory imagery, and proper punctuation (using colons and semi-colons)."
    }
  ]
};

export const englishUnit2Assets: Asset[] = [
  {
    id: "asset_u2_1a",
    type: "novel",
    title: "To Kill a Mockingbird by Harper Lee",
    description: "An exploration of first-person narrative perspective and moral development in a small town.",
    url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/To_Kill_a_Mockingbird"
  },
  {
    id: "asset_u2_1b",
    type: "novel",
    title: "Lord of the Flies by William Golding",
    description: "Analyzing dynamic characters turning adversarial, and the use of setting as an antagonist.",
    url: "https://images.unsplash.com/photo-1510137258380-4dbb38ff13a3?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Lord_of_the_Flies"
  },
  {
    id: "asset_u2_2a",
    type: "article",
    title: "Understanding Character Archetypes",
    description: "A deep dive into static, dynamic, flat, and round characters, and how they drive the plot forward.",
    url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=60",
    link: "https://literaryterms.net/archetype/"
  },
  {
    id: "asset_u2_2b",
    type: "article",
    title: "The Importance of Perspective in Storytelling",
    description: "How first-person vs third-person omniscient changes the relationship between reader and protagonist.",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead2708?w=600&auto=format&fit=crop&q=60",
    link: "https://literaryterms.net/point-of-view/"
  },
  {
    id: "asset_u2_3a",
    type: "video",
    title: "The Hero's Journey: Narrative Arc",
    description: "Visual breakdown of the exposition, rising action, climax, falling action, and resolution.",
    url: "https://images.unsplash.com/photo-1535016120720-40c746a6580B?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Story_arc"
  },
  {
    id: "asset_u2_3b",
    type: "video",
    title: "Kurt Vonnegut on the Shapes of Stories",
    description: "A brilliant, simple visual explanation of character arcs and narrative structure.",
    url: "https://images.unsplash.com/photo-1516104758805-4c6e61fd86fb?w=600&auto=format&fit=crop&q=60",
    link: "https://www.youtube.com/watch?v=oP3c1h8v2ZQ"
  }
];

export const englishUnit3Examples: Example[] = [
  {
    id: "eng_u3_1",
    title: "3.2 The Soundscape Analysis & Punctuation as Control",
    problem: "Evaluate auditory and grammatical choices in poetry.",
    context: "Poetry & Form",
    method1Name: "Auditory Devices",
    techniques: [
      { name: "Alliteration", description: "Repetition of initial consonant sounds.", color: "text-amber-500", excerpt: "**W**ild and **w**ind-blown **w**ords." },
      { name: "Assonance", description: "Repetition of vowel sounds.", color: "text-indigo-500", excerpt: "The cr**e**aking of the tr**ee**s in the br**ee**ze." },
      { name: "Sibilance", description: "Repetition of 's' or 'sh' sounds.", color: "text-emerald-500", excerpt: "**S**oftly, the **s**erpent **s**lithered." },
      { name: "Onomatopoeia", description: "Words that imitate sounds.", color: "text-rose-500", excerpt: "The **crash** and **bang** of the thunder." }
    ],
    method2Name: "Grammar & Rhythms",
    method2Steps: [
      "Read a poem with heavy caesura (stops in the middle of a line) and enjambment (lines running over).",
      "Discuss how these choices accelerate or decelerate reading speed."
    ]
  },
  {
    id: "eng_u3_2",
    title: "3.2 The Metaphor Reconstruction & Form Constraints",
    problem: "Analyze extended metaphors and strict poetic forms.",
    context: "Imagery & Tropes",
    method1Name: "Imagery & Tropes",
    techniques: [
      { name: "Extended Metaphor", description: "A metaphor developed through several lines or an entire poem.", color: "text-cyan-500", excerpt: "Hope is the thing with feathers / That perches in the soul..." },
      { name: "Personification", description: "Giving human qualities to non-human things.", color: "text-fuchsia-500", excerpt: "The wind **whispered** its secrets." },
      { name: "Hyperbole", description: "Exaggerated statements not meant to be taken literally.", color: "text-orange-500", excerpt: "I've told you a **million times**." }
    ],
    method2Name: "Form Constraints",
    method2Steps: [
      "Write a structured 4-line stanza (quatrain).",
      "Follow a strict ABAB rhyme scheme.",
      "Ensure each line contains exactly eight syllables (iambic tetrameter)."
    ]
  }
];

export const englishUnit3Practice: PracticeQuestion[] = [
  {
    id: 1,
    question: "What is the meaning of the word **untamed** as it is used in the final line?",
    answerFullWorking: "Break down the word: \"un-\" (not) and \"tamed\" (controlled). It describes the ancient wind moving through a modern city. It means wild, free, and completely uncontrolled by the human buildings around it.",
    type: 'multiple-choice',
    interactiveOptions: ['Calm and quiet', 'Wild and completely uncontrolled', 'Trapped by buildings', 'Domesticated'],
    interactiveAnswer: 'Wild and completely uncontrolled'
  },
  {
    id: 2,
    question: "Identify two materials that the poem states make up the modern \"shifting canyons.\"",
    answerFullWorking: "Locate the phrase \"shifting canyons\" and read the words right after it: \"...canyons of glass and steel now—\". The materials are glass and steel.",
    type: 'multiple-choice',
    interactiveOptions: ['Sand and wind', 'Concrete and shadows', 'Glass and steel', 'Bricks and mortar'],
    interactiveAnswer: 'Glass and steel'
  },
  {
    id: 3,
    question: "What message about time does the line *“sweeps away the footprints of kings and nomads alike”* convey?",
    answerFullWorking: "\"Kings\" and \"nomads\" represent all of humanity, regardless of status. Sweeping away footprints means erasing history. It shows that time and nature eventually erase all human history, treating everyone equally.",
    type: 'multiple-choice',
    interactiveOptions: ['Kings trace the steps of nomads', 'Nature treats everyone equally and erases all history', 'Only the wealthy leave footprints', 'The desert wind is weak'],
    interactiveAnswer: 'Nature treats everyone equally and erases all history'
  },
  {
    id: 4,
    question: "What literary device is used when the wind is described as *“whispering secrets”* and *“sighing”*?",
    answerFullWorking: "Whispering and sighing are human actions. The subject is the desert wind, an inanimate natural force. Giving human qualities to non-human things is called personification.",
    type: 'multiple-choice',
    interactiveOptions: ['Hyperbole', 'Alliteration', 'Personification', 'Onomatopoeia'],
    interactiveAnswer: 'Personification'
  },
  {
    id: 5,
    question: "How does the shift from \"dunes\" to \"glass and steel\" help show the poem's theme?",
    answerFullWorking: "\"Dunes\" represent the ancient past, while \"glass and steel\" represent modern urban development. The shift highlights the rapid change of the landscape over time, connecting historical nature with modern cities.",
    type: 'multiple-choice',
    interactiveOptions: ['It shows the wind is getting stronger', 'It proves the desert is expanding', 'It highlights the rapid change of the landscape spanning history and modern times', 'It demonstrates how glass is made from sand'],
    interactiveAnswer: 'It highlights the rapid change of the landscape spanning history and modern times'
  }
];

export const englishUnit3Assessment: any = {
  title: "Voices in Verse \u2013 Poetry & Form Assessment",
  description: "Formative: Close-reading annotation and comparative paragraph. Summative (Criteria A & C): Poetry Commentary & Showcase.",
  questions: [
    {
      id: 1,
      type: 'essay',
      question: "Summative Assessment: Compose an original poem reflecting a personal cultural theme, accompanied by a structured analytical commentary justifying your linguistic and structural choices."
    }
  ]
};

export const englishUnit3Assets: Asset[] = [
  {
    id: "asset_u3_1a",
    type: "video",
    title: "Sarah Kay: If I should have a daughter",
    description: "An inspiring spoken-word performance demonstrating the power of rhythm, pacing, and metaphor.",
    url: "https://images.unsplash.com/photo-1516280440503-62f0fb8396c3?w=600&auto=format&fit=crop&q=60",
    link: "https://www.ted.com/talks/sarah_kay_if_i_should_have_a_daughter"
  },
  {
    id: "asset_u3_1b",
    type: "article",
    title: "Poetry Foundation: Glossary of Poetic Terms",
    description: "Comprehensive guide to understanding poetic forms and devices, including sonnets, haikus, and free verse.",
    url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=60",
    link: "https://www.poetryfoundation.org/learn/glossary-terms"
  },
  {
    id: "asset_u3_2a",
    type: "novel",
    title: "Selected Poems of Emily Dickinson",
    description: "Analyze classic examples of unconventional meter, enjambment, and profound metaphor.",
    url: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Emily_Dickinson"
  },
  {
    id: "asset_u3_2b",
    type: "article",
    title: "The Impact of Enjambment and Caesura",
    description: "An article dissecting how punctuation controls the breath and pacing of a poem.",
    url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=60",
    link: "https://literarydevices.net/enjambment/"
  }
];

export const englishUnit4Examples: Example[] = [
  {
    id: "eng_u4_1",
    title: "4.2 The Silent Scene Challenge & Editing",
    problem: "Evaluate the psychological impact of cinematography and lighting.",
    context: "Language & Film",
    method1Name: "Cinematography & Lighting",
    techniques: [
      { name: "Extreme Long Shot", description: "Shows the subject from a distance, or the area in which the scene is taking place.", color: "text-slate-500", excerpt: "The vast, isolating scale of the desert landscape..." },
      { name: "Close-up", description: "Tightly frames a person or object to show detail or emotion.", color: "text-rose-500", excerpt: "A tear rolling down the protagonist's cheek." },
      { name: "Low-key Lighting", description: "Creates deep shadows and high contrast for a dramatic, moody, or mysterious atmosphere.", color: "text-indigo-500", excerpt: "Severe lighting casting deep shadows across the villain's face." },
      { name: "High-key Lighting", description: "Bright, even illumination with few shadows, often used for upbeat or open scenes.", color: "text-amber-500", excerpt: "The bright, hopeful morning light filling the kitchen." }
    ],
    method2Name: "Diegetic vs. Non-Diegetic Sound",
    method2Steps: [
      "Listen to a movie clip with your eyes closed.",
      "Sort sounds into Diegetic (footsteps, rain) and Non-Diegetic (soundtrack, voiceover)."
    ]
  },
  {
    id: "eng_u4_2",
    title: "4.2 Storyboard Scripting & Mise-en-scène",
    problem: "Analyze the layout of the frame and camera movement.",
    context: "Visual Literacy",
    method1Name: "Mise-en-scène",
    techniques: [
      { name: "Costume and Color Palette", description: "Clothing choices that reflect character state or contrast with the environment.", color: "text-fuchsia-500", excerpt: "The vibrant red coat against the dreary grey city." },
      { name: "Props", description: "Objects handled by actors that carry symbolic meaning.", color: "text-emerald-500", excerpt: "The ticking pocket watch left on the empty desk." }
    ],
    method2Name: "Camera Movement",
    method2Steps: [
      "Take a paragraph from a novel.",
      "Sketch a 4-frame storyboard showing camera positions (tracking, panning, tilting) to capture tension."
    ]
  }
];

export const englishUnit4Practice: PracticeQuestion[] = [
  {
    id: 1,
    question: "What does the term **low-key** mean when describing the lighting design?",
    answerFullWorking: "Look at the context clues: \"single flickering streetlamp\" and \"deep, elongated shadows.\" Low-key lighting refers to a style with high contrast and lots of dark shadows, used to create an eerie or tense atmosphere.",
    type: 'multiple-choice',
    interactiveOptions: ['Bright and even lighting', 'High contrast and lots of dark shadows', 'Lighting that is not very important', 'Lighting from the sun'],
    interactiveAnswer: 'High contrast and lots of dark shadows'
  },
  {
    id: 2,
    question: "Where exactly did the production crew place the camera system?",
    answerFullWorking: "Scan the text for the word \"camera.\" Find the phrase: \"...rigged a high-angle camera system above the fire escape...\" The camera was placed above the fire escape.",
    type: 'multiple-choice',
    interactiveOptions: ['On the cobblestones', 'Behind a streetlamp', 'Above the fire escape', 'Inside a building'],
    interactiveAnswer: 'Above the fire escape'
  },
  {
    id: 3,
    question: "How does the choice of a **high-angle shot** help achieve the director's goal?",
    answerFullWorking: "Looking down at someone makes them look smaller on screen. This connects to making the character look \"helpless,\" \"small,\" and \"exposed,\" thereby making them appear weak or vulnerable to the audience.",
    type: 'multiple-choice',
    interactiveOptions: ['It makes the character look weak or vulnerable', 'It makes the character look incredibly powerful', 'It makes the scene look brighter', 'It hides the character\'s face'],
    interactiveAnswer: 'It makes the character look weak or vulnerable'
  },
  {
    id: 4,
    question: "Is the sound of the character's *“heavy breathing”* diegetic or non-diegetic?",
    answerFullWorking: "Diegetic sound comes from inside the story world; non-diegetic is added from outside. The breathing comes from the character inside the scene, so it is a diegetic sound.",
    type: 'multiple-choice',
    interactiveOptions: ['Diegetic', 'Non-diegetic', 'Synchronous', 'Synthetic'],
    interactiveAnswer: 'Diegetic'
  },
  {
    id: 5,
    question: "How do these technical choices work together to define the scene's genre?",
    answerFullWorking: "Combining a high angle showing weakness, dark shadow lighting, no music, and loud breathing builds fear and suspense. These elements indicate that the film belongs to the thriller or suspense genre.",
    type: 'multiple-choice',
    interactiveOptions: ['Comedy', 'Romance', 'Thriller or Suspense', 'Action'],
    interactiveAnswer: 'Thriller or Suspense'
  }
];

export const englishUnit4Assessment: any = {
  title: "Language & Film \u2013 Visual Literacy Assessment",
  description: "Formative: A written analytical response (PEE paragraph). Summative (Criteria A & C): Film Analysis Essay.",
  questions: [
    {
      id: 1,
      type: 'essay',
      question: "Summative Assessment: Watch the designated short film and write a structured analytical essay deconstructing how the director utilizes cinematography, lighting, and sound to communicate a central message."
    }
  ]
};

export const englishUnit4Assets: Asset[] = [
  {
    id: "asset_u4_1",
    type: "video",
    title: "Cinematography: The Art of the Camera",
    description: "An educational video explaining shot types, angles, and camera movement.",
    url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Cinematography"
  },
  {
    id: "asset_u4_2",
    type: "article",
    title: "Mise-en-scène Explained",
    description: "A comprehensive guide on analyzing everything within the cinematic frame.",
    url: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Mise-en-sc%C3%A8ne"
  },
  {
    id: "asset_u4_3",
    type: "video",
    title: "Diegetic vs. Non-Diegetic Sound",
    description: "Examples of how sound design manipulates audience emotion and perspective.",
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Diegetic_music"
  }
];

export const englishUnit5Examples: Example[] = [
  {
    id: "eng_u5_1",
    title: "5.2 The Insult Duel & Decoding Iambic Pentameter",
    problem: "Analyze fast-paced dialogue and Shakespearean meter.",
    context: "Shakespeare & Context",
    method1Name: "Linguistic Techniques",
    techniques: [
      { name: "Stichomythia", description: "Short, rapid alternating lines of dialogue, often used to show tension or wit.", color: "text-amber-500", excerpt: "Petruchio: Come, come, you wasp; i' faith, you are too angry. \nKatherina: If I be waspish, best beware my sting." },
      { name: "Puns", description: "A joke exploiting the different possible meanings of a word.", color: "text-rose-500", excerpt: "Petruchio: What, with my tongue in your tail? nay, come again, Good Kate; I am a gentleman." },
      { name: "Iambic Pentameter", description: "A line of verse with five metrical feet, each consisting of one short syllable followed by one long syllable.", color: "text-indigo-500", excerpt: "But **sun** it **is** not, **when** you **say** it **is** not..." }
    ],
    method2Name: "Decoding Meter",
    method2Steps: [
      "Take a 5-line passage from a soliloquy.",
      "Mark the unstressed (da) and stressed (DUM) syllables.",
      "Identify any breaks in the ten-syllable pattern and discuss the dramatic effect."
    ]
  },
  {
    id: "eng_u5_2",
    title: "5.2 The Context Translation & Aside Analysis",
    problem: "Evaluate subtext, context, and dramatic irony.",
    context: "Dramatic Devices",
    method1Name: "Dramatic Devices",
    techniques: [
      { name: "Soliloquy", description: "A speech speaking one's thoughts aloud when by oneself.", color: "text-emerald-500", excerpt: "Thus have I politicly begun my reign..." },
      { name: "Aside", description: "A remark intended to be heard by the audience but unheard by the other characters in the play.", color: "text-cyan-500", excerpt: "[Aside] I say it is the moon." },
      { name: "Dramatic Irony", description: "When the audience knows something the characters do not.", color: "text-fuchsia-500", excerpt: "The audience watches the 'taming' tactics while other characters remain confused." }
    ],
    method2Name: "The Context Translation",
    method2Steps: [
      "Rewrite Katherina's final controversial monologue into modern language.",
      "Discuss whether it is satirical or bound strictly to Elizabethan expectations."
    ]
  }
];

export const englishUnit5Practice: PracticeQuestion[] = [
  {
    id: 1,
    question: "What is the meaning of the word **compliance** as it is used in the final sentence?",
    answerFullWorking: "Look at the surrounding words: \"societal norms,\" \"rigid boundaries,\" and \"honor.\" Connect it to the historical roles of women in that era. Compliance means obeying rules, conforming to social expectations, or yielding to authority.",
    type: 'multiple-choice',
    interactiveOptions: ['Rebellion against rules', 'Obeying rules or conforming to expectations', 'Speaking to an audience', 'Economic survival'],
    interactiveAnswer: 'Obeying rules or conforming to expectations'
  },
  {
    id: 2,
    question: "What two distinct purposes did drama serve in Elizabethan playhouses?",
    answerFullWorking: "Locate the first sentence of the passage: \"...drama functioned as both entertainment and social instruction.\" The two purposes were entertainment and social instruction.",
    type: 'multiple-choice',
    interactiveOptions: ['News and entertainment', 'Entertainment and social instruction', 'Religious instruction and news', 'Social instruction and financial gain'],
    interactiveAnswer: 'Entertainment and social instruction'
  },
  {
    id: 3,
    question: "Why do modern audiences often misinterpret the actions in Shakespeare's plays?",
    answerFullWorking: "Find the word \"misinterpret\" in the text. Reason given: \"They view it through a modern lens rather than considering the historical context...\" They judge the story using modern values instead of understanding the rules of the historical era.",
    type: 'multiple-choice',
    interactiveOptions: ['The language is too difficult', 'They judge the story using modern values', 'The actors are not very good', 'They do not enjoy classical drama'],
    interactiveAnswer: 'They judge the story using modern values'
  },
  {
    id: 4,
    question: "The text mentions a device where a character *“speaks directly to the audience”* alone on stage. What is the term for this device?",
    answerFullWorking: "Scan the first paragraph for dramatic terms. Match the description: \"Shakespeare's use of the soliloquy provided a rare window...\" The technical term is a soliloquy.",
    type: 'multiple-choice',
    interactiveOptions: ['Dialogue', 'Soliloquy', 'Aside', 'Monologue'],
    interactiveAnswer: 'Soliloquy'
  },
  {
    id: 5,
    question: "What real-world constraints made a character's public obedience a matter of survival?",
    answerFullWorking: "Look at the final sentence for words related to survival. Core reasons: \"...tied to family honor and economic survival.\" Public obedience affected a person's financial safety and family reputation.",
    type: 'multiple-choice',
    interactiveOptions: ['Fear of the government', 'Family honor and economic survival', 'A lack of education', 'Strict religious laws'],
    interactiveAnswer: 'Family honor and economic survival'
  }
];

export const englishUnit5Assessment: any = {
  title: "'The Taming of the Shrew' \u2013 Shakespeare & Context Assessment",
  description: "Formative: Close-reading analytical paragraph. Summative (Criteria A & B): Literary Essay.",
  questions: [
    {
      id: 1,
      type: 'essay',
      question: "Summative Assessment: Complete a formal essay analyzing how the characterization of either Katherina or Petruchio reflects or challenges the cultural expectations of Elizabethan society."
    }
  ]
};

export const englishUnit5Assets: Asset[] = [
  {
    id: "asset_u5_1",
    type: "novel",
    title: "The Taming of the Shrew - Full Text",
    description: "The complete play with annotations and modern English translations.",
    url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=60",
    link: "https://shakespeare.folger.edu/shakespeares-works/the-taming-of-the-shrew/"
  },
  {
    id: "asset_u5_2",
    type: "video",
    title: "Shakespeare's Mother: The Secret Life of a Tudor Woman",
    description: "Gain historical context on the expectations and roles of women in Elizabethan society.",
    url: "https://images.unsplash.com/photo-1582214400329-87c17be9ddfa?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Women_in_the_early_modern_period"
  },
  {
    id: "asset_u5_3",
    type: "article",
    title: "Understanding Iambic Pentameter",
    description: "A guide to reading and understanding Shakespeare's metric choices and rhythm.",
    url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Iambic_pentameter"
  }
];

export const englishUnit1Assets: Asset[] = [
  {
    id: "asset_1a",
    type: "novel",
    title: "1984 by George Orwell",
    description: "An excerpt focusing on the concept of 'Newspeak' and how language can be used to control thought—a fundamental, extreme form of persuasion.",
    url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four"
  },
  {
    id: "asset_1b",
    type: "novel",
    title: "Fahrenheit 451 by Ray Bradbury",
    description: "Themes of censorship, mass media, and the struggle against a technology-driven, superficial culture.",
    url: "https://images.unsplash.com/photo-1518375836284-601c0da403bd?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/Fahrenheit_451"
  },
  {
    id: "asset_2a",
    type: "newspaper",
    title: "Gulf News: Environmental Editorial",
    description: "Analyzing the persuasive bias and emotive language used in a local editorial discussing environmental conservation in the UAE.",
    url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60",
    link: "https://gulfnews.com/opinion"
  },
  {
    id: "asset_2b",
    type: "newspaper",
    title: "The Guardian: Opinion Piece",
    description: "Examining modern rhetorical techniques and political persuasion in contemporary editorial writing.",
    url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=60",
    link: "https://www.theguardian.com/uk/commentisfree"
  },
  {
    id: "asset_3a",
    type: "advertisement",
    title: "McDonald's 'Big Mac' Classic Campaign",
    description: "A look at premium print advertisements, dissecting the target audience and visual layout used to sell fast food.",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60",
    link: "https://www.adsoftheworld.com/"
  },
  {
    id: "asset_3b",
    type: "advertisement",
    title: "Apple 'Think Different' Campaign",
    description: "An iconic advertisement showcasing branding by association, minimalist typography, and emotive appeal.",
    url: "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?w=600&auto=format&fit=crop&q=60",
    link: "https://www.youtube.com/watch?v=5sMBhDv4sik"
  },
  {
    id: "asset_3c",
    type: "advertisement",
    title: "Nike 'Just Do It' Campaign",
    description: "Analyzing the power of the imperative voice (triplets) and celebrity endorsement in sports advertising.",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
    link: "https://www.nike.com"
  },
  {
    id: "asset_4a",
    type: "video",
    title: "Documentary: The Century of the Self",
    description: "A critical documentary segment detailing how public relations and advertising tap into our deepest subconscious desires.",
    url: "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=600&auto=format&fit=crop&q=60",
    link: "https://en.wikipedia.org/wiki/The_Century_of_the_Self"
  },
  {
    id: "asset_4b",
    type: "video",
    title: "TED Talk: The magic of truth and lies (and iPods)",
    description: "Marco Tempest explores the nature of deception and storytelling in media and technology.",
    url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=60",
    link: "https://www.ted.com/talks/marco_tempest_the_magic_of_truth_and_lies_and_ipods"
  }
];
