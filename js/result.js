phina.define('ResultScene', {
    superClass: 'DisplayScene',
    init: function(option) {
      this.superInit(option);
      var self = this;
      // 背景色を指定
      this.backgroundColor = '#444';
      // ラベルを生成
      this.label = Label('Hello, phina.js!').addChildTo(this);
      this.label.x = this.gridX.center(); // x 座標
      this.label.y = this.gridY.center(); // y 座標
      this.label.fill = 'white'; // 塗りつぶし色
      var nextBtn = Shape({
        backgroundColor: 'blue',
        x: this.gridX.center(2),
        y: this.gridY.center(),
      }).addChildTo(this);
      nextBtn.setInteractive(true);
      nextBtn.on('pointstart',function(){
        self.exit();
      })
    },
  });