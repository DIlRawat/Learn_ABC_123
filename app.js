// Variables for referencing the canvas and 2dcanvas context
var canvas,ctx;

// Variables to keep track of the mouse position and left-button status 
var mouseX,mouseY,mouseDown=0;

// Variables to keep track of the touch position
var touchX,touchY;
//size of the circle
var size = 9;

//to read out the text
var synth = window.speechSynthesis;

// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(ctx,x,y,size) {
    // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
    r=0; g=0; b=0; a=255;

    // Select a fill style
    ctx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";

    // Draw a filled circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
} 

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas,ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
    mouseDown=1;
    drawDot(ctx,mouseX,mouseY,size);
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown=0;
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) { 
    // Update the mouse co-ordinates when moved
    getMousePos(e);

    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown==1) {
        drawDot(ctx,mouseX,mouseY,size);
    }
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e)
        var e = event;

    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
 }

// Draw something when a touch start is detected
function sketchpad_touchStart() {
    // Update the touch co-ordinates
    getTouchPos();

    drawDot(ctx,touchX,touchY,size);

    // Prevents an additional mousedown event being triggered
    event.preventDefault();
}

// Draw something and prevent the default scrolling when touch movement is detected
function sketchpad_touchMove(e) { 
    // Update the touch co-ordinates
    getTouchPos(e);

    // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
    drawDot(ctx,touchX,touchY,size); 

    // Prevent a scrolling action as a result of this touchmove triggering.
    event.preventDefault();
}

// Get the touch position relative to the top-left of the canvas
// When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
// but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
// "target.offsetTop" to get the correct values in relation to the top left of the canvas.
function getTouchPos(e) {
    if (!e)
        var e = event;

    if(e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            touchX=touch.pageX-touch.target.offsetLeft;
            touchY=touch.pageY-touch.target.offsetTop;
        }
    }
}

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    // Get the specific canvas element from the HTML document
    canvas = document.getElementById('sketchpad');

    // If the browser supports the canvas tag, get the 2d drawing context for this canvas
    if (canvas.getContext)
        ctx = canvas.getContext('2d');

    // Check that we have a valid context to draw on/with before adding event handlers
    if (ctx) {
        // React to mouse events on the canvas, and mouseup on the entire document
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);

        // React to touch events on the canvas
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);
    }
}

 //Array to store strings of numbers and alphabets.

 var letters = ["A a","B b","C c","D d","E e","F f","G g","H h","I i","J j","K k","L l", "M m", "N n","O o",
 "P p", "Q q", "R r", "S s", "T t", "U u", "V v", "W w", "X x", "Y y", "Z z"];

 var numbers = ["0","1","2","3","4","5","6","7","8","9"];

// Event listner grabbed with element id and triggered when button is clicked
document.getElementById("learnABC").addEventListener("click", () => {learn(letters)}); // When LearnABC button is clicked

document.getElementById("learn123").addEventListener("click", () => {learn(numbers)}); //When Learn123 button is clicked

//Learn function to view the values from arrays

function learn (array){
    reloading();

    var temp = 0;
    
    var item = document.getElementById("learnthis");

    item.textContent = array[temp];

    document.getElementById("sound").addEventListener("click", () => {readOutLoud()}); // when sound button is clicked

    document.getElementById("next").addEventListener("click", () => {nextItem(array)}); //When next button is clicked
    
    document.getElementById("previous").addEventListener("click", () => {previousItem(array)}); // when previous button is clicked

// Temp variable is incremented by one whenever next button is clicked
// Then the value of temp index is  shown in the page    

function nextItem(array){

    temp++;
    var item = document.getElementById("learnthis");
    if(temp < array.length){
   
    item.textContent = array[temp];
    }
    else{
        item.textContent = "Start Over";
    }
}

// Temp variable is incremented by one whenever previous button is clicked
// Then the value of temp index is  shown in the page    

function previousItem(array){
    temp--;
    var item = document.getElementById("learnthis");
    if(temp !== 0){
    
    item.textContent = array[temp];
    }
    else{
        item.textContent = "Start Over";
    }
}

// After getting element value by ID numbers are read loud.
// Items in letters array has lowercase letter, uppercase letter, and whitespace 
//which are then trimmed using substrin function.
//Finally trimmed value is read out loud with speak function of SpeechSyntesis web api

function readOutLoud(){
    var value = document.getElementById("learnthis");
            var value2 = value.textContent.substring(0,1);
            var utterThis = new SpeechSynthesisUtterance(value2);
            synth.speak(utterThis); 
            console.log(value2);
    }
}

//So I reloaded the page everyting either LearnABC or Learn123 button is clicked. 

function reloading()
{
  if( window.localStorage )
  {
    if( !localStorage.getItem('firstLoad') )
    {
      localStorage['firstLoad'] = true;
      window.location.reload();
    }  
    else
      localStorage.removeItem('firstLoad');
      console.log("Page reloded");
  }
};