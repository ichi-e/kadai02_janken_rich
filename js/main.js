  // 乱数生成関数
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // カードの生成
  let cards = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
  ];

let first = null;
let second = null;
let timer = null;
let times = [];
let mekuri = 0;
let count = 0;
let clock = $("#clock");
let timer2;

// タイマーの設定
function start() {
  timer2 = setInterval(function () {
    clock.text(++count);
  }, 1000);
}

function setup (){
  // シャッフル（Fisher-Yatesアルゴリズム）
  for (let i = cards.length - 1; i > 0; i--) {
    let r = rand(0, i);
    [cards[i], cards[r]] = [cards[r], cards[i]];  // 配列の要素を交換
  }

  // カードの生成とフィールドへの追加
  let field = $("#field");
  cards.forEach(function(value, index){
      let card = $("<div>")
      .addClass("card")
      .data("index", index)
      .data("value", value)
      .text("")
      .on("click", click);
      field.append(card);
  });

}

  // カードをクリックしたときの処理
function click() {
    let elm = $(this);
    let imgNum = elm.data("value");

    $(".card").removeClass("");
    
    // タイマーが残っていたらクリアする処理
    if (timer) {
      clearTimeout(timer);
      judge();
    }
    if (elm.hasClass("hidden")) {
        return;
    }

    if (!first) {
        first = elm;
      elm.append('<img src="img/img' + imgNum + '.jpg">');
    } else if (first.data("index") === elm.data("index")) {
        return;
        // 同じカードがクリックされた場合、２枚目をクリックしたことにならないために必要
    } else {
      second = elm;
        timer = setTimeout(judge, 800);
      elm.append('<img src="img/img' + imgNum + '.jpg">');
    }

  }

  // 2 枚のカードが一致するかを判定する関数
  function judge() {
    if (first.data("value") === second.data("value")) {
      first.addClass("hidden");
      second.addClass("hidden");
      mekuri += 2;
      if (mekuri === cards.length) stopTimer();  // すべてのカードがめくられた場合
    } else {
      first.text("");
      second.text("");
    }
    first = null;
    second = null;
    timer = null;
  }

// タイマーを止める
function stopTimer() {
    clearInterval(timer2);
    times.push(count);
    mekuri = 0;
    count = 0;
    $("#note").empty();
    notes();
    timer2 = null;
}

// 記録
function notes() {
    times.sort(function (first, second) {
      return first - second;  
    });
  
    times.forEach(function (time, index) {
        let note = $("<div>")
            .data("index", index)
            .data("time", time)
            .text( "No" + (index+1) + " : " + time + "秒");
        $("#note").append(note);
    });
}

// スタートボタンを押した時の処理
$('#start_btn').off('click');
$('#start_btn').on('click', function () {
    if (timer2) {
        return;
    } 
    $("#field").empty();
    start();
    setup();
})

// 画面が読み込まれた時の処置
$(window).on('load', function () {
    setup();
    $(".card").addClass("disabled");
});
