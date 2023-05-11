let canvas;
let context;
let drawingState = false;
let lastX;
let lastY;
let strokeWidth = 3;
let strokeColor = 'black';
let mode = 'draw';
let paths = [];
let currentPath = [];

const setup = () => {
    canvas = document.getElementById("note");
    context = canvas.getContext("2d");

    canvas.width = window.innerWidth *.9;
    canvas.height = window.innerHeight *.9;

    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("touchstart", touchStartHandler);
    canvas.addEventListener("touchend", touchEndHandler);
    canvas.addEventListener("touchmove", touchMoveHandler);
    document.body.addEventListener("keypress", undo);

    context.lineWidth = strokeWidth;
    context.strokeStyle = strokeColor;
};

const startHandler = (x, y) => {
    lastX = x;
    lastY = y;
    drawingState = true;
}

const endHandler = (x, y) => {
    currentPath.push([x,y]);
    paths.push(currentPath);
    currentPath = [];
    drawingState = false;
}

const moveHandler = (x, y) => {
    if(drawingState){
        currentPath.push([lastX, lastY]);
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

const undo = () => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    let undoPath = paths.pop();
    if(undoPath != undefined){
        paths.map(drawpath);
    }
}

const drawpath = (path) => {
    context.strokeStyle = strokeColor;
    if(path.length < 1) return;
    let startX = path[0][0];
    let startY = path[0][1];
    if(path.length === 1) {
        context.fillRect(startX, startY, strokeWidth, strokeWidth);
        return;
    }

    for(let i = 1; i < path.length; i++){
        let endX = path[i][0];
        let endY = path[i][1];
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
        startX = endX;
        startY = endY;
    }

}

setup();

