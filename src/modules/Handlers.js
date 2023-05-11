//@ts-check
import { getActualPos } from "./Util.js";
export { Handlers };

let model;
let drawingState = false;

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

  btnRedo.addEventListener("click", model.redo);
  btnUndo.addEventListener("click", model.undo);
  btnClear.addEventListener("click", model.clearAll);
  colPick.addEventListener("change", model.updateColor);
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
  let x = getActualPos(event.changedTouches[0].pageX, "X");
  let y = getActualPos(event.changedTouches[0].pageY, "Y");
  startHandler(x, y);
};

const touchEndHandler = (event) => {
  event.preventDefault();
  let x = getActualPos(event.changedTouches[0].pageX, "X");
  let y = getActualPos(event.changedTouches[0].pageY, "Y");
  endHandler(x, y);
};

const touchMoveHandler = (event) => {
  let x = getActualPos(event.changedTouches[0].pageX, "X");
  let y = getActualPos(event.changedTouches[0].pageY, "Y");
  moveHandler(x, y);
};

const mouseDownHandler = (event) => {
  event.preventDefault();
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");
  startHandler(x, y);
};

const mouseUpHandler = (event) => {
  event.preventDefault();
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");
  endHandler(x, y);
};

const mouseMoveHandler = (event) => {
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");
  moveHandler(x, y);
};

const mouseClickHandler = (event) => {
  // context.fillRect(getMousePos(event, 'X'), getMousePos(event, 'Y'), strokeWidth, strokeWidth);
};
