import sortOrder from "@/constant/order.js";
import cloneDeep from "lodash/cloneDeep.js";
// import groupBy from "lodash/groupBy.js";
let playerInfo = null;
let againstPlayer = null;
let hitCard = [];
let comCardGroup = {
  singGroup: [],
  doubleGroup: [],
  tripleGroup: [],
  bombGroup: [],
};

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

// A
function single() {
  console.log("single");
  const { hands, playerNum } = playerInfo;
  const cardInfo = againstPlayer.cardInfo;
  const maxCard = cardInfo.maxCard;
  const singGroup = comCardGroup.singGroup;
  const index = singGroup.findIndex((el) => {
    let i = sortOrder.indexOf(el.sortKey);
    let j = sortOrder.indexOf(maxCard);
    return i - j > 0;
  });
  // 是否有更大的牌出
  let hasMoreBigerCard = index > -1;
  console.log(hasMoreBigerCard, 'hasMoreBigerCard');
  console.log(maxCard, 'maxCardmaxCardmaxCardmaxCard');
  // 没有的话结束计算
  if (!hasMoreBigerCard) return hasMoreBigerCard;
  const hitCard = singGroup[index];
  const cardid = hitCard.id;

  hands.forEach((el) => {
    if (el.id === cardid) {
      el.isSelected = true;
    }
  });

  playerInfo.cardInfo = {
    cardType: "SINGLE",
    matchLength: 1,
    addCard: 0,
    maxCard: hitCard.sortKey,
  };
  console.log(`要出的牌${hitCard.sortKey}`, `playerInfo${playerNum}`);
  return hasMoreBigerCard;
}

// AA
function double() {
  console.log("double");
  const { hands, playerNum } = playerInfo;
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

  playerInfo.cardInfo = {
    cardType: "DOUBLE",
    matchLength: 2,
    addCard: 0,
    maxCard: toBeHit,
  };
  return toBeHit;
}

function computerDropTheCards() {
  const selectedCards = filterSelectedCard();
  console.log(selectedCards, 'selectedCards');
  playerInfo.nowTurnHitCardsList = selectedCards;
  selectedCards.forEach((el) => {
    const index = playerInfo.hands.findIndex((el2) => el2.id === el.id);
    playerInfo.hands.splice(index, 1);
  });
}

// 电脑选中的牌
function filterSelectedCard() {
  const tempHitCards = cloneDeep(playerInfo.hands).filter((el) => {
    return el.isSelected;
  });
  return tempHitCards;
}

// 初始化当前数据（要对付的玩家和他出的牌）
function initGameInfo(player, playerList) {
  // 上一个玩家
  againstPlayer = playerList[playerInfo.preTurn - 1];
  // 上一个玩家出的牌
  hitCard = againstPlayer.nowTurnHitCardsList;
  // 如果上一家没有出牌 则去找上上家
  if (hitCard.length === 0) {
    againstPlayer = playerList[againstPlayer.preTurn - 1];
    hitCard = againstPlayer.nowTurnHitCardsList;
  }
  // 上上家也要不起
  if (hitCard.length === 0) {
    if (player.preTurn === 1) {
      // 电脑的逻辑，自己随便走
      console.log("电脑的逻辑，自己随便走,剩下两个人都要不起，随便出牌");
      return false;
    }
    console.log("2个人都要不起，随便出牌");
    return false;
  }
  return hitCard.length;
}
// 给电脑当前手牌分组
function formatCardsGroup() {
  const hands = playerInfo.hands;
  const cardInfo = againstPlayer.cardInfo;
  console.log(cardInfo);

  const doubleList = [];
  const cardMap = groupBy(hands, "sortKey");
  const singGroup = [],
    doubleGroup = [],
    tripleGroup = [],
    bombGroup = [];

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
  // 排序
  let isSingle = true; // 手否是处理单牌的情况
  sortCard(singGroup, isSingle);
  sortCard(doubleGroup);
  sortCard(tripleGroup);
  sortCard(bombGroup);

  comCardGroup = {
    singGroup,
    doubleGroup,
    tripleGroup,
    bombGroup,
  };
  console.log(comCardGroup, "ssss");
}

function sortCard(collection, isSingle) {
  if (isSingle) {
    collection.sort((a, b) => {
      const i = sortOrder.indexOf(a.sortKey);
      const j = sortOrder.indexOf(b.sortKey);
      return i - j;
    });
  } else {
    collection.sort((a, b) => {
      const i = sortOrder.indexOf(a[0].sortKey);
      const j = sortOrder.indexOf(b[0].sortKey);
      return i - j;
    });
  }
}

export default function computerHitCard(player, playerList) {
  playerInfo = player;
  const hasHitCard = initGameInfo(player, playerList);

  // 其他两家都要不起，随意走
  if (!hasHitCard) return false;
  // 确定出牌的类型
  const type = againstPlayer.cardInfo.cardType;
  formatCardsGroup();
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
