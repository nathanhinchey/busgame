(function() {
  'use strict';
  var g = window.spaceGame = window.spaceGame || {};
  
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  g.drawRect = function(x,y){
    ctx.fillStyle = 'rgba(20,200,20,0.5)';
    ctx.strokeStyle = 'white';
    
    ctx.fillRect(x - 10, y - 10, 20, 20);
    ctx.strokeRect(x - 10, y - 10, 20, 20);
  };
  
  g.handleMouseMove = function(event){
    
    if (g.mouseDown){
      g.drawRect(event.pageX, event.pageY);
    }
  };
  
  document.onmousemove = g.handleMouseMove;
  document.onmousedown = function(){ g.mouseDown = true; }
  document.onmouseup = function(){ g.mouseDown = false; }
  
}());
