//画面サイズ
  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;

  var SLOPE_TRACK_NUM = 2;
  var TRACK_NUM = 2;
  var MARKER_RADIUS = 120;
  var MARKER_STROKE_WIDTH = 12;

//ユニット・ノーツ・ディレイ
  var ICON_INTERVAL_DEGREE = 180 / (TRACK_NUM - 1); // 22.5
  var MARKER_APPEARANCE_DELTA = 750; // ノーツ出現時間(ms): 大きくするほど低速
  var UNIT_ARRANGE_RADIUS = SCREEN_HEIGHT * 0.85 | 0; // 中心からアイコンまでの距離
  var MUSIC_START_DELAY = 2000;


//レート
var RATING_TABLE = {
  perfect: {
    score: 1000,
    range: 80, //ms
  },
  great: {
    score: 500,
    range: 130, //ms
  },
  miss: {
    score: 0,
    range: 150, //ms
  },
};

// キーボード操作用
var KEYCODE_TO_KEYDATA_MAP = {
  65: {key:"a", id:0},
  76: {key:"l", id:1},
  70: {key:"f", id:2},
  73: {key:"j", id:3},
};
var INDEX_TO_KEY_MAP = {};
KEYCODE_TO_KEYDATA_MAP.forIn(function(key, val) {
  INDEX_TO_KEY_MAP[val.id] = val.key;
});

// アセット
var ASSETS = {
  // サウンド
  sound: {
    'urobo': './assets/uroboros.mp3',
    'gerbe': './assets/gerbera.mp3',
    'evans': './assets/evans.mp3',
    'kaidan': './assets/kaidan.mp3',
    'tap': './assets/tap.mp3',
    'tap02': './assets/tap02.mp3',
  },
  json: {
    beatmap: "./assets/wat1.json"
  }
};
  