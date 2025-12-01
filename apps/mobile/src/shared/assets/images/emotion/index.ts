export const EMOTION_ICONS = {
  joyBig: require('./big/joy-big.png'),
  calmBig: require('./big/calm-big.png'),
  sadBig: require('./big/sad-big.png'),
  angryBig: require('./big/angry-big.png'),
  anxietyBig: require('./big/anxiety-big.png'),

  joyBigShadow: require('./big/joy-big-shadow.png'),
  calmBigShadow: require('./big/calm-big-shadow.png'),
  sadBigShadow: require('./big/sad-big-shadow.png'),
  angryBigShadow: require('./big/angry-big-shadow.png'),
  anxietyBigShadow: require('./big/anxiety-big-shadow.png'),

  joySmallSelected: require('./small/selected/joy-small-selected.png'),
  calmSmallSelected: require('./small/selected/calm-small-selected.png'),
  sadSmallSelected: require('./small/selected/sad-small-selected.png'),
  angrySmallSelected: require('./small/selected/angry-small-selected.png'),
  anxietySmallSelected: require('./small/selected/anxiety-small-selected.png'),

  joySmallUnSelected: require('./small/unselected/joy-small-unselected.png'),
  calmSmallUnSelected: require('./small/unselected/calm-small-unselected.png'),
  sadSmallUnSelected: require('./small/unselected/sad-small-unselected.png'),
  angrySmallUnSelected: require('./small/unselected/angry-small-unselected.png'),
  anxietySmallUnSelected: require('./small/unselected/anxiety-small-unselected.png'),
} as const;

export type EmotionIconKey = keyof typeof EMOTION_ICONS;
