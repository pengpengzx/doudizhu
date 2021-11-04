// 黑桃： Spade 红心：Heart 方块: Diamond 草花：Club
const NUMS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const SUITS = ["spades", "hearts", "diams", "clubs"];
// 所有的扑克牌
let POKERS = [];

NUMS.forEach((num) => {
  SUITS.forEach((suit) => {
    POKERS.push({
      id: num + suit,
      rank: num,
      suit: suit,
      sortKey: num,
      isSelected: false,
    });
  });
});

// 加入大小王
POKERS = POKERS.concat([
  {
    rank: "JOKER",
    suit: "big",
    sortKey: "big",
    id: "JOKERbig",
    isSelected: false,
  },
  {
    rank: "JOKER",
    suit: "little",
    sortKey: "little",
    id: "JOKERlittle",
    isSelected: false,
  },
]);

export default POKERS;
