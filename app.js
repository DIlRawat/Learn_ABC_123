// Variables for referencing the canvas and 2d canvas context
var canvas, ctx;

// Variables to keep track of the mouse position and left-button status
var mouseX,
  mouseY,
  mouseDown = 0;

// Variables to keep track of the touch position
var touchX, touchY;

// Size of the circle
var size = 9;

// Draws a dot at a specific position on the supplied canvas context
function drawDot(ctx, x, y, size) {
  ctx.fillStyle = "rgba(0, 0, 0, 1)"; // Black color with full opacity
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// Clear the canvas context
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Handle mouse down event
function sketchpad_mouseDown() {
  mouseDown = 1;
  drawDot(ctx, mouseX, mouseY, size);
}

// Handle mouse up event
function sketchpad_mouseUp() {
  mouseDown = 0;
}

// Handle mouse move event
function sketchpad_mouseMove(e) {
  getMousePos(e);
  if (mouseDown) {
    drawDot(ctx, mouseX, mouseY, size);
  }
}

// Get the current mouse position
function getMousePos(e) {
  if (e.offsetX !== undefined) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  } else if (e.layerX !== undefined) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }
}

// Handle touch start event
function sketchpad_touchStart(e) {
  getTouchPos(e);
  drawDot(ctx, touchX, touchY, size);
  e.preventDefault(); // Prevents an additional mousedown event
}

// Handle touch move event
function sketchpad_touchMove(e) {
  getTouchPos(e);
  drawDot(ctx, touchX, touchY, size);
  e.preventDefault(); // Prevents scrolling
}

// Get the touch position
function getTouchPos(e) {
  if (e.touches && e.touches.length === 1) {
    var touch = e.touches[0];
    touchX = touch.pageX - touch.target.offsetLeft;
    touchY = touch.pageY - touch.target.offsetTop;
  }
}

// Initialize the canvas and add event handlers
function init() {
  canvas = document.getElementById("sketchpad");
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.addEventListener("mousedown", sketchpad_mouseDown);
      canvas.addEventListener("mousemove", sketchpad_mouseMove);
      window.addEventListener("mouseup", sketchpad_mouseUp);
      canvas.addEventListener("touchstart", sketchpad_touchStart);
      canvas.addEventListener("touchmove", sketchpad_touchMove);
    }
  }
}

// Variables
var temp = 0;
var nextListener, previousListener, soundListener;
var letters = [
  "A a",
  "B b",
  "C c",
  "D d",
  "E e",
  "F f",
  "G g",
  "H h",
  "I i",
  "J j",
  "K k",
  "L l",
  "M m",
  "N n",
  "O o",
  "P p",
  "Q q",
  "R r",
  "S s",
  "T t",
  "U u",
  "V v",
  "W w",
  "X x",
  "Y y",
  "Z z",
];
var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var synth = window.speechSynthesis;

// Function to handle learning setup
function learn(array) {
  // Remove existing event listeners to avoid duplication
  if (nextListener) {
    document.getElementById("next").removeEventListener("click", nextListener);
  }
  if (previousListener) {
    document
      .getElementById("previous")
      .removeEventListener("click", previousListener);
  }
  if (soundListener) {
    document
      .getElementById("sound")
      .removeEventListener("click", soundListener);
  }

  // Reset temp index
  temp = 0;
  var item = document.getElementById("learnthis");
  item.textContent = array[temp];

  // Define new event listeners
  nextListener = () => nextItem(array);
  previousListener = () => previousItem(array);
  soundListener = readOutLoud;

  // Add new event listeners
  document.getElementById("next").addEventListener("click", nextListener);
  document
    .getElementById("previous")
    .addEventListener("click", previousListener);
  document.getElementById("sound").addEventListener("click", soundListener);
}

// Handle next item
function nextItem(array) {
  var item = document.getElementById("learnthis");

  if (temp < array.length - 1) {
    temp++;
    item.textContent = array[temp];
  } else {
    item.textContent = "Starting Over";
    setTimeout(() => {
      temp = 0; // Loop back to the first item
      item.textContent = array[temp];
    }, 1000); // Delay of 1000 milliseconds (1 second)
  }
}

// Handle previous item
function previousItem(array) {
  temp--;
  var item = document.getElementById("learnthis");
  if (temp >= 0) {
    item.textContent = array[temp];
  } else {
    // If it's the last item, show "Starting Over" then loop back
    item.textContent = "This is the first item";
    setTimeout(() => {
      temp = 0; // Loop back to the first item
      item.textContent = array[temp];
    }, 1000); // Delay of 1000 milliseconds (1 second)
  }
}

// Read out loud
function readOutLoud() {
  var value = document.getElementById("learnthis").textContent.substring(0, 1);
  var utterThis = new SpeechSynthesisUtterance(value);
  synth.speak(utterThis);
}

// Set up event listeners for learning buttons
document
  .getElementById("learnABC")
  .addEventListener("click", () => learn(letters));
document
  .getElementById("learn123")
  .addEventListener("click", () => learn(numbers));

//show the dialog box
const dialog = document.querySelector("dialog");
const showButton = document.querySelector("dialog + button");
const closeButton = document.querySelector("dialog button");

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});
