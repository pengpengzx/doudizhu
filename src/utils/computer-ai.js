import sortOrder from "@/constant/order.js";
import cloneDeep from "lodash/cloneDeep.js";
// import groupBy from "lodash/groupBy.js";
let playerInfo = null;
let againstPlayer = null;
let hitCard = [];
let comCardGroup = {
  singleGroup: [],
  doubleGroup: [],
  tripleGroup: [],
  bombGroup: [],
  abcdeGroup: [],
};
let isLockSingleGroup = false;
let isLockDoubleGroup = false;
let isLockTripleGroup = false;
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
  const { hands, playerNum } = playerInfo;
  const cardInfo = againstPlayer.cardInfo;
  const maxCard = cardInfo.maxCard;
  const singleGroup = comCardGroup.singleGroup;
  const index = singleGroup.findIndex((el) => {
    let i = sortOrder.indexOf(el.sortKey);
    let j = sortOrder.indexOf(maxCard);
    return i - j > 0;
  });
  // 是否有更大的牌出
  let hasMoreBigerCard = index > -1;

  // 没有的话结束计算
  if (!hasMoreBigerCard) return hasMoreBigerCard;
  const hitCard = singleGroup[index];
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

function triple() {
  const { hands } = playerInfo;
  const cardInfo = againstPlayer.cardInfo;
  const maxCard = cardInfo.maxCard;
  const tripleGroup = comCardGroup.tripleGroup;

  if (tripleGroup.length === 0) return false;
  const index = tripleGroup.findIndex((el) => {
    let i = sortOrder.indexOf(el[0].sortKey);
    let j = sortOrder.indexOf(maxCard);
    return i - j > 0;
  });
  // 是否有更大的牌出
  let hasMoreBigerCard = index > -1;

  // 没有的话结束计算
  if (!hasMoreBigerCard) return hasMoreBigerCard;
  const hitCards = tripleGroup[index];
  hitCards.forEach(el => {
    el.isSelected = true;
  })

  playerInfo.cardInfo = {
    cardType: "TRIPLE",
    matchLength: 3,
    addCard: 0,
    maxCard: hitCards[0].sortKey,
  };
  return true;
}
function bomb() {}
// 把要出的牌从手牌里删除
function computerDropTheCards() {
  const selectedCards = filterSelectedCard();
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
function initGameInfo(playerList) {
  // 上一个玩家
  againstPlayer = playerList[playerInfo.preTurn - 1];
  // 上一个玩家出的牌
  hitCard = againstPlayer.nowTurnHitCardsList;
  // 如果上一家没有出牌 则去找上上家
  if (hitCard.length === 0) {
    againstPlayer = playerList[againstPlayer.preTurn - 1];
    hitCard = againstPlayer.nowTurnHitCardsList;
  }
  // 等于0就是2个人都要不起
  return hitCard.length > 0;
}
// 给电脑当前手牌分组
function formatCardsGroup() {
  const hands = playerInfo.hands;
  const cardInfo = againstPlayer.cardInfo;
  console.log(cardInfo);

  const doubleList = [];
  const cardMap = groupBy(hands, "sortKey");
  const singleGroup = [],
    doubleGroup = [],
    tripleGroup = [],
    bombGroup = [],
    abcdeGroup = [];

  const reStructCardsGroup = [];
  for (const key in cardMap) {
    const cards = cardMap[key];
    if (cards.length === 1) {
      singleGroup.push(cards[0]);
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
  sortCard(singleGroup, isSingle);
  sortCard(doubleGroup);
  sortCard(tripleGroup);
  sortCard(bombGroup);
  comCardGroup = {
    singleGroup,
    doubleGroup,
    tripleGroup,
    bombGroup,
  };
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

function findAllABCDE() {
  const hands = playerInfo.hands;
  console.log(hands, "hands");
}

export default function computerHitCard(player, playerList) {
  playerInfo = player;
  const hasHitCard = initGameInfo(playerList);
  let isComputerFinished = false;
  console.log(hasHitCard, "hasHitCard");
  // 格式化手牌，按A，AA，AAA，AAAA分牌
  formatCardsGroup();
  // 其他两家都要不起，随意走
  if (!hasHitCard) {
    isComputerFinished = computerFreeAction();
  } else {
    // 确定出牌的类型
    const type = againstPlayer.cardInfo.cardType;
    switch (type) {
      case "SINGLE":
        isComputerFinished = single();
        break;
      case "DOUBLE":
        isComputerFinished = double();
        break;
      case "TRIPLE":
        isComputerFinished = triple();
        break;
      case "BOMB":
        isComputerFinished = bomb();
        break;
    }
  }

  // 把要出的牌从手牌里删除
  computerDropTheCards();
  return isComputerFinished;
}

function computerFreeAction() {
  let { singleGroup, doubleGroup, tripleGroup, bombGroup } = comCardGroup;
  // if (tripleGroup.length > 0) {
  isLockSingleGroup = singleGroup.length === 0 || isLockSingleGroup;
  isLockDoubleGroup = doubleGroup.length === 0 || isLockDoubleGroup;
  isLockTripleGroup = tripleGroup.length === 0 || isLockTripleGroup;
  if (singleGroup.length > 0) {
    console.log(singleGroup, "singleGroup");
    const hitCard = singleGroup[0];
    const sortKey = hitCard.sortKey;
    const i = sortOrder.indexOf(sortKey);
    console.log(i, "index");
    hitCard.isSelected = true;
    playerInfo.cardInfo = {
      cardType: "SINGLE",
      matchLength: 1,
      addCard: 0,
      maxCard: hitCard.sortKey,
    };
    return true;
  }
  if (isLockSingleGroup && doubleGroup.length > 0) {
    const hitCards = doubleGroup[0];
    hitCards.forEach((el) => {
      el.isSelected = true;
    });
    playerInfo.cardInfo = {
      cardType: "DOUBLE",
      matchLength: 2,
      addCard: 0,
      maxCard: hitCards[0].sortKey,
    };
    return true;
  }

  if (tripleGroup.length > 0) {
    const hitCards = tripleGroup[0];
    hitCards.forEach((el) => {
      el.isSelected = true;
    });
    playerInfo.cardInfo = {
      cardType: "TRIPLE",
      matchLength: 3,
      addCard: 0,
      maxCard: hitCards[0].sortKey,
    };
  }
  // 大顺子
}
