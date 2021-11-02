import sortOrder from "@/constant/order.js";
import cloneDeep from "lodash/cloneDeep.js";
// import groupBy from "lodash/groupBy.js";

let computer = null;
let againstPlayer = null;
let hitCard = [];

// 工具方法 等同与_groupBy
function groupBy(hands, key) {
  const cardMap = {};
  hands.forEach((el) => {
    if (cardMap[el[key]]) {
      cardMap[el[key]].push(el);
    } else {
      cardMap[el[key]] = [el];
    }
  });
  return cardMap;
}
function single() {
  console.log("single");
  const { hands, playerNum } = computer;
  const cardInfo = againstPlayer.cardInfo;
  console.log(cardInfo);

  const doubleList = [];
  const cardMap = groupBy(hands, "sortKey");
  const singGroup = [],
    doubleGroup = [],
    tripleGroup = [],
    bombGroup = [];

  console.log(singGroup, doubleGroup, tripleGroup, bombGroup);
  const reStructCardsGroup = [];
  for (const key in cardMap) {
    const cards = cardMap[key];
    if (cards.length === 1) {
      singGroup.push(cards[0]);
    }
    if (cards.length === 2) {
      doubleList.push(key);
      doubleGroup.push(cards);
    }
    if (cards.length === 3) {
      tripleGroup.push(cards);
    }
    if (cards.length === 4) {
      bombGroup.push(cards);
    }
    reStructCardsGroup.push({
      rank: key,
      cards: cardMap[key],
    });
  }
  console.log(singGroup, "singGroup");
  console.log(doubleGroup, "doubleGroup");
  console.log(tripleGroup, "tripleGroup");
  console.log(bombGroup, "bombGroup");
  singGroup.sort((a, b) => {
    const indexA = sortOrder.indexOf(a);
    const indexB = sortOrder.indexOf(b);
    return indexA - indexB;
  });
  console.log(singGroup, 'singGrouptobehit');
  let toBeHit = "";
  for (let index = 0; index < doubleList.length; index++) {
    const element = doubleList[index];
    const a = sortOrder.indexOf(element);
    const b = sortOrder.indexOf(hitCard[0].rank);

    if (a > b) {
      toBeHit = element;
      break;
    }
  }
  console.log(`要出的牌${toBeHit}`, `player${playerNum}`);
  hands.forEach((el) => {
    if (toBeHit && el.rank === toBeHit) {
      el.isSelected = true;
    }
  });
  computer.cardInfo = {
    cardType: "SINGLE",
    matchLength: 0,
    addCard: 0,
    maxCard: toBeHit.rank,
  };
  return toBeHit;
}

function double() {
  console.log("double");
  const { hands, playerNum } = computer;
  const cardMap = {};
  const doubleList = [];
  hands.forEach((el) => {
    if (cardMap[el.rank]) {
      cardMap[el.rank].push(el);
    } else {
      cardMap[el.rank] = [el];
    }
  });
  for (const key in cardMap) {
    if (cardMap[key].length === 2) {
      doubleList.push(key);
    }
  }
  doubleList.sort((a, b) => {
    const indexA = sortOrder.indexOf(a);
    const indexB = sortOrder.indexOf(b);
    return indexA - indexB;
  });
  let toBeHit = "";
  for (let index = 0; index < doubleList.length; index++) {
    const element = doubleList[index];
    const a = sortOrder.indexOf(element);
    const b = sortOrder.indexOf(hitCard[0].rank);

    if (a > b) {
      toBeHit = element;
      break;
    }
  }
  console.log(`要出的牌${toBeHit}`, `player${playerNum}`);
  hands.forEach((el) => {
    if (toBeHit && el.rank === toBeHit) {
      el.isSelected = true;
    }
  });

  computer.cardInfo = {
    cardType: "DOUBLE",
    matchLength: 2,
    addCard: 0,
    maxCard: toBeHit,
  };
  return toBeHit;
}

function computerDropTheCards() {
  const selectedCards = filterSelectedCard();
  computer.nowTurnHitCardsList = selectedCards;
  selectedCards.forEach((el) => {
    const index = computer.hands.findIndex((el2) => el2.id === el.id);
    computer.hands.splice(index, 1);
  });
}

// 电脑选中的牌
function filterSelectedCard() {
  const tempHitCards = cloneDeep(computer.hands).filter((el) => {
    return el.isSelected;
  });
  return tempHitCards;
}

export function computerHitCard(player, playerList) {
  computer = player;
  const { preTurn } = computer;

  // 上一个玩家
  againstPlayer = playerList[computer.preTurn - 1];
  // 上一个玩家出的牌
  hitCard = againstPlayer.nowTurnHitCardsList;
  // 如果上一家没有出牌 则去找上上家
  if (hitCard.length === 0) {
    againstPlayer = playerList[againstPlayer.preTurn - 1];
    hitCard = againstPlayer.nowTurnHitCardsList;
  }
  if (hitCard.length === 0) {
    if (preTurn === 1) {
      // 电脑的逻辑，自己随便走
      console.log("电脑的逻辑，自己随便走,剩下两个人都要不起，随便出牌");
      return;
    }
    console.log("2个人都要不起，随便出牌");
    return;
  }
  // 确定出牌的类型
  const type = againstPlayer.cardInfo.cardType;
  let isCPUhited = false;
  switch (type) {
    case "SINGLE":
      isCPUhited = single();
      break;
    case "DOUBLE":
      isCPUhited = double();
  }
  computerDropTheCards();
  return isCPUhited;
}
