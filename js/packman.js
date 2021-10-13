const markup = `<div id="info"> X: Y:</div><canvas height="600" width="800" class="canvas" id="canvas" />`;
document.body.innerHTML = markup;

const INFO = document.getElementById("info");
const CANVAS = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let changed = false;

const pacman = {
  positionX: 37,
  positionY: 37,
  
  draw: function() {
    checkPoints(this.positionX - 2, this.positionY - 2);
    ctx.beginPath();
    ctx.arc(this.positionX, this.positionY, 13, Math.PI / 7, - Math.PI / 7, false);
    ctx.lineTo(this.positionX - 7, this.positionY);
    ctx.fill();
    console.log(`pac pos: ${this.positionX} - ${this.positionY}`);
  },
  
  right: function() {
    if(this.positionX < 600) {
      this.positionX = this.positionX + 16;
      changed = true;
    }
  },
  
  left: function() {
    if(this.positionX > 37) {
      this.positionX = this.positionX - 16;
      changed = true;
    }
  },
  
  up: function() {
    if(this.positionY > 37) {
      this.positionY = this.positionY + 16;
      changed = true;
    }
  },
  
  down: function() {
    if(this.positionY < 600) {
      this.positionY = this.positionY + 16;
      changed = true;
    }
  },
}

const WALLS = [];

(function initWalls() {
  WALLS.push([53, 53, 49, 33, 10]);
  WALLS.push([53, 119, 49, 16, 6]);
  WALLS.push([135, 53, 49, 33, 10]);
  WALLS.push([135, 119, 25, 49, 10]);
})();

const POINTS = [];

(function initPoints() {
  for(let i = 0; i < 16; i++) {
    POINTS.push([51 + i * 16, 35, 4, 4])
  }
  
  for(let i = 0; i < 12; i++) {
    POINTS.push([115, 51 + i * 16, 35, 4, 4])
  }
  
  for(let i = 0; i < 16; i++) {
    POINTS.push([51 + i * 16, 99, 4, 4])
  }
})();

function checkPoints(posX, posY) {
  for(var i = 0; i < POINTS.length; i++) {
    if(POINTS[i][0] == posX && POINTS[i][1] == posY) {
      POINTS.splice(i, 1);
      return;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
  
  drawWalls();
  drawPoints();
  packman.draw();
}

function drawWalls() {
  for(let w of WALLS) {
    let x = w[0], y = w[1], width  = w[2], height = w[3], radius = w[4];
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.stroke();
  }
}

function drawPoints() {
  for(var p of POINTS) {
    ctx.fillRect(p[0], p[1], p[2], p[3]);
  }
}

draw();

document.addEventListener('keypress', e => {
  if(e.key == "w") {
    packman.up();
  }
  else if(e.key == "s") {
    packman.down();
  } 
  else if(e.key == "d") {
    packman.right();
  }
  else if(e.key == "a") {
    packman.left();
  }
  
  draw();
}
);

CANVAS.addEventListener('mousemove', e => {
  INFO.innerHTML = `X: ${e.offsetX}, Y: ${e.offsetY}`;
});
