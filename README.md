# Wordbound: Whispering Woods

A story-driven English-learning adventure for Swedish speakers.

## Play loop

Choose a forest mission, complete adaptive language challenges, restore the world, earn coins and unlock the next clearing.

## Vertical-slice features

- Five connected missions
- Translation, spelling and definition challenges
- Glitch Thorn boss encounter
- Adaptive word selection prioritising unseen, weak and due words
- Spaced-repetition scheduling
- Three-heart mission system
- XP, ranks, streaks, coins and three-star results
- Visible forest restoration
- Firefly hints, Guardian Leaves and Focus Runes
- English pronunciation through browser speech synthesis
- Local explorer profile
- Parent learning report
- Offline installable PWA shell
- Responsive mobile, tablet and desktop layouts

## Existing legacy logic preserved

The previous vocabulary and game files remain in `js/world.js`, `js/game.js` and `css/style.css` for reference during migration. The production entry point now uses the modular Wordbound files in `js/wordbound/` and `css/wordbound.css`.

## Privacy

All progress stays in browser storage. Wordbound contains no accounts, advertising or analytics trackers.

## Deployment

The application is static and can be served directly through GitHub Pages.
