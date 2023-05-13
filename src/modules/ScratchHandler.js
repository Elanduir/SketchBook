import { DrawUtil } from "./Draw.js";
import { ScratchModel } from "./ScratchModel.js";

export { ScratchHandler };

const ScratchHandler = () => {
  let models = {};
  let activeModel;
  let modelChangeListener = [];
  let activeChangeListener = [];
  let prevX, prevY;
  let drawAgent;
  let color = "black";

  const addModel = (name, model) => {
    models[name] = model;
    modelChangeListener.map((c) => c(getList()));
  };

  const createModel = () => {
    let nM = ScratchModel();
    let name = nM.getHName();
    addModel(name, nM);
  };

  const getModel = (name) => models[name];

  const getList = () => {
    let names = [];
    for (const [key, value] of Object.entries(models)) {
      names.push([key, value]);
    }

    names.sort((a, b) => {
      let nameA, mA;
      [nameA, mA] = a;
      let nameB, mB;
      [nameB, mB] = b;
      return mA.getCreateDate() - mB.getCreateDate();
    });

    return names;
  };

  const getNewest = () => {
    let list = getList();
    if (list.length === 0) return;
    return list[0][1];
  };

  const setActive = (newActiveModel) => {
    activeModel = newActiveModel;
    drawAgent.redraw(activeModel.getPaths());
    activeChangeListener.map((c) => c(activeModel));
  };

  const setActiveByName = (newActiveName) => {
    setActive(getModel(newActiveName));
  };

  const setTitle = (title) => {
    activeModel.setName(title);

    modelChangeListener.map((c) => c(getList()));
  };

  const init = (initialColor) => {
    // TODO: read cookies / backend
    drawAgent = DrawUtil(color);
    createModel();
    setActive(getNewest());
    updateColor(initialColor);
  };

  const updateColor = (newCol) => {
    color = newCol;
    activeModel.updateColor(color);
    drawAgent.updateColor(color);
  };

  const addPathToActive = (x, y) => {
    prevX = x;
    prevY = y;
    activeModel.initPath(x, y);
  };

  const addToCurrentPath = (x, y) => {
    activeModel.extendPath(x, y);
    drawAgent.drawCurrent(prevX, prevY, x, y);
    prevX = x;
    prevY = y;
  };

  const endCurrentPath = (x, y) => {
    activeModel.endPath(x, y);
    drawAgent.redraw(activeModel.getPaths());
  };

  const pan = (x, y) => {
    activeModel.handlePan(x, y);
    drawAgent.redraw(activeModel.getPaths());
  };

  const zoom = (x, y, center) => {
    activeModel.zoom(x, y, center);
    drawAgent.redraw(activeModel.getPaths());
  };

  return {
    init,
    addModel,
    getModel,
    getNewest,
    createModel,
    getList,
    setActive,
    setActiveByName,
    setTitle,
    addPathToActive,
    addToCurrentPath,
    endCurrentPath,
    pan,
    zoom,
    undo: () => {
      activeModel.undo();
      drawAgent.redraw(activeModel.getPaths());
    },
    redo: () => {
      activeModel.redo();
      drawAgent.redraw(activeModel.getPaths());
    },
    clear: () => {
      activeModel.clearAll();
      drawAgent.redraw(activeModel.getPaths());
    },
    getActive: () => activeModel,
    onActiveChange: (callback) => activeChangeListener.push(callback),
    onModelChange: (callback) => modelChangeListener.push(callback),
  };
};
