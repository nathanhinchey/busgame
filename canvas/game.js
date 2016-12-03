(function() {
  'use strict';
  var sg = window.spaceGame = window.spaceGame || {};

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var CHASE_DISTANCE = 300;
  var BULLET_SPEED = 10;


  sg.player = {
    x: -1000,
    y: -1000,
    radius: 20,
    color: 'green'
  };

  sg.enemies = [
    {x: 200, y: 200, radius: 20, color: 'pink', speed: 2, behavior: 'chaseWhenNear'},
    {x: 300, y: 300, radius: 20, color: 'lightblue', speed: 2, behavior: 'wander'},
    {x: 400, y: 400, radius: 20, color: 'orange', speed: 0.5, behavior: 'waitForAggroThenFastSeek'},
  ];
  
  sg.bullets = [];

  sg.drawShip = function(ship){
    ctx.fillStyle = ship.color;

    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.radius, 0, 2 * Math.PI);
    ctx.fill();
  };
  
  sg.findNearestEnemy = function(){
    var nearestEnemy, dx, dy, currentDistance;
    var bestDistanceYet = Infinity;
    sg.enemies.forEach(function(enemy){
      dx = enemy.x - sg.player.x;
      dy = enemy.y - sg.player.y;
      currentDistance = Math.sqrt(dx**2 + dy**2);
      if (!nearestEnemy ||  currentDistance < bestDistanceYet){
        nearestEnemy = enemy;
        bestDistanceYet = currentDistance;
      }
    });
    
    return nearestEnemy;
  };
  
  sg.shootAt = function(enemy){
    dx = sg.player.x - enemy.x;
    dy = sg.player.y - enemy.y;
    var theta = Math.atan2(dy,dx);
    
    var bullet = {
      speed: BULLET_SPEED,
      direction: theta,
      x: sg.player.x,
      y: sg.player.y
    };
    
    sg.bullets.push(bullet);
  }
  
  sg.moveBullets = function(){
    sg.bullets.forEach(function(bullet, index){
      bullet.x = Math.cos(bullet.direction);
      bullet.y = Math.sin(bullet.direction);
      
      // TODO: this is hugely inefficient
      var boom;
      for (var i; i < sg.enemies.length; i++){
        if (isColliding(sg.enemies[i], bullet)){
          sg.enemies.splice(i,1);
          boom = true;
        }
      }
      
      if (boom || !(0 < bullet.x < sg.canvasWidth && 0 < bullet.y < sg.canvasHeight)){
        bullets.splice(index)
      }
    })
  };

  sg.drawPlayerShip = function(){
    sg.drawShip(sg.player)
  };

  sg.behaviors = {
    wander: function(ship){
      if (Math.random() > 0.99 || !ship.direction){
        ship.direction = Math.random() * 4 * Math.PI - 2 * Math.PI;
      }

      if (ship.x < 0){
        ship.direction = 0;
      }
      if (ship.x > sg.canvasWidth){
        ship.direction = Math.PI;
      }
      if (ship.y < 0){
        ship.direction = Math.PI * 0.5;
      }
      if (ship.y > sg.canvasHeight){
        ship.direction = Math.PI * 1.5;
      }
    },
    seek: function(ship){
      // This math is confusing to me.
      var dx = sg.player.x - ship.x;
      var dy = sg.player.y - ship.y;
      var theta = Math.atan2(dy,dx);

      ship.direction = theta;
    },
    chaseWhenNear: function(ship){
      var dx = sg.player.x - ship.x;
      var dy = sg.player.y - ship.y;
      if (Math.sqrt(dx**2 + dy**2) < CHASE_DISTANCE){
        sg.behaviors.seek(ship);
      }
      else {
        sg.behaviors.wander(ship);
      }
    },
    waitForAggroThenFastSeek: function(ship){
      var dx = sg.player.x - ship.x;
      var dy = sg.player.y - ship.y;
      if (Math.sqrt(dx**2 + dy**2) < CHASE_DISTANCE){
        ship.behavior = 'seek';
        ship.speed *= 6;
      }
      else {
        sg.behaviors.wander(ship);
      }
    }
  };

  var n = function(number){
    return number > 0 ? ' 1' : '-1';
  }

  sg.drawEnemies = function(){
    sg.enemies.forEach(function(enemy){
      sg.behaviors[enemy.behavior](enemy); //set direction

      enemy.x = enemy.x + Math.cos(enemy.direction) * enemy.speed
      enemy.y = enemy.y + Math.sin(enemy.direction) * enemy.speed
      sg.drawShip(enemy);

      if (sg.isColliding(sg.player, enemy)){
        window.clearInterval(sg.clock);
        canvas.setAttribute('style', 'background-color: darkred;')
      }
    });
  };

  sg.storeMousePosition = function(e){
    sg.player.x = (e.pageX < sg.canvasWidth ? e.pageX : sg.canvasWidth);
    sg.player.y = (e.pageY < sg.canvasHeight ? e.pageY : sg.canvasHeight);
  };

  sg.isColliding = function(gameObject1, gameObject2){
    var a = (gameObject2.x - gameObject1.x);
    var b = gameObject2.y - gameObject1.y;
    var c = Math.sqrt(a**2 + b**2)
    return c < gameObject2.radius + gameObject1.radius;
  };

  sg.update = function(){
    ctx.clearRect(0,0,sg.canvasWidth,sg.canvasHeight)
    sg.drawPlayerShip();
    sg.drawEnemies();
  };

  sg.launchGame = function(){
    var elem = document.getElementById("html");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }

    window.setTimeout(function(){
      sg.canvasWidth = window.innerWidth;
      sg.canvasHeight = window.innerHeight;

      canvas.setAttribute('width', sg.canvasWidth);
      canvas.setAttribute('height', sg.canvasHeight);

      document.onmousemove = sg.storeMousePosition;
      sg.clock = window.setInterval(sg.update, 10)
    }, 500)
  }


}());
