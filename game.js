(function() {
  'use strict';
  
  var busgame = window.busgame = {};
  
  var PLAYER_HEIGHT = 20;
  var PLAYER_WIDTH = 20;
  var STARTING_X = 10;
  var STARTING_Y = 10;
  var FIELD_BORDER = 4;
  var BORDER_POS_TOP = 0;
  var BORDER_POS_LEFT = 0;
  var FIELD_WIDTH = 500;
  var FIELD_HEIGHT = 500;
  var TICK_SPEED = 1;
  var MOVE_SPEED = 1;
  
  var field_top = BORDER_POS_TOP + FIELD_BORDER;
  var field_bottom = BORDER_POS_TOP + FIELD_HEIGHT - PLAYER_HEIGHT + FIELD_BORDER;
  var player_crash_bottom = BORDER_POS_TOP + FIELD_HEIGHT - PLAYER_HEIGHT + FIELD_BORDER;
  var field_left = BORDER_POS_LEFT + FIELD_BORDER;
  var field_right = BORDER_POS_LEFT + FIELD_WIDTH + FIELD_BORDER - PLAYER_WIDTH;
  var player_crash_right = 504;//BORDER_POS_LEFT + FIELD_WIDTH + FIELD_BORDER ;
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
  }
  
  busgame.update = function(){
    busgame.playerMove()
  }
    
  
  busgame.playerMove = function(){
    var new_x, new_y;
    
    if (busgame.moveUp){
      new_y = pos['y'] - MOVE_SPEED;
      new_y > field_top ?  pos['y'] = new_y : pos['y'] = field_top;
    }
    if (busgame.moveDown){
      new_y = pos['y'] + MOVE_SPEED;
      new_y < player_crash_bottom ?  pos['y'] = new_y : pos['y'] = player_crash_bottom;
    }
    if (busgame.moveLeft){
      new_x = pos['x'] - MOVE_SPEED;
      new_x > field_left ?  pos['x'] = new_x : pos['x'] = field_left;
    }
    if (busgame.moveRight){
      new_x = pos['x'] + MOVE_SPEED;
      new_x < field_right ? pos['x'] = new_x : pos['x'] = field_right;
    }
    
    busgame.setPlayerPos(pos['x'],pos['y'])
  }
  
  // STARTING CONDITIONS
  busgame.playerX = STARTING_X;
  busgame.playerY = STARTING_Y;
  
  busgame.setPlayerPos(STARTING_X, STARTING_Y);
  
  field.setAttribute(
    "style",
    "width: " + FIELD_WIDTH + "px;" +
    "height: " + FIELD_HEIGHT + "px;" +
    "top:" + field_top + "px;" +
    "left:" + field_left + "px;"
  )
  
  busgame.clock = window.setInterval(busgame.update, TICK_SPEED)
  
  document.addEventListener("keydown", busgame.respondToKey);
  document.addEventListener("keyup", busgame.respondToKey);
}());
