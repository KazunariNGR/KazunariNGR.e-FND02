
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

  // 確率計算
  const dummy = {
    onePair: 13.0,
    twoPair: 18.6,
    threeOfKind: 4.3,
    straight: 17.4,
    flush: 19.5
  };

  displayProb(dummy);
});
