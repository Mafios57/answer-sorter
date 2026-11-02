// Item bank for the Answer Sorting Game.
// Each item needs: one "correct" answer, at least one "trap" (with "mis" and "why"),
// and one "dud". "target" is the word that tells the student what to find (or null).
// ages: "12-15", "16-19", or both.

window.ITEMS = [
  {
    id: "cm1", subject: "Core Math", ages: ["12-15"], syllabus: "BECE: decimals",
    stem: "Which number is the largest: 0.3, 0.25, or 0.125?",
    target: "largest",
    answers: [
      { text: "0.3", type: "correct" },
      { text: "0.25", type: "trap", mis: "Whole-number thinking", why: "Reads 25 as bigger than 3, as if the digits were whole numbers." },
      { text: "0.125", type: "trap", mis: "Longer is larger", why: "Thinks more digits after the point means a bigger number." },
      { text: "3", type: "dud", why: "3 is not one of the numbers in the question." }
    ],
    tip: "Write each number to three places: 0.300, 0.250, 0.125. Then compare."
  },
  {
    id: "cm2", subject: "Core Math", ages: ["12-15"], syllabus: "BECE: fractions",
    stem: "What is 1/2 + 1/3?",
    target: null,
    answers: [
      { text: "5/6", type: "correct" },
      { text: "2/5", type: "trap", mis: "Add tops and add bottoms", why: "Adds numerators and denominators, like the rule for multiplying." },
      { text: "6", type: "dud", why: "Two fractions smaller than 1 cannot add up to 6." }
    ],
    tip: "Check the size. 1/2 alone is bigger than 2/5, so the sum cannot be 2/5."
  },
  {
    id: "cm3", subject: "Core Math", ages: ["16-19"], syllabus: "WASSCE: simultaneous equations",
    stem: "Ama buys 2 pens and 3 books for GH¢31. Kofi buys 2 pens and 1 book for GH¢17. What does one book cost?",
    target: "book",
    answers: [
      { text: "GH¢7", type: "correct" },
      { text: "GH¢14", type: "trap", mis: "Stopping mid-procedure", why: "Finds that 2 books cost GH¢14 and stops there." },
      { text: "GH¢5", type: "trap", mis: "Solving for the wrong unknown", why: "Gives the price of a pen, not a book." },
      { text: "GH¢48", type: "dud", why: "Adds all the numbers together." }
    ],
    tip: "Ask what your number stands for. Then check both purchases: 2(5) + 3(7) = 31."
  },
  {
    id: "cm4", subject: "Core Math", ages: ["12-15"], syllabus: "BECE: word problems",
    stem: "A trader sold 15 oranges. After that, she had 3 times as many oranges as she sold. How many oranges did she have at first?",
    target: "first",
    answers: [
      { text: "60", type: "correct" },
      { text: "45", type: "trap", mis: "Answering a nearby question", why: "Gives how many were left after selling, not how many at first." },
      { text: "5", type: "trap", mis: "Keyword means operation", why: "Reads \"times\" as a cue to divide." },
      { text: "10", type: "dud", why: "She sold 15, so she must have had more than 15." }
    ],
    tip: "Draw the story: 15 sold, 45 left, so 60 at the start."
  },
  {
    id: "cm5", subject: "Core Math", ages: ["12-15", "16-19"], syllabus: "BECE and WASSCE: linear equations",
    stem: "If 3x + 4 = 19, find the value of 2x.",
    target: "2x",
    answers: [
      { text: "10", type: "correct" },
      { text: "5", type: "trap", mis: "Answering a nearby question", why: "Finds x and stops. The question asks for 2x." },
      { text: "46", type: "dud", why: "No step in solving this equation gives 46." }
    ],
    tip: "Circle what the question asks for before you start solving."
  },
  {
    id: "cm6", subject: "Core Math", ages: ["12-15"], syllabus: "BECE: word problems",
    stem: "Esi has GH¢24. She has GH¢6 less than Yaw. How much does Yaw have?",
    target: "Yaw",
    answers: [
      { text: "GH¢30", type: "correct" },
      { text: "GH¢18", type: "trap", mis: "Keyword means operation", why: "Sees \"less\" and subtracts." },
      { text: "GH¢144", type: "dud", why: "Multiplies the two numbers. Nothing in the story multiplies." }
    ],
    tip: "Ask who has more. Esi has less, so Yaw has more than GH¢24."
  },
  {
    id: "am1", subject: "Advanced Math", ages: ["16-19"], syllabus: "WASSCE Elective Math: algebra",
    stem: "Expand (x + 3)².",
    target: null,
    answers: [
      { text: "x² + 6x + 9", type: "correct" },
      { text: "x² + 9", type: "trap", mis: "Squaring each term separately", why: "Squares x and 3 but misses the middle term 6x." },
      { text: "6x", type: "dud", why: "Drops the squared terms completely." }
    ],
    tip: "Test with x = 1. (1 + 3)² = 16, but 1 + 9 = 10."
  },
  {
    id: "am2", subject: "Advanced Math", ages: ["16-19"], syllabus: "WASSCE Elective Math: differentiation",
    stem: "Find dy/dx if y = (2x + 1)³.",
    target: null,
    answers: [
      { text: "6(2x + 1)²", type: "correct" },
      { text: "3(2x + 1)²", type: "trap", mis: "Forgetting the chain rule", why: "Uses the power rule but does not multiply by the derivative of 2x + 1." },
      { text: "(2x + 1)⁴/8", type: "trap", mis: "Mixing up differentiation and integration", why: "Integrates instead of differentiating." },
      { text: "0", type: "dud", why: "y changes when x changes, so dy/dx cannot be 0." }
    ],
    tip: "Ask whether the inside of the bracket changes with x. If it does, use the chain rule."
  },
  {
    id: "is1", subject: "Integrated Science", ages: ["12-15"], syllabus: "BECE: plant nutrition",
    stem: "Where does most of the dry mass of a large tree come from?",
    target: "dry",
    answers: [
      { text: "Carbon dioxide from the air", type: "correct" },
      { text: "The soil", type: "trap", mis: "Plants eat soil", why: "Roots sit in soil, so soil feels like plant food." },
      { text: "Water", type: "trap", mis: "Water builds the plant", why: "Water matters, but most of the dry mass is carbon from the air." },
      { text: "The animals that live on the tree", type: "dud", why: "Animals do not give their mass to the tree." }
    ],
    tip: "Recall photosynthesis. The carbon in glucose comes from carbon dioxide."
  },
  {
    id: "ph1", subject: "Physics", ages: ["16-19"], syllabus: "WASSCE Physics: mechanics",
    stem: "A ball is thrown straight up. At its highest point, what is the net force on it?",
    target: "net",
    answers: [
      { text: "Downward, equal to its weight", type: "correct" },
      { text: "Zero", type: "trap", mis: "No motion means no force", why: "The ball stops for an instant, so it feels like no force acts." },
      { text: "Upward, from the throw", type: "trap", mis: "Force stored in a moving object", why: "Thinks the throw leaves a force inside the ball." },
      { text: "Sideways", type: "dud", why: "Nothing pushes the ball sideways." }
    ],
    tip: "Ask whether gravity ever switches off."
  },
  {
    id: "ph2", subject: "Physics", ages: ["16-19"], syllabus: "WASSCE Physics: electricity",
    stem: "Two 6 Ω resistors are connected in parallel across a 12 V battery. What current flows from the battery?",
    target: "parallel",
    answers: [
      { text: "4 A", type: "correct" },
      { text: "1 A", type: "trap", mis: "Using the series formula for parallel", why: "Adds the resistors to get 12 Ω, as in a series circuit." },
      { text: "2 A", type: "trap", mis: "Counting one path only", why: "Uses only one 6 Ω resistor." },
      { text: "12 V", type: "dud", why: "Volts measure voltage, not current." }
    ],
    tip: "Parallel paths give current more ways through, so total resistance drops below 6 Ω."
  },
  {
    id: "ph3", subject: "Physics", ages: ["16-19"], syllabus: "WASSCE Physics: motion",
    stem: "A car moves at a constant 20 m/s for 5 s. What is its acceleration?",
    target: "constant",
    answers: [
      { text: "0 m/s²", type: "correct" },
      { text: "4 m/s²", type: "trap", mis: "Using the numbers given", why: "Divides speed by time because those numbers are in the question." },
      { text: "25 kg", type: "dud", why: "Kilograms measure mass, not acceleration." }
    ],
    tip: "Read \"constant\". No change in speed means no acceleration."
  },
  {
    id: "ph4", subject: "Physics", ages: ["16-19"], syllabus: "WASSCE Physics: energy",
    stem: "A 2 kg ball moves at 36 km/h. What is its kinetic energy?",
    target: "km/h",
    answers: [
      { text: "100 J", type: "correct" },
      { text: "1,296 J", type: "trap", mis: "Skipping unit conversion", why: "Uses 36 without changing km/h to m/s." },
      { text: "10 J", type: "trap", mis: "Forgetting to square", why: "Uses v instead of v² in ½mv²." },
      { text: "100 kg", type: "dud", why: "Energy is measured in joules, not kilograms." }
    ],
    tip: "Change every unit to SI first. 36 km/h = 10 m/s."
  },
  {
    id: "ch1", subject: "Chemistry", ages: ["12-15", "16-19"], syllabus: "BECE and WASSCE: solutions",
    stem: "Salt dissolves in water. What happens to the salt?",
    target: null,
    answers: [
      { text: "It splits into ions that spread through the water, and its mass stays the same", type: "correct" },
      { text: "It disappears and has no mass", type: "trap", mis: "Dissolving destroys matter", why: "You cannot see the salt, so it seems gone." },
      { text: "It melts", type: "trap", mis: "Dissolving is melting", why: "Mixes up dissolving with melting. Melting needs heat." },
      { text: "It turns into sugar", type: "dud", why: "Salt and sugar are different substances." }
    ],
    tip: "Weigh it. The solution weighs the same as the water plus the salt."
  },
  {
    id: "ch2", subject: "Chemistry", ages: ["16-19"], syllabus: "WASSCE Chemistry: mole concept",
    stem: "How many moles are in 8 g of oxygen gas, O₂? (O = 16)",
    target: "O₂",
    answers: [
      { text: "0.25 mol", type: "correct" },
      { text: "0.5 mol", type: "trap", mis: "Atom mass for a molecule", why: "Uses 16 for O instead of 32 for O₂." },
      { text: "4 mol", type: "trap", mis: "Dividing upside down", why: "Divides 32 by 8 instead of 8 by 32." },
      { text: "256 g", type: "dud", why: "The question asks for moles, not grams." }
    ],
    tip: "Write the formula first. Then find its molar mass: O₂ = 32 g/mol."
  },
  {
    id: "st1", subject: "Statistics", ages: ["12-15", "16-19"], syllabus: "BECE and WASSCE: probability",
    stem: "A fair coin lands heads 5 times in a row. What is the probability the next toss is heads?",
    target: "next",
    answers: [
      { text: "1/2", type: "correct" },
      { text: "Less than 1/2, because tails is due", type: "trap", mis: "Gambler's fallacy", why: "Expects a run of heads to even out." },
      { text: "More than 1/2, because heads is on a streak", type: "trap", mis: "Hot-hand belief", why: "Thinks a streak makes heads more likely." },
      { text: "2", type: "dud", why: "A probability cannot be more than 1." }
    ],
    tip: "Ask whether the coin remembers the last toss."
  },
  {
    id: "st2", subject: "Statistics", ages: ["16-19"], syllabus: "WASSCE: statistics",
    stem: "Five workers earn GH¢300, 320, 340, 350, and 2,000. Which value best describes a typical worker's pay?",
    target: "typical",
    answers: [
      { text: "GH¢340, the median", type: "correct" },
      { text: "GH¢662, the mean", type: "trap", mis: "Typical always means the mean", why: "Uses the mean, which one very high pay pulls up." },
      { text: "GH¢2,000", type: "dud", why: "Only one worker earns that much." }
    ],
    tip: "Check that the answer sits near most of the values. 4 of 5 workers earn under GH¢400."
  },
  {
    id: "bi1", subject: "Biology", ages: ["12-15", "16-19"], syllabus: "BECE and WASSCE: respiration",
    stem: "Do green plants respire?",
    target: null,
    answers: [
      { text: "Yes, all the time, day and night", type: "correct" },
      { text: "No, plants photosynthesize instead", type: "trap", mis: "Photosynthesis replaces respiration", why: "Learns photosynthesis as the plant process and respiration as the animal process." },
      { text: "Only at night", type: "trap", mis: "Plants switch between processes", why: "Thinks respiration and photosynthesis take turns." },
      { text: "No, plants are not living things", type: "dud", why: "Plants are living things." }
    ],
    tip: "Ask where a plant's cells get energy at noon."
  },
  {
    id: "bi2", subject: "Biology", ages: ["16-19"], syllabus: "WASSCE Biology: cells",
    stem: "A red blood cell is placed in a hypotonic solution. What happens?",
    target: "hypotonic",
    answers: [
      { text: "Water enters by osmosis, the cell swells and can burst", type: "correct" },
      { text: "The cell shrinks", type: "trap", mis: "Mixing up hypotonic and hypertonic", why: "Moves water the wrong way. That happens in a hypertonic solution." },
      { text: "The cell turns into a plant cell", type: "dud", why: "A cell cannot change into a different kind of cell." }
    ],
    tip: "Translate the word. Hypotonic means less solute outside, so water moves in."
  },
  {
    id: "la1", subject: "Language", ages: ["12-15"], syllabus: "BECE: comprehension",
    stem: "\"The minister's remarks were anything but reassuring.\" What does this mean?",
    target: null,
    answers: [
      { text: "The remarks were worrying", type: "correct" },
      { text: "The remarks were reassuring", type: "trap", mis: "Reading idioms word by word", why: "Sees \"reassuring\" and misses \"anything but\"." },
      { text: "The minister was a teacher", type: "dud", why: "Nothing in the sentence is about a job." }
    ],
    tip: "Learn \"anything but\" as one unit. It means \"the opposite of\"."
  },
  {
    id: "la2", subject: "Language", ages: ["16-19"], syllabus: "WASSCE English: comprehension",
    stem: "The passage says: \"The farmer's harvest was meagre.\" In your own words, what was the harvest like?",
    target: "own",
    answers: [
      { text: "It was small", type: "correct" },
      { text: "It was meagre", type: "trap", mis: "Lifting words from the passage", why: "Copies the passage word when the question says \"in your own words\"." },
      { text: "The farmer worked hard", type: "trap", mis: "Answering a nearby question", why: "Sounds true but does not answer what was asked." },
      { text: "The farmer was a teacher", type: "dud", why: "The passage says nothing like this." }
    ],
    tip: "Underline the instruction words, such as \"in your own words\", before you answer."
  },
  {
    id: "la3", subject: "Language", ages: ["12-15"], syllabus: "BECE: comprehension",
    stem: "Kofi stayed home because it was raining and his bicycle was broken. Which is NOT a reason Kofi stayed home?",
    target: "NOT",
    answers: [
      { text: "He was sick", type: "correct" },
      { text: "It was raining", type: "trap", mis: "Skipping NOT", why: "Matches the passage but misses the word NOT." },
      { text: "Kofi is a river", type: "dud", why: "Kofi is a person in the story." }
    ],
    tip: "Circle NOT. Cross out every reason the passage gives."
  },
  {
    id: "la4", subject: "Language", ages: ["16-19"], syllabus: "WASSCE English and Literature",
    stem: "Which answer earns full marks? \"Why does the writer describe the market as a beehive?\"",
    target: "full",
    answers: [
      { text: "To show the market was busy and noisy, with many people moving at once, like bees in a hive", type: "correct" },
      { text: "Because it was like a beehive", type: "trap", mis: "Restating without explaining", why: "Repeats the image but does not say what the two things share." },
      { text: "Because there were bees in the market", type: "trap", mis: "Reading a metaphor literally", why: "Takes the image as a real fact." },
      { text: "Because the market was closed", type: "dud", why: "A closed market is not busy like a beehive." }
    ],
    tip: "Ask what the market and a beehive have in common."
  }
];
