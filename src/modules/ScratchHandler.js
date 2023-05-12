import { ScratchModel } from "./ScratchModel.js";

export { ScratchHandler };

const ScratchHandler = () => {
  let models = {};
  let modelChangeListener = [];

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
    return names;
  };

  const getNewest = () => {
    let list = getList();
    if (list.length === 0) return;
    list.sort((a, b) => {
      let nameA, mA;
      [nameA, mA] = a;
      let nameB, mB;
      [nameB, mB] = b;
      return mA.getCreateDate() - mB.getCreateDate();
    });
    return list[0];
  };

  const init = () => {
    // TODO: read cookies / backend
    createModel();
  };

  return {
    init,
    addModel,
    getModel,
    getNewest,
    createModel,
    getList,
    onModelChange: (callback) => modelChangeListener.push(callback),
  };
};
