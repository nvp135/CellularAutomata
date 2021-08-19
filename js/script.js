const markup = `<canvas height="890" width="1880" class="canvas" id="canvas" />`;
document.body.innerHTML = markup;

const TUREMITS = [];

const GRID_SIZE = 1;
const CANVAS = document.getElementById("canvas");
const CANVAS_HEIGHT = CANVAS.height;
const CANVAS_WIDTH = CANVAS.width;
const H_SIZE = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
const W_SIZE = Math.floor(CANVAS_WIDTH / GRID_SIZE);
const CONTEXT = CANVAS.getContext("2d");

const COLORS = ["black","maroon","green","olive",
                "navy","purple","teal","silver",
                "gray","red","lime","yellow",
                "blue","fuchsia","aqua","white",];

const DIRECTIONS = Object.freeze({UP: 1, RIGHT:2, DOWN:3, LEFT:4});

const FIELD = [];

const ISLAND = [
  { startState: "A", startColor: 0, newColor: 1, direction: -1, newState: "B" },
  { startState: "A", startColor: 1, newColor: 2, direction: -1, newState: "B" },
  { startState: "A", startColor: 2, newColor: 3, direction: -1, newState: "B" },
  { startState: "A", startColor: 3, newColor: 4, direction: -1, newState: "B" },
  { startState: "A", startColor: 4, newColor: 5, direction: 1, newState: "B" },
  { startState: "A", startColor: 5, newColor: 6, direction: 1, newState: "B" },
  { startState: "A", startColor: 6, newColor: 7, direction: 1, newState: "B" },
  { startState: "A", startColor: 7, newColor: 8, direction: 1, newState: "B" },
  { startState: "A", startColor: 8, newColor: 9, direction: -1, newState: "B" },
  { startState: "A", startColor: 9, newColor: 10, direction: -1, newState: "B" },
  { startState: "A", startColor: 10, newColor: 11, direction: -1, newState: "B" },
  { startState: "A", startColor: 11, newColor: 12, direction: -1, newState: "B" },
  { startState: "A", startColor: 12, newColor: 13, direction: 1, newState: "B" },
  { startState: "A", startColor: 13, newColor: 14, direction: 1, newState: "B" },
  { startState: "A", startColor: 14, newColor: 15, direction: 1, newState: "B" },
  { startState: "A", startColor: 15, newColor: 0, direction: 1, newState: "A" },
  { startState: "B", startColor: 0, newColor: 1, direction: 1, newState: "B" },
  { startState: "B", startColor: 1, newColor: 2, direction: 1, newState: "A" },
  { startState: "B", startColor: 2, newColor: 3, direction: 1, newState: "A" },
  { startState: "B", startColor: 3, newColor: 4, direction: 1, newState: "A" },
  { startState: "B", startColor: 4, newColor: 5, direction: -1, newState: "A" },
  { startState: "B", startColor: 5, newColor: 6, direction: -1, newState: "A" },
  { startState: "B", startColor: 6, newColor: 7, direction: -1, newState: "A" },
  { startState: "B", startColor: 7, newColor: 8, direction: -1, newState: "A" },
  { startState: "B", startColor: 8, newColor: 9, direction: 1, newState: "A" },
  { startState: "B", startColor: 9, newColor: 10, direction: 1, newState: "A" },
  { startState: "B", startColor: 10, newColor: 11, direction: 1, newState: "A" },
  { startState: "B", startColor: 11, newColor: 12, direction: 1, newState: "A" },
  { startState: "B", startColor: 12, newColor: 13, direction: -1, newState: "A" },
  { startState: "B", startColor: 13, newColor: 14, direction: -1, newState: "A" },
  { startState: "B", startColor: 14, newColor: 15, direction: -1, newState: "A" },
  { startState: "B", startColor: 15, newColor: 0, direction: -1, newState: "A" },
];

const LABYRINTH = [
{ startState: "A", startColor: 0, newColor: 1, direction: -1, newState: "A" },
{ startState: "A", startColor: 1, newColor: 2, direction: -1, newState: "A" },
{ startState: "A", startColor: 2, newColor: 3, direction: -1, newState: "A" },
{ startState: "A", startColor: 3, newColor: 4, direction: -1, newState: "A" },
{ startState: "A", startColor: 4, newColor: 5, direction: -1, newState: "A" },
{ startState: "A", startColor: 5, newColor: 6, direction: 1, newState: "B" },
{ startState: "B", startColor: 0, newColor: 1, direction: 1, newState: "A" },
{ startState: "B", startColor: 5, newColor: 6, direction: -1, newState: "B" },
{ startState: "B", startColor: 6, newColor: 7, direction: -1, newState: "B" },
{ startState: "B", startColor: 7, newColor: 8, direction: -1, newState: "B" },
{ startState: "B", startColor: 8, newColor: 9, direction: -1, newState: "B" },
{ startState: "B", startColor: 9, newColor: 10, direction: -1, newState: "B" },
{ startState: "B", startColor: 10, newColor: 11, direction: -1, newState: "B" },
{ startState: "B", startColor: 11, newColor: 12, direction: -1, newState: "B" },
{ startState: "B", startColor: 12, newColor: 13, direction: -1, newState: "B" },
{ startState: "B", startColor: 13, newColor: 14, direction: -1, newState: "B" },
{ startState: "B", startColor: 14, newColor: 15, direction: -1, newState: "B" },
{ startState: "B", startColor: 15, newColor: 0, direction: -1, newState: "B" },
];

const SPINNER = [
  { startState: "A", startColor: 0, newColor: 2, direction: 0, newState: "C" },
  { startState: "A", startColor: 2, newColor: 0, direction: 0, newState: "B" },
  { startState: "B", startColor: 2, newColor: 2, direction: 1, newState: "A" },
  { startState: "B", startColor: 15, newColor: 2, direction: 1, newState: "A" },
  { startState: "C", startColor: 2, newColor: 0, direction: -1, newState: "A" },
  { startState: "C", startColor: 0, newColor: 15, direction: -1, newState: "A" },
  { startState: "C", startColor: 15, newColor: 2, direction: -1, newState: "A" },
];

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

      if(newCoordinates.x > W_SIZE || newCoordinates.y > H_SIZE ||
        newCoordinates.x < 0 || newCoordinates.y < 0) {
        throw new Error("Out of field range");
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
  for(var i = 0; i < H_SIZE; i++) {
    FIELD.push(new Array(W_SIZE).fill(0));
  }
}

CONTEXT.lineWidth = 0.1;

for(var i = 0; i < H_SIZE; i++) {
  CONTEXT.moveTo(0, i * GRID_SIZE);
  CONTEXT.lineTo(CANVAS_WIDTH, i * GRID_SIZE);
}

for(var i = 0; i < W_SIZE; i++) {
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
  
  let turemit;
  
  for(var t of TUREMITS) {
    if(t.x == x && t.y == y) {
      turemit = t;
      break;
    }
  }
  
  if(turemit) {
    turemit.upColor();
  } else {
    t = new Turemit(FIELD, x, y, DIRECTIONS.UP, "A", ISLAND);
    TUREMITS.push(t);
  }
  draw();
});

document.addEventListener('keypress', e => {
  if(e.code != "Space") {
    return;
  }
  
  for(t of TUREMITS) {
    t.step(10000);
  }
  draw();
});
