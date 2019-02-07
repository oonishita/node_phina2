//ユニット表示アイコン(スロープ)
phina.define('SlopeIcon', {
  superClass: 'phina.display.PolygonShape',

  init: function(id) {
    this.superInit({
      radius: MARKER_RADIUS,
      strokeWidth: MARKER_STROKE_WIDTH,
      fill: "rgb(192,192,255)",
      strokeWidth: "8",
      stroke: "rgb(180,180,255)",
      sides: 4
    });
    this.setInteractive(true);
    this.id = id;
  },

  fireEffect: function() {
    EffectWave().addChildTo(this);
  },

});

//ユニット表示アイコン(タップ)
phina.define('UnitIcon', {
  superClass: 'phina.display.CircleShape',

  init: function(id) {
    this.superInit({
      radius: MARKER_RADIUS,
      strokeWidth: MARKER_STROKE_WIDTH,
      fill: "rgb(192,192,192)",
      strokeWidth: "8",
      stroke: "rgb(180,180,180)"
    });
    this.setInteractive(true);
    this.id = id;
  },

  fireEffect: function() {
    EffectWave2().addChildTo(this);
  },

});

/**
 * ターゲットマーカー（傾き）
 */
phina.define('SlopeMarker', {
  superClass: 'phina.display.PolygonShape',

  init: function(targetTime, trackId, type) {
    this.superInit({
      radius: MARKER_RADIUS,
      strokeWidth: MARKER_STROKE_WIDTH,
      fill: false,
      strokeWidth: "8",
      stroke: "rgb(110,110,180)",
      sides: 4
    });

    this.visible = false;
    this.scaleX = this.scaleY = 0;
    this.isAwake = true;

    this.targetTime = targetTime;
    this.trackId = trackId;
    this.vector = phina.geom.Vector2(0,1);
  },

});

/**
 * ターゲットマーカー（タップ）
 */
phina.define('TargetMarker', {
  superClass: 'phina.display.CircleShape',

  init: function(targetTime, trackId, type) {
    this.superInit({
      radius: MARKER_RADIUS,
      strokeWidth: MARKER_STROKE_WIDTH,
      stroke: "rgb(100,100,100)",
      fill: false,
    });

    this.visible = false;
    this.scaleX = this.scaleY = 0;
    this.isAwake = true;

    this.targetTime = targetTime;
    this.trackId = trackId;
    this.vector = phina.geom.Vector2(0,1);
  },

});

/**
 * エフェクト：白フェードアウト(傾き)
 */
phina.define('EffectWave', {
  superClass: 'phina.display.PolygonShape',

  init: function(options) {
    this.superInit({
      radius: MARKER_RADIUS,
      strokeWidth: MARKER_STROKE_WIDTH,
      fill: "white",
      stroke: false,
      sides: 4
    });

    this.tweener
    .to({scaleX:1.7, scaleY:1.7, alpha:0}, 250)
    .call(function() {
      this.remove();
    }, this);
  },
});

/**
 * エフェクト：白フェードアウト(タップ)
 */
phina.define('EffectWave2', {
  superClass: 'phina.display.CircleShape',

  init: function(options) {
    this.superInit({
      radius: MARKER_RADIUS,
      strokeWidth: MARKER_STROKE_WIDTH,
      stroke: false,
      fill: "white",
    });

    this.tweener
    .to({scaleX:1.7, scaleY:1.7, alpha:0}, 250)
    .call(function() {
      this.remove();
    }, this);
  },
});


/**
 * エフェクト："PERFECT!"など
 */
phina.define('RateLabel', {
  superClass: 'phina.display.Label',

  init: function(textParam) {
    this.superInit({
      text: textParam.text,
      fontSize: 60,
      strokeWidth: 8,
      fill: "pink",
      stroke: "white",
    });

    this.tweener
    .set({scaleX: 0.2, scaleY: 0.2, alpha: 0})
    .to({scaleX:1, scaleY:1, alpha:1}, 130, "easeOutCirc")
    .wait(250)
    .to({alpha:0}, 100)
    .call(function() {
      this.remove();
    }, this);
  },
});