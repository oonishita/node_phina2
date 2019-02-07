let socket;
if (typeof(io) != 'undefined') {
  socket = io.connect(location.origin);
} else {
  // ioオブジェクトが存在しない時にエラーにならない設定
  socket = {
    emit: () => {
    },
    on: () => {
    }
  };
}

let roomID;
$(function () {
  const windowDom = $(window);
  const controllerWindow = $('#controllerWindow');
  const pairingWindow = $('#pairingWindow');
  let controllerWidth;
  let controllerHeight;
  const CONTROLLER_MARGIN = 10;

  // ペアリングボタンをタップしたら、ペアリングを開始
  $('#pairingButton').click(function () {
    startPairing();
  });

  // ペアリングに成功
  socket.on('successPairing', function () {
    showControllWindow();
    $('#pairingIDText').text('Paring ID:' + roomID);
  });

  // PCとのペアリングに失敗
  socket.on('failPairingWithPC', function () {
    $('#pairingButton').show();
    $('#paringMessage').hide();
  });

  // ウィンドウのリサイズ
  windowDom.resize(resizeHandler);
  resizeHandler();

  $('#room');

  function startPairing() {
    $('#pairingButton').hide();
    $('#paringMessage').show();

    roomID = $('#roomID').val();
    socket.emit('pairingFromController', {
      'roomID': roomID
    });
  }

  function showControllWindow() {
    pairingWindow.animate({
      'top': '-50%'
    }, '1s', 'swing');
    controllerWindow.animate({
      'top': '0'
    }, '1s', 'swing');
  }

  function resizeHandler() {
    controllerWidth = windowDom.width() - CONTROLLER_MARGIN * 2;
    controllerHeight = windowDom.height() - CONTROLLER_MARGIN * 2;
    controllerWindow.css({
      'width': controllerWidth + 'px',
      'height': controllerHeight + 'px',
      'margin-left': '-' + controllerWidth / 2 + 'px',
      'margin-top': '-' + controllerHeight / 2 + 'px'
    });
  }

  //加速度センサー情報取得
window.addEventListener("deviceorientation", function(evt){

  //回転値
  var b =  parseInt(evt.beta); //x方向

  //傾き1　背景
  if(b <= -20){
    $("#slope0_window").css({
      "background-color":"#87cefa",
      "transition": "background-color 0.3s linear"
    });
  }else{
    $("#slope0_window").css({
      "background-color":"#fff",
      "transition": "background-color 0.3s linear"
    });
  }

  //傾き2　背景
  if(b >= 20){
    $("#slope1_window").css({
      "background-color":"#87cefa",
      "transition": "background-color 0.3s linear"
    });
  }else{
    $("#slope1_window").css({
      "background-color":"#fff",
      "transition": "background-color 0.3s linear"
    });
  }

}, true); 

const isTouch = ('ontouchstart' in window);
const MOUSE_DOWN = isTouch ? 'touchstart' : 'mousedown';
const MOUSE_UP = isTouch ? 'touchend' : 'mouseup';

//タップボタン１
  $('#tapbtn1').on(MOUSE_DOWN, (touchEvent) => {
    console.log('タッチ？')
    $('#tapbtn1').css({
      "box-shadow": "0 0 4px gray"
    });
    touchActionHandler(touchEvent, 'touchDownFromControler1');
  });

  $('#tapbtn1').on(MOUSE_UP, function() {
    $('#tapbtn1').css({
      "box-shadow": "0 0 16px gray"
    })
  });

  //タップボタン２
  $('#tapbtn2').on(MOUSE_DOWN, (touchEvent) => {
    $('#tapbtn2').css({
      "box-shadow": "0 0 4px gray"
    });
    touchActionHandler(touchEvent, 'touchDownFromControler2');
  });

  $('#tapbtn2').on(MOUSE_UP, function() {
    $('#tapbtn2').css({
      "box-shadow": "0 0 16px gray"
    })
  });

  /**
   * マウスのアクションがあった時に実行される
   * マウスイベントを受け取って、emitEventNameというデータをサーバーに送信する
   */
  function touchActionHandler(touchEvent, emitEventName) {
    // サーバーに送信
    socket.emit(emitEventName);
  }
});
