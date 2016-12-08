var circles = (function() {
  "use strict";

  var canvas = document.getElementById("circleCanvas");
  var context = canvas.getContext("2d");

  var RIGHT_BOUND = canvas.width = 500;
  var LOWER_BOUND = canvas.height = 500;
  var MAX_RADIUS = 300;

  canvas.addEventListener('click', cycle);

  function cycle() {
    Circle.prototype.resetDraw();
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(interval);
    circles = [];
    startSequence();
  }

  function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  Circle.prototype.distanceFromPerimeter = function(x, y) {
    return Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) - this.radius;
  }

  // petri dish
  var color;
  var colorCount;
  Circle.prototype.resetDraw = function() {
    color = 255;
    colorCount = 0;
  }
  Circle.prototype.draw = function() {
    var hexColor = color.toString(16);
    if (colorCount++ % 2 === 0) {
      color--;
    }
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = "#" + hexColor + hexColor + hexColor;
    context.fill();
  }

  var circles = [];
  var interval;

  function startSequence() {
    interval = setInterval(function() {
      var giveUp = 100;
      while (giveUp-- > 0) {
        var x = getRandomInt(0, RIGHT_BOUND);
        var y = getRandomInt(0, LOWER_BOUND);

        var maybeSpot = true;
        var radius = MAX_RADIUS;
        for (var i = 0; i < circles.length; i++) {
          var circle = circles[i];
          var distanceFromPerimeter = circle.distanceFromPerimeter(x, y);
          if (distanceFromPerimeter < 0) {
            maybeSpot = false;
            break;
          }

          if (radius > distanceFromPerimeter) {
            radius = distanceFromPerimeter;
          }
        }

        if (maybeSpot) {
          var circle = new Circle(x, y, radius);
          circles.push(circle);
          circle.draw();
          break;
        }
      }

      if (giveUp === 0) {
        clearInterval(interval);
      }
    }, 1);
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[getRandomInt(0, 16)];
    }
    return color;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  cycle();

  return {
    setMaxRadius: function(radius) {
      MAX_RADIUS = radius;
      cycle();
    },
    setDrawFunction: function(text) {
      Circle.prototype.draw = eval(text);
      cycle();
    }
  }
})();

function exercise1() {
  var radius = parseInt($("#radiusSetter").val())
  circles.setMaxRadius(radius);
}

function exercise2() {
  var completedString = "(function() {" + $("#drawFunctionInput").val() + "})";
  circles.setDrawFunction(completedString);
}