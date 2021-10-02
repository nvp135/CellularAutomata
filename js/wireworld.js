const CANVAS_HEIGHT = window.innerHeight - 20;
const CANVAS_WIDTH = window.innerWidth - 20;

const markup = `<canvas height="${CANVAS_HEIGHT}" width="${CANVAS_WIDTH}" class="canvas" id="canvas" />`;
document.body.innerHTML = markup;

const GRID_SIZE = 5;
const CANVAS = document.getElementById("canvas");
const H_SIZE = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
const W_SIZE = Math.floor(CANVAS_WIDTH / GRID_SIZE);
const CONTEXT = CANVAS.getContext("2d");

const COLORS = ["black","maroon","green","olive",
                "navy","purple","teal","silver",
                "gray","red","lime","yellow",
                "blue","fuchsia","aqua","white",];

const DIRECTIONS = Object.freeze({UP: 1, RIGHT:2, DOWN:3, LEFT:4});
const STATE = Object.freeze({SPACE: 0, ELTAIL:9, CONDUCTOR: 11, ELHEAD: 12});

let FIELD = [];

function TorItX(x) {
  if(x < 0)
    return x + W_SIZE; 
  if(x >= W_SIZE)
    return 0; 
  else 
    return x % W_SIZE;
}

function TorItY(y) {
  if(y < 0)
    return y + H_SIZE; 
  if(y >= H_SIZE)
    return 0; 
  else 
    return y % H_SIZE;
}

class Turemit {
  constructor(field, x, y, direction, state, rules) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.state = state;
    this.rules = rules;
    this.field = field;
  }
  #deadLock = false;
 
  step(stepsCount) {
    var rule = this.rules.find(r => (r.startColor == this.field[this.y][this.x] && r.startState == this.state));
    if(this.#deadLock) {
      if(!rule) {
        return;
      } else {
        this.#deadLock = false;
      }
    }
    for(var i = 0; i < stepsCount; i++) {
      rule = this.rules.find(r => (r.startColor == this.field[this.y][this.x] && r.startState == this.state));
      if(!rule) {
        this.#deadLock = true;
        //throw new Error
        console.log(`No rule for field color ${this.field[this.y][this.x]}; state ${this.state}`);
        return;
      }
      let newCoordinates = { x: this.x, y: this.y };

      this.field[this.y][this.x] = rule.newColor;

      switch(this.direction) {
        case DIRECTIONS.UP:
          if(rule.direction == -1) {
            newCoordinates.x = newCoordinates.x - 1;
            this.direction = DIRECTIONS.LEFT;
          }
          else if(rule.direction == 0) {
            newCoordinates.y = newCoordinates.y - 1;
          }
          else if(rule.direction == 1) {
            newCoordinates.x = newCoordinates.x + 1;
            this.direction = DIRECTIONS.RIGHT;
          }
          else
            throw new Error("Incorrect direction");
          break;
        case DIRECTIONS.DOWN:
          if(rule.direction == -1) {
            newCoordinates.x = newCoordinates.x + 1;
            this.direction = DIRECTIONS.RIGHT;
          }
          else if(rule.direction == 0) {
            newCoordinates.y = newCoordinates.y + 1;
          }
          else if(rule.direction == 1) {
            newCoordinates.x = newCoordinates.x - 1;
            this.direction = DIRECTIONS.LEFT;
          }
          else
            throw new Error("Incorrect direction");
          break;
        case DIRECTIONS.RIGHT:
          if(rule.direction == -1) {
            newCoordinates.y = newCoordinates.y - 1;
            this.direction = DIRECTIONS.UP;
          }
          else if(rule.direction == 0) {
            newCoordinates.x = newCoordinates.x + 1;
          }
          else if(rule.direction == 1) {
            newCoordinates.y = newCoordinates.y + 1;
            this.direction = DIRECTIONS.DOWN;
          }
          else
            throw new Error("Incorrect direction");
          break;
        case DIRECTIONS.LEFT:
          if(rule.direction == -1) {
            newCoordinates.y = newCoordinates.y + 1;
            this.direction = DIRECTIONS.DOWN;
          }
          else if(rule.direction == 0) {
            newCoordinates.x = newCoordinates.x - 1;
          }
          else if(rule.direction == 1) {
            newCoordinates.y = newCoordinates.y - 1;
            this.direction = DIRECTIONS.UP;
          }
          else
            throw new Error("Incorrect direction");
          break;
        default:
          throw new Error("Incorrect direction");
      }

      if(newCoordinates.x >= W_SIZE || newCoordinates.y >= H_SIZE ||
        newCoordinates.x < 0 || newCoordinates.y < 0) {
        this.#deadLock = true;
        return;
          //throw new Error("Out of field range");
      }

      this.state = rule.newState;
      this.x = newCoordinates.x;
      this.y = newCoordinates.y;
    }
  }
  
  upColor() {
    this.field[this.y][this.x] = this.field[this.y][this.x] < 5 ? this.field[this.y][this.x] + 1 : 0;
  }
}

function resetField() {
  for(let i = 0; i < H_SIZE; i++) {
    FIELD.push(new Array(W_SIZE).fill(STATE.SPACE));
  }
}

CONTEXT.lineWidth = 0.1;
CONTEXT.strokeStyle = COLORS[7];

for(let i = 0; i < H_SIZE; i++) {
  CONTEXT.moveTo(0, i * GRID_SIZE);
  CONTEXT.lineTo(CANVAS_WIDTH, i * GRID_SIZE);
}

for(let i = 0; i < W_SIZE; i++) {
  CONTEXT.moveTo(i * GRID_SIZE, 0);
  CONTEXT.lineTo(i * GRID_SIZE, CANVAS_HEIGHT);
}

resetField();

function draw() {
  CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for(var x = 0; x < FIELD.length; x++) {
    for(var y = 0; y < FIELD[x].length; y++) {
      drawSquare(y * GRID_SIZE, x * GRID_SIZE, GRID_SIZE, FIELD[x][y]);
    }
  }
  CONTEXT.stroke();
}

draw();

function drawSquare(x, y, size, color) {
  CONTEXT.fillStyle = COLORS[color];
  CONTEXT.fillRect(x, y, size, size);
}

CANVAS.addEventListener('click', e => {
  let x = Math.floor(e.offsetX / GRID_SIZE);
  let y = Math.floor(e.offsetY / GRID_SIZE);
  
  switchState(Math.floor(e.offsetX / GRID_SIZE), Math.floor(e.offsetY / GRID_SIZE));
  
  draw();
});

function switchState(x, y) {
  switch(FIELD[y][x]) {
    case STATE.SPACE:
      FIELD[y][x] = STATE.CONDUCTOR;
      break;
    case STATE.CONDUCTOR:
      FIELD[y][x] = STATE.ELHEAD;
      break;
    case STATE.ELHEAD:
      FIELD[y][x] = STATE.ELTAIL;
      break;
    case STATE.ELTAIL:
      FIELD[y][x] = STATE.SPACE;
      break;
    default:
      break;
  }
}

function run() {
  let nextState = [];
  nextState = FIELD.map(function(arr) {
    return arr.slice();
  });
  for (let y = 0; y < FIELD.length; y++) {
    for (let x = 0; x < FIELD[y].length; x++) {
      switch (FIELD[y][x]) {
        case STATE.CONDUCTOR:
          const countElAround = checkElectronsAround(x, y);
          if(countElAround == 1 || countElAround == 2) {
            nextState[y][x] = STATE.ELHEAD;
          }
          break;
        case STATE.ELHEAD:
          nextState[y][x] = STATE.ELTAIL;
          break;
        case STATE.ELTAIL:
          nextState[y][x] = STATE.CONDUCTOR;
        default:
          break;
      }
    }
  }
  FIELD = nextState;
  draw();
}

function checkElectronsAround(x, y) {
  let count = 0;
  if(FIELD[y-1][x] == STATE.ELHEAD) {
    count++;
  }
  if(FIELD[y-1][x+1] == STATE.ELHEAD) {
    count++;
  }
  if(FIELD[y][x+1] == STATE.ELHEAD) {
    count++;
  }
  if(FIELD[y+1][x+1] == STATE.ELHEAD) {
    count++;
  }
  if(FIELD[y+1][x] == STATE.ELHEAD) {
    count++;
  }
  if(FIELD[y+1][x-1] == STATE.ELHEAD) {
    count++;
  }
  if(FIELD[y][x-1] == STATE.ELHEAD) {
    count++;
  }
  if(FIELD[y-1][x-1] == STATE.ELHEAD) {
    count++;
  }
  if(FIELD[y][x] == STATE.ELHEAD) {
    count++;
  }
  return count; 
}

let timerId;

document.addEventListener('keypress', e => {
  switch (e.code) {
    case "KeyS":
      if(timerId) {
        clearInterval(timerId);
        timerId = undefined;
      } else {
        timerId = setInterval(() => run(), 100);
      }
      break;
  
    default:
      break;
  }
  draw();
});