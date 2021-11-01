import sortOrder from "@/constant/order.js";
let computer = null;
let againstPlayer = null;
let hitCard = [];

function single () {
  console.log('single');
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
  const cardInfo = {
    cardType: "SINGLE",
    matchLength: cards.length / 2,
    addCard: 0,
    maxCard: cards[0].rank,
  };
  return toBeHit;
}

function double() {
  console.log('single');
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
  const cardInfo = {
    cardType: "SINGLE",
    matchLength: cards.length / 2,
    addCard: 0,
    maxCard: cards[0].rank,
  };
  console.log('double');
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
    case 'SINGLE':
      isCPUhited = single();
      break;
    case 'DOUBLE':
      isCPUhited = double();
  }
  return isCPUhited;
}