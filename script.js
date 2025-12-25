
const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

//トランプのデッキを配列でつくる　⇒　確率計算でオブジェクトのほうがよかった
function createDeck() {
  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  return deck;
}

//ハンドとボードのトランプを配る
function dealCards() {
  const deck = createDeck();

  //カードシャッフル
  deck.sort(() => Math.random() - 0.5); //完全なシャッフルとは少し違う

  const hand = deck.slice(0, 2);
  const board = deck.slice(2, 7);

  return { hand, board };
}

//スートとランクの表示、ハンド用で単純に２枚表示用
function displayCards(cards, elementId) {
  const area = document.getElementById(elementId);
  area.innerHTML = "";

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    //赤スートなら赤くする
    if (card.suit === "♥" || card.suit === "♦") {
      div.classList.add("red");
    }

    //カードの文字を表示
    div.textContent = `${card.rank}${card.suit}`; //テンプレートリテラル便利
    area.appendChild(div);
  });
}

//場5枚を表示（右端は枠のみ）リバーのカードは内部的には引いておく
function displayBoard(boardCards, elementId) {
  const area = document.getElementById(elementId);
  area.innerHTML = "";

  //左から4枚を表向きで表示
  for (let i = 0; i < 4; i++) {
    const card = boardCards[i];
    const div = document.createElement("div");
    div.className = "card";

    if (card.suit === "♥" || card.suit === "♦") {
      div.classList.add("red");
    }

    div.textContent = `${card.rank}${card.suit}`;
    area.appendChild(div);
  }

  //リバー表示
  const empty = document.createElement("div");
  empty.className = "card empty";
  area.appendChild(empty);
}

//他のプレイヤーカード2枚を描画
function displayBackCards(elementId) {
  const area = document.getElementById(elementId);
  area.innerHTML = "";

  for (let i = 0; i < 2; i++) {
    const div = document.createElement("div");
    div.className = "card back";
    area.appendChild(div);
  }
}

//確率表示
function displayProb(probs) {
  document.getElementById("onePair").textContent = probs.onePair.toFixed(1) + "%";

  document.getElementById("twoPair").textContent = probs.twoPair.toFixed(1) + "%";

  document.getElementById("three").textContent = probs.threeOfKind.toFixed(1) + "%";

  document.getElementById("straight").textContent = probs.straight.toFixed(1) + "%";

  document.getElementById("flush").textContent = probs.flush.toFixed(1) + "%";
}


document.getElementById("dealButton").addEventListener("click", () => {
  const { hand, board } = dealCards();

  displayCards(hand, "hand");//手札2枚を下に表示
  displayBoard(board, "board");//場5枚を中央に表示（右端は枠だけ）
  displayBackCards("opponent-top");
  const turnBoard = board.slice(0, 4);

  // 確率計算
  const dummy = {
    onePair: calOnePair(hand,turnBoard),
    twoPair: calTwoPair(hand,turnBoard),
    threeOfKind: calThreeOfKind(hand,turnBoard),
    straight: "未実装",
    flush: "未実装"
  };

  displayProb(dummy);
});

//ワンペア確率
function calOnePair(hand, turnBoard) {
  const [h1, h2] = hand;
  const boardRanks = turnBoard.map(c => c.rank); //スートをとる

  //ポケットペア
  if (h1.rank === h2.rank) {
    return 100.0;
  }

  //すでにワンペア
  if (boardRanks.includes(h1.rank) || boardRanks.includes(h2.rank)) {
    return 100.0;
  }

  //リバーで完成する確率
  return ( 6 / 46 ) * 100;
}

//ツーペア確率
function calTwoPair(hand, turnBoard) {
  const [h1, h2] = hand;
  const boardRanks = turnBoard.map(c => c.rank);

  //すでにツーペア
  const h1Hit = boardRanks.includes(h1.rank);
  const h2Hit = boardRanks.includes(h2.rank);

  if (h1Hit && h2Hit) {
    return 100.0;
  }

  //ペアなし
  const noPair = !h1Hit && !h2Hit && h1.rank !== h2.rank;
  if (noPair) {
    return 0.0;
  }

  //ワンペアからツーペアになる確率
  return (3 / 46) * 100;
}

//スリーカード確率
function calThreeOfKind(hand, turnBoard) {

  const [h1, h2] = hand;
  const boardRanks = turnBoard.map(c => c.rank);

  //手札と同じランクが場に何枚出ているか
  const h1Matches = boardRanks.filter(r => r === h1.rank).length;
  const h2Matches = boardRanks.filter(r => r === h2.rank).length;

  //すでにスリーカード
  if ((h1.rank === h2.rank && h1Matches >= 1) ||  // ポケットペア＋ボード1枚
      h1Matches >= 2 || h2Matches >= 2) {
    return 100.0;
  }

  //ペアなし
  const noPair =
    h1Matches === 0 && h2Matches === 0 && h1.rank !== h2.rank;

  if (noPair) {
    return 0.0;
  }

  //ワンペアからスリーカードの確率
  return (2 / 46) * 100;
}

