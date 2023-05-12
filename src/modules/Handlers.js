//@ts-check
import { getActualPositions } from "./Util.js";
export { Handlers };

let model;
let drawingState = false;
let panState = false;
let startX;
let startY;
let activePointers = [];
let distanceBetweenPointers = 0;
let panPointerID = "";
let dbg;

const Handlers = (mod) => {
  model = mod;
  setupHandlers();
  return {};
};

const setupHandlers = () => {
  let canvas = document.getElementById("note");
  dbg = document.getElementById("debug");
  canvas.addEventListener("pointerdown", startHandler);
  canvas.addEventListener("pointerup", endHandler);
  canvas.addEventListener("pointermove", moveHandler);
  canvas.addEventListener("wheel", (event) => {
    let factor = event.deltaY < 0 ? 1.1 : 0.9;
    event.preventDefault();
    handleZoom(factor);
    let ax, ay;
    [ax, ay] = getActualPositions(event.clientX, event.clientY);
    model.updateZoomLoc(ax, ay);
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

  let x, y;
  [x, y] = getActualPositions(
    activePointers[0].clientX,
    activePointers[0].clientY
  );
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
  event.preventDefault();
  let x, y;
  [x, y] = getActualPositions(event.clientX, event.clientY);

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
  const SENSITIVITY = 5;
  let x, y;
  [x, y] = getActualPositions(event.clientX, event.clientY);
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
      let mx, my;
      [mx, my] = getActualPositions(
        (p1.clientX + p2.clientX) / 2,
        (p1.clientY + p2.clientY) / 2
      );
      model.updateZoomLoc(mx, my);
      handleZoom(factor);
    }
    let pP = activePointers.filter((p) => p.pointerId == panPointerID)[0];
    let aX, aY;
    [aX, aY] = getActualPositions(pP.clientX, pP.clientY);
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

const log = (text) => (dbg.innerHTML = text);
