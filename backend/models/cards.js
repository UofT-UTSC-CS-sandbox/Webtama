export const cards = [
  [
    "Eel",
    [
      [-1, 1],
      [-1, -1],
      [1, 0],
    ],
  ],
  [
    "Frog",
    [
      [-2, 0],
      [-1, -1],
      [1, 1],
    ],
  ],
  [
    "Mantis",
    [
      [-1, 1],
      [-1, 0],
      [1, 0],
    ],
  ],
  [
    "Boar",
    [
      [-1, 0],
      [0, -1],
      [0, 1],
    ],
  ],
  [
    "Horse",
    [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ],
  ],
  [
    "Cobra",
    [
      [-1, 0],
      [0, -1],
      [1, 0],
    ],
  ],
  [
    "Ox",
    [
      [0, -1],
      [0, 1],
      [1, 0],
    ],
  ],
];

export function shuffle() {
  const index = Math.floor(Math.random() * (cards.length - 1));
  return cards[index];
}
