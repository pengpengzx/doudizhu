// 黑桃： Spade 红心：Heart 方块: Diamond 草花：Club
const NUMS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let POKERS = [];

NUMS.forEach((el) => {
  POKERS.push({
    rank: el,
    suit: "spades",
    sortKey: el,
  });
  POKERS.push({
    rank: el,
    suit: "hearts",
    sortKey: el,
  });
  POKERS.push({
    rank: el,
    suit: "diams",
    sortKey: el,
  });
  POKERS.push({
    rank: el,
    suit: "clubs",
    sortKey: el,
  });
});

POKERS = POKERS.concat([
  { rank: "JOKER", suit: "big", sortKey: 'big'},
  { rank: "JOKER", suit: "little", sortKey: 'little'},
]);
POKERS.forEach((el) => {
  el.id = el.rank + el.suit;
  el.isSelected = false;
});
export default POKERS;
