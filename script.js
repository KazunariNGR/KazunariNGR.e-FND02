//スーツとランクをつくる
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
//ここまではほぼ自力でいけた、成長実感

//トランプを配る
function dealCards() {
  const deck = createDeck();

  //配列の要素をランダムに並び替える
  deck.sort(() => Math.random() - 0.5); //完全なシャッフルとは少し違うみたい

  const hand = deck.slice(0, 2); //手札の2枚
  const board = deck.slice(2, 6); //フロップとターンの4枚

  return { hand, board };
}

//画面に表示する
function displayCards(cards, elementId) {
  const area = document.getElementById(elementId);
  area.innerHTML = "";

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = `${card.rank}${card.suit}`;//テンプレートリテラル便利！！
    area.appendChild(div);
  });
}

//ボタンで配る
document.getElementById("dealButton").addEventListener("click", () => {
  const { hand, board } = dealCards();

  displayCards(hand, "hand");
  displayCards(board, "board");
});
