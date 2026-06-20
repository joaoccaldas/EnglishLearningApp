export const WORDS = [
  {id:'owl',word:'owl',swedish:'uggla',definition:'A bird with large eyes that is active at night.',hint:'It hoots and can turn its head very far.',category:'animals',difficulty:1},
  {id:'bee',word:'bee',swedish:'bi',definition:'A flying insect that makes honey.',hint:'It buzzes and visits flowers.',category:'animals',difficulty:1},
  {id:'oak',word:'oak',swedish:'ek',definition:'A strong tree that grows acorns.',hint:'A broad tree with small brown acorns.',category:'nature',difficulty:1},
  {id:'fox',word:'fox',swedish:'räv',definition:'A clever wild animal with a bushy tail.',hint:'A red-orange forest animal.',category:'animals',difficulty:1},
  {id:'moss',word:'moss',swedish:'mossa',definition:'A small soft green plant that grows in damp places.',hint:'A green carpet on rocks and trees.',category:'nature',difficulty:1},
  {id:'leaf',word:'leaf',swedish:'löv',definition:'A flat green part of a plant or tree.',hint:'Trees lose these in autumn.',category:'nature',difficulty:1},
  {id:'forest',word:'forest',swedish:'skog',definition:'A large area filled with trees and plants.',hint:'A place where many trees grow together.',category:'places',difficulty:2},
  {id:'rabbit',word:'rabbit',swedish:'kanin',definition:'A small furry animal with long ears.',hint:'It hops and likes carrots.',category:'animals',difficulty:2},
  {id:'branch',word:'branch',swedish:'gren',definition:'A part of a tree that grows out from the trunk.',hint:'Birds often sit on this.',category:'nature',difficulty:2},
  {id:'lantern',word:'lantern',swedish:'lykta',definition:'A portable light protected by a case.',hint:'It helps you see in the dark.',category:'objects',difficulty:2},
  {id:'stream',word:'stream',swedish:'bäck',definition:'A small narrow river.',hint:'Water that flows through the woods.',category:'nature',difficulty:2},
  {id:'hidden',word:'hidden',swedish:'gömd',definition:'Kept out of sight or difficult to find.',hint:'Something that cannot easily be seen.',category:'adjectives',difficulty:2},
  {id:'mushroom',word:'mushroom',swedish:'svamp',definition:'A fungus with a rounded top that grows in damp places.',hint:'It often grows after rain.',category:'nature',difficulty:2},
  {id:'whisper',word:'whisper',swedish:'viska',definition:'To speak very quietly.',hint:'Talking so softly that only someone nearby can hear.',category:'actions',difficulty:2},
  {id:'squirrel',word:'squirrel',swedish:'ekorre',definition:'A small animal with a bushy tail that climbs trees.',hint:'It collects nuts.',category:'animals',difficulty:3},
  {id:'pinecone',word:'pinecone',swedish:'kotte',definition:'The seed case of a pine tree.',hint:'A hard brown shape that falls from evergreen trees.',category:'nature',difficulty:3},
  {id:'moonlight',word:'moonlight',swedish:'månsken',definition:'Light that appears to come from the moon.',hint:'The pale light seen at night.',category:'nature',difficulty:3},
  {id:'clearing',word:'clearing',swedish:'glänta',definition:'An open space in a forest.',hint:'A place with fewer trees and more sky.',category:'places',difficulty:3},
  {id:'woodpecker',word:'woodpecker',swedish:'hackspett',definition:'A bird that pecks tree trunks with its beak.',hint:'You may hear it tapping wood.',category:'animals',difficulty:3},
  {id:'enchanted',word:'enchanted',swedish:'förtrollad',definition:'Magically affected or filled with wonder.',hint:'A word used for a magical place.',category:'adjectives',difficulty:3},
  {id:'glimmer',word:'glimmer',swedish:'glimta',definition:'A faint or brief light.',hint:'A tiny light that is almost hidden.',category:'nature',difficulty:3},
  {id:'guardian',word:'guardian',swedish:'väktare',definition:'A person or creature that protects something.',hint:'Someone who keeps a place safe.',category:'people',difficulty:3},
  {id:'courage',word:'courage',swedish:'mod',definition:'The ability to do something despite fear.',hint:'What helps a hero act when afraid.',category:'concepts',difficulty:3},
  {id:'restore',word:'restore',swedish:'återställa',definition:'To bring something back to a good condition.',hint:'To repair and return what was lost.',category:'actions',difficulty:3}
];

export const MISSIONS = [
  {
    id:'lantern-path',
    number:1,
    title:'Lantern Path',
    short:'Relight the path into the woods.',
    story:'The first lanterns have gone dark. Translate the forest words to wake their light.',
    challengeTypes:['translation'],
    length:5,
    reward:{xp:60,coins:18},
    unlock:0,
    accent:'#f4cf75'
  },
  {
    id:'echo-grove',
    number:2,
    title:'Echo Grove',
    short:'Rebuild words from scattered runes.',
    story:'The grove repeats only fragments. Put the letters back in their true order.',
    challengeTypes:['spellforge'],
    length:6,
    reward:{xp:80,coins:24},
    unlock:1,
    accent:'#7ce7c4'
  },
  {
    id:'rune-pool',
    number:3,
    title:'Rune Pool',
    short:'Match meanings to hidden words.',
    story:'The pool remembers every word, but its meanings have become tangled.',
    challengeTypes:['definition'],
    length:6,
    reward:{xp:100,coins:30},
    unlock:2,
    accent:'#83a8ff'
  },
  {
    id:'moonroot-crossing',
    number:4,
    title:'Moonroot Crossing',
    short:'Use every skill to cross the roots.',
    story:'The ancient roots move beneath the moon. Translation, spelling and meaning must work together.',
    challengeTypes:['translation','spellforge','definition'],
    length:7,
    reward:{xp:130,coins:38},
    unlock:3,
    accent:'#c79af4'
  },
  {
    id:'glitch-thorn',
    number:5,
    title:'The Glitch Thorn',
    short:'Defeat the creature stealing the forest’s words.',
    story:'The Glitch Thorn has reached the heart tree. Break its shield by mastering the words it corrupted.',
    challengeTypes:['translation','spellforge','definition'],
    length:8,
    boss:true,
    reward:{xp:220,coins:70},
    unlock:4,
    accent:'#ef7b83'
  }
];

export const SHOP = [
  {id:'hint',name:'Firefly Hint',description:'Reveal a stronger clue during a challenge.',icon:'✦',price:20},
  {id:'shield',name:'Guardian Leaf',description:'Protect one heart after an incorrect answer.',icon:'◆',price:35},
  {id:'focus',name:'Focus Rune',description:'Remove two wrong choices in a definition challenge.',icon:'◈',price:45}
];

export const LEVELS = [
  {name:'Pathfinder',xp:0},
  {name:'Rune Keeper',xp:180},
  {name:'Word Ranger',xp:420},
  {name:'Grove Guardian',xp:760},
  {name:'Forest Restorer',xp:1200}
];
