import sortOrder from "@/constant/order.js";
import { chunk, cloneDeep, uniqBy, countBy } from "lodash";
const testData = [
  {
    id: "3clubs",
    isSelected: true,
    rank: "6",
    sortKey: "3",
    suit: "clubs",
  },
  {
    id: "3clubs",
    isSelected: true,
    rank: "6",
    sortKey: "3",
    suit: "clubs",
  },
  {
    id: "3clubs",
    isSelected: true,
    rank: "6",
    sortKey: "3",
    suit: "clubs",
  },
  {
    id: "3clubs",
    isSelected: true,
    rank: "6",
    sortKey: "3",
    suit: "clubs",
  },
  {
    id: "3clubs",
    isSelected: true,
    rank: "5",
    sortKey: "3",
    suit: "clubs",
  },
  {
    id: "3clubs",
    isSelected: true,
    rank: "5",
    sortKey: "3",
    suit: "clubs",
  },
  {
    id: "clubs",
    isSelected: true,
    rank: "4",
    sortKey: "3",
    suit: "clubs",
  },
  {
    id: "clubs",
    isSelected: true,
    rank: "4",
    sortKey: "3",
    suit: "clubs",
  },
];
const AscentSortOrder = cloneDeep(sortOrder).reverse();
// A
export function checkSingle(cards) {
  return cards.length === 1;
}

// AAAA
export function checkBomb(cards) {
  if (cards.length !== 4) return false;
  const cardsNumbers = cards.map((el) => el.rank);
  return cardsNumbers.every((el) => el === cardsNumbers[0]);
}

// AA
export function checkDouble(cards) {
  if (cards.length !== 2) return false;
  return cards[0].rank === cards[1].rank;
}

// JJ
export function checkJBOMB(cards) {
  if (cards.length !== 2) return false;
  if (cards.length === 2) {
    return cards.every((el) => el.rank === "JOKER");
  }
}

// AAA
export function checkTriple(cards) {
  if (cards.length !== 3) return false;
  const card1 = cards[0].rank;
  return cards.every((el) => el.rank === card1);
}

// AAAB
export function checkTriple1(cards) {
  const cloneCards = cloneDeep(cards);

  if (cards[0].rank === cards[1].rank) {
    // AAAB
    return checkTriple(cloneCards.slice(2)) && "TRIPLE1";
  } else {
    // BAAA
    return checkTriple(cloneCards.slice(-3)) && "TRIPLE1";
  }
}

// AAABB
export function checkTriple2(cards) {
  const cloneCards = cloneDeep(cards);
  if (cards[0].rank === cards[2].rank) {
    if (checkTriple(cloneCards.slice(0, 3))) {
      return checkDouble(cloneCards.slice(-2)) && "checkTriple2";
    }
  } else {
    if (checkTriple(cloneCards.slice(-3))) {
      return checkDouble(cloneCards.slice(0, 2)) && "checkTriple2";
    }
  }
  return false;
}

// continuously ABCDEF
export function checkContinuously(cards) {
  if (cards.length < 5) return false;
  const nums = cards.map((el) => el.rank);
  let index = AscentSortOrder.indexOf(nums[0]);
  const isContinuously = nums.every((el) => {
    console.log(el, AscentSortOrder[index], index);
    const isEqual = el === AscentSortOrder[index];
    index++;
    return isEqual;
  });
  return isContinuously;
}

export function checkAABBCC(cards) {
  const cardsLength = cards.length;
  if (cardsLength < 6 || cardsLength % 2 !== 0) return false;
  // chunk array
  const cardGroup = chunk(cards, 2);
  const isSame = cardGroup.every((el) => {
    return el[0].rank === el[1].rank;
  });
  if (!isSame) return false;

  console.log(isSame, "isSame");

  const uniqueArr = uniqBy(cards, "rank");
  const nums = uniqueArr.map((el) => el.rank);
  let index = AscentSortOrder.indexOf(nums[0]);
  const isContinuously = nums.every((el) => {
    console.log(el, AscentSortOrder[index], index);
    const isEqual = el === AscentSortOrder[index];
    index++;
    return isEqual;
  });
  console.log(isContinuously, "uniqueArr");
  return isContinuously;
}

export function checkAAABBB(cards) {
  const cardsLength = cards.length;
  if (cardsLength < 6 || cardsLength % 2 !== 0) return false;
  // chunk array
  const cardGroup = chunk(cards, 3);
  const isSame = cardGroup.every((el) => {
    return el[0].rank === el[1].rank && el[1].rank === el[2].rank;
  });
  if (!isSame) return false;

  console.log(isSame, "isSame");

  const uniqueArr = uniqBy(cards, "rank");
  const nums = uniqueArr.map((el) => el.rank);
  let index = AscentSortOrder.indexOf(nums[0]);
  const isContinuously = nums.every((el) => {
    console.log(el, AscentSortOrder[index], index);
    const isEqual = el === AscentSortOrder[index];
    index++;
    return isEqual;
  });
  console.log(isContinuously, "uniqueArr");
  return isContinuously;
}

// 飞机带单
function checkAAABBBCD(cards, n) {
  const groups = countBy(cards, "rank");
  const keys = Object.keys(groups);
  let AAAgroup = [];
  let Bgroup = [];
  keys.forEach((key) => {
    if (groups[key] === 3) {
      AAAgroup.push(key);
    }
    if (groups[key] === n) {
      Bgroup.push(key);
    }
  });
  return AAAgroup.length >= 2 && AAAgroup.length === Bgroup.length;   
}

// 四带二（两张单牌或者两站对）
function checkAAAABC(cards, n) {
  cards = testData;
  const groups = countBy(cards, "rank");
  const keys = Object.keys(groups);
  let AAAAgroup = [];
  let Bgroup = [];
  keys.forEach((key) => {
    if (groups[key] === 4) {
      AAAAgroup.push(key);
    }
    if (groups[key] === n) {
      Bgroup.push(key);
    }
  });
  return AAAAgroup.length === 1 && Bgroup.length === 2;
}
function checkType(cards) {
  const cardsLength = cards.length;
  if (cardsLength === 1) {
    return checkSingle(cards) && "SINGLE";
  }
  // 对牌 或者 王炸
  if (cardsLength === 2) {
    if (checkDouble(cards)) {
      return "DOUBLE";
    }
    return checkJBOMB(cards) && "JBOMB";
  }
  // 三张牌
  if (cardsLength === 3) {
    return checkTriple(cards) && "TRIPLE";
  }

  if (cardsLength === 4) {
    // 炸弹
    if (checkBomb(cards)) {
      return "BOMB";
    }
    // 三带一
    return checkTriple1(cards) && "TRIPLE1";
  }

  // 三带二
  if (cardsLength === 5) {
    if (checkTriple2(cards)) return "TRIPLE2";
  }

  // 单顺
  if (cardsLength >= 5 && cardsLength <= 12) {
    if (checkContinuously(cards)) return "CONSEQUENT";
  }
  
  // 双顺 三顺
  if (cardsLength >= 6 && cardsLength % 2 === 0) {
    if (checkAABBCC(cards)) {
      return "DOUBLE_CONSEQUENT";
    }
    if (checkAAABBB(cards)) {
      return "TRIPLE_CONSEQUENT";
    }
  }
  // 四带二
  if (cardsLength === 6) {
    if (checkAAAABC(cards, 1)) return 'FOURANDONE';
  }
  if (cardsLength === 8) {
    if (checkAAAABC(cards, 2)) return 'FOURANDTWO';
  }
  if (cardsLength >= 8) {
    if (checkAAABBBCD(cards, 1)) {
      return "AIRPLANE1";
    }
    if (checkAAABBBCD(cards, 2)) {
      return "AIRPLANE2";
    }
  }
  return false;
}

const validate = {
  checkSingle,
  checkBomb,
  checkDouble,
  checkTriple,
  checkTriple1,
  checkTriple2,
  checkType,
};
export default validate;
