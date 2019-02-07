phina.define("MainScene", {
  superClass: 'DisplayScene',

  init: function(option) {
    this.superInit(option);
    this.backgroundColor = 'skyblue';

    var self = this;
    var gx = this.gridX;
    var gy = this.gridY;
    var AM = phina.asset.AssetManager;

    var beatmap = AM.get('json', 'beatmap').data;
    var notes_array = beatmap.notes;

    // タイマーのセット
    this.elapsedTime = 0; // 経過時間
    this.gameTime = 0 - MUSIC_START_DELAY + beatmap.offset; // 判定用時間

    this.totalScore = 0;

    // 時間が来たら音楽流す
    this.one('musicstart', function() {
      SoundManager.playMusic('gerbe', null, false);
    });

    //傾きアイコン(1)
    var icon0 = SlopeIcon(0)
    .setPosition(gx.span(2),gy.span(10))
    .addChildTo(this);

    icon0.onpointstay = function() {
      self.judge(this); // 自分を渡す
    };

    //傾きアイコン(2)
    var icon1 = SlopeIcon(1)
    .setPosition(gx.span(14),icon0.y)
    .addChildTo(this);

    icon1.onpointstay = function() {
      self.judge1(this); // 自分を渡す
    };

    //タップアイコン(1)
    var icon2 = UnitIcon(2)
    .setPosition(gx.span(6),gy.span(13))
    .addChildTo(this);

    icon2.onpointstart = function() {
      self.judge2(this); // 自分を渡す
    };

    //タップアイコン(2)
    var icon3 = UnitIcon(3)
    .setPosition(gx.span(10),gy.span(13))
    .addChildTo(this);

    icon3.onpointstart = function() {
      self.judge3(this); // 自分を渡す
    };

    // 譜面の展開(傾き1)
    this.slopeGroup = DisplayElement()
    .setPosition(icon0.x, gy.span(-2))
    .addChildTo(this);

    var track_select = notes_array.filter(function(element){
      return element.mark_num == 0;
    });

    for(var i = 0; i < track_select.length; i++){
      var note = track_select[i];
      SlopeMarker(note.targetTime, note.track)
      .addChildTo(self.slopeGroup);
    }

    // 譜面の展開(傾き1)
    this.slopeGroup2 = DisplayElement()
    .setPosition(icon1.x, gy.span(-2))
    .addChildTo(this);

    var track_select1 = notes_array.filter(function(element1){
      return element1.mark_num == 1;
    });

    for(var j = 0; j < track_select1.length; j++){
      var note1 = track_select1[j];
      SlopeMarker(note1.targetTime, note1.track)
      .addChildTo(self.slopeGroup2);
    }


    // 譜面の展開(タップ1)
    this.markerGroup = DisplayElement()
    .setPosition(icon2.x, gy.span(-2))
    .addChildTo(this);

    var track_select2 = notes_array.filter(function(element2){
      return element2.mark_num == 2;
    });

    for(var k = 0; k < track_select2.length; k++){
      var note2 = track_select2[k];
      TargetMarker(note2.targetTime, note2.track)
      .addChildTo(self.markerGroup);
    }

    // 譜面の展開(タップ2)
    this.markerGroup2 = DisplayElement()
    .setPosition(icon3.x, gy.span(-2))
    .addChildTo(this);

    var track_select3 = notes_array.filter(function(element3){
      return element3.mark_num == 3;
    });
    
    for(var l = 0; l < track_select3.length; l++){
      var note3 = track_select3[l];
      TargetMarker(note3.targetTime, note3.track)
      .addChildTo(self.markerGroup2);
    }

  },

  update: function(app) {
    var self = this;
    var ps = app.pointers;
    var kb = app.keyboard;

    // タイマー加算
    this.elapsedTime += app.deltaTime;
    this.gameTime += app.deltaTime;
    var jadge_time = Math.floor(this.elapsedTime / 1000);

    // ゲームスタートまでの猶予
    if (this.has('musicstart') && this.elapsedTime > MUSIC_START_DELAY) {
      this.flare('musicstart');
    }

    //シーン遷移
    if(jadge_time >= 130){
      //urobo => 150;
      //gerbe => 130;
      self.exit();
    }

    //----------------   傾き１   -----------------
    // マーカー描画
    var markers = this.slopeGroup.children;
    markers.forEach(function(m) {
      if (!m.isAwake) return;

      var time = this.gameTime
      var rTime = m.targetTime - time; // 相対時間

      if (rTime < MARKER_APPEARANCE_DELTA) {
        // マーカーの位置比率や縮小率（倍率）を計算する
        // ratioはアイコンに近いほど1.0に近づく
        var ratio = (time - (m.targetTime - MARKER_APPEARANCE_DELTA)) / MARKER_APPEARANCE_DELTA;
        var distance = UNIT_ARRANGE_RADIUS * ratio;

        m.setVisible(true)
        .setPosition(
          m.vector.x * distance,
          m.vector.y * distance
        )
        .setScale(1,1);
      }

      // miss判定
      if (RATING_TABLE["miss"].range < -rTime) {
        this.reaction(m, "miss");
      }
    }.bind(this));

     //----------------   傾き2   -----------------
    // マーカー描画
    var markers1 = this.slopeGroup2.children;
    markers1.forEach(function(m) {
      if (!m.isAwake) return;

      var time = this.gameTime
      var rTime = m.targetTime - time; // 相対時間

      if (rTime < MARKER_APPEARANCE_DELTA) {
        // マーカーの位置比率や縮小率（倍率）を計算する
        // ratioはアイコンに近いほど1.0に近づく
        var ratio = (time - (m.targetTime - MARKER_APPEARANCE_DELTA)) / MARKER_APPEARANCE_DELTA;
        var distance = UNIT_ARRANGE_RADIUS * ratio;

        m.setVisible(true)
        .setPosition(
          m.vector.x * distance,
          m.vector.y * distance
        )
        .setScale(1,1);
      }

      // miss判定
      if (RATING_TABLE["miss"].range < -rTime) {
        this.reaction(m, "miss");
      }
    }.bind(this));

//----------------   タップ１   -----------------
    // マーカー描画
    var markers2 = this.markerGroup.children;
    markers2.forEach(function(m) {
      if (!m.isAwake) return;

      var time = this.gameTime
      var rTime = m.targetTime - time; // 相対時間

      if (rTime < MARKER_APPEARANCE_DELTA) {
        // マーカーの位置比率や縮小率（倍率）を計算する
        // ratioはアイコンに近いほど1.0に近づく
        var ratio = (time - (m.targetTime - MARKER_APPEARANCE_DELTA)) / MARKER_APPEARANCE_DELTA;
        var distance = UNIT_ARRANGE_RADIUS * ratio;

        m.setVisible(true)
        .setPosition(
          m.vector.x * distance,
          m.vector.y * distance
        )
        .setScale(1,1);
      }

      // miss判定
      if (RATING_TABLE["miss"].range < -rTime) {
        this.reaction(m, "miss");
      }
    }.bind(this));

    //----------------   タップ2   -----------------
    // マーカー描画
    var markers3 = this.markerGroup2.children;
    markers3.forEach(function(m) {
      if (!m.isAwake) return;

      var time = this.gameTime
      var rTime = m.targetTime - time; // 相対時間

      if (rTime < MARKER_APPEARANCE_DELTA) {
        // マーカーの位置比率や縮小率（倍率）を計算する
        // ratioはアイコンに近いほど1.0に近づく
        var ratio = (time - (m.targetTime - MARKER_APPEARANCE_DELTA)) / MARKER_APPEARANCE_DELTA;
        var distance = UNIT_ARRANGE_RADIUS * ratio;

        m.setVisible(true)
        .setPosition(
          m.vector.x * distance,
          m.vector.y * distance
        )
        .setScale(1,1);
      }

      // miss判定
      if (RATING_TABLE["miss"].range < -rTime) {
        this.reaction(m, "miss");
      }
    }.bind(this));

  },

  // 判定処理(傾き１)
  judge: function(unitIcon) {
    var time = this.gameTime;

    // 判定可能マーカーを探索
    var markers = this.slopeGroup.children;
    markers.some(function(m) {
      if (!m.isAwake || m.trackId !== unitIcon.id) return;

      // マーカーが有効かつtrackIdが一致、かつ判定範囲内
      // 判定が狭い順に判定し、該当したらループ拔ける
      var delta = Math.abs(m.targetTime - time);
      if (delta <= RATING_TABLE["perfect"].range) {
        unitIcon.fireEffect();
        SoundManager.play('tap');
        this.reaction(m, "perfect");
        return true;
      }
      if (delta <= RATING_TABLE["great"].range) {
        unitIcon.fireEffect();
        SoundManager.play('tap');
        this.reaction(m, "great");
        return true;
      }
      if (delta <= RATING_TABLE["miss"].range) {
        this.reaction(m, "miss");
        return true;
      }
    }.bind(this));
  },

  reaction: function(marker, rating) {
    // マーカー不可視化
    marker.isAwake = false;
    marker.visible = false;

    RateLabel({text: rating.toUpperCase()})
    .setPosition(this.gridX.center(), this.gridY.center())
    .addChildTo(this);

    this.totalScore += RATING_TABLE[rating].score;
  },

  // 判定処理(傾き2)
  judge1: function(unitIcon) {
    var time = this.gameTime;

    // 判定可能マーカーを探索
    var markers1 = this.slopeGroup2.children;
    markers1.some(function(m) {
      if (!m.isAwake || m.trackId !== unitIcon.id) return;

      // マーカーが有効かつtrackIdが一致、かつ判定範囲内
      // 判定が狭い順に判定し、該当したらループ拔ける
      var delta = Math.abs(m.targetTime - time);
      if (delta <= RATING_TABLE["perfect"].range) {
        unitIcon.fireEffect();
        SoundManager.play('tap');
        this.reaction(m, "perfect");
        return true;
      }
      if (delta <= RATING_TABLE["great"].range) {
        unitIcon.fireEffect();
        SoundManager.play('tap');
        this.reaction(m, "great");
        return true;
      }
      if (delta <= RATING_TABLE["miss"].range) {
        this.reaction(m, "miss");
        return true;
      }
    }.bind(this));
  },

  reaction: function(marker1, rating) {
    // マーカー不可視化
    marker1.isAwake = false;
    marker1.visible = false;

    RateLabel({text: rating.toUpperCase()})
    .setPosition(this.gridX.center(), this.gridY.center())
    .addChildTo(this);

    this.totalScore += RATING_TABLE[rating].score;
  },

  // 判定処理(タップ１)
  judge2: function(unitIcon) {
    var time = this.gameTime;

    // 判定可能マーカーを探索
    var markers2 = this.markerGroup.children;
    markers2.some(function(m) {
      if (!m.isAwake || m.trackId !== unitIcon.id) return;

      // マーカーが有効かつtrackIdが一致、かつ判定範囲内
      // 判定が狭い順に判定し、該当したらループ拔ける
      var delta = Math.abs(m.targetTime - time);
      if (delta <= RATING_TABLE["perfect"].range) {
        unitIcon.fireEffect();
        SoundManager.play('tap');
        this.reaction(m, "perfect");
        return true;
      }
      if (delta <= RATING_TABLE["great"].range) {
        unitIcon.fireEffect();
        SoundManager.play('tap');
        this.reaction(m, "great");
        return true;
      }
      if (delta <= RATING_TABLE["miss"].range) {
        this.reaction(m, "miss");
        return true;
      }
    }.bind(this));
  },

  reaction: function(marker2, rating) {
    // マーカー不可視化
    marker2.isAwake = false;
    marker2.visible = false;

    RateLabel({text: rating.toUpperCase()})
    .setPosition(this.gridX.center(), this.gridY.center())
    .addChildTo(this);

    this.totalScore += RATING_TABLE[rating].score;
  },

  // 判定処理(タップ２)
  judge3: function(unitIcon) {
    var time = this.gameTime;

    // 判定可能マーカーを探索
    var markers3 = this.markerGroup2.children;
    markers3.some(function(m) {
      if (!m.isAwake || m.trackId !== unitIcon.id) return;

      // マーカーが有効かつtrackIdが一致、かつ判定範囲内
      // 判定が狭い順に判定し、該当したらループ拔ける
      var delta = Math.abs(m.targetTime - time);
      if (delta <= RATING_TABLE["perfect"].range) {
        unitIcon.fireEffect();
        SoundManager.play('tap');
        this.reaction(m, "perfect");
        return true;
      }
      if (delta <= RATING_TABLE["great"].range) {
        unitIcon.fireEffect();
        SoundManager.play('tap');
        this.reaction(m, "great");
        return true;
      }
      if (delta <= RATING_TABLE["miss"].range) {
        this.reaction(m, "miss");
        return true;
      }
    }.bind(this));
  },

  reaction: function(marker3, rating) {
    // マーカー不可視化
    marker3.isAwake = false;
    marker3.visible = false;

    RateLabel({text: rating.toUpperCase()})
    .setPosition(this.gridX.center(), this.gridY.center())
    .addChildTo(this);

    this.totalScore += RATING_TABLE[rating].score;
  },
  
});
