// Socket.IOを使って接続
const socket = io.connect(location.origin);
// ランダムなルームIDを作成
const roomID = Math.floor(Math.random() * 10000);
//各レイヤー
const pairinglayer = $('#pairingLayer');
const phinadiv = $('#phinaDiv');
// roomIDに入室
socket.emit('pairingFromMain', {'roomID': roomID});
$(function () {
  $('#pairingCodeForSP').text(roomID);
  // サーバーからsuccessPairingというデータを受信
  socket.on('successPairing', loginSuccessHandler);

  function loginSuccessHandler() {
    pairinglayer.fadeOut();
      phinadiv.animate({
        'top': '0'
      }, '1s', 'swing');
  }
  
});

window.addEventListener('DOMContentLoaded', () => {
  // サーバーからtouchDownToMain1というデータを受信
  // コントローラーのマウスダウンイベントがサーバーを経由してメイン画面に届いた
  socket.on('touchDownToMain1', (data) => {
    console.log('tap');
  });
  // サーバーからtouchDownToMain2というデータを受信
  // コントローラーのマウスダウンイベントがサーバーを経由してメイン画面に届いた
  socket.on('touchDownToMain2', (data) => {
    console.log('タッチダウン2')
  });
  // サーバーからmouseMoveToMainというデータを受信
  // コントローラーのマウスムーブイベントがサーバーを経由してメイン画面に届いた
  // サーバーからmmouseUpToMainというデータを受信
  // コントローラーのマウスアップイベントがサーバーを経由してメイン画面に届いた

  // デモ用コード
  $('#controllerURL').text(location.origin + '/controller.html');
});
