//@ts-check
import { getActualPos } from "./Util.js";
export { Handlers };

let model;
let drawingState = false;
let drawingMode;
let panState = false;
let startX;
let startY;

const Handlers = (mod) => {
  model = mod;
  setupHandlers();
  return {};
};

const setupHandlers = () => {
  let canvas = document.getElementById("note");
  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("touchstart", touchStartHandler);
  canvas.addEventListener("touchend", touchEndHandler);
  canvas.addEventListener("touchmove", touchMoveHandler);
  canvas.addEventListener("wheel", (event) => {
    let factor = event.deltaY > 0 ? 1.1 : 0.9;
    event.preventDefault();
    model.manageZoom(factor);
  });

  let btnRedo = document.getElementById("redo");
  let btnUndo = document.getElementById("undo");
  let btnClear = document.getElementById("clear");
  let colPick = document.getElementById("strokeColorPicker");
  let drawingToggle = document.getElementById("drawingToggle");
  drawingMode = drawingToggle.checked;

  btnRedo.addEventListener("click", model.redo);
  btnUndo.addEventListener("click", model.undo);
  btnClear.addEventListener("click", model.clearAll);
  colPick.addEventListener("change", model.updateColor);
  drawingToggle.addEventListener("change", (event) => {
    drawingMode = drawingToggle.checked;
  });
};

const panHandler = (x, y) => {
  let xO = x - startX;
  let yO = y - startY;
  startX = x;
  startY = y;
  model.managePan(xO, yO);
};

const startHandler = (x, y) => {
  model.initCurrent(x, y);
  drawingState = true;
};

const endHandler = (x, y) => {
  model.endCurrent(x, y);
  drawingState = false;
};

const moveHandler = (x, y) => {
  if (drawingState) {
    model.addCurrent(x, y);
  }
};

const touchStartHandler = (event) => {
  event.preventDefault();
  let x = getActualPos(event.changedTouches[0].clientX, "X");
  let y = getActualPos(event.changedTouches[0].clientY, "Y");
  startX = x;
  startY = y;
  if (!drawingMode || panState) return;
  startHandler(x, y);
};

const touchEndHandler = (event) => {
  if (!drawingMode) return;
  event.preventDefault();
  let x = getActualPos(event.changedTouches[0].clientX, "X");
  let y = getActualPos(event.changedTouches[0].clientY, "Y");
  endHandler(x, y);
};

const touchMoveHandler = (event) => {
  event.preventDefault();
  let x = getActualPos(event.changedTouches[0].clientX, "X");
  let y = getActualPos(event.changedTouches[0].clientY, "Y");
  if (!drawingMode) {
    panHandler(x, y);
  } else {
    moveHandler(x, y);
  }
};

const mouseDownHandler = (event) => {
  panState = event.shiftKey;
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");
  startX = x;
  startY = y;
  if (!drawingMode || panState) return;
  event.preventDefault();
  startHandler(x, y);
};

const mouseUpHandler = (event) => {
  panState = false;
  if (!drawingMode) return;
  event.preventDefault();
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");
  endHandler(x, y);
};

const mouseMoveHandler = (event) => {
  if (!drawingMode) return;
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");
  if (panState) {
    panHandler(x, y);
  } else {
    moveHandler(x, y);
  }
};
