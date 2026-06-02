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

// ── NGRT (New Group Reading Test) — 3 tests per unit ─────────────────────────
// Each test contains a short reading passage and 4 standardised MCQ questions.
// Thematically linked to the chapter so comprehension is contextually scaffolded.

export interface NGRTQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface NGRTTest {
  id: string;
  testNumber: 1 | 2 | 3;
  title: string;
  passage: string;
  questions: NGRTQuestion[];
}

// ── Unit 1 — Advertising & Persuasion ────────────────────────────────────────
export const englishUnit1NGRTTests: NGRTTest[] = [
  {
    id: 'ngrt-u1-1', testNumber: 1,
    title: 'The Green Promise',
    passage: `Every year, millions of tonnes of plastic waste end up in our oceans, silently strangling marine life and poisoning the food chain we all depend on. The Eco-Drive 500 is not merely a car — it is a declaration. By choosing to switch to our revolutionary hydrogen engine, you are not just saving on fuel costs (a staggering 62% reduction, verified by independent tests). You are joining a global community of forward-thinkers who refuse to sit idly by while the planet warms. The future does not wait. Neither should you.`,
    questions: [
      { id: 1, question: 'What percentage fuel cost reduction is claimed in the passage?', options: ['26%', '42%', '62%', '82%'], answer: '62%' },
      { id: 2, question: 'Which AFOREST technique is used in the phrase "staggering 62% reduction, verified by independent tests"?', options: ['Alliteration', 'Rhetorical question', 'Statistics', 'Emotive language'], answer: 'Statistics' },
      { id: 3, question: 'What does the phrase "sit idly by" imply about readers who do not buy the product?', options: ['They are lazy and passive', 'They are very busy', 'They already own a green car', 'They prefer public transport'], answer: 'They are lazy and passive' },
      { id: 4, question: 'Which sentence best describes the purpose of the final two lines?', options: ['To provide a statistic', 'To create urgency and compel immediate action', 'To describe the car\'s features', 'To introduce the product price'], answer: 'To create urgency and compel immediate action' },
    ],
  },
  {
    id: 'ngrt-u1-2', testNumber: 2,
    title: 'Charity Under the Spotlight',
    passage: `The small child in the photograph stares directly into the camera. Her eyes, wide and dark, tell a story that no number of facts could adequately convey. "For just £2 a day," the caption reads, "you can change everything." The charity advertisement deploys every known persuasive tool: emotive imagery, personal address (the word "you" appears eleven times in a single paragraph), and a donation deadline printed in bold red. The colour red is no accident — designers know it signals urgency and danger, priming the reader to act before rational thought can intervene.`,
    questions: [
      { id: 1, question: 'How many times does the word "you" appear in the single paragraph mentioned?', options: ['Seven', 'Nine', 'Eleven', 'Fourteen'], answer: 'Eleven' },
      { id: 2, question: 'Why is the colour red used for the donation deadline?', options: ['It is the charity\'s brand colour', 'It signals urgency and danger', 'It is easier to read', 'It matches the photograph'], answer: 'It signals urgency and danger' },
      { id: 3, question: 'What does "personal address" mean in the context of this passage?', options: ['Giving out the charity\'s postal address', 'Directly speaking to the reader using "you"', 'Writing the donor\'s name on the form', 'Including a personal story from the director'], answer: 'Directly speaking to the reader using "you"' },
      { id: 4, question: 'Which phrase from the passage best shows the technique of emotive language?', options: ['"For just £2 a day"', '"The colour red is no accident"', '"Her eyes, wide and dark, tell a story"', '"Printed in bold red"'], answer: '"Her eyes, wide and dark, tell a story"' },
    ],
  },
  {
    id: 'ngrt-u1-3', testNumber: 3,
    title: 'The Power of the Slogan',
    passage: `A good slogan must accomplish three things in under seven words: it must be memorable, it must encapsulate a brand's core identity, and it must create an emotional response. "Just Do It" achieves all three through the simple power of the imperative voice — a direct command that positions the customer not as a passive consumer but as an athlete, a conqueror of obstacles. The deliberate vagueness of the slogan is, paradoxically, its greatest strength. "It" can mean a morning run, a career change, or anything the reader desires. The brand becomes a mirror, reflecting the customer's own ambitions back at them.`,
    questions: [
      { id: 1, question: 'According to the passage, how many things must a good slogan accomplish?', options: ['Two', 'Three', 'Four', 'Five'], answer: 'Three' },
      { id: 2, question: 'What grammatical term describes the technique used in "Just Do It"?', options: ['Rhetorical question', 'Metaphor', 'Imperative voice', 'Alliteration'], answer: 'Imperative voice' },
      { id: 3, question: 'Why does the author describe the vagueness of "Just Do It" as a "strength"?', options: ['It saves time for the copywriter', 'Customers can project their own meaning onto it', 'Short slogans are cheaper to print', 'Vague words are easier to translate'], answer: 'Customers can project their own meaning onto it' },
      { id: 4, question: 'What does the metaphor "The brand becomes a mirror" suggest?', options: ['The product is shiny and reflective', 'The brand shows customers their own ambitions', 'Mirrors are used in advertising shoots', 'The brand copies other companies'], answer: 'The brand shows customers their own ambitions' },
    ],
  },
];

// ── Unit 2 — The Novel: Character & Perspective ───────────────────────────────
export const englishUnit2NGRTTests: NGRTTest[] = [
  {
    id: 'ngrt-u2-1', testNumber: 1,
    title: 'The New Arrival',
    passage: `The hall fell silent the moment Marcus stepped through the double doors. He was used to silences — the kind that stretched and hardened like cooling wax — but this one felt different. Two hundred pairs of eyes tracked him from his shoes (second-hand, one sole beginning to separate) to the bandage still wrapped around his left hand. He kept his chin level. His mother had drilled that into him since he could walk: chin level, shoulders back, let them stare. He found an empty seat near the window and settled into it with the deliberate slowness of someone who had learned, long ago, that running only made the pack give chase.`,
    questions: [
      { id: 1, question: 'What does the simile "hardened like cooling wax" tell us about the silence?', options: ['It was warm and comfortable', 'It was short and quickly forgotten', 'It was rigid and suffocating', 'It was pleasant and peaceful'], answer: 'It was rigid and suffocating' },
      { id: 2, question: 'Why does Marcus sit down "with the deliberate slowness" of someone who knows running invites a chase?', options: ['He is physically tired from a long journey', 'He wants to show confidence and not appear afraid', 'He is unsure where to sit', 'He has a painful injury slowing him down'], answer: 'He wants to show confidence and not appear afraid' },
      { id: 3, question: 'What does the detail about Marcus\'s shoes tell the reader?', options: ['He prefers second-hand fashion', 'He is wealthy but modest', 'His family does not have much money', 'He chose the wrong shoes for school'], answer: 'His family does not have much money' },
      { id: 4, question: 'From whose perspective is this passage told?', options: ['An omniscient narrator', 'A third-person limited narrator focused on Marcus', 'A second-person narrator', 'A first-person narrator inside Marcus\'s head'], answer: 'A third-person limited narrator focused on Marcus' },
    ],
  },
  {
    id: 'ngrt-u2-2', testNumber: 2,
    title: 'Turning Point',
    passage: `Before that afternoon in the library, Priya had been a static character in her own story — reacting rather than acting, carried along by the current rather than choosing her direction. But when she found the notebook beneath the floorboard, something shifted. The handwriting was her grandmother's. The dates were from forty years before Priya was born. Page after page described a woman who had argued with teachers, who had walked out of her own arranged engagement, who had built a business from the proceeds of selling her gold bangles. Priya sat on the dusty floor for two hours, reading and re-reading. When she finally stood, she stood differently.`,
    questions: [
      { id: 1, question: 'What literary term best describes Priya before she finds the notebook?', options: ['Dynamic character', 'Round character', 'Static character', 'Protagonist'], answer: 'Static character' },
      { id: 2, question: 'What does the phrase "carried along by the current" suggest about Priya?', options: ['She enjoys swimming', 'She is passive and lets life happen to her', 'She is adventurous and free-spirited', 'She follows the crowd intentionally'], answer: 'She is passive and lets life happen to her' },
      { id: 3, question: 'Which detail best shows that Priya\'s grandmother was a dynamic, independent character?', options: ['She kept a notebook under the floorboard', 'She had beautiful handwriting', 'She sold her gold bangles to build a business', 'She lived forty years before Priya was born'], answer: 'She sold her gold bangles to build a business' },
      { id: 4, question: 'What does "When she finally stood, she stood differently" imply?', options: ['Priya had hurt her leg sitting on the floor', 'Priya had grown taller while reading', 'Priya had been transformed internally by what she read', 'Priya was copying her grandmother\'s posture'], answer: 'Priya had been transformed internally by what she read' },
    ],
  },
  {
    id: 'ngrt-u2-3', testNumber: 3,
    title: 'Unreliable Narrator',
    passage: `I am going to tell you exactly what happened that night, and I want you to understand from the very beginning that I have no reason to lie. The window was already broken when I arrived. The dog — their dog, not mine — had knocked over the vase. I simply picked up the pieces. The fact that the letters were inside the vase, and the fact that I then read those letters, was a matter of entirely innocent curiosity. Anyone would have done the same. It is the letters that are the real crime here, not anything I may or may not have done with them afterwards.`,
    questions: [
      { id: 1, question: 'What technique does the narrator use at the start by saying "I have no reason to lie"?', options: ['Personification', 'Pre-emptive self-defence to make us trust them', 'A direct threat to the reader', 'A statement of confirmed fact'], answer: 'Pre-emptive self-defence to make us trust them' },
      { id: 2, question: 'Why might a careful reader doubt this narrator?', options: ['The narrator admits to reading private letters', 'The narrator claims innocence too forcefully and deflects blame', 'The narrator describes a broken window clearly', 'The narrator is afraid of the dog'], answer: 'The narrator claims innocence too forcefully and deflects blame' },
      { id: 3, question: 'What narrative device is being demonstrated by this passage?', options: ['Omniscient narration', 'Unreliable first-person narration', 'Third-person limited narration', 'Stream of consciousness'], answer: 'Unreliable first-person narration' },
      { id: 4, question: 'The narrator says the letters are "the real crime." What effect does this have?', options: ['It proves the narrator is innocent', 'It redirects blame away from the narrator\'s own actions', 'It confirms the narrator found stolen property', 'It shows the narrator feels genuine guilt'], answer: 'It redirects blame away from the narrator\'s own actions' },
    ],
  },
];

// ── Unit 3 — Voices in Verse: Poetry & Form ───────────────────────────────────
export const englishUnit3NGRTTests: NGRTTest[] = [
  {
    id: 'ngrt-u3-1', testNumber: 1,
    title: 'The Language of Storm',
    passage: `The storm does not ask permission. It arrives at the coast like an uninvited guest who has forgotten how to be quiet — shattering windows with its fist, scattering the fishing boats like seeds. The gulls, those ancient navigators, had read its handwriting in the clouds three days before and had flown inland. Only the lighthouse remained, standing in its patient, salt-bleached silence, blinking its amber eye into the dark. It had survived nineteen storms. It would survive this one.`,
    questions: [
      { id: 1, question: 'What literary device is used when the storm is described as "an uninvited guest"?', options: ['Simile', 'Personification', 'Onomatopoeia', 'Assonance'], answer: 'Personification' },
      { id: 2, question: 'What does "scattering the fishing boats like seeds" tell us about the storm\'s power?', options: ['The storm is gentle and scatters things lightly', 'The storm is a farmer planting boats', 'The storm throws boats around with effortless force', 'The boats are very small and lightweight'], answer: 'The storm throws boats around with effortless force' },
      { id: 3, question: 'What is the effect of ending the passage with two short, declarative sentences?', options: ['It shows the author ran out of ideas', 'It creates a sense of certainty and enduring strength', 'It speeds the narrative pace towards a climax', 'It rhymes with the rest of the passage'], answer: 'It creates a sense of certainty and enduring strength' },
      { id: 4, question: 'What evidence in the passage shows that animals can sense extreme weather?', options: ['The lighthouse blinks its amber eye', 'The gulls read storm signals in the clouds three days early', 'The fishing boats are scattered', 'The windows shatter from the wind'], answer: 'The gulls read storm signals in the clouds three days early' },
    ],
  },
  {
    id: 'ngrt-u3-2', testNumber: 2,
    title: 'Reading a Sonnet',
    passage: `A sonnet is a fourteen-line argument. The first eight lines (the octave) establish a problem, a tension, or a contradiction. The final six lines (the sestet) then pivot — Shakespeare's sonnets use the word "but" or "yet" to signal this turn, which is called the volta — and offer a resolution, a counter-argument, or an unexpected revelation. When Shakespeare writes, "Shall I compare thee to a summer's day? / Thou art more lovely and more temperate," he opens a comparison only to immediately complicate it. Summer, he argues, is inconstant, too hot, too brief. His beloved, preserved in the poem itself, will last as long as the poem is read.`,
    questions: [
      { id: 1, question: 'What is the purpose of the octave in a sonnet?', options: ['To resolve a conflict', 'To establish a problem or tension', 'To rhyme perfectly with the sestet', 'To describe the poem\'s author'], answer: 'To establish a problem or tension' },
      { id: 2, question: 'What is the "volta" in a sonnet?', options: ['The final couplet of the poem', 'The title of the poem', 'The pivoting turn in the argument, signalled by "but" or "yet"', 'The rhyme scheme of the octave'], answer: 'The pivoting turn in the argument, signalled by "but" or "yet"' },
      { id: 3, question: 'What criticism does Shakespeare make of summer in the passage?', options: ['It is cold and grey', 'It is inconstant, too hot, and too brief', 'It is more beautiful than his beloved', 'It lasts longer than expected'], answer: 'It is inconstant, too hot, and too brief' },
      { id: 4, question: 'According to Shakespeare\'s argument in the passage, what will preserve his beloved forever?', options: ['A painting or sculpture', 'The poem itself, as long as it is read', 'Her own natural beauty', 'A summer\'s day'], answer: 'The poem itself, as long as it is read' },
    ],
  },
  {
    id: 'ngrt-u3-3', testNumber: 3,
    title: 'Sound and Sense',
    passage: `Poets know that the sound of a word is as important as its meaning. The technique of sibilance — stringing together soft "s" and "sh" sounds — creates a hushing, whispering atmosphere, as if the poem itself is leaning in to confide a secret. By contrast, hard plosive consonants (b, p, d, t) create impact and aggression. Compare "the soft, silver stream slips silently south" with "the black rocks burst and battered the brutal beach." Both are descriptions of water, yet they inhabit entirely different emotional worlds because of the sounds the poet has chosen. Sound is not decoration. It is meaning.`,
    questions: [
      { id: 1, question: 'What is sibilance?', options: ['Repetition of hard plosive consonants', 'Repetition of soft "s" and "sh" sounds', 'A type of rhyme scheme', 'The rhythm of a line'], answer: 'Repetition of soft "s" and "sh" sounds' },
      { id: 2, question: 'According to the passage, what effect do hard plosive consonants create?', options: ['Whispering and mystery', 'Sadness and longing', 'Impact and aggression', 'Softness and calm'], answer: 'Impact and aggression' },
      { id: 3, question: 'Both example phrases in the passage describe what subject?', options: ['A forest', 'Fire', 'Water', 'The wind'], answer: 'Water' },
      { id: 4, question: 'What is the author\'s argument in the final sentence, "Sound is not decoration. It is meaning."?', options: ['Poets should focus only on rhyme', 'Sound choices are purely aesthetic and optional', 'The sounds a poet chooses actively shape and create meaning', 'Decoration and meaning are the same thing in poetry'], answer: 'The sounds a poet chooses actively shape and create meaning' },
    ],
  },
];

// ── Unit 4 — Language & Film: Visual Literacy ─────────────────────────────────
export const englishUnit4NGRTTests: NGRTTest[] = [
  {
    id: 'ngrt-u4-1', testNumber: 1,
    title: 'The Grammar of the Camera',
    passage: `Every choice a cinematographer makes is a grammatical decision. A low-angle shot — camera aimed upward at the subject — grants power and authority, elevating a character to something almost mythological. A high-angle shot reverses this entirely: the subject shrinks, becomes vulnerable, an object of pity or contempt. The close-up is the cinema's equivalent of italics, insisting that the audience pay intimate attention to a single detail — a trembling lip, a clenched fist, a tear that never falls. When these tools are combined, they create not just an image but an argument, a point of view pressed silently but insistently against the audience's understanding.`,
    questions: [
      { id: 1, question: 'What effect does a low-angle shot create?', options: ['The subject appears small and vulnerable', 'The subject appears powerful and authoritative', 'The subject is hidden from view', 'The subject appears to be running'], answer: 'The subject appears powerful and authoritative' },
      { id: 2, question: 'What does the author compare a close-up to in written language?', options: ['Bold text', 'Italics', 'Capital letters', 'Quotation marks'], answer: 'Italics' },
      { id: 3, question: 'What does the phrase "an argument pressed silently against the audience\'s understanding" suggest?', options: ['Audiences never understand films', 'Cinematography communicates ideas without needing words', 'Films use subtitles to make arguments', 'Silent films are more powerful than talking ones'], answer: 'Cinematography communicates ideas without needing words' },
      { id: 4, question: 'A high-angle shot is said to make the subject become "an object of pity or contempt." What does this reveal about how camera position shapes audience emotion?', options: ['It confirms that angles are purely technical decisions', 'Camera angles actively manipulate how audiences feel about characters', 'Audiences always feel sympathy for characters shot from above', 'High-angle shots are only used in horror films'], answer: 'Camera angles actively manipulate how audiences feel about characters' },
    ],
  },
  {
    id: 'ngrt-u4-2', testNumber: 2,
    title: 'The Sound Behind the Scene',
    passage: `In the cinema, what you cannot see is often more powerful than what you can. Non-diegetic sound — music and narration added in post-production that exists outside the story world — reaches directly into the viewer's nervous system and tells it how to feel before rational analysis has a chance to catch up. Horror films exploit this ruthlessly. Research has shown that the deep, sub-bass frequencies used in horror soundtracks (sometimes below the threshold of normal hearing) trigger a physiological anxiety response in listeners. Remove the music from any famous horror scene, and the footage becomes almost comedic. The monster is never as terrifying as the note you did not know you were hearing.`,
    questions: [
      { id: 1, question: 'What is non-diegetic sound?', options: ['Sound that characters in the film can hear', 'Natural ambient sounds recorded on set', 'Music and narration added in post-production from outside the story world', 'Sound effects created by props'], answer: 'Music and narration added in post-production from outside the story world' },
      { id: 2, question: 'What happens to horror scenes when the music is removed, according to the passage?', options: ['They become more frightening', 'They become almost comedic', 'They become confusing', 'They remain equally terrifying'], answer: 'They become almost comedic' },
      { id: 3, question: 'What do deep sub-bass frequencies in horror soundtracks do to audiences?', options: ['They make audiences fall asleep', 'They trigger a physiological anxiety response', 'They cause hearing damage', 'They signal that the film is ending'], answer: 'They trigger a physiological anxiety response' },
      { id: 4, question: 'What is the main argument of this passage?', options: ['Horror films rely entirely on monsters for their effect', 'Post-production is the most expensive part of filmmaking', 'Sound manipulates audience emotion more powerfully than visuals', 'Diegetic sound should be louder than non-diegetic sound'], answer: 'Sound manipulates audience emotion more powerfully than visuals' },
    ],
  },
  {
    id: 'ngrt-u4-3', testNumber: 3,
    title: 'Colour as Language',
    passage: `In film, colour is never innocent. Directors and production designers deploy colour palettes as deliberately as poets choose their words. Wes Anderson's films use symmetrical frames and pastel colour palettes to create a world of nostalgic, artificial perfection — a world the viewer knows is not real but longs for anyway. By contrast, the washed-out, de-saturated grey-green tones of a war film like *Saving Private Ryan* strip the world of beauty, insisting on the ugliness and moral compromise of combat. Even costume choices communicate: a character dressed in white within a world of grey and black becomes immediately symbolic — purity surrounded by corruption, or innocence about to be destroyed.`,
    questions: [
      { id: 1, question: 'What does the author mean when saying "colour is never innocent"?', options: ['Colours in films are always accidental', 'Every colour choice communicates meaning deliberately', 'Innocent characters always wear white', 'Film studios cannot afford to add colour'], answer: 'Every colour choice communicates meaning deliberately' },
      { id: 2, question: 'What effect do pastel colour palettes create in Wes Anderson\'s films?', options: ['A sense of danger and war', 'A harsh, realistic portrayal of life', 'A nostalgic, artificial perfection the viewer longs for', 'A de-saturated, grey world'], answer: 'A nostalgic, artificial perfection the viewer longs for' },
      { id: 3, question: 'What do "de-saturated grey-green tones" communicate in a war film?', options: ['Optimism and hope', 'The beauty of the natural landscape', 'Ugliness and the moral compromise of combat', 'A historical time period before colour film'], answer: 'Ugliness and the moral compromise of combat' },
      { id: 4, question: 'A character dressed in white in a grey-and-black world represents what, according to the passage?', options: ['An unimportant background character', 'Purity surrounded by corruption, or innocence about to be destroyed', 'The villain of the story', 'A character who has wealth and status'], answer: 'Purity surrounded by corruption, or innocence about to be destroyed' },
    ],
  },
];

// ── Unit 5 — Shakespeare & Context ────────────────────────────────────────────
export const englishUnit5NGRTTests: NGRTTest[] = [
  {
    id: 'ngrt-u5-1', testNumber: 1,
    title: 'The Globe and Its World',
    passage: `The Globe Theatre, opened in 1599 on the south bank of the Thames, was a radical democratic space in an era of rigid social hierarchy. Groundlings — the poorest members of the audience — paid a penny to stand in the open yard directly beneath the stage, packed together in sun or rain, eating nuts and heckling freely. The wealthy sat in covered galleries above. Yet every person in that crowd, from nobleman to illiterate apprentice, watched the same play. Shakespeare wrote for all of them simultaneously: crude slapstick and punning jokes for the groundlings, elaborate rhetoric and philosophical complexity for the educated elite. His genius was that both groups believed the play had been written exclusively for them.`,
    questions: [
      { id: 1, question: 'How much did groundlings pay to enter The Globe?', options: ['Tuppence', 'A shilling', 'A penny', 'Nothing — entry was free'], answer: 'A penny' },
      { id: 2, question: 'Where did the wealthiest audience members sit?', options: ['In the open yard beneath the stage', 'On the stage itself', 'In covered galleries above', 'At the back of the theatre'], answer: 'In covered galleries above' },
      { id: 3, question: 'What does the author mean by calling The Globe "a radical democratic space"?', options: ['The theatre was owned by the government', 'All social classes watched the same performance in the same place', 'Women were allowed to perform on the stage', 'The plays were about politics and elections'], answer: 'All social classes watched the same performance in the same place' },
      { id: 4, question: 'What was Shakespeare\'s genius, according to the final sentence?', options: ['He wrote only for educated nobles', 'He made each group feel the play was written specifically for them', 'He charged different prices to different audiences', 'He only wrote comedies for groundlings'], answer: 'He made each group feel the play was written specifically for them' },
    ],
  },
  {
    id: 'ngrt-u5-2', testNumber: 2,
    title: 'The Language of Power',
    passage: `In Elizabethan England, mastery of language was mastery of power. Rhetoric — the formal art of persuasive speech — was a compulsory subject in grammar schools, and the most successful courtiers were those who could deploy its weapons with surgical precision: a well-timed allusion to a classical text, a metaphor that flattered without being obsequious, a pause of calculated length before a reply. Shakespeare's villains — Iago, Richard III — are invariably the cleverest speakers in the room. They understand that words are not just communication: they are architecture, building the reality in which others choose to live. The most dangerous weapon in Elizabethan society was not a sword. It was a perfectly constructed sentence.`,
    questions: [
      { id: 1, question: 'What was rhetoric in Elizabethan schools?', options: ['A type of musical performance', 'An optional art class for wealthy students', 'The formal art of persuasive speech, a compulsory subject', 'A form of swordsmanship'], answer: 'The formal art of persuasive speech, a compulsory subject' },
      { id: 2, question: 'According to the passage, what characterizes Shakespeare\'s villains like Iago and Richard III?', options: ['They are the strongest fighters in the play', 'They are the cleverest speakers in the room', 'They are disliked for their poor vocabulary', 'They are cowardly and avoid conflict'], answer: 'They are the cleverest speakers in the room' },
      { id: 3, question: 'What does the metaphor "words are not just communication: they are architecture" mean?', options: ['Shakespeare worked as an architect', 'Words are physically heavy and can break things', 'Language constructs and shapes the reality that people believe in', 'Elizabethan sentences were very long and complicated'], answer: 'Language constructs and shapes the reality that people believe in' },
      { id: 4, question: 'What does the passage identify as "the most dangerous weapon in Elizabethan society"?', options: ['A sword or dagger', 'Rhetorical flattery in public', 'A perfectly constructed sentence', 'A letter sent to the Queen'], answer: 'A perfectly constructed sentence' },
    ],
  },
  {
    id: 'ngrt-u5-3', testNumber: 3,
    title: 'Reading Katherina',
    passage: `Modern audiences frequently misread Katherina in *The Taming of the Shrew*, judging her by twenty-first century standards of gender equality rather than the Elizabethan context in which she was written. In Elizabethan England, a woman who publicly refused to obey her father or husband risked social ruin — not merely disapproval, but the withdrawal of all financial support and legal protection. Katherina's famous final speech, in which she argues for a wife's obedience, has been read as Shakespeare's endorsement of patriarchy, as biting satire, or — most intriguingly — as the speech of a woman who has learned to perform compliance while retaining her inner defiance. The text supports all three readings simultaneously. That is its power.`,
    questions: [
      { id: 1, question: 'What mistake do modern audiences make when reading Katherina, according to the passage?', options: ['They do not read the play carefully', 'They judge her by modern values rather than Elizabethan context', 'They confuse her with characters in other Shakespeare plays', 'They misunderstand the plot entirely'], answer: 'They judge her by modern values rather than Elizabethan context' },
      { id: 2, question: 'What risk did an Elizabethan woman face by publicly defying her father or husband?', options: ['Arrest and imprisonment', 'Social ruin and loss of financial and legal protection', 'Being exiled from England', 'Being fined by the local magistrate'], answer: 'Social ruin and loss of financial and legal protection' },
      { id: 3, question: 'Which of the following is NOT listed as a possible interpretation of Katherina\'s final speech?', options: ['Endorsement of patriarchy', 'Biting satire', 'Performance of compliance hiding inner defiance', 'A genuine declaration of romantic love'], answer: 'A genuine declaration of romantic love' },
      { id: 4, question: 'Why does the author say the play\'s ability to support multiple readings simultaneously is "its power"?', options: ['It means audiences never get bored re-reading it', 'It shows Shakespeare was confused about his own intentions', 'Texts that support multiple readings are richer, more complex, and more enduring', 'It proves that Shakespeare supported women\'s rights'], answer: 'Texts that support multiple readings are richer, more complex, and more enduring' },
    ],
  },
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
