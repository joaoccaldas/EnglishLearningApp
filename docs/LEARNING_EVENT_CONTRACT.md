# Learning Event Contract — Draft v0

This is a cross-project **concept contract**, not a shared runtime library.

It exists because Wordbound, Kids Python Game Platform, Scratch Klon, and Nova's Realm all represent learning progress differently. A common vocabulary can make experiments easier to compare without forcing the games to share UI, storage, pedagogy, or reward systems.

## Principles

1. Local-first by default.
2. No child contact, location, school, account, or advertising identifiers.
3. A learner profile may be an anonymous/browser-local convenience identity.
4. Educational claims remain separate from gameplay telemetry.
5. Games own their own progression/reward logic.
6. No cloud analytics dependency is required.
7. Events should be understandable without an AI model.
8. AI-generated feedback should record that it was AI-generated when that distinction matters.

## Minimal event shape

```json
{
  "event": "challenge_completed",
  "version": 1,
  "occurred_at": "2026-09-27T08:00:00.000Z",
  "learner_ref": "local-profile",
  "content_ref": "mission-forest-03",
  "skill_ref": "english.vocabulary.food",
  "result": {
    "correct": true,
    "attempts": 2,
    "hints_used": 1
  },
  "context": {
    "difficulty": "adaptive",
    "source": "wordbound"
  }
}
```

## Candidate events

### `challenge_started`
A learner begins an atomic challenge.

### `attempt_submitted`
One answer/code/action is submitted.

Useful result fields:
- `correct`
- `score`
- `attempt_number`
- `response_time_ms` where locally useful

Do not store the learner's free-form answer unless the product genuinely needs it.

### `hint_used`
A hint or scaffolding action is consumed.

### `challenge_completed`
The challenge reaches its terminal state.

### `skill_practiced`
A game maps activity to a named skill/concept.

### `review_scheduled`
A spaced-repetition or review system schedules future practice.

### `mission_completed`
A larger game/learning mission is completed.

### `reward_awarded`
XP, coins, stars, cosmetics, achievements, or another game reward is granted.

Learning mastery and game rewards must remain distinguishable.

## What is deliberately not standardized

- XP values
- reward economy
- mastery thresholds
- spaced-repetition algorithm
- difficulty model
- UI copy
- world/story structure
- parent reports
- learner names
- storage implementation

## Adoption rule

Do not create a package for this contract until at least two projects actually emit compatible events and the shared implementation reduces maintenance.

For now, use this document as a vocabulary when designing or testing new learning features.

## AI-assisted development context

These learning games are personal, self-directed projects. AI tools are used extensively during research, design, coding, debugging, testing, and documentation. AI output is input to review, not proof that an educational approach is effective.
