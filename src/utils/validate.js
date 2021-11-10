import sortOrder from "@/constant/order.js";
import { chunk, cloneDeep, uniqBy, countBy } from "lodash";
let cardInfo = {
  cardType: "",
  matchLength: 0,
  addCard: 0,
  maxCard: "",
};
// 排序
function sortPoker(arr) {
  arr.sort((a, b) => {
    const indexA = sortOrder.indexOf(a);
    const indexb = sortOrder.indexOf(b);
    return indexb - indexA;
  });
}

// const testData = [
//   {
//     id: "3clubs",
//     isSelected: true,
//     rank: "6",
//     sortKey: "3",
//     suit: "clubs",
//   },
//   {
//     id: "3clubs",
//     isSelected: true,
//     rank: "6",
//     sortKey: "3",
//     suit: "clubs",
//   },
//   {
//     id: "3clubs",
//     isSelected: true,
//     rank: "6",
//     sortKey: "3",
//     suit: "clubs",
//   },
//   {
//     id: "3clubs",
//     isSelected: true,
//     rank: "6",
//     sortKey: "3",
//     suit: "clubs",
//   },
//   {
//     id: "3clubs",
//     isSelected: true,
//     rank: "5",
//     sortKey: "3",
//     suit: "clubs",
//   },
//   {
//     id: "3clubs",
//     isSelected: true,
//     rank: "5",
//     sortKey: "3",
//     suit: "clubs",
//   },
//   {
//     id: "clubs",
//     isSelected: true,
//     rank: "4",
//     sortKey: "3",
//     suit: "clubs",
//   },
//   {
//     id: "clubs",
//     isSelected: true,
//     rank: "4",
//     sortKey: "3",
//     suit: "clubs",
//   },
// ];
const AscentSortOrder = cloneDeep(sortOrder).reverse();
// A
export function checkSingle(cards) {
  const isValid = cards.length === 1;
  if (isValid) {
    cardInfo = {
      cardType: "SINGLE",
      matchLength: 1,
      addCard: 0,
      maxCard: cards[0].sortKey,
    };
  }
  return isValid && cardInfo;
}

// AAAA
export function checkBomb(cards) {
  if (cards.length !== 4) return false;
  const cardsNumbers = cards.map((el) => el.rank);
  const isValid = cardsNumbers.every((el) => el === cardsNumbers[0]);
  if (isValid) {
    cardInfo = {
      cardType: "BOMB",
      matchLength: 4,
      addCard: 0,
      maxCard: cards[0].rank,
    };
  }
  return isValid && cardInfo;
}

// AA
export function checkDouble(cards) {
  if (cards.length !== 2) return false;
  const isValid = cards[0].sortKey === cards[1].sortKey;
  if (isValid) {
    cardInfo = {
      cardType: "DOUBLE",
      matchLength: 2,
      addCard: 0,
      maxCard: cards[0].sortKey,
    };
  }
  return isValid && cardInfo;
}

// JJ
export function checkJBOMB(cards) {
  if (cards.length !== 2) return false;
  if (cards.length === 2) {
    const isValid = cards.every((el) => el.rank === "JOKER");
    if (isValid) {
      cardInfo = {
        cardType: "JBOMB",
        matchLength: 0,
        addCard: 0,
        maxCard: "",
      };
    }
    return isValid && cardInfo;
  }
}

// AAA
export function checkTriple(cards) {
  if (cards.length !== 3) return false;
  const card1 = cards[0].rank;
  const isValid = cards.every((el) => el.rank === card1);
  if (isValid) {
    cardInfo = {
      cardType: "TRIPLE",
      matchLength: 3,
      addCard: 0,
      maxCard: card1,
    };
  }
  return isValid && cardInfo;
}

// AAAB
export function checkTriple1(cards) {
  const cloneCards = cloneDeep(cards);
  if (cards[0].rank === cards[1].rank) {
    // AAAB
    const isValid = checkTriple(cloneCards.slice(0, 3));
    if (isValid) {
      cardInfo = {
        cardType: "TRIPLE1",
        matchLength: 3,
        addCard: 1,
        maxCard: cards[0].rank,
      };
    }
    return isValid && cardInfo;
  } else {
    // BAAA
    const isValid = checkTriple(cloneCards.slice(-3));
    if (isValid) {
      cardInfo = {
        cardType: "TRIPLE1",
        matchLength: 3,
        addCard: 1,
        maxCard: cards[1].rank,
      };
    }
    return isValid && cardInfo;
  }
}

// AAABB
export function checkTriple2(cards) {
  const cloneCards = cloneDeep(cards);
  if (cards[0].rank === cards[2].rank) {
    if (checkTriple(cloneCards.slice(0, 3))) {
      const isValid = checkDouble(cloneCards.slice(-2));
      if (isValid) {
        cardInfo = {
          cardType: "TRIPLE2",
          matchLength: 3,
          addCard: 2,
          maxCard: cards[0].rank,
        };
      }
      return isValid && "TRIPLE2";
    }
  } else {
    if (checkTriple(cloneCards.slice(-3))) {
      const isValid = checkDouble(cloneCards.slice(0, 2));
      if (isValid) {
        cardInfo = {
          cardType: "checkTriple2",
          matchLength: 3,
          addCard: 1,
          maxCard: cards[2].rank,
        };
      }
      return isValid && "checkTriple2";
    }
  }
  return false;
}
// continuously ABCDEF
export function checkContinuously(cards) {
  const NOT_ALLOW_RANK = ["2", "little", "big"];
  if (cards.length < 5) return false;

  // 顺里面不能包括2，JOKER
  const isValid = NOT_ALLOW_RANK.some((el) => {
    return cards.some((card) => card.rank === el);
  });
  console.log(isValid, "isValid");
  if (isValid) return false;

  const nums = cards.map((el) => el.sortKey);
  let index = AscentSortOrder.indexOf(nums[0]);
  const isContinuously = nums.every((el) => {
    const isEqual = el === AscentSortOrder[index];
    index++;
    return isEqual;
  });
  if (isContinuously) {
    cardInfo = {
      cardType: "CONSEQUENT",
      matchLength: cards.length,
      addCard: 0,
      maxCard: cards[0].rank,
    };
  }
  return isContinuously && cardInfo;
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

  const uniqueArr = uniqBy(cards, "rank");
  const nums = uniqueArr.map((el) => el.rank);
  let index = AscentSortOrder.indexOf(nums[0]);
  const isContinuously = nums.every((el) => {
    console.log(el, AscentSortOrder[index], index);
    const isEqual = el === AscentSortOrder[index];
    index++;
    return isEqual;
  });
  if (isContinuously) {
    cardInfo = {
      cardType: "DOUBLE_CONSEQUENT",
      matchLength: cards.length / 2,
      addCard: 0,
      maxCard: cards[0].rank,
    };
  }
  return isContinuously && cardInfo;
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
  if (isContinuously) {
    cardInfo = {
      cardType: "TRIPLE_CONSEQUENT",
      matchLength: cards.length / 3,
      addCard: 0,
      maxCard: cards[0].rank,
    };
  }
  return isContinuously && cardInfo;
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
  const isValid = AAAgroup.length >= 2 && AAAgroup.length === Bgroup.length;
  if (isValid) {
    cardInfo = {
      cardType: n === 1 ? "AIRPLANE1" : "AIRPLANE2",
      matchLength: AAAgroup.length,
      addCard: n,
      maxCard: sortPoker(AAAgroup)[0],
    };
  }
  return isValid && cardInfo;
}

// 四带二（两张单牌或者两站对）
function checkAAAABC(cards, n) {
  const groups = countBy(cards, "rank");
  console.log(groups, "groups");
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
  const isValid = AAAAgroup.length === 1 && Bgroup.length === 2;
  if (isValid) {
    cardInfo = {
      cardType: n === 1 ? "FOUR1" : "FOUR2",
      matchLength: 1,
      addCard: n,
      maxCard: AAAAgroup[0],
    };
  }
  return isValid && cardInfo;
}
function checkType(cards) {
  const cardsLength = cards.length;
  if (cardsLength === 1) {
    return checkSingle(cards);
  }
  // 对牌 或者 王炸
  if (cardsLength === 2) {
    return checkDouble(cards) || checkJBOMB(cards);
  }
  // 三张牌
  if (cardsLength === 3) {
    return checkTriple(cards);
  }

  if (cardsLength === 4) {
    // 炸弹
    // 三带一
    return checkBomb(cards) || checkTriple1(cards);
  }

  // 三带二
  if (cardsLength === 5) {
    const isValid = checkTriple2(cards);
    if (isValid) return isValid;
  }

  // 单顺
  if (cardsLength >= 5 && cardsLength <= 12) {
    const isValid = checkContinuously(cards);
    if (isValid) return isValid;
  }

  // 双顺 三顺
  if (cardsLength >= 6 && cardsLength % 2 === 0) {
    const isValid = checkAABBCC(cards) || checkAAABBB(cards);
    if (isValid) return isValid;
  }
  // 四带二
  if (cardsLength === 6) {
    return checkAAAABC(cards, 1);
  }

  if (cardsLength >= 8) {
    return (
      checkAAABBBCD(cards, 1) ||
      checkAAABBBCD(cards, 2) ||
      checkAAAABC(cards, 2)
    );
  }
  return false;
}

function isBiggerUtils(maxCard, comMaxCard) {
  let i = sortOrder.indexOf(maxCard);
  let k = sortOrder.indexOf(comMaxCard);
  return i - k > 0;
}
export function isBigger(player, computer) {
  const { cardType, maxCard } = player.cardInfo;
  const comMaxCard = computer.cardInfo.maxCard;
  let isBigger = false;
  if ( cardType === "JBOMB") {
    return true;  
  }
  isBigger = isBiggerUtils(maxCard, comMaxCard);

  return isBigger;
}

const validate = {
  checkSingle,
  checkBomb,
  checkDouble,
  checkTriple,
  checkTriple1,
  checkTriple2,
  checkType,
  isBigger,
};
export default validate;
