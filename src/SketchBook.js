let canvas;
let context;
let drawingState = false;
let lastX;
let lastY;
let strokeWidth = 2;
let strokeColor = 'black';
let mode = 'draw';
let paths = [];
let redoPaths = [];
let currentPath = [];

const setup = () => {
    canvas = document.getElementById("note");
    context = canvas.getContext("2d");

    canvas.width = window.innerWidth-50;
    canvas.height = window.innerHeight-50;

    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("touchstart", touchStartHandler);
    canvas.addEventListener("touchend", touchEndHandler);
    canvas.addEventListener("touchmove", touchMoveHandler);
    document.body.addEventListener("keypress", () => redraw(true));

    context.lineWidth = strokeWidth;
    context.strokeStyle = strokeColor;

    updateColor();
};

const startHandler = (x, y) => {
    currentPath = [];
    currentPath.push([x,y]);
    lastX = x;
    lastY = y;
    drawingState = true;
}

const endHandler = (x, y) => {
    currentPath.push([x,y]);
    paths.push([currentPath, strokeColor]);
    currentPath = [];
    drawingState = false;
    redraw(false);
}

const moveHandler = (x, y) => {
    if(drawingState){
        currentPath.push([x, y]);
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.stroke();
        lastX = x;
        lastY = y;
    }
}

const touchStartHandler = (event) => {
    event.preventDefault();
    startHandler(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
}

const touchEndHandler = (event) => {
    event.preventDefault();
    endHandler(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
}

const touchMoveHandler = (event) => {
    moveHandler(event.touches[0].pageX, event.touches[0].pageY);
}

const mouseDownHandler = (event) => {
    event.preventDefault();
    startHandler(getMousePos(event, 'X'), getMousePos(event, 'Y'));
}

const mouseUpHandler = (event) => {
    event.preventDefault();
    endHandler(getMousePos(event, 'X'), getMousePos(event, 'Y'));
}

const mouseMoveHandler = (event) => {
    moveHandler(getMousePos(event, 'X'), getMousePos(event, 'Y'));
}

const mouseClickHandler = (event) => {
   // context.fillRect(getMousePos(event, 'X'), getMousePos(event, 'Y'), strokeWidth, strokeWidth);
}

const getMousePos = (event, key) => {
    let bounding = canvas.getBoundingClientRect();
    if(key === 'X') return event.clientX - bounding.left;
    if(key === 'Y') return event.clientY - bounding.top;
}

const redraw = (remove) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, 10000, 10000);
    if(remove){
        redoPaths.push(paths.pop());    
    }
    if(paths.length === 0) return;
    paths = paths.filter(e => e != undefined);
    paths.map(drawSmooth);
}

const drawSmooth = (pathObj) => {
    let path = pathObj[0];
    let color = pathObj[1];
    context.strokeStyle = color;
    if(path.length < 0) return;
    let startX = path[0][0];
    let startY = path[0][1];
    if(path.length === 1) {
        context.fillRect(startX, startY, strokeWidth, strokeWidth);
        return;
    }
    context.beginPath();
    context.moveTo(startX, startY);
    for(let i = 1; i < path.length - 1; i++){
        let endX = (path[i][0] + path[i+1][0]) / 2;
        let endY = (path[i][1] + path[i+1][1]) / 2;
        let controlX = path[i][0];
        let controlY = path[i][1];
        context.quadraticCurveTo(controlX, controlY, endX, endY);
        
    }
    context.stroke();
}

const redo = () => {
    if(redoPaths.length === 0) return;
    let rP = redoPaths.pop();
    if(rP != undefined) paths.push(rP);
    redraw(false);
}

const clearAll = () => {
    if(paths.length === 0) return;
    while(paths.length > 0){
        let rP = paths.pop();
        if(rP != undefined)redoPaths.push(rP);
    }
    redraw(false);
}

const updateColor = () => {
    let colorPicker = document.getElementById("strokeColorPicker");
    strokeColor = colorPicker.value;
    context.strokeStyle = strokeColor;
}

setup();

