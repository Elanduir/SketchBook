let canvas;
let context;
let mouseDown = false;
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

    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("touchstart", mouseDownHandler);
    canvas.addEventListener("touchend", mouseUpHandler);
    canvas.addEventListener("touchmove", mouseMoveHandler);
    canvas.addEventListener("click", mouseClickHandler);
    document.body.addEventListener("keypress", undo);

    context.lineWidth = strokeWidth;
    context.strokeStyle = strokeColor;
};

const mouseDownHandler = (event) => {
    lastX = getMousePos(event, 'X');
    lastY = getMousePos(event, 'Y');
    mouseDown = true;
}

const mouseUpHandler = (event) => {
    mouseDown = false;
    currentPath.push([getMousePos(event, 'X'), getMousePos(event, 'Y')]);
    paths.push(currentPath);
    currentPath = [];
}

const mouseMoveHandler = (event) => {
    if(mouseDown){
        currentPath.push([lastX, lastY]);
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(getMousePos(event, 'X'), getMousePos(event, 'Y'));
        context.stroke();
        lastX = getMousePos(event, 'X');
        lastY = getMousePos(event, 'Y');
    }
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
    context.fillRect(0, 0, 500, 500);
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

