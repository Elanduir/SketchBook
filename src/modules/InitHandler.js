import { ScratchHandler } from "./ScratchHandler.js";
import { getActualPositions } from "./Util.js";

export { Initialize };

let sketchSelector;
let scratchHandler;
let sketchTitle;
let canvas;

let drawingState = false;
let panState = false;
let panX, panY;
let activePointers = [];
let distanceBetweenPointers = 0;
let panPointerID = "";
let zoomLoc = [];

const Initialize = () => {
  canvas = document.getElementById("note");
  sketchSelector = document.getElementById("sketchSelect");
  sketchTitle = document.getElementById("title");
  zoomLoc = [canvas.width / 2, canvas.height / 2];

  scratchHandler = ScratchHandler();

  // Callbacks
  scratchHandler.onModelChange(updateDropdown);
  scratchHandler.onActiveChange(updateTitle);

  canvas.addEventListener("pointerdown", startHandler);
  canvas.addEventListener("pointerup", endHandler);
  canvas.addEventListener("pointermove", moveHandler);
  //canvas.addEventListener("pointercancel", endHandler);
  //canvas.addEventListener("pointerleave", endHandler);
  //canvas.addEventListener("pointerout", endHandler);
  canvas.addEventListener("touchstart", touchStartHandler);
  canvas.addEventListener("touchend", touchEndHandler);
  canvas.addEventListener("touchmove", touchMoveHandler);

  canvas.addEventListener("wheel", (event) => {
    let factor = event.deltaY < 0 ? 1.1 : 0.9;
    event.preventDefault();
    let ax, ay;
    [ax, ay] = getActualPositions(event.clientX, event.clientY);
    zoomLoc = [ax, ay];
    eventZoom(factor, zoomLoc);
  });

  scratchHandler.init();

  let btnRedo = document.getElementById("redo");
  let btnUndo = document.getElementById("undo");
  let btnClear = document.getElementById("clear");
  let btnCreate = document.getElementById("create");
  let colPick = document.getElementById("strokeColorPicker");

  btnRedo.addEventListener("click", scratchHandler.redo);
  btnUndo.addEventListener("click", scratchHandler.undo);
  btnClear.addEventListener("click", scratchHandler.clear);

  sketchTitle.addEventListener("change", (e) =>
    scratchHandler.setTitle(e.target.value)
  );

  btnCreate.addEventListener("click", scratchHandler.createModel);
  sketchSelector.addEventListener("change", (e) =>
    scratchHandler.setActiveByName(e.target.value)
  );
};

const updateTitle = (model) => {
  sketchTitle.value = model.getHName();
};

const updateDropdown = (models) => {
  sketchSelector.innerHTML = "";
  let html = "";
  models.map((m) => {
    html +=
      '<option value="' +
      m[1].getHName() +
      '">' +
      m[1].getHName() +
      "</option>";
  });
  sketchSelector.innerHTML += html;
};

const initEventListeners = () => {};

// Pan && Zoom
const eventPan = (x, y) => {
  let x0 = x - panX;
  let y0 = y - panY;
  panX = x;
  panY = y;
  scratchHandler.pan(x0, y0);
};

const eventZoom = (factor, loc) => {
  scratchHandler.zoom(factor, loc);
};

// drawing handlers

const startHandler = (event) => {
  event.preventDefault();
  activePointers.push(event);
  if (panPointerID === "") panPointerID = event.pointerId;

  if (
    activePointers.length === 1 &&
    (event.pointerType === "touch" || event.pointerType === "pen")
  ) {
    return;
  }

  let x, y;
  [x, y] = getActualPositions(
    activePointers[0].clientX,
    activePointers[0].clientY
  );
  panX = x;
  panY = y;

  if (activePointers.length > 1) {
    let p1 = activePointers[0];
    let p2 = activePointers[1];
    distanceBetweenPointers = Math.sqrt(
      Math.pow(p1.clientX - p2.clientX, 2) +
        Math.pow(p1.clientY - p2.clientY, 2)
    );
  }

  panState = event.shiftKey;
  if (panState) return;
  scratchHandler.addPathToActive(x, y);
  drawingState = true;
};

const moveHandler = (event) => {
  if (
    activePointers.length === 1 &&
    (event.pointerType === "touch" || event.pointerType === "pen")
  ) {
    return;
  }

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
      // not good
      eventZoom(factor, [mx, my]);
    }
    let pP = activePointers.filter((p) => p.pointerId == panPointerID)[0];
    let aX, aY;
    [aX, aY] = getActualPositions(pP.clientX, pP.clientY);
    let pan =
      Math.abs(startX - aX) > SENSITIVITY ||
      Math.abs(startY - aY) > SENSITIVITY;
    if (pan) {
      eventPan(aX, aY);
    }

    return;
  }

  if (panState) {
    eventPan(x, y);
  } else {
    drawHandler(x, y);
  }
};

const endHandler = (event) => {
  panState = false;
  activePointers = activePointers.filter((e) => e.pointerId != event.pointerId);
  let x, y;
  [x, y] = getActualPositions(event.clientX, event.clientY);
  scratchHandler.endCurrentPath(x, y);
  drawingState = false;
  panPointerID = "";
  event.preventDefault();
};

const touchStartHandler = (event) => {
  event.preventDefault();
  if (activePointers.length > 1) return;
  let x, y;
  [x, y] = getActualPositions(
    event.changedTouches[0].cleintX,
    event.changedTouches[0].clientY
  );
  drawingState = true;
  scratchHandler.addPathToActive(x, y);
};

const touchEndHandler = (event) => {
  event.preventDefault();
  if (activePointers.length > 1) return;
  let x, y;
  [x, y] = getActualPositions(
    event.changedTouches[0].cleintX,
    event.changedTouches[0].clientY
  );
  scratchHandler.endCurrentPath(x, y);
};

const touchMoveHandler = (event) => {
  event.preventDefault();
  if (activePointers.length > 1) return;
  let x, y;
  [x, y] = getActualPositions(
    event.changedTouches[0].clientX,
    event.changedTouches[0].clientY
  );
  drawHandler(x, y);
};

const drawHandler = (x, y) => {
  if (drawingState) {
    scratchHandler.addToCurrentPath(x, y);
  }
};
