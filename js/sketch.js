// ジェスチャーの種類

let tableImgElement;
let statusElement;

function getCode(left_gesture, right_gesture) {
  let code_array = {
    "1-samples": 1,
    "2-samples": 2,
    "3-samples": 3,
    "4-samples": 4,
    "5-samples": 5,
    "6-samples": 6,
    "7-samples": 7,
  };

  let left_code = code_array[left_gesture];
  let right_code = code_array[right_gesture];

  if (left_code === undefined || right_code === undefined) {
    return "";
  }

  return String(left_code) + String(right_code);
}

function getCharacter(code) {
  const codeToChar = {
    "11": "a", "12": "b", "13": "c", "14": "d", "15": "e", "16": "f",
    "17": "g", "21": "h", "22": "i", "23": "j", "24": "k", "25": "l",
    "26": "m", "27": "n", "31": "o", "32": "p", "33": "q", "34": "r",
    "35": "s", "36": "t", "37": "u", "41": "v", "42": "w", "43": "x",
    "44": "y", "45": "z", "55": " ", "66": "backspace"
  };
  return codeToChar[code] || "";
}

let sample_texts = [
  "the quick brown fox jumps over the lazy dog",
];

let game_mode = {
  now: "notready",
  previous: "notready",
};

let game_start_time = 0;
let gestures_results;
let cam = null;
let p5canvas = null;

function setup() {
  p5canvas = createCanvas(320, 240);
  p5canvas.parent('#canvas');

  tableImgElement = document.createElement("img");
  tableImgElement.src = "js/table.png";
  tableImgElement.alt = "入力対応表";
  tableImgElement.style.display = "block";
  tableImgElement.style.margin = "12px auto";
  tableImgElement.style.borderRadius = "16px";
  tableImgElement.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
  tableImgElement.style.width = "800px";
  tableImgElement.style.height = "auto";

  const canvasArea = document.querySelector("#canvas");
  canvasArea.appendChild(tableImgElement);

  statusElement = createDiv("認識中：-");
  statusElement.parent("#canvas");
  statusElement.style("font-size", "24px");
  statusElement.style("font-weight", "bold");
  statusElement.style("color", "#14101f");
  statusElement.style("margin-top", "12px");
  statusElement.style("text-align", "center");

  let lastChar = "";
  let lastCharTime = millis();

  gotGestures = function (results) {
    gestures_results = results;

    if (results.gestures.length == 2) {
      if (game_mode.now == "ready" && game_mode.previous == "notready") {
        game_mode.previous = game_mode.now;
        game_mode.now = "playing";
        document.querySelector('input').value = "";
        game_start_time = millis();
      }

      let left_gesture;
      let right_gesture;

      if (results.handedness[0][0].categoryName == "Left") {
        left_gesture = results.gestures[0][0].categoryName;
        right_gesture = results.gestures[1][0].categoryName;
      } else {
        left_gesture = results.gestures[1][0].categoryName;
        right_gesture = results.gestures[0][0].categoryName;
      }

      let code = getCode(left_gesture, right_gesture);
      let c = getCharacter(code);

      statusElement.html("認識中：" + (c || "-"));

      let now = millis();

      if (c === "") {
        return;
      }

      if (c !== lastChar) {
        lastChar = c;
        lastCharTime = now;
        return;
      }

      if (now - lastCharTime > 800) {
        typeChar(c);
        lastCharTime = now;
      }
    }
  };
  // 参考リンク
let linkElement = document.createElement("a");
linkElement.href = "https://park-sc.paa.jp/park2/dc/018/chapter2-05/";
linkElement.textContent = "手の形1〜7";
linkElement.target = "_blank";
linkElement.style.display = "block";
linkElement.style.textAlign = "center";
linkElement.style.margin = "10px";
linkElement.style.color = "#1a0f2e";
linkElement.style.fontWeight = "bold";
document.body.appendChild(linkElement);

// ぷかぷかアルファベット背景
let floatingBox = document.createElement("div");
floatingBox.style.position = "fixed";
floatingBox.style.top = "0";
floatingBox.style.left = "0";
floatingBox.style.width = "100%";
floatingBox.style.height = "100%";
floatingBox.style.pointerEvents = "none";
floatingBox.style.overflow = "hidden";
floatingBox.style.zIndex = "-1";
document.body.appendChild(floatingBox);

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for (let i = 0; i < 20; i++) {
  let span = document.createElement("span");
  span.textContent = letters[Math.floor(Math.random() * letters.length)];
  span.style.position = "absolute";
  span.style.left = Math.random() * 100 + "%";
  span.style.top = Math.random() * 100 + "%";
  span.style.fontSize = 18 + Math.random() * 30 + "px";
  span.style.color = "rgba(255, 120, 180, 0.35)";
  span.style.animation = `floatAlpha ${4 + Math.random() * 4}s ease-in-out infinite`;
  span.style.animationDelay = Math.random() * 3 + "s";
  floatingBox.appendChild(span);
}

let style = document.createElement("style");
style.textContent = `
  body {
    background: linear-gradient(180deg, #fff7fb, #eef8ff);
  }

  @keyframes floatAlpha {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-18px) rotate(8deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
`;
document.head.appendChild(style);
}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ここから下は課題制作にあたって編集してはいけません。
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// 入力欄に文字を追加する場合は必ずこの関数を使用してください。
function typeChar(c) {
  if (c === "") {
    console.warn("Empty character received, ignoring.");
    return;
  }
  // inputにフォーカスする
  document.querySelector('input').focus();
  // 入力欄に文字を追加または削除する関数
  const input = document.querySelector('input');
  if (c === "backspace") {
    input.value = input.value.slice(0, -1);
  } else {
    input.value += c;
  }

  let inputValue = input.value;
  // #messageのinnerTextを色付けして表示
  const messageElem = document.querySelector('#message');
  const target = messageElem.innerText;
  let matchLen = 0;
  for (let i = 0; i < Math.min(inputValue.length, target.length); i++) {
    if (inputValue[i] === target[i]) {
      matchLen++;
    } else {
      break;
    }
  }
  const matched = target.slice(0, matchLen);
  const unmatched = target.slice(matchLen);
  console.log(`Matched: ${matched}, Unmatched: ${unmatched}`);
  messageElem.innerHTML =
    `<span style="background-color:lightgreen">${matched}</span><span style="background-color:transparent">${unmatched}</span>`;




  // もしvalueの値がsample_texts[0]と同じになったら、[0]を削除して、次のサンプル文章に移行する。配列長が0になったらゲームを終了する
  if (document.querySelector('input').value == sample_texts[0]) {
    sample_texts.shift(); // 最初の要素を削除
    console.log(sample_texts.length);
    if (sample_texts.length == 0) {
      // サンプル文章がなくなったらゲーム終了
      game_mode.previous = game_mode.now;
      game_mode.now = "finished";
      document.querySelector('input').value = "";
      const elapsedSec = ((millis() - game_start_time) / 1000).toFixed(2);
      document.querySelector('#message').innerText = `Finished: ${elapsedSec} sec`;
    } else {
      // 次のサンプル文章に移行
      document.querySelector('input').value = "";
      document.querySelector('#message').innerText = sample_texts[0];
    }
  }

}


function startWebcam() {
  // If the function setCameraStreamToMediaPipe is defined in the window object, the camera stream is set to MediaPipe.
  if (window.setCameraStreamToMediaPipe) {
    cam = createCapture(VIDEO);
    cam.hide();
    cam.elt.onloadedmetadata = function () {
      window.setCameraStreamToMediaPipe(cam.elt);
    }
    p5canvas.style('width', '100%');
    p5canvas.style('height', 'auto');
  }

  if (game_mode.now == "notready") {
    game_mode.previous = game_mode.now;
    game_mode.now = "ready";
    document.querySelector('#message').innerText = sample_texts[0];
    game_start_time = millis();
  }
}


function draw() {
  background(127);
  if (cam) {
    image(cam, 0, 0, width, height);
  }
  // 各頂点座標を表示する
  // 各頂点座標の位置と番号の対応は以下のURLを確認
  // https://developers.google.com/mediapipe/solutions/vision/hand_landmarker
  if (gestures_results) {
    if (gestures_results.landmarks) {
      for (const landmarks of gestures_results.landmarks) {
        for (let landmark of landmarks) {
          noStroke();
          fill(100, 150, 210);
          circle(landmark.x * width, landmark.y * height, 10);
        }
      }
    }

    // ジェスチャーの結果を表示する
    for (let i = 0; i < gestures_results.gestures.length; i++) {
      noStroke();
      fill(255, 0, 0);
      textSize(10);
      let name = gestures_results.gestures[i][0].categoryName;
      let score = gestures_results.gestures[i][0].score;
      let right_or_left = gestures_results.handednesses[i][0].hand;
      let pos = {
        x: gestures_results.landmarks[i][0].x * width,
        y: gestures_results.landmarks[i][0].y * height,
      };
      textSize(20);
      fill(0);
      textAlign(CENTER, CENTER);
      text(name, pos.x, pos.y);
    }
  }

  if (game_mode.now == "notready") {
    // 文字の後ろを白で塗りつぶす
    let msg = "Press the start button to begin";
    textSize(18);
    let tw = textWidth(msg) + 20;
    let th = 32;
    let tx = width / 2;
    let ty = height / 2;
    rectMode(CENTER);
    fill(255, 100);
    noStroke();
    rect(tx, ty, tw, th, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(msg, tx, ty);
  }
  else if (game_mode.now == "ready") {
    let msg = "Waiting for gestures to start";
    textSize(18);
    let tw = textWidth(msg) + 20;
    let th = 32;
    let tx = width / 2;
    let ty = height / 2;
    rectMode(CENTER);
    fill(255, 100);
    noStroke();
    rect(tx, ty, tw, th, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(msg, tx, ty);
  }
  else if (game_mode.now == "playing") {
    // ゲーム中のメッセージ
    let elapsedSec = ((millis() - game_start_time) / 1000).toFixed(2);
    let msg = `${elapsedSec} [s]`;
    textSize(18);
    let tw = textWidth(msg) + 20;
    let th = 32;
    let tx = width / 2;
    let ty = th;
    rectMode(CENTER);
    fill(255, 100);
    noStroke();
    rect(tx, ty, tw, th, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(msg, tx, ty);
  }
  else if (game_mode.now == "finished") {
    // ゲーム終了後のメッセージ
    let msg = "Game finished!";
    textSize(18);
    let tw = textWidth(msg) + 20;
    let th = 32;
    let tx = width / 2;
    let ty = height / 2;
    rectMode(CENTER);
    fill(255, 100);
    noStroke();
    rect(tx, ty, tw, th, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(msg, tx, ty);
  }

}


