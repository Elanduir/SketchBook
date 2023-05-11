//@ts-check
import { getMousePos } from "./Util.js";
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
  startHandler(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
};

const touchEndHandler = (event) => {
  event.preventDefault();
  endHandler(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
};

const touchMoveHandler = (event) => {
  moveHandler(event.touches[0].pageX, event.touches[0].pageY);
};

const mouseDownHandler = (event) => {
  event.preventDefault();
  startHandler(getMousePos(event, "X"), getMousePos(event, "Y"));
};

const mouseUpHandler = (event) => {
  event.preventDefault();
  endHandler(getMousePos(event, "X"), getMousePos(event, "Y"));
};

const mouseMoveHandler = (event) => {
  moveHandler(getMousePos(event, "X"), getMousePos(event, "Y"));
};

const mouseClickHandler = (event) => {
  // context.fillRect(getMousePos(event, 'X'), getMousePos(event, 'Y'), strokeWidth, strokeWidth);
};
