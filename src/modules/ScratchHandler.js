import { ScratchModel } from "./ScratchModel";

export { ScratchHandler };

const ScratchHandler = () => {
  let models = {};

  const addModel = (name, model) => (models[name] = model);
  const createModel = () => {
    let nM = ScratchModel();
    let name = nM.getName();
    addModel(name, nM);
  };
  const getModel = (name) => models[name];
  const getList = () => {
    let names = [];
    for (const [key, value] of Object.entries(models)) {
      names.push(key);
    }
    return names;
  };
  const getNewest = () => {
    let list = getList();
    if (list.length === 0) return;
    list.sort((a, b) => {
      let nameA = a.getName();
      let nameB = b.getName();
      let dateA = Number(nameA.substring(nameA.lastIndexOf(";")));
      let dateB = Number(nameB.substring(nameB.lastIndexOf(";")));
      return dateA - dateB;
    });
    return list[0];
  };

  return {
    addModel,
    getModel,
    getNewest,
    createModel,
    getList,
  };
};
