//@ts-check

export { SketchModel };

let paths = [];
let redoPaths = [];
let currentPath = [];
let drawAgent;
let initX, initY;

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
