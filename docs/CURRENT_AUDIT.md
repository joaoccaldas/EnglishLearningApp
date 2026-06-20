# EnglishLearningApp audit

## Existing strengths

- Five playable modes: translation, word building, definition matching, quick fire and phrase building
- Five difficulty tiers from beginner to expert
- Large Swedish-to-English word database with definitions, hints and categories
- Six themed worlds with unlock levels
- Persistent level, points, coins, inventory and achievements
- Shop with hints, time freezes, double points and protection items
- Levenshtein-based close-answer feedback
- Session results, accuracy, streaks and learning tips
- Themed forest, Halloween, space, ocean and winter vocabulary

## Main weaknesses

- The interface is a long educational form rather than a game world
- Every option is presented simultaneously, creating high cognitive load
- Inline `onclick` handlers tightly couple UI and game logic
- Progress exists as numbers instead of visible world restoration
- Random word selection does not prioritise mistakes or spaced repetition
- Difficulty is manually selected rather than adapting to performance
- There is no clear mission narrative or boss loop
- Shop rewards are disconnected from the world fiction
- Mobile screens contain too many controls at once
- Visual styling relies on animated rainbow gradients, glass panels and emoji rather than art direction
- Local storage is not versioned or guarded against malformed data
- Parent insight is limited to a generic results screen

## Preserve

- Vocabulary data and Swedish translations
- Word categories, definitions and hints
- Similarity feedback concept
- Progression, coins, streaks and inventory concepts
- Themed worlds
- Five challenge concepts

## Rebuild

- Navigation and screen architecture
- Game state management
- Adaptive word selection
- Spaced repetition
- Mission progression
- Visual reward system
- Mobile UI
- Accessibility and event handling
- Parent progress summary

## Vertical-slice objective

Build one complete world, **Whispering Woods**, containing five missions, three challenge types, one boss encounter, adaptive review, local progress and a visible forest-restoration loop.
