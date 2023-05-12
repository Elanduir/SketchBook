//@ts-check

export { SketchModel };

let paths = [];
let redoPaths = [];
let currentPath = [];
let drawAgent;
let initX, initY;
let xOffT = 0;
let yOffT = 0;

const SketchModel = (draw) => {
  drawAgent = draw;
  return {
    initCurrent,
    addCurrent,
    endCurrent,
    empty,
    updateScreen,
    undo,
    redo,
    clearAll,
    updateColor,
    managePan,
    resetPan,
    manageZoom,
    updateZoomLoc,
  };
};

const initCurrent = (x, y) => {
  currentPath = [];
  initX = x;
  initY = y;
  currentPath.push([x, y]);
};

const addCurrent = (x, y) => {
  currentPath.push([x, y]);
  drawAgent.drawCurrent(initX, initY, x, y);
  initX = x;
  initY = y;
};

const endCurrent = (x, y) => {
  currentPath.push([x, y]);
  paths.push([currentPath, drawAgent.getColor()]);
  currentPath = [];
  drawAgent.redraw(paths);
};

const empty = () => paths.length === 0;

const updateScreen = (draw) => paths.map(draw);

const undo = () => {
  if (paths.length === 0) return;
  let rP = paths.pop();
  if (rP == undefined) return;
  redoPaths.push(rP);
  drawAgent.redraw(paths);
};

const redo = () => {
  if (redoPaths.length === 0) return;
  let rP = redoPaths.pop();
  if (rP == undefined) return;
  paths.push(rP);
  drawAgent.redraw(paths);
};

const clearAll = () => {
  if (paths.length === 0) return;
  while (paths.length > 0) {
    let rP = paths.pop();
    if (rP != undefined) redoPaths.push(rP);
  }
  drawAgent.redraw(paths);
};

const updateColor = (event) => {
  drawAgent.updateColor(event.target.value);
};

const managePan = (x, y) => {
  xOffT += x;
  yOffT += y;
  updateOffset(x, y);
  drawAgent.redraw(paths);
};

const updateOffset = (x, y) => {
  paths.map((path) =>
    path[0].map((c) => {
      c[0] += x;
      c[1] += y;
    })
  );
};

// TODO: Seems not to work
const resetPan = () => {
  updateOffset(-xOffT, -yOffT);
  drawAgent.redraw(paths);
};

const manageZoom = (factor) => {
  zoom(factor);
  drawAgent.redraw(paths);
};

const zoom = (factor) => {
  let xC, yC;
  [xC, yC] = drawAgent.getCenter();
  paths.map((path) => {
    path[0].map((c) => {
      let xV = (c[0] - xC) * factor;
      let yV = (c[1] - yC) * factor;
      c[0] = xC + xV;
      c[1] = yC + yV;
    });
  });
};

const updateZoomLoc = (x, y) => drawAgent.updateZoomLoc(x, y);
