(function() {
  'use strict';

  var busgame = window.busgame = {};

  var PLAYER_HEIGHT = 20;
  var PLAYER_WIDTH = 20;
  var STARTING_X = 100;
  var STARTING_Y = 100;
  var FIELD_BORDER = 4;
  var BORDER_POS_TOP = 20;
  var BORDER_POS_LEFT = 20;
  var FIELD_WIDTH = 500;
  var FIELD_HEIGHT = 500;
  var TICK_SPEED = 1;
  var MOVE_SPEED = 1;

  var field_top = BORDER_POS_TOP;
  var field_bottom = BORDER_POS_TOP + FIELD_HEIGHT;
  var field_left = BORDER_POS_LEFT + FIELD_BORDER;
  var field_right = BORDER_POS_LEFT + FIELD_WIDTH + FIELD_BORDER;
  var crash_top = field_top + FIELD_BORDER;
  var crash_bottom = field_bottom - FIELD_BORDER - PLAYER_HEIGHT;
  var crash_left = field_left + FIELD_BORDER;
  var crash_right = field_right - FIELD_BORDER - PLAYER_WIDTH;
  var player = busgame.player = document.getElementById('player');
  var field = busgame.field = document.getElementById('game-field');
  var pos = busgame.playerPos = {x: STARTING_X, y: STARTING_Y};

  // FUNCTIONS

  busgame.setPlayerPos = function(x,y){
    player.setAttribute("style", "top: " + y + "px; left: " + x + "px;")
  };

  busgame.respondToKey = function(event){
    var key = event.key;
    var value;
    event.type == "keyup" ? value = false : value = true;

    switch (key) {
      case "ArrowUp":
        busgame.moveUp = value;
        break;
      case "ArrowDown":
        busgame.moveDown = value;
        break;
      case "ArrowLeft":
        busgame.moveLeft = value;
        break;
      case "ArrowRight":
        busgame.moveRight = value;
        break;
    }
  };

  busgame.update = function(){
    busgame.playerMove()
  };

  busgame.playerMove = function(){
    var new_x, new_y;

    if (busgame.moveUp){
      new_y = pos['y'] - MOVE_SPEED;
      new_y > crash_top ?  pos['y'] = new_y : pos['y'] = crash_top;
    }
    if (busgame.moveDown){
      new_y = pos['y'] + MOVE_SPEED;
      new_y < crash_bottom ?  pos['y'] = new_y : pos['y'] = crash_bottom;
    }
    if (busgame.moveLeft){
      new_x = pos['x'] - MOVE_SPEED;
      new_x > crash_left ?  pos['x'] = new_x : pos['x'] = crash_left;
    }
    if (busgame.moveRight){
      new_x = pos['x'] + MOVE_SPEED;
      new_x < crash_right ? pos['x'] = new_x : pos['x'] = crash_right;
    }

    busgame.setPlayerPos(pos['x'],pos['y'])
  };

  // STARTING CONDITIONS
  busgame.playerX = STARTING_X;
  busgame.playerY = STARTING_Y;

  busgame.setPlayerPos(STARTING_X, STARTING_Y);

  field.setAttribute(
    "style",
    "border-width: " + FIELD_BORDER + "px;" +
    "position: absolute;" +
    "width: " + FIELD_WIDTH + "px;" +
    "height: " + FIELD_HEIGHT + "px;" +
    "top:" + field_top + "px;" +
    "left:" + field_left + "px;"
  );

  busgame.clock = window.setInterval(busgame.update, TICK_SPEED)

  document.addEventListener("keydown", busgame.respondToKey);
  document.addEventListener("keyup", busgame.respondToKey);
}());
