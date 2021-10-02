const CANVAS_HEIGHT = window.innerHeight - 20;
const CANVAS_WIDTH = window.innerWidth - 20;

const markup = `<button onclick="resetField()">Reset</button>
<button onclick="bubbleSort()">Bubble Sort</button>
<button onclick="shakerSort()">Shaker Sort</button>
<button onclick="insertionSort()">Insertion sort</button>
<br><canvas height="${CANVAS_HEIGHT}" width="${CANVAS_WIDTH}" class="canvas" id="canvas" />`;
document.body.innerHTML = markup;

const GRID_SIZE = 3;
const CANVAS = document.getElementById("canvas");
const H_SIZE = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
const W_SIZE = Math.floor(CANVAS_WIDTH / GRID_SIZE);
const CONTEXT = CANVAS.getContext("2d");

const centralPoint = { x: Math.floor(CANVAS_WIDTH / 2),
                    y: Math.floor(CANVAS_HEIGHT / 2)
                };

const COLORS = ["black","maroon","green","olive",
                "navy","purple","teal","silver",
                "gray","red","lime","yellow",
                "blue","fuchsia","aqua","white",];

const DIRECTIONS = Object.freeze({UP: 1, RIGHT:2, DOWN:3, LEFT:4});
const STATE = Object.freeze({SPACE: 0, ELTAIL:9, CONDUCTOR: 11, ELHEAD: 12});

let FIELD = [];

async function draw(arr = FIELD) {
  CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for(let i = 0; i < arr.length; i++) {
      let x = centralPoint.x + arr[i] * Math.cos(i * Math.PI / 180);
      let y = centralPoint.y + arr[i] * Math.sin(i * Math.PI / 180);
      CONTEXT.beginPath();
      CONTEXT.moveTo(centralPoint.x, centralPoint.y);
      CONTEXT.lineTo(x, y);
      CONTEXT.stroke();
  }
}

function resetField(arr = FIELD) {
    arr.length = 0;
    for(let i = 0; i < 361; i++) {
        arr.push(i);
    }
    shuffle(arr);
    draw();
}

function shuffle(arr) {
    let currentIndex = arr.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [arr[currentIndex], arr[randomIndex]] = 
            [arr[randomIndex], arr[currentIndex]];
    }

    return arr;
}

resetField();

CONTEXT.lineWidth = 0.5;



async function bubbleSort(arr = FIELD) {
    for (let j = 0; j < arr.length; j++) {
        let f = 0;
        let min = j;
        for (let i = 0; i < arr.length - j - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                await swapElements(arr, i, i + 1);
                f++;
            }
            if (arr[i] < arr[min]) {
                min = i;
            }
        }
        if(f == 0) {
            break;
        }
        if(min != j) {
            await swapElements(arr, j, min);
        }
    }
}

async function shakerSort(arr = FIELD) {
    let control = arr.length - 1, left = 0, right = arr.length - 1;
    do {
        for(let i = left; i < right; i++) {
            if(arr[i] > arr[i + 1]) {
                await swapElements(arr, i, i + 1);
                control = i;
            }
        }
        right = control;
        for(let i = right; i > left; i--) {
            if(arr[i] < arr[i -1]) {
                await swapElements(arr, i, i-1);
                control = i;
            }
        }
    } while (left < right)
}

async function insertionSort(arr = FIELD) {
    for(let i = 0; i < arr.length; i++) {
        let j = i;
        while (j > 0 && arr[j] < arr[j -1]) {
            await swapElements(arr, j, j - 1);
            j--;
        }
    }
}

async function swapElements(arr, i, j) {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    draw();
    await new Promise(r => setTimeout(r, 1));
}