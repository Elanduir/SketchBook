import { ScratchHandler } from "./ScratchHandler.js";

export { Initialize };

let sketchSelector;
let scratchHandler;

const Initialize = () => {
  let canvas = document.getElementById("note");
  sketchSelector = document.getElementById("sketchSelect");

  scratchHandler = ScratchHandler();

  // Callbacks
  scratchHandler.onModelChange(updateDropdown);
  scratchHandler.init();

  let btnRedo = document.getElementById("redo");
  let btnUndo = document.getElementById("undo");
  let btnClear = document.getElementById("clear");
  let btnCreate = document.getElementById("create");
  let colPick = document.getElementById("strokeColorPicker");

  btnCreate.addEventListener("click", scratchHandler.createModel);
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
