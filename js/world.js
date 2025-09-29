// Word database organized by difficulty level
const wordsDatabase = {
    beginner: [
        {
            word: "I",
            swedish: "Jag",
            definition: "First person singular pronoun",
            hint: "The word you use to refer to yourself",
            category: "pronouns"
        },
        {
            word: "go",
            swedish: "gå",
            definition: "To move from one place to another",
            hint: "What you do with your feet to move",
            category: "actions"
        },
        {
            word: "no",
            swedish: "nej",
            definition: "A negative response",
            hint: "The opposite of yes",
            category: "responses"
        },
        {
            word: "yes",
            swedish: "ja",
            definition: "An affirmative response",
            hint: "The opposite of no",
            category: "responses"
        },
        {
            word: "up",
            swedish: "upp",
            definition: "In or to a higher position",
            hint: "The opposite of down",
            category: "directions"
        },
        {
            word: "dog",
            swedish: "hund",
            definition: "A domesticated carnivorous mammal",
            hint: "A loyal pet that barks",
            category: "animals"
        },
        {
            word: "sun",
            swedish: "sol",
            definition: "The star at the center of our solar system",
            hint: "What gives us light during the day",
            category: "nature"
        },
        {
            word: "car",
            swedish: "bil",
            definition: "A motor vehicle with four wheels",
            hint: "A vehicle you drive on roads",
            category: "transportation"
        },
        {
            word: "big",
            swedish: "stor",
            definition: "Of considerable size or extent",
            hint: "The opposite of small",
            category: "adjectives"
        },
        {
            word: "red",
            swedish: "röd",
            definition: "The color of blood or roses",
            hint: "The color of fire trucks",
            category: "colors"
        }
    ],
    easy: [
        {
            word: "cat",
            swedish: "katt",
            definition: "A small domesticated carnivorous mammal",
            hint: "A furry pet that says 'meow'",
            category: "animals"
        },
        {
            word: "book",
            swedish: "bok",
            definition: "A written or printed work consisting of pages",
            hint: "Something you read with pages",
            category: "objects"
        },
        {
            word: "tree",
            swedish: "träd",
            definition: "A woody perennial plant with a trunk and branches",
            hint: "It has leaves and grows in the ground",
            category: "nature"
        },
        {
            word: "house",
            swedish: "hus",
            definition: "A building for human habitation",
            hint: "Where people live",
            category: "buildings"
        },
        {
            word: "water",
            swedish: "vatten",
            definition: "A transparent liquid that forms seas, lakes, and rivers",
            hint: "You drink this to stay hydrated",
            category: "nature"
        },
        {
            word: "happy",
            swedish: "glad",
            definition: "Feeling or showing pleasure or contentment",
            hint: "The opposite of sad",
            category: "emotions"
        },
        {
            word: "phone",
            swedish: "telefon",
            definition: "A device used to make calls or send messages",
            hint: "You use this to call people",
            category: "technology"
        },
        {
            word: "apple",
            swedish: "äpple",
            definition: "A round fruit with red or green skin",
            hint: "A fruit that keeps the doctor away",
            category: "food"
        },
        {
            word: "chair",
            swedish: "stol",
            definition: "A piece of furniture for sitting",
            hint: "You sit on this",
            category: "furniture"
        },
        {
            word: "money",
            swedish: "pengar",
            definition: "A medium of exchange in the form of coins and banknotes",
            hint: "You use this to buy things",
            category: "concepts"
        },
        {
            word: "light",
            swedish: "ljus",
            definition: "Natural illumination from the sun or artificial sources",
            hint: "The opposite of darkness",
            category: "concepts"
        },
        {
            word: "green",
            swedish: "grön",
            definition: "The color of grass and leaves",
            hint: "The color of nature",
            category: "colors"
        },
        {
            word: "smile",
            swedish: "leende",
            definition: "A facial expression showing happiness",
            hint: "What you do when you're happy",
            category: "actions"
        },
        {
            word: "bread",
            swedish: "bröd",
            definition: "A baked food made from flour and water",
            hint: "You make sandwiches with this",
            category: "food"
        },
        {
            word: "sleep",
            swedish: "sova",
            definition: "A naturally recurring state of rest",
            hint: "What you do at night in bed",
            category: "actions"
        }
    ],
    
    medium: [
        {
            word: "computer",
            swedish: "dator",
            definition: "An electronic device for processing data",
            hint: "You're probably using one to play this game",
            category: "technology"
        },
        {
            word: "elephant",
            swedish: "elefant",
            definition: "A large mammal with a trunk and tusks",
            hint: "The largest land animal",
            category: "animals"
        },
        {
            word: "mountain",
            swedish: "berg",
            definition: "A large natural elevation of the earth's surface",
            hint: "A very high hill",
            category: "nature"
        },
        {
            word: "birthday",
            swedish: "födelsedag",
            definition: "The anniversary of the day someone was born",
            hint: "A special day when you get older",
            category: "events"
        },
        {
            word: "rainbow",
            swedish: "regnbåge",
            definition: "An arc of colors formed in the sky after rain",
            hint: "Colorful arc you see after rain",
            category: "nature"
        },
        {
            word: "bicycle",
            swedish: "cykel",
            definition: "A vehicle with two wheels propelled by pedaling",
            hint: "A two-wheeled vehicle you pedal",
            category: "transportation"
        },
        {
            word: "kitchen",
            swedish: "kök",
            definition: "A room where food is prepared and cooked",
            hint: "Where you cook and prepare meals",
            category: "rooms"
        },
        {
            word: "teacher",
            swedish: "lärare",
            definition: "A person who instructs students",
            hint: "Someone who helps you learn at school",
            category: "professions"
        },
        {
            word: "butterfly",
            swedish: "fjäril",
            definition: "A flying insect with colorful wings",
            hint: "A beautiful flying insect with colorful wings",
            category: "animals"
        },
        {
            word: "adventure",
            swedish: "äventyr",
            definition: "An exciting or unusual experience",
            hint: "An exciting journey or experience",
            category: "concepts"
        },
        {
            word: "hospital",
            swedish: "sjukhus",
            definition: "A place where sick people receive medical treatment",
            hint: "Where you go when you're very sick",
            category: "buildings"
        },
        {
            word: "sandwich",
            swedish: "smörgås",
            definition: "Food consisting of ingredients between pieces of bread",
            hint: "Food made with bread and fillings",
            category: "food"
        },
        {
            word: "calendar",
            swedish: "kalender",
            definition: "A chart showing days, weeks, and months",
            hint: "Shows you what day it is",
            category: "objects"
        },
        {
            word: "princess",
            swedish: "prinsessa",
            definition: "A female member of a royal family",
            hint: "A royal female character in fairy tales",
            category: "people"
        },
        {
            word: "vacation",
            swedish: "semester",
            definition: "A period of time devoted to pleasure and rest",
            hint: "Time off from work or school for fun",
            category: "concepts"
        }
    ],
    
    hard: [
        {
            word: "magnificent",
            swedish: "magnifik",
            definition: "Extremely beautiful, elaborate, or impressive",
            hint: "Another word for absolutely amazing",
            category: "adjectives"
        },
        {
            word: "archaeological",
            swedish: "arkeologisk",
            definition: "Relating to the study of ancient cultures",
            hint: "Related to studying ancient civilizations",
            category: "science"
        },
        {
            word: "responsibility",
            swedish: "ansvar",
            definition: "The state of being accountable for something",
            hint: "Being accountable for your actions",
            category: "concepts"
        },
        {
            word: "entrepreneur",
            swedish: "entreprenör",
            definition: "A person who starts and runs a business",
            hint: "Someone who starts their own business",
            category: "professions"
        },
        {
            word: "constellation",
            swedish: "stjärnbild",
            definition: "A group of stars forming a recognizable pattern",
            hint: "A pattern of stars in the night sky",
            category: "astronomy"
        },
        {
            word: "kindergarten",
            swedish: "dagis",
            definition: "A school or class for young children",
            hint: "The first year of school for little kids",
            category: "education"
        },
        {
            word: "refrigerator",
            swedish: "kylskåp",
            definition: "An appliance for keeping food cold",
            hint: "Where you keep food cold in the kitchen",
            category: "appliances"
        },
        {
            word: "independence",
            swedish: "självständighet",
            definition: "The state of being free from outside control",
            hint: "Being free and self-reliant",
            category: "concepts"
        },
        {
            word: "extraordinary",
            swedish: "extraordinär",
            definition: "Very unusual or remarkable",
            hint: "Beyond ordinary; very special",
            category: "adjectives"
        },
        {
            word: "temperature",
            swedish: "temperatur",
            definition: "The degree of hotness or coldness",
            hint: "How hot or cold something is",
            category: "science"
        },
        {
            word: "photography",
            swedish: "fotografi",
            definition: "The art of taking and processing photographs",
            hint: "The art of taking pictures",
            category: "arts"
        },
        {
            word: "mathematics",
            swedish: "matematik",
            definition: "The science of numbers and shapes",
            hint: "The subject dealing with numbers and calculations",
            category: "subjects"
        },
        {
            word: "destination",
            swedish: "destination",
            definition: "The place to which someone is going",
            hint: "Where you're traveling to",
            category: "travel"
        },
        {
            word: "encyclopedia",
            swedish: "encyklopedi",
            definition: "A comprehensive reference work",
            hint: "A big book with information about everything",
            category: "books"
        },
        {
            word: "helicopter",
            swedish: "helikopter",
            definition: "An aircraft with rotating blades",
            hint: "A flying machine with spinning blades on top",
            category: "transportation"
        }
    ],
    
    expert: [
        {
            word: "environmentally",
            swedish: "miljömässigt",
            definition: "In a way that relates to the natural world and ecology",
            hint: "Relating to protecting nature and the planet",
            category: "environmental"
        },
        {
            word: "comprehensively",
            swedish: "omfattande",
            definition: "In a way that includes everything or is complete",
            hint: "Covering all aspects thoroughly",
            category: "adverbs"
        },
        {
            word: "internationally",
            swedish: "internationellt",
            definition: "Between or among different countries",
            hint: "Across multiple nations worldwide",
            category: "adverbs"
        },
        {
            word: "transformation",
            swedish: "förvandling",
            definition: "A thorough or dramatic change in form or appearance",
            hint: "A complete change from one thing to another",
            category: "concepts"
        },
        {
            word: "consciousness",
            swedish: "medvetenhet",
            definition: "The state of being awake and aware of surroundings",
            hint: "Your awareness of yourself and your environment",
            category: "psychology"
        },
        {
            word: "philosophical",
            swedish: "filosofisk",
            definition: "Relating to the study of fundamental nature of reality",
            hint: "Related to deep thinking about life and existence",
            category: "academics"
        },
        {
            word: "revolutionary",
            swedish: "revolutionerande",
            definition: "Involving or causing a complete change",
            hint: "Something that completely changes everything",
            category: "history"
        },
        {
            word: "sophisticated",
            swedish: "sofistikerad",
            definition: "Having great knowledge or experience of culture and fashion",
            hint: "Very refined and complex",
            category: "adjectives"
        },
        {
            word: "extraordinary",
            swedish: "extraordinär",
            definition: "Very unusual or remarkable beyond what is normal",
            hint: "Far beyond ordinary or typical",
            category: "adjectives"
        },
        {
            word: "administration",
            swedish: "administration",
            definition: "The process of running a business or organization",
            hint: "Managing and organizing operations",
            category: "business"
        },
        {
            word: "communication",
            swedish: "kommunikation",
            definition: "The means of sharing information between people",
            hint: "How people share ideas and information",
            category: "skills"
        },
        {
            word: "opportunities",
            swedish: "möjligheter",
            definition: "Circumstances that make it possible to do something",
            hint: "Chances to achieve or do something good",
            category: "concepts"
        },
        {
            word: "technological",
            swedish: "teknologisk",
            definition: "Relating to or involving technology",
            hint: "Connected to modern science and gadgets",
            category: "technology"
        },
        {
            word: "investigation",
            swedish: "utredning",
            definition: "The action of investigating something or someone",
            hint: "Carefully examining to find the truth",
            category: "research"
        },
        {
            word: "recommendation",
            swedish: "rekommendation",
            definition: "A suggestion about the best course of action",
            hint: "Advice about what someone should do",
            category: "communication"
        }
    ]
};

// Common word patterns for hints
const wordPatterns = {
    double_letters: ["letter", "coffee", "happy", "success"],
    silent_letters: ["knife", "thumb", "castle", "island"],
    long_vowels: ["cake", "hope", "cute", "game"],
    short_vowels: ["cat", "pet", "hit", "got", "run"]
};

// Motivational messages for correct answers
const encouragementMessages = [
    "Excellent! 🌟",
    "Perfect spelling! 🎉",
    "Great job! 👏",
    "You're doing amazing! ✨",
    "Fantastic work! 🚀",
    "Brilliant! 💯",
    "Outstanding! 🏆",
    "Superb! 🎊",
    "Well done! 👍",
    "Incredible! 🌈"
];

// Helpful messages for incorrect answers
const encouragingMessages = [
    "Don't give up! Try again! 💪",
    "You're getting closer! 🎯",
    "Almost there! Keep trying! 🔥",
    "Great effort! Give it another shot! ⭐",
    "You can do it! Try once more! 🌟",
    "Nice try! Let's keep going! 🚀",
    "Good attempt! Try again! 👍",
    "You're learning! Keep it up! 📚"
];

// Learning tips based on performance
const learningTips = [
    "Break long words into smaller parts or syllables",
    "Look for common word patterns and endings",
    "Practice words with similar spelling patterns together",
    "Read the word out loud to help with spelling",
    "Use memory tricks like rhymes or associations",
    "Write the word multiple times to build muscle memory",
    "Focus on the parts of the word that are tricky",
    "Practice a little bit every day for best results"
];

// Themed word collections for different worlds
const themedWords = {
    forest: {
        beginner: [
            { word: "owl", swedish: "uggla", definition: "A bird that hoots at night", hint: "Night bird with big eyes", category: "forest_animals" },
            { word: "bee", swedish: "bi", definition: "Flying insect that makes honey", hint: "Buzzing honey maker", category: "forest_animals" },
            { word: "oak", swedish: "ek", definition: "A type of strong tree", hint: "Strong tree with acorns", category: "forest_plants" }
        ],
        easy: [
            { word: "forest", swedish: "skog", definition: "A large area covered with trees", hint: "Where many trees grow together", category: "forest_places" },
            { word: "rabbit", swedish: "kanin", definition: "Small furry animal that hops", hint: "Hopping animal with long ears", category: "forest_animals" },
            { word: "mushroom", swedish: "svamp", definition: "Fungus that grows in damp places", hint: "Grows under trees after rain", category: "forest_plants" }
        ],
        medium: [
            { word: "squirrel", swedish: "ekorre", definition: "Small animal that climbs trees", hint: "Bushy tail, collects nuts", category: "forest_animals" },
            { word: "pinecone", swedish: "kotte", definition: "Seed case from pine trees", hint: "Falls from evergreen trees", category: "forest_plants" },
            { word: "woodpecker", swedish: "hackspett", definition: "Bird that pecks holes in trees", hint: "Makes holes in tree trunks", category: "forest_animals" }
        ]
    },
    
    halloween: {
        beginner: [
            { word: "bat", swedish: "fladdermus", definition: "Flying mammal active at night", hint: "Hangs upside down in caves", category: "halloween_creatures" },
            { word: "web", swedish: "spindelnät", definition: "What spiders make to catch prey", hint: "Spider's trap", category: "halloween_items" },
            { word: "boo", swedish: "bu", definition: "What ghosts say to scare people", hint: "Ghost sound", category: "halloween_sounds" }
        ],
        easy: [
            { word: "ghost", swedish: "spöke", definition: "Spirit of a dead person", hint: "White floating spirit", category: "halloween_creatures" },
            { word: "witch", swedish: "häxa", definition: "Person who practices magic", hint: "Rides a broomstick", category: "halloween_creatures" },
            { word: "candy", swedish: "godis", definition: "Sweet treats given on Halloween", hint: "Trick or treat reward", category: "halloween_items" }
        ],
        medium: [
            { word: "pumpkin", swedish: "pumpa", definition: "Orange vegetable carved for Halloween", hint: "Jack-o'-lantern material", category: "halloween_items" },
            { word: "skeleton", swedish: "skelett", definition: "Framework of bones in a body", hint: "What's left when flesh is gone", category: "halloween_creatures" },
            { word: "haunted", swedish: "hemsökt", definition: "Visited by ghosts or spirits", hint: "Scary house description", category: "halloween_places" }
        ]
    },
    
    space: {
        beginner: [
            { word: "sun", swedish: "sol", definition: "The star at the center of our solar system", hint: "Bright star that lights the day", category: "space_objects" },
            { word: "moon", swedish: "måne", definition: "Earth's natural satellite", hint: "Shines at night", category: "space_objects" },
            { word: "star", swedish: "stjärna", definition: "Burning ball of gas in space", hint: "Twinkles in the night sky", category: "space_objects" }
        ],
        easy: [
            { word: "planet", swedish: "planet", definition: "Large object that orbits the sun", hint: "Earth is one of these", category: "space_objects" },
            { word: "rocket", swedish: "raket", definition: "Vehicle used to travel to space", hint: "Blasts off to space", category: "space_vehicles" },
            { word: "alien", swedish: "utomjording", definition: "Being from another planet", hint: "Visitor from outer space", category: "space_creatures" }
        ],
        medium: [
            { word: "astronaut", swedish: "astronaut", definition: "Person who travels to space", hint: "Space explorer in a suit", category: "space_people" },
            { word: "galaxy", swedish: "galax", definition: "Massive collection of stars", hint: "The Milky Way is one", category: "space_objects" },
            { word: "asteroid", swedish: "asteroid", definition: "Rocky object orbiting the sun", hint: "Space rock", category: "space_objects" }
        ]
    },
    
    ocean: {
        beginner: [
            { word: "fish", swedish: "fisk", definition: "Animal that lives and breathes in water", hint: "Swims with fins", category: "ocean_animals" },
            { word: "wave", swedish: "våg", definition: "Moving water on the ocean surface", hint: "Water that crashes on shore", category: "ocean_features" },
            { word: "blue", swedish: "blå", definition: "The color of the ocean", hint: "Color of sea and sky", category: "ocean_colors" }
        ],
        easy: [
            { word: "shark", swedish: "haj", definition: "Large predatory fish with sharp teeth", hint: "Ocean predator with fins", category: "ocean_animals" },
            { word: "coral", swedish: "korall", definition: "Colorful marine organisms that form reefs", hint: "Colorful underwater formations", category: "ocean_plants" },
            { word: "whale", swedish: "val", definition: "Largest mammal in the ocean", hint: "Biggest sea creature", category: "ocean_animals" }
        ],
        medium: [
            { word: "dolphin", swedish: "delfin", definition: "Intelligent marine mammal", hint: "Smart sea creature that jumps", category: "ocean_animals" },
            { word: "treasure", swedish: "skatt", definition: "Valuable items hidden underwater", hint: "Pirates buried this", category: "ocean_items" },
            { word: "submarine", swedish: "ubåt", definition: "Underwater vessel", hint: "Travels under the sea", category: "ocean_vehicles" }
        ]
    },
    
    winter: {
        beginner: [
            { word: "ice", swedish: "is", definition: "Frozen water", hint: "Solid form of water", category: "winter_elements" },
            { word: "snow", swedish: "snö", definition: "Frozen precipitation", hint: "White flakes from sky", category: "winter_elements" },
            { word: "cold", swedish: "kall", definition: "Low temperature", hint: "Opposite of hot", category: "winter_weather" }
        ],
        easy: [
            { word: "winter", swedish: "vinter", definition: "Coldest season of the year", hint: "Season with snow", category: "winter_seasons" },
            { word: "skiing", swedish: "skidåkning", definition: "Sport on snow with long boards", hint: "Sliding down snowy hills", category: "winter_sports" },
            { word: "mittens", swedish: "vantar", definition: "Warm hand coverings", hint: "Keep fingers warm together", category: "winter_clothes" }
        ],
        medium: [
            { word: "snowflake", swedish: "snöflinga", definition: "Individual crystal of snow", hint: "Unique ice crystal", category: "winter_elements" },
            { word: "blizzard", swedish: "snöstorm", definition: "Severe snowstorm with strong winds", hint: "Fierce winter storm", category: "winter_weather" },
            { word: "hibernation", swedish: "vinterdvala", definition: "Deep sleep during winter", hint: "What bears do in winter", category: "winter_nature" }
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        wordsDatabase,
        themedWords,
        wordPatterns,
        encouragementMessages,
        encouragingMessages,
        learningTips
    };
}
