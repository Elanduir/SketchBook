//@ts-check

export { DrawUtil };

let context;
let canvas;
let strokeWidth = 3;
let strokeColor;
let xC = 0;
let yC = 0;

const DrawUtil = (initColor) => {
  canvas = document.getElementById("note");
  // @ts-ignore
  context = canvas.getContext("2d");
  updateColor(initColor);

  xC = canvas.width / 2;
  yC = canvas.height / 2;

  return {
    redraw,
    drawPath: drawSmooth,
    drawCurrent,
    getColor,
    updateColor,
    getCenter: () => [xC, yC],
  };
};

const redraw = (paths) => {
  xC = canvas.width / 2;
  yC = canvas.height / 2;
  context.fillStyle = "white";
  context.fillRect(0, 0, 10000, 10000);
  paths.map(drawSmooth);
};

const drawSmooth = (pathObj) => {
  let path = pathObj[0];
  let color = pathObj[1];
  context.strokeStyle = color;
  if (path.length < 0) return;
  let startX = path[0][0];
  let startY = path[0][1];
  if (path.length === 1) {
    context.fillRect(startX, startY, strokeWidth, strokeWidth);
    return;
  }
  context.beginPath();
  context.moveTo(startX, startY);
  for (let i = 1; i < path.length - 1; i++) {
    let endX = (path[i][0] + path[i + 1][0]) / 2;
    let endY = (path[i][1] + path[i + 1][1]) / 2;
    let controlX = path[i][0];
    let controlY = path[i][1];
    context.quadraticCurveTo(controlX, controlY, endX, endY);
  }
  context.stroke();
};

const drawCurrent = (startX, startY, endX, endY) => {
  updateColor(strokeColor);
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
};

const updateColor = (color) => {
  context.strokeStyle = color;
  strokeColor = color;
};

const getColor = () => strokeColor;
