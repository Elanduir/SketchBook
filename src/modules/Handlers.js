//@ts-check
import { getActualPos } from "./Util.js";
export { Handlers };

let model;
let drawingState = false;
let panState = false;
let startX;
let startY;
let activePointers = [];
let distanceBetweenPointers = 0;
let panPointerID = "";

const Handlers = (mod) => {
  model = mod;
  setupHandlers();
  return {};
};

const setupHandlers = () => {
  let canvas = document.getElementById("note");
  canvas.addEventListener("pointerdown", startHandler);
  canvas.addEventListener("pointerup", endHandler);
  canvas.addEventListener("pointermove", moveHandler);
  canvas.addEventListener("wheel", (event) => {
    let factor = event.deltaY < 0 ? 1.1 : 0.9;
    event.preventDefault();
    handleZoom(factor);
  });

  let btnRedo = document.getElementById("redo");
  let btnUndo = document.getElementById("undo");
  let btnClear = document.getElementById("clear");
  let colPick = document.getElementById("strokeColorPicker");

  btnRedo.addEventListener("click", model.redo);
  btnUndo.addEventListener("click", model.undo);
  btnClear.addEventListener("click", model.clearAll);
  colPick.addEventListener("change", model.updateColor);
};

const panHandler = (x, y) => {
  let xO = x - startX;
  let yO = y - startY;
  startX = x;
  startY = y;
  model.managePan(xO, yO);
};

const startHandler = (event) => {
  event.preventDefault();
  activePointers.push(event);
  if (panPointerID === "") panPointerID = event.pointerId;

  let x = getActualPos(activePointers[0].clientX, "X");
  let y = getActualPos(activePointers[0].clientY, "Y");
  startX = x;
  startY = y;

  if (activePointers.length > 1) {
    let p1 = activePointers[0];
    let p2 = activePointers[1];
    distanceBetweenPointers = Math.sqrt(
      Math.pow(p1.clientX - p2.clientX, 2) +
        Math.pow(p1.clientY - p2.clientY, 2)
    );
    console.log(distanceBetweenPointers);
  }

  panState = event.shiftKey;
  if (panState) return;
  event.preventDefault();
  model.initCurrent(x, y);
  drawingState = true;
};

const endHandler = (event) => {
  panState = false;
  activePointers = activePointers.filter((e) => e.pointerId != event.pointerId);
  console.log(activePointers);
  event.preventDefault();
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");

  model.endCurrent(x, y);
  drawingState = false;
  panPointerID = "";
};

const drawHandler = (x, y) => {
  if (drawingState) {
    model.addCurrent(x, y);
  }
};

const moveHandler = (event) => {
  const SENSITIVITY = 10;
  let x = getActualPos(event.clientX, "X");
  let y = getActualPos(event.clientY, "Y");
  activePointers = activePointers.filter((e) => e.pointerId != event.pointerId);
  activePointers.push(event);
  if (activePointers.length > 1) {
    let p1 = activePointers[0];
    let p2 = activePointers[1];
    let cDist = Math.sqrt(
      Math.pow(p1.clientX - p2.clientX, 2) +
        Math.pow(p1.clientY - p2.clientY, 2)
    );
    let delta = cDist - distanceBetweenPointers;
    distanceBetweenPointers = cDist;
    if (Math.abs(delta) > SENSITIVITY) {
      let factor = delta > 0 ? 1.05 : 0.95;
      handleZoom(factor);
    }
    let pP = activePointers.filter((p) => p.pointerId == panPointerID)[0];
    let aX = getActualPos(pP.clientX, "X");
    let aY = getActualPos(pP.clientY, "Y");
    let pan =
      Math.abs(startX - aX) > SENSITIVITY ||
      Math.abs(startY - aY) > SENSITIVITY;
    if (pan) {
      panHandler(aX, aY);
    }

    return;
  }

  if (panState) {
    panHandler(x, y);
  } else {
    drawHandler(x, y);
  }
};

const handleZoom = (factor) => {
  model.manageZoom(factor);
};
