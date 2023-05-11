//@ts-check
import { getActualPos } from "./Util.js";
export { Handlers };

let model;
let drawingState = false;
let drawingMode;

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
  if (!drawingMode) return;
  if (event.touches.length > 1) return;
  event.preventDefault();
  let x = getActualPos(event.changedTouches[0].clientX, "X");
  let y = getActualPos(event.changedTouches[0].clientY, "Y");
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
  if (!drawingMode) return;
  let x = getActualPos(event.changedTouches[0].clientX, "X");
  let y = getActualPos(event.changedTouches[0].clientY, "Y");
  moveHandler(x, y);
};

const mouseDownHandler = (event) => {
  if (!drawingMode) return;
  event.preventDefault();
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");
  startHandler(x, y);
};

const mouseUpHandler = (event) => {
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
  moveHandler(x, y);
};

const mouseClickHandler = (event) => {
  // context.fillRect(getMousePos(event, 'X'), getMousePos(event, 'Y'), strokeWidth, strokeWidth);
};
